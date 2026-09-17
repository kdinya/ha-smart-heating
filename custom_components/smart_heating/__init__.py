"""Smart Heating integration."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import EVENT_HOMEASSISTANT_STARTED, CoreState, HomeAssistant
from homeassistant.helpers.event import async_call_later

from .const import DOMAIN
from .coordinator import SmartHeatingData

_LOGGER = logging.getLogger(__name__)
PLATFORMS = ["climate", "number", "switch"]
CARD_PATH = Path(__file__).parent / "www"
CANONICAL_CARD_URL = "/hacsfiles/ha-smart-heating/smart-heating-card.js"
CARD_VERSION = "1.0.3"
CARD_BUILD = "reference-dashboard-v103-4"


def _is_card_resource_url(url: str) -> bool:
    """Return true for the card file regardless of its old HACS/API prefix."""
    return urlsplit(url).path.rstrip("/").endswith("/smart-heating-card.js")


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up Smart Heating and install its Lovelace card automatically."""
    await hass.http.async_register_static_paths([
        StaticPathConfig("/hacsfiles/ha-smart-heating", str(CARD_PATH), cache_headers=False),
    ])

    async def _register_frontend(_event: Any = None) -> None:
        """Register the card only after Lovelace has initialized."""
        await async_register_lovelace_resource(hass)

    if hass.state is CoreState.running:
        hass.async_create_task(_register_frontend())
    else:
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _register_frontend)
    return True


async def async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """Create or update the card in Lovelace storage resources."""
    lovelace = hass.data.get("lovelace")
    resources = getattr(lovelace, "resources", None) if lovelace else None
    mode = getattr(lovelace, "mode", getattr(lovelace, "resource_mode", "yaml")) if lovelace else "yaml"

    if resources is None or mode != "storage":
        # YAML dashboards do not have a writable Lovelace resource store.
        _LOGGER.debug("Lovelace is not in storage mode; add the canonical HACS resource in YAML")
        return

    if not resources.loaded:
        async_call_later(
            hass,
            5,
            lambda _now: hass.async_create_task(
                async_register_lovelace_resource(hass)
            ),
        )
        return

    card_resources = [
        resource for resource in resources.async_items()
        if _is_card_resource_url(resource["url"])
    ]
    existing = card_resources[0] if card_resources else None
    url = f"{CANONICAL_CARD_URL}?v={CARD_VERSION}&build={CARD_BUILD}"
    if existing is None:
        await resources.async_create_item({"res_type": "module", "url": url})
        _LOGGER.info("Registered Smart Heating Lovelace card resource: %s", url)
    elif existing["url"] != url:
        await resources.async_update_item(
            existing["id"], {"res_type": "module", "url": url}
        )
        _LOGGER.info("Updated Smart Heating Lovelace card resource to %s", url)

    for resource in card_resources[1:]:
        await resources.async_delete_item(resource["id"])
        _LOGGER.info("Removed duplicate Smart Heating Lovelace card resource: %s", resource["url"])


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Smart Heating from a config entry."""
    data = SmartHeatingData(hass, entry)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = data
    await data.async_start()
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(async_reload_entry))
    return True


async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Apply changed options by reloading the entry."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        data = hass.data[DOMAIN].pop(entry.entry_id)
        await data.async_stop()
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Remove the shared Lovelace card resource after the last entry."""
    remaining = [
        item for item in hass.config_entries.async_entries(DOMAIN)
        if item.entry_id != entry.entry_id
    ]
    if remaining:
        return

    lovelace = hass.data.get("lovelace")
    resources = getattr(lovelace, "resources", None) if lovelace else None
    if resources is not None and resources.loaded:
        for resource in list(resources.async_items()):
            if _is_card_resource_url(resource["url"]):
                await resources.async_delete_item(resource["id"])
