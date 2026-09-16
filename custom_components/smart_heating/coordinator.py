"""Runtime state and hysteresis controller for Smart Heating."""
from __future__ import annotations

from typing import Callable

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event

from .const import (
    ATTR_HEATING, CONF_HUMIDITY, CONF_OUTDOOR_TEMPERATURE, CONF_PRECIPITATION,
    CONF_ROOM_TEMPERATURE, CONF_SWITCH_1, CONF_SWITCH_2, CONF_WIND, DEFAULT_HYSTERESIS,
    DEFAULT_TARGET, DOMAIN,
)

class SmartHeatingData:
    """State container shared by all entities in one heating device."""
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass, self.entry = hass, entry
        self.name = entry.data.get("name", "Smart Heating")
        self.target_temperature = entry.options.get("target_temperature", DEFAULT_TARGET)
        self.hysteresis = entry.options.get("hysteresis", DEFAULT_HYSTERESIS)
        self.enabled = True
        self.heating = False
        self.room_temperature = None
        self._remove_listener = None
        self._listeners: list[Callable[[], None]] = []

    def async_add_listener(self, update_callback: Callable[[], None]) -> Callable[[], None]:
        """Register a callback invoked after every evaluate() cycle. Returns an unsubscribe function."""
        self._listeners.append(update_callback)

        def _remove() -> None:
            if update_callback in self._listeners:
                self._listeners.remove(update_callback)

        return _remove

    def _notify_listeners(self) -> None:
        for update_callback in list(self._listeners):
            update_callback()

    async def async_start(self) -> None:
        entity_ids = [v for k, v in self.entry.data.items() if k not in {"name"} and v]
        if entity_ids:
            self._remove_listener = async_track_state_change_event(
                self.hass, entity_ids, self._state_changed
            )
        self._evaluate()

    async def async_stop(self) -> None:
        if self._remove_listener:
            self._remove_listener()

    @callback
    def _state_changed(self, event) -> None:
        self._evaluate()

    @callback
    def _evaluate(self) -> None:
        entity_id = self.entry.data.get(CONF_ROOM_TEMPERATURE)
        state = self.hass.states.get(entity_id) if entity_id else None
        try:
            self.room_temperature = float(state.state) if state and state.state not in ("unknown", "unavailable") else None
        except ValueError:
            self.room_temperature = None
        try:
            if self.room_temperature is None:
                return
            if not self.enabled:
                self.heating = False
                self._sync_output()
                return
            if self.heating and self.room_temperature >= self.target_temperature:
                self.heating = False
            elif not self.heating and self.room_temperature <= self.target_temperature - self.hysteresis:
                self.heating = True
            self._sync_output()
        finally:
            self._notify_listeners()

    @callback
    def _sync_output(self) -> None:
        switch_id = self.entry.data.get(CONF_SWITCH_1)
        if switch_id:
            desired = "on" if self.heating else "off"
            current = self.hass.states.get(switch_id)
            if current and current.state != desired:
                self.hass.async_create_task(self.hass.services.async_call(
                    "switch", "turn_on" if self.heating else "turn_off", {"entity_id": switch_id}
                ))

    def set_target(self, value: float) -> None:
        self.target_temperature = value
        self._evaluate()

    def set_hysteresis(self, value: float) -> None:
        self.hysteresis = value
        self._evaluate()

    def source_value(self, key: str):
        entity_id = self.entry.data.get(key)
        state = self.hass.states.get(entity_id) if entity_id else None
        if not state or state.state in ("unknown", "unavailable"):
            return None
        return state.state

    @property
    def attributes(self) -> dict:
        return {
            "enabled": self.enabled,
            ATTR_HEATING: self.heating,
            "room_temperature": self.room_temperature,
            "target_temperature": self.target_temperature,
            "hysteresis": self.hysteresis,
            "humidity": self.source_value(CONF_HUMIDITY),
            "outdoor_temperature": self.source_value(CONF_OUTDOOR_TEMPERATURE),
            "wind": self.source_value(CONF_WIND),
            "precipitation": self.source_value(CONF_PRECIPITATION),
        }
