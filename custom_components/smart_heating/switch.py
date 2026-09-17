"""Boiler contact switches exposed by Smart Heating."""
from __future__ import annotations

from homeassistant.components.switch import SwitchDeviceClass, SwitchEntity

from .const import CONF_SWITCH_1, CONF_SWITCH_2, DOMAIN
from .coordinator import SmartHeatingData


async def async_setup_entry(hass, entry, async_add_entities):
    """Create one entity per configured physical contact."""
    data = hass.data[DOMAIN][entry.entry_id]
    entities = [
        BoilerSwitch(data, entry, key, label)
        for key, label in (
            (CONF_SWITCH_1, "Котел — контакт 1"),
            (CONF_SWITCH_2, "Котел — контакт 2"),
        )
        if data.get_config_or_option(key)
    ]
    async_add_entities(entities)


class BoilerSwitch(SwitchEntity):
    """Mirror of a configured physical switch.

    Contact 1 follows the hysteresis output; contact 2 only reflects and forwards
    the state of its own switch and is never driven automatically.
    """

    _attr_has_entity_name = True
    _attr_device_class = SwitchDeviceClass.SWITCH

    def __init__(self, data: SmartHeatingData, entry, key: str, name: str) -> None:
        self.data = data
        self.key = key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_name = name
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry.entry_id)},
            "name": data.name,
            "manufacturer": "Smart Heating",
        }
        self._remove_listener = None

    async def async_added_to_hass(self) -> None:
        self._remove_listener = self.data.async_add_listener(self.async_write_ha_state)

    async def async_will_remove_from_hass(self) -> None:
        if self._remove_listener:
            self._remove_listener()
            self._remove_listener = None

    @property
    def _source_entity_id(self) -> str | None:
        return self.data.get_config_or_option(self.key)

    @property
    def is_on(self) -> bool:
        if self.key == CONF_SWITCH_1:
            return self.data.heating
        state = self.data.hass.states.get(self._source_entity_id or "")
        return bool(state and state.state == "on")

    async def _call(self, service: str) -> None:
        entity_id = self._source_entity_id
        if not entity_id:
            return
        await self.data.hass.services.async_call(
            "switch", service, {"entity_id": entity_id}
        )

    async def async_turn_on(self, **kwargs) -> None:
        await self._call("turn_on")
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        await self._call("turn_off")
        self.async_write_ha_state()
