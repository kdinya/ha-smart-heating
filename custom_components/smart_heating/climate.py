"""Climate platform for Smart Heating."""
from __future__ import annotations

import logging

from homeassistant.components.climate import (
    ClimateEntity,
    ClimateEntityFeature,
    HVACAction,
    HVACMode,
)
from homeassistant.const import ATTR_TEMPERATURE, UnitOfTemperature
from homeassistant.helpers.restore_state import RestoreEntity

from .const import (
    CONF_HYSTERESIS,
    DOMAIN,
    MAX_TARGET,
    MIN_TARGET,
    TARGET_STEP,
)
from .coordinator import SmartHeatingData

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass, entry, async_add_entities):
    """Set up the single climate entity of a Smart Heating device."""
    async_add_entities([SmartHeatingClimate(hass.data[DOMAIN][entry.entry_id], entry)])


class SmartHeatingClimate(RestoreEntity, ClimateEntity):
    """Hysteresis thermostat exposed as a climate entity."""

    _attr_has_entity_name = True
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_hvac_modes = [HVACMode.HEAT, HVACMode.OFF]
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE
        | ClimateEntityFeature.TURN_ON
        | ClimateEntityFeature.TURN_OFF
    )
    _attr_min_temp = MIN_TARGET
    _attr_max_temp = MAX_TARGET
    _attr_target_temperature_step = TARGET_STEP

    def __init__(self, data: SmartHeatingData, entry) -> None:
        self.data = data
        self._attr_unique_id = f"{entry.entry_id}_climate"
        self._attr_name = "Газовий котел"
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry.entry_id)},
            "name": data.name,
            "manufacturer": "Smart Heating",
            "model": "Hysteresis boiler controller",
        }
        self._remove_listener = None

    async def async_added_to_hass(self) -> None:
        """Restore the previous mode, target temperature and hysteresis.

        Only an explicit `heat` re-enables the control. A restored `unknown` or
        `unavailable` state (e.g. after a crash) must not be treated as `heat`.
        """
        await super().async_added_to_hass()
        last_state = await self.async_get_last_state()
        if last_state:
            self.data.enabled = last_state.state == HVACMode.HEAT
            attributes = last_state.attributes
            target = attributes.get(ATTR_TEMPERATURE, attributes.get("target_temperature"))
            if target is not None:
                try:
                    self.data.set_target(float(target))
                except (TypeError, ValueError):
                    _LOGGER.debug("Ignoring restored target temperature %r", target)
            h_on = attributes.get("hysteresis_on", attributes.get(CONF_HYSTERESIS))
            if h_on is not None:
                try:
                    self.data.set_hysteresis_on(float(h_on))
                except (TypeError, ValueError):
                    _LOGGER.debug("Ignoring restored turn-on delta %r", h_on)
            h_off = attributes.get("hysteresis_off")
            if h_off is not None:
                try:
                    self.data.set_hysteresis_off(float(h_off))
                except (TypeError, ValueError):
                    _LOGGER.debug("Ignoring restored turn-off delta %r", h_off)
            c1 = attributes.get("contact_1_enabled")
            if c1 is not None:
                self.data.contact_1_enabled = bool(c1)
            c2 = attributes.get("contact_2_enabled")
            if c2 is not None:
                self.data.contact_2_enabled = bool(c2)
            self.data.evaluate()
        self._remove_listener = self.data.async_add_listener(self.async_write_ha_state)

    async def async_will_remove_from_hass(self) -> None:
        """Drop the state listener."""
        if self._remove_listener:
            self._remove_listener()
            self._remove_listener = None

    @property
    def current_temperature(self) -> float | None:
        return self.data.room_temperature

    @property
    def target_temperature(self) -> float:
        return self.data.target_temperature

    @property
    def hvac_mode(self) -> HVACMode:
        return HVACMode.HEAT if self.data.enabled else HVACMode.OFF

    @property
    def hvac_action(self) -> HVACAction:
        """Report whether the boiler is actually firing right now."""
        if not self.data.enabled:
            return HVACAction.OFF
        return HVACAction.HEATING if (self.data.contact_1_enabled and self.data.heating) else HVACAction.IDLE

    @property
    def extra_state_attributes(self) -> dict:
        return self.data.attributes

    async def async_set_temperature(self, **kwargs) -> None:
        """Set a new target temperature."""
        if ATTR_TEMPERATURE in kwargs:
            self.data.set_target(float(kwargs[ATTR_TEMPERATURE]))
            self.async_write_ha_state()

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        """Enable or disable the hysteresis control."""
        if hvac_mode not in self._attr_hvac_modes:
            return
        self.data.set_enabled(hvac_mode == HVACMode.HEAT)
        self.async_write_ha_state()

    async def async_turn_on(self) -> None:
        await self.async_set_hvac_mode(HVACMode.HEAT)

    async def async_turn_off(self) -> None:
        await self.async_set_hvac_mode(HVACMode.OFF)
