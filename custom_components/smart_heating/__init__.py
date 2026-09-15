"""Smart Heating integration."""
from __future__ import annotations

import logging
import shutil
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
LOCAL_CARD_URL = "/local/smart-heating-card.js"
LOCAL_CARD_PATH = "smart-heating-card.js"
CARD_VERSION = "1.0.0"
CARD_BUILD = "ref3d-aspect"


def _copy_card_to_www(www_path: str) -> None:
    """Install the bundled card in Home Assistant's standard /local directory."""
    destination_dir = Path(www_path)
    destination_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(CARD_PATH / LOCAL_CARD_PATH, destination_dir / LOCAL_CARD_PATH)


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up Smart Heating and install its Lovelace card automatically."""
    await hass.http.async_register_static_paths([
        StaticPathConfig(URL_BASE, str(CARD_PATH), cache_headers=False)
    ])
    await hass.async_add_executor_job(_copy_card_to_www, hass.config.path("www"))

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
        frontend.add_extra_js_url(hass, f"{LOCAL_CARD_URL}?v={CARD_VERSION}&build={CARD_BUILD}")
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

    accepted_urls = {CARD_URL, LOCAL_CARD_URL}
    existing = next(
        (
            resource
            for resource in resources.async_items()
            if resource["url"].split("?", 1)[0] in accepted_urls
        ),
        None,
    )
    url = f"{LOCAL_CARD_URL}?v={CARD_VERSION}&build={CARD_BUILD}"
    if existing is None:
        await resources.async_create_item({"res_type": "module", "url": url})
        _LOGGER.info("Registered Smart Heating Lovelace card resource: %s", url)
    elif existing["url"] != url:
        await resources.async_update_item(
            existing["id"], {"res_type": "module", "url": url}
        )
        _LOGGER.info("Updated Smart Heating Lovelace card resource to %s", url)


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
