"""Optional boiler output controls."""
from __future__ import annotations
from homeassistant.components.switch import SwitchEntity
from .const import DOMAIN, CONF_SWITCH_1, CONF_SWITCH_2

async def async_setup_entry(hass, entry, async_add_entities):
    data = hass.data[DOMAIN][entry.entry_id]
    entities = []
    for key, label in ((CONF_SWITCH_1, "Котел — контакт 1"), (CONF_SWITCH_2, "Котел — контакт 2")):
        if entry.data.get(key): entities.append(BoilerSwitch(data, entry, key, label))
    async_add_entities(entities)

class BoilerSwitch(SwitchEntity):
    _attr_has_entity_name = True
    def __init__(self, data, entry, key, name):
        self.data, self.key = data, key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_name = name
        self._attr_device_info = {"identifiers": {(DOMAIN, entry.entry_id)}, "name": data.name, "manufacturer": "Smart Heating"}
    @property
    def is_on(self): return self.data.heating if self.key == CONF_SWITCH_1 else bool(self.data.hass.states.get(self.data.entry.data.get(self.key)) and self.data.hass.states.get(self.data.entry.data.get(self.key)).state == "on")
    async def async_turn_on(self, **kwargs):
        await self.data.hass.services.async_call("switch", "turn_on", {"entity_id": self.data.entry.data[self.key]})
        self.async_write_ha_state()
    async def async_turn_off(self, **kwargs):
        await self.data.hass.services.async_call("switch", "turn_off", {"entity_id": self.data.entry.data[self.key]})
        self.async_write_ha_state()
