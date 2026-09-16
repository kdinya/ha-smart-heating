"""Climate platform."""
from __future__ import annotations

from homeassistant.components.climate import ClimateEntity, ClimateEntityFeature, HVACMode
from homeassistant.const import ATTR_TEMPERATURE, UnitOfTemperature
from homeassistant.helpers.restore_state import RestoreEntity

from . import SmartHeatingData
from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([SmartHeatingClimate(hass.data[DOMAIN][entry.entry_id], entry)])


class SmartHeatingClimate(RestoreEntity, ClimateEntity):
    _attr_has_entity_name = True
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_hvac_modes = [HVACMode.HEAT, HVACMode.OFF]
    _attr_supported_features = ClimateEntityFeature.TARGET_TEMPERATURE
    _attr_min_temp, _attr_max_temp, _attr_target_temperature_step = 5, 35, 0.5

    def __init__(self, data: SmartHeatingData, entry):
        self.data, self._attr_unique_id = data, f"{entry.entry_id}_climate"
        self._attr_name = "Газовий котел"
        self._attr_device_info = {"identifiers": {(DOMAIN, entry.entry_id)}, "name": data.name, "manufacturer": "Smart Heating", "model": "Hysteresis boiler controller"}

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        last_state = await self.async_get_last_state()
        if last_state:
            self.data.enabled = last_state.state != HVACMode.OFF
            attributes = last_state.attributes
            target = attributes.get(ATTR_TEMPERATURE, attributes.get("target_temperature"))
            if target is not None:
                try:
                    self.data.target_temperature = float(target)
                except (TypeError, ValueError):
                    pass
            hysteresis = attributes.get("hysteresis")
            if hysteresis is not None:
                try:
                    self.data.hysteresis = float(hysteresis)
                except (TypeError, ValueError):
                    pass
            self.data._evaluate()
        self._remove_listener = self.data.async_add_listener(self.async_write_ha_state)

    async def async_will_remove_from_hass(self) -> None:
        if getattr(self, "_remove_listener", None):
            self._remove_listener()

    @property
    def current_temperature(self): return self.data.room_temperature
    @property
    def target_temperature(self): return self.data.target_temperature
    @property
    def hvac_mode(self): return HVACMode.HEAT if self.data.enabled else HVACMode.OFF
    @property
    def extra_state_attributes(self): return self.data.attributes

    async def async_set_temperature(self, **kwargs):
        if ATTR_TEMPERATURE in kwargs:
            self.data.set_target(float(kwargs[ATTR_TEMPERATURE]))
            self.async_write_ha_state()

    async def async_set_hvac_mode(self, hvac_mode):
        if hvac_mode == HVACMode.HEAT:
            self.data.enabled = True
            self.data._evaluate()
        elif hvac_mode == HVACMode.OFF:
            self.data.enabled = False
            self.data.heating = False
            self.data._sync_output()
        self.async_write_ha_state()
