"""Smart Heating integration."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import EVENT_HOMEASSISTANT_STARTED, CoreState, HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.event import async_call_later

from .const import CONF_SWITCH_1, CONF_SWITCH_2, DOMAIN
from .coordinator import SmartHeatingData

_LOGGER = logging.getLogger(__name__)
PLATFORMS = ["climate", "number", "switch"]
CARD_PATH = Path(__file__).parent / "www"
CANONICAL_CARD_URL = "/hacsfiles/ha-smart-heating/smart-heating-card.js"
CARD_VERSION = "1.0.5"
CARD_BUILD = "reference-dashboard-v105-7"
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


def _is_card_resource_url(url: str) -> bool:
    """Return true for the card file regardless of its old HACS/API prefix."""
    return urlsplit(url).path.rstrip("/").endswith("/smart-heating-card.js")


def _get_target_datas(hass: HomeAssistant, call: Any) -> list[SmartHeatingData]:
    """Find SmartHeatingData instances targeted by a service call."""
    entries: dict[str, SmartHeatingData] = {
        k: v for k, v in hass.data.get(DOMAIN, {}).items() if isinstance(v, SmartHeatingData)
    }
    if not entries:
        return []

    raw_entity_id = call.data.get("entity_id")
    if not raw_entity_id:
        return list(entries.values())

    target_eids = [raw_entity_id] if isinstance(raw_entity_id, str) else list(raw_entity_id)
    target_set = set(target_eids)

    matched: list[SmartHeatingData] = []

    # 1. Look up via entity registry if available
    try:
        from homeassistant.helpers import entity_registry as er
        registry = er.async_get(hass)
        for eid in target_set:
            entry = registry.async_get(eid)
            if entry and entry.config_entry_id in entries:
                matched_data = entries[entry.config_entry_id]
                if matched_data not in matched:
                    matched.append(matched_data)
    except Exception:
        pass

    # 2. Look up via known entity IDs tracked on SmartHeatingData
    for data in entries.values():
        if data in matched:
            continue
        known_eids = set(getattr(data, "entity_ids", set()))
        climate_eid = getattr(data, "climate_entity_id", None)
        if climate_eid:
            known_eids.add(climate_eid)
        sw1 = data.get_config_or_option(CONF_SWITCH_1)
        if sw1:
            known_eids.add(sw1)
        sw2 = data.get_config_or_option(CONF_SWITCH_2)
        if sw2:
            known_eids.add(sw2)
        if known_eids & target_set:
            matched.append(data)
        elif data.entry.entry_id in target_set:
            matched.append(data)

    if not matched:
        _LOGGER.warning(
            "Smart Heating service called with entity_id %s, but no matching Smart Heating device was found",
            raw_entity_id,
        )

    return matched

def _register_domain_services(hass: HomeAssistant) -> None:
    """Register domain services once."""
    if hass.services.has_service(DOMAIN, "set_contact"):
        return

    async def async_handle_set_contact(call: Any) -> None:
        contact_1 = call.data.get("contact_1")
        contact_2 = call.data.get("contact_2")
        for data in _get_target_datas(hass, call):
            if contact_1 is not None:
                data.set_contact_1(bool(contact_1))
            if contact_2 is not None:
                data.set_contact_2(bool(contact_2))

    async def async_handle_set_hysteresis(call: Any) -> None:
        h_on = call.data.get("hysteresis_on", call.data.get("hysteresis"))
        h_off = call.data.get("hysteresis_off")
        for data in _get_target_datas(hass, call):
            if h_on is not None:
                data.set_hysteresis_on(float(h_on))
            if h_off is not None:
                data.set_hysteresis_off(float(h_off))

    async def async_handle_set_program(call: Any) -> None:
        has_prog = "program" in call.data
        prog = call.data.get("program")
        has_progs = "programs" in call.data
        progs = call.data.get("programs")
        for data in _get_target_datas(hass, call):
            if has_prog and has_progs:
                data.set_program(prog, progs)
            elif has_prog:
                data.set_program(prog)
            elif has_progs:
                data.set_program(programs=progs)

    async def async_handle_set_eco_timer(call: Any) -> None:
        duration = call.data.get("duration", 0)
        for data in _get_target_datas(hass, call):
            data.set_eco_timer(int(duration))

    async def async_handle_set_relay_timeout(call: Any) -> None:
        timeout = call.data.get("timeout", 10.0)
        for data in _get_target_datas(hass, call):
            data.set_relay_timeout(float(timeout))

    async def async_handle_set_temp_step(call: Any) -> None:
        step = call.data.get("step", 0.5)
        for data in _get_target_datas(hass, call):
            data.set_temp_step(float(step))

    async def async_handle_set_eco_temperature(call: Any) -> None:
        temp = call.data.get("temperature", 18.0)
        for data in _get_target_datas(hass, call):
            data.set_eco_temperature(float(temp))

    async def async_handle_set_min_target_temperature(call: Any) -> None:
        temp = call.data.get("temperature", 16.0)
        for data in _get_target_datas(hass, call):
            data.set_min_target_temperature(float(temp))

    async def async_handle_set_max_target_temperature(call: Any) -> None:
        temp = call.data.get("temperature", 30.0)
        for data in _get_target_datas(hass, call):
            data.set_max_target_temperature(float(temp))

    hass.services.async_register(DOMAIN, "set_contact", async_handle_set_contact)
    hass.services.async_register(DOMAIN, "set_hysteresis", async_handle_set_hysteresis)
    hass.services.async_register(DOMAIN, "set_program", async_handle_set_program)
    hass.services.async_register(DOMAIN, "set_eco_timer", async_handle_set_eco_timer)
    hass.services.async_register(DOMAIN, "set_relay_timeout", async_handle_set_relay_timeout)
    hass.services.async_register(DOMAIN, "set_temp_step", async_handle_set_temp_step)
    hass.services.async_register(DOMAIN, "set_eco_temperature", async_handle_set_eco_temperature)
    hass.services.async_register(DOMAIN, "set_min_target_temperature", async_handle_set_min_target_temperature)
    hass.services.async_register(DOMAIN, "set_max_target_temperature", async_handle_set_max_target_temperature)


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up Smart Heating and install its Lovelace card automatically."""
    await hass.http.async_register_static_paths([
        StaticPathConfig("/hacsfiles/ha-smart-heating", str(CARD_PATH), cache_headers=False),
    ])
    async def _register_frontend(_event: Any = None) -> None:
        """Register the card only after Lovelace has initialized."""
        await async_register_lovelace_resource(hass)

    _register_domain_services(hass)

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
        if hasattr(resources, "async_load"):
            try:
                await resources.async_load()
            except Exception as err:
                _LOGGER.debug("Could not eager load Lovelace resources: %s", err)
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
    _register_domain_services(hass)
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
