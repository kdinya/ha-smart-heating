"""Runtime state and hysteresis controller for Smart Heating."""
from __future__ import annotations

import logging
from typing import Any, Callable

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event

from .const import (
    ATTR_HEATING,
    CONF_HUMIDITY,
    CONF_HYSTERESIS,
    CONF_HYSTERESIS_ON,
    CONF_HYSTERESIS_OFF,
    CONF_NAME,
    CONF_OUTDOOR_TEMPERATURE,
    CONF_PRECIPITATION,
    CONF_ROOM_TEMPERATURE,
    CONF_SWITCH_1,
    CONF_SWITCH_2,
    CONF_TARGET_TEMPERATURE,
    CONF_WIND,
    DEFAULT_HYSTERESIS,
    DEFAULT_HYSTERESIS_ON,
    DEFAULT_HYSTERESIS_OFF,
    DEFAULT_NAME,
    DEFAULT_TARGET,
    ENTITY_KEYS,
    MAX_HYSTERESIS,
    MAX_TARGET,
    MIN_HYSTERESIS,
    MIN_HYSTERESIS_ON,
    MAX_HYSTERESIS_ON,
    MIN_HYSTERESIS_OFF,
    MAX_HYSTERESIS_OFF,
    MIN_TARGET,
)

_LOGGER = logging.getLogger(__name__)
UNAVAILABLE_STATES = {"unknown", "unavailable", "none", ""}


def clamp(value: float, low: float, high: float) -> float:
    """Keep a value inside its supported range."""
    return min(high, max(low, value))


class SmartHeatingData:
    """State container shared by all entities of one heating device."""

    def get_config_or_option(self, key: str, default: Any = None) -> Any:
        """Read a setting or entity ID, giving precedence to options over data."""
        if key in self.entry.options:
            val = self.entry.options[key]
            return val if val is not None and val != "" else None
        val = self.entry.data.get(key)
        return val if val is not None and val != "" else default

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.name = entry.data.get(CONF_NAME, DEFAULT_NAME)
        self.target_temperature = clamp(
            float(self.get_config_or_option(CONF_TARGET_TEMPERATURE, DEFAULT_TARGET)),
            MIN_TARGET,
            MAX_TARGET,
        )
        self.hysteresis_on = clamp(
            float(self.get_config_or_option(CONF_HYSTERESIS_ON, self.get_config_or_option(CONF_HYSTERESIS, DEFAULT_HYSTERESIS_ON))),
            MIN_HYSTERESIS_ON,
            MAX_HYSTERESIS_ON,
        )
        self.hysteresis_off = clamp(
            float(self.get_config_or_option(CONF_HYSTERESIS_OFF, DEFAULT_HYSTERESIS_OFF)),
            MIN_HYSTERESIS_OFF,
            MAX_HYSTERESIS_OFF,
        )
        self.enabled = True
        self.heating = False
        self.room_temperature: float | None = None
        self._remove_listener: Callable[[], None] | None = None
        self._listeners: list[Callable[[], None]] = []

    # -- listener plumbing -------------------------------------------------

    def async_add_listener(self, update_callback: Callable[[], None]) -> Callable[[], None]:
        """Register a callback invoked after every evaluation. Returns an unsubscribe function."""
        self._listeners.append(update_callback)

        def _remove() -> None:
            if update_callback in self._listeners:
                self._listeners.remove(update_callback)

        return _remove

    def _notify_listeners(self) -> None:
        for update_callback in list(self._listeners):
            update_callback()

    # -- lifecycle ---------------------------------------------------------

    async def async_start(self) -> None:
        """Begin watching the configured source entities."""
        entity_ids = [
            entity_id
            for key in ENTITY_KEYS
            if (entity_id := self.get_config_or_option(key))
        ]
        if entity_ids:
            self._remove_listener = async_track_state_change_event(
                self.hass, entity_ids, self._state_changed
            )
        self.evaluate()

    async def async_stop(self) -> None:
        """Stop watching source entities."""
        if self._remove_listener:
            self._remove_listener()
            self._remove_listener = None

    @callback
    def _state_changed(self, event: Any) -> None:
        self.evaluate()

    # -- control loop ------------------------------------------------------

    def _read_float(self, key: str) -> float | None:
        entity_id = self.get_config_or_option(key)
        state = self.hass.states.get(entity_id) if entity_id else None
        if not state or state.state in UNAVAILABLE_STATES:
            return None
        try:
            return float(state.state)
        except (TypeError, ValueError):
            _LOGGER.debug("%s: cannot read a number from %s", self.name, entity_id)
            return None

    @callback
    def evaluate(self) -> None:
        """Re-read the room sensor, apply hysteresis and drive the output switch.

        If the room sensor is unavailable, heating is forced off rather than
        left at its last value: a stuck-on boiler with no working thermostat
        is a real hazard, an idle one is just an inconvenience.
        """
        self.room_temperature = self._read_float(CONF_ROOM_TEMPERATURE)
        try:
            if self.room_temperature is None:
                if self.heating:
                    _LOGGER.warning(
                        "%s: room sensor unavailable, turning heating off as a fail-safe",
                        self.name,
                    )
                self.heating = False
                self.sync_output()
                return
            if not self.enabled:
                self.heating = False
                self.sync_output()
                return
            if self.heating and self.room_temperature >= self.target_temperature + self.hysteresis_off:
                self.heating = False
            elif not self.heating and self.room_temperature <= self.target_temperature - self.hysteresis_on:
                self.heating = True
            self.sync_output()
        finally:
            self._notify_listeners()

    @callback
    def sync_output(self) -> None:
        """Push the desired state to the controlled switch, if it differs."""
        switch_id = self.get_config_or_option(CONF_SWITCH_1)
        if not switch_id:
            return
        desired = "on" if self.heating else "off"
        current = self.hass.states.get(switch_id)
        if current and current.state != desired:
            self.hass.async_create_task(
                self.hass.services.async_call(
                    "switch",
                    "turn_on" if self.heating else "turn_off",
                    {"entity_id": switch_id},
                )
            )

    # -- setters used by the entities -------------------------------------

    def set_enabled(self, enabled: bool) -> None:
        """Turn the hysteresis control on or off."""
        self.enabled = enabled
        if not enabled:
            self.heating = False
            self.sync_output()
            self._notify_listeners()
            return
        self.evaluate()

    def set_target(self, value: float) -> None:
        """Change the target temperature and re-evaluate."""
        self.target_temperature = clamp(float(value), MIN_TARGET, MAX_TARGET)
        self.evaluate()

    @property
    def hysteresis(self) -> float:
        """Legacy single hysteresis alias (points to hysteresis_on)."""
        return self.hysteresis_on

    def set_hysteresis(self, value: float) -> None:
        """Change the hysteresis band and re-evaluate."""
        self.set_hysteresis_on(value)

    def set_hysteresis_on(self, value: float) -> None:
        """Change the turn-on delta and re-evaluate."""
        self.hysteresis_on = clamp(float(value), MIN_HYSTERESIS_ON, MAX_HYSTERESIS_ON)
        self.evaluate()

    def set_hysteresis_off(self, value: float) -> None:
        """Change the turn-off delta and re-evaluate."""
        self.hysteresis_off = clamp(float(value), MIN_HYSTERESIS_OFF, MAX_HYSTERESIS_OFF)
        self.evaluate()

    # -- card-facing data --------------------------------------------------

    def source_value(self, key: str) -> str | None:
        """Raw state of an optional source entity, or None when unusable."""
        entity_id = self.get_config_or_option(key)
        state = self.hass.states.get(entity_id) if entity_id else None
        if not state or state.state in UNAVAILABLE_STATES:
            return None
        return state.state

    @property
    def attributes(self) -> dict[str, Any]:
        """Extra attributes consumed by the Lovelace card."""
        return {
            "enabled": self.enabled,
            ATTR_HEATING: self.heating,
            "room_temperature": self.room_temperature,
            "target_temperature": self.target_temperature,
            "hysteresis": self.hysteresis,
            "hysteresis_on": self.hysteresis_on,
            "hysteresis_off": self.hysteresis_off,
            "humidity": self.source_value(CONF_HUMIDITY),
            "outdoor_temperature": self.source_value(CONF_OUTDOOR_TEMPERATURE),
            "wind": self.source_value(CONF_WIND),
            "precipitation": self.source_value(CONF_PRECIPITATION),
            "switch_1": self.get_config_or_option(CONF_SWITCH_1),
            "switch_2": self.get_config_or_option(CONF_SWITCH_2),
            "switch_2_state": self.source_value(CONF_SWITCH_2),
        }
