"""Smart Heating integration."""
from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .coordinator import SmartHeatingData

PLATFORMS = ["climate", "number", "switch"]
CARD_URL = "/api/smart_heating/smart-heating-card.js"
CARD_PATH = Path(__file__).parent / "www" / "smart-heating-card.js"

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Register the Lovelace card automatically on every Home Assistant start."""
    await hass.http.async_register_static_paths([
        StaticPathConfig(CARD_URL, str(CARD_PATH), cache_headers=False)
    ])
    frontend.add_extra_js_url(hass, CARD_URL)
    return True

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
