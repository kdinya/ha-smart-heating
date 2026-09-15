"""Smart Heating integration."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import EVENT_HOMEASSISTANT_STARTED, CoreState, HomeAssistant
from homeassistant.helpers.event import async_call_later

from .const import DOMAIN
from .coordinator import SmartHeatingData

_LOGGER = logging.getLogger(__name__)
PLATFORMS = ["climate", "number", "switch"]
URL_BASE = "/api/smart_heating"
CARD_URL = f"{URL_BASE}/smart-heating-card.js"
CARD_PATH = Path(__file__).parent / "www"
CARD_VERSION = "1.0.0"


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up Smart Heating and its frontend resource endpoint."""
    await hass.http.async_register_static_paths([
        StaticPathConfig(URL_BASE, str(CARD_PATH), cache_headers=False)
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
        frontend.add_extra_js_url(hass, f"{CARD_URL}?v={CARD_VERSION}")
        _LOGGER.debug("Lovelace is not in storage mode; registered extra JS URL")
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

    existing = next(
        (
            resource
            for resource in resources.async_items()
            if resource["url"].split("?", 1)[0] == CARD_URL
        ),
        None,
    )
    url = f"{CARD_URL}?v={CARD_VERSION}"
    if existing is None:
        await resources.async_create_item({"res_type": "module", "url": url})
        _LOGGER.info("Registered Smart Heating Lovelace card resource: %s", url)
    elif existing["url"] != url:
        await resources.async_update_item(
            existing["id"], {"res_type": "module", "url": url}
        )
        _LOGGER.info("Updated Smart Heating Lovelace card resource to %s", CARD_VERSION)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Smart Heating from a config entry."""
    data = SmartHeatingData(hass, entry)
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = data
    await data.async_start()
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        data = hass.data[DOMAIN].pop(entry.entry_id)
        await data.async_stop()
    return unloaded
