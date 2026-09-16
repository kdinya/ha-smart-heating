"""Number controls for Smart Heating."""
from __future__ import annotations

from homeassistant.components.number import NumberDeviceClass, NumberEntity, NumberMode
from homeassistant.const import UnitOfTemperature

from .const import (
    DOMAIN,
    MAX_HYSTERESIS,
    MAX_TARGET,
    MIN_HYSTERESIS,
    MIN_TARGET,
)
from .coordinator import SmartHeatingData


async def async_setup_entry(hass, entry, async_add_entities):
    """Set up the target-temperature and hysteresis controls."""
    data = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([HeatingTarget(data, entry), HeatingHysteresis(data, entry)])


class SmartHeatingNumber(NumberEntity):
    """Shared plumbing for the two numeric controls."""

    _attr_has_entity_name = True
    _attr_mode = NumberMode.BOX
    _attr_native_step = 0.1
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS

    def __init__(self, data: SmartHeatingData, entry, suffix: str, name: str) -> None:
        self.data = data
        self._attr_unique_id = f"{entry.entry_id}_{suffix}"
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


class HeatingTarget(SmartHeatingNumber):
    """Target room temperature."""

    _attr_device_class = NumberDeviceClass.TEMPERATURE
    _attr_native_min_value = MIN_TARGET
    _attr_native_max_value = MAX_TARGET

    def __init__(self, data: SmartHeatingData, entry) -> None:
        super().__init__(data, entry, "target", "Цільова температура")

    @property
    def native_value(self) -> float:
        return self.data.target_temperature

    async def async_set_native_value(self, value: float) -> None:
        self.data.set_target(value)
        self.async_write_ha_state()


class HeatingHysteresis(SmartHeatingNumber):
    """Width of the hysteresis band below the target temperature."""

    _attr_native_min_value = MIN_HYSTERESIS
    _attr_native_max_value = MAX_HYSTERESIS

    def __init__(self, data: SmartHeatingData, entry) -> None:
        super().__init__(data, entry, "hysteresis", "Гістерезіс")

    @property
    def native_value(self) -> float:
        return self.data.hysteresis

    async def async_set_native_value(self, value: float) -> None:
        self.data.set_hysteresis(value)
        self.async_write_ha_state()
