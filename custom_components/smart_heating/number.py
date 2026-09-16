"""Number controls for Smart Heating."""
from __future__ import annotations
from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.const import UnitOfTemperature
from .const import DOMAIN, DEFAULT_TARGET, DEFAULT_HYSTERESIS, MIN_TARGET, MAX_TARGET, MIN_HYSTERESIS, MAX_HYSTERESIS

async def async_setup_entry(hass, entry, async_add_entities):
    data = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([HeatingTarget(data, entry), HeatingHysteresis(data, entry)])

class Base(NumberEntity):
    _attr_has_entity_name = True
    _attr_mode = NumberMode.BOX
    _attr_native_step = 0.1
    def __init__(self, data, entry, suffix, name):
        self.data, self._attr_unique_id = data, f"{entry.entry_id}_{suffix}"
        self._attr_name = name
        self._attr_device_info = {"identifiers": {(DOMAIN, entry.entry_id)}, "name": data.name, "manufacturer": "Smart Heating"}
    async def async_added_to_hass(self):
        self._remove_listener = self.data.async_add_listener(self.async_write_ha_state)
    async def async_will_remove_from_hass(self):
        if getattr(self, "_remove_listener", None):
            self._remove_listener()

class HeatingTarget(Base):
    _attr_native_min_value, _attr_native_max_value = MIN_TARGET, MAX_TARGET
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    def __init__(self, data, entry): super().__init__(data, entry, "target", "Цільова температура")
    @property
    def native_value(self): return self.data.target_temperature
    async def async_set_native_value(self, value): self.data.set_target(value); self.async_write_ha_state()

class HeatingHysteresis(Base):
    _attr_native_min_value, _attr_native_max_value = MIN_HYSTERESIS, MAX_HYSTERESIS
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    def __init__(self, data, entry): super().__init__(data, entry, "hysteresis", "Гістерезіс")
    @property
    def native_value(self): return self.data.hysteresis
    async def async_set_native_value(self, value): self.data.set_hysteresis(value); self.async_write_ha_state()
