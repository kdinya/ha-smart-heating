"""Number controls for Smart Heating."""
from __future__ import annotations

from homeassistant.components.number import (
    NumberDeviceClass,
    NumberMode,
    RestoreNumber,
)
from homeassistant.const import UnitOfTemperature, UnitOfTime

from .const import (
    DOMAIN,
    MAX_HYSTERESIS_OFF,
    MAX_HYSTERESIS_ON,
    MAX_RELAY_TIMEOUT,
    MAX_TARGET,
    MAX_TEMP_STEP,
    MIN_HYSTERESIS_OFF,
    MIN_HYSTERESIS_ON,
    MIN_RELAY_TIMEOUT,
    MIN_TARGET,
    MIN_TEMP_STEP,
)
from .coordinator import SmartHeatingData


async def async_setup_entry(hass, entry, async_add_entities):
    """Set up the target-temperature, dual hysteresis and eco controls when the device is created."""
    data = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([
        HeatingTarget(data, entry),
        HeatingHysteresisOn(data, entry),
        HeatingHysteresisOff(data, entry),
        HeatingEcoTarget(data, entry),
        HeatingRelayTimeout(data, entry),
        HeatingTempStep(data, entry),
    ])


class SmartHeatingNumber(RestoreNumber):
    """Shared plumbing for the numeric controls."""

    _attr_has_entity_name = True
    _attr_mode = NumberMode.SLIDER
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
        last = await self.async_get_last_number_data()
        if last is not None and last.native_value is not None:
            self._apply_restored(float(last.native_value))
        if hasattr(self.data, 'entity_ids'):
            self.data.entity_ids.add(self.entity_id)
        self._remove_listener = self.data.async_add_listener(self.async_write_ha_state)

    def _apply_restored(self, value: float) -> None:
        """Push a restored value into shared coordinator state. No-op by default."""

    async def async_will_remove_from_hass(self) -> None:
        if hasattr(self.data, 'entity_ids'):
            self.data.entity_ids.discard(self.entity_id)
        if self._remove_listener:
            self._remove_listener()
            self._remove_listener = None


class HeatingTarget(SmartHeatingNumber):
    """Target room temperature."""

    _attr_device_class = NumberDeviceClass.TEMPERATURE

    def __init__(self, data: SmartHeatingData, entry) -> None:
        super().__init__(data, entry, "target", "Цільова температура")

    @property
    def native_min_value(self) -> float:
        return self.data.min_target_temperature

    @property
    def native_max_value(self) -> float:
        return self.data.max_target_temperature

    @property
    def native_value(self) -> float:
        return self.data.target_temperature

    async def async_set_native_value(self, value: float) -> None:
        self.data.set_target(value)
        self.async_write_ha_state()


class HeatingHysteresisOn(SmartHeatingNumber):
    """Width of the hysteresis band below target for turning contact 1 ON."""

    _attr_native_min_value = MIN_HYSTERESIS_ON
    _attr_native_max_value = MAX_HYSTERESIS_ON

    def __init__(self, data: SmartHeatingData, entry) -> None:
        # Keep _hysteresis as unique id suffix for backward compatibility with existing setups
        super().__init__(data, entry, "hysteresis", "Гістерезіс увімкнення")

    @property
    def native_value(self) -> float:
        return self.data.hysteresis_on

    def _apply_restored(self, value: float) -> None:
        self.data.set_hysteresis_on(value)

    async def async_set_native_value(self, value: float) -> None:
        self.data.set_hysteresis_on(value)
        self.async_write_ha_state()


class HeatingHysteresisOff(SmartHeatingNumber):
    """Width of the hysteresis band above target for turning contact 1 OFF."""

    _attr_native_min_value = MIN_HYSTERESIS_OFF
    _attr_native_max_value = MAX_HYSTERESIS_OFF

    def __init__(self, data: SmartHeatingData, entry) -> None:
        super().__init__(data, entry, "hysteresis_off", "Гістерезіс вимкнення")

    @property
    def native_value(self) -> float:
        return self.data.hysteresis_off

    def _apply_restored(self, value: float) -> None:
        self.data.set_hysteresis_off(value)

    async def async_set_native_value(self, value: float) -> None:
        self.data.set_hysteresis_off(value)
        self.async_write_ha_state()


class HeatingEcoTarget(SmartHeatingNumber):
    """Eco target temperature used during eco schedule hours and eco timers."""

    _attr_device_class = NumberDeviceClass.TEMPERATURE
    _attr_native_min_value = MIN_TARGET
    _attr_native_max_value = MAX_TARGET

    def __init__(self, data: SmartHeatingData, entry) -> None:
        super().__init__(data, entry, "eco_target", "Еко температура")

    @property
    def native_value(self) -> float:
        return self.data.eco_temperature

    def _apply_restored(self, value: float) -> None:
        self.data.set_eco_temperature(value)

    async def async_set_native_value(self, value: float) -> None:
        self.data.set_eco_temperature(value)
        self.async_write_ha_state()


class HeatingRelayTimeout(SmartHeatingNumber):
    """Seconds to wait for relay feedback before flagging a mismatch."""

    _attr_native_unit_of_measurement = UnitOfTime.SECONDS
    _attr_native_step = 1
    _attr_native_min_value = MIN_RELAY_TIMEOUT
    _attr_native_max_value = MAX_RELAY_TIMEOUT

    def __init__(self, data: SmartHeatingData, entry) -> None:
        super().__init__(data, entry, "relay_timeout", "Час перевірки реле")

    @property
    def native_value(self) -> float:
        return self.data.relay_timeout

    def _apply_restored(self, value: float) -> None:
        self.data.set_relay_timeout(value)

    async def async_set_native_value(self, value: float) -> None:
        self.data.set_relay_timeout(value)
        self.async_write_ha_state()


class HeatingTempStep(SmartHeatingNumber):
    """Step size used by the target-temperature +/- buttons."""

    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_native_step = 0.1
    _attr_native_min_value = MIN_TEMP_STEP
    _attr_native_max_value = MAX_TEMP_STEP

    def __init__(self, data: SmartHeatingData, entry) -> None:
        super().__init__(data, entry, "temp_step", "Крок зміни цільової температури")

    @property
    def native_value(self) -> float:
        return self.data.temp_step

    def _apply_restored(self, value: float) -> None:
        self.data.set_temp_step(value)

    async def async_set_native_value(self, value: float) -> None:
        self.data.set_temp_step(value)
        self.async_write_ha_state()
