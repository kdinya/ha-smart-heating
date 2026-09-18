"""Runtime state and hysteresis controller for Smart Heating."""
from __future__ import annotations

import logging
import time

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
    CONF_ECO_TEMPERATURE,
    CONF_RELAY_TIMEOUT,
    CONF_TEMP_STEP,
    DEFAULT_ECO_TEMPERATURE,
    DEFAULT_RELAY_TIMEOUT,
    DEFAULT_TEMP_STEP,
    MIN_ECO_TEMPERATURE,
    MAX_ECO_TEMPERATURE,
    MIN_RELAY_TIMEOUT,
    MAX_RELAY_TIMEOUT,
    MIN_TEMP_STEP,
    MAX_TEMP_STEP,
    CONF_WEATHER,
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
        self.contact_1_enabled = True
        self.contact_2_enabled = False
        self.eco_temperature = clamp(
            float(self.get_config_or_option(CONF_ECO_TEMPERATURE, DEFAULT_ECO_TEMPERATURE)),
            MIN_ECO_TEMPERATURE,
            MAX_ECO_TEMPERATURE,
        )
        self.relay_timeout = clamp(
            float(self.get_config_or_option(CONF_RELAY_TIMEOUT, DEFAULT_RELAY_TIMEOUT)),
            MIN_RELAY_TIMEOUT,
            MAX_RELAY_TIMEOUT,
        )
        self.temp_step = clamp(
            float(self.get_config_or_option(CONF_TEMP_STEP, DEFAULT_TEMP_STEP)),
            MIN_TEMP_STEP,
            MAX_TEMP_STEP,
        )
        self.active_program: str | None = None
        self.programs: dict[str, Any] = {
            "P1": {
                "name": "P1",
                "hours": [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
            }
        }
        self.eco_timer_until: float | None = None
        self._switch_1_requested_state: str | None = None
        self._switch_1_requested_time: float = 0.0
        self._switch_2_requested_state: str | None = None
        self._switch_2_requested_time: float = 0.0
        self.relay_mismatch_1: bool = False
        self.relay_mismatch_2: bool = False
        self.relay_warning: str | None = None
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
            if not self.enabled or not self.contact_1_enabled:
                self.heating = False
                self.sync_output()
                return
            if self.room_temperature is None:
                if self.heating:
                    _LOGGER.warning(
                        "%s: room sensor unavailable, turning heating off as a fail-safe",
                        self.name,
                    )
                self.heating = False
                self.sync_output()
                return
            target = self.effective_target_temperature
            if self.heating and self.room_temperature >= target + self.hysteresis_off:
                self.heating = False
            elif not self.heating and self.room_temperature <= target - self.hysteresis_on:
                self.heating = True
            self.sync_output()
        finally:
            self._notify_listeners()

    @callback
    def sync_output(self) -> None:
        """Push the desired state to both output switches, if configured."""
        switch_1_id = self.get_config_or_option(CONF_SWITCH_1)
        if switch_1_id:
            desired_1 = "on" if (self.enabled and self.contact_1_enabled and self.heating) else "off"
            current_1 = self.hass.states.get(switch_1_id)
            if current_1:
                if current_1.state in ("unavailable", "unknown"):
                    self.relay_mismatch_1 = False
                    self.relay_warning = f"Switch 1 is {current_1.state}"
                else:
                    if self._switch_1_requested_state != desired_1:
                        self._switch_1_requested_state = desired_1
                        self._switch_1_requested_time = time.monotonic()
                    if current_1.state != desired_1:
                        self.hass.async_create_task(
                            self.hass.services.async_call(
                                "switch",
                                "turn_on" if desired_1 == "on" else "turn_off",
                                {"entity_id": switch_1_id},
                            )
                        )
                        if (time.monotonic() - self._switch_1_requested_time) > self.relay_timeout:
                            self.relay_mismatch_1 = True
                            self.relay_warning = f"Switch 1 mismatch: expected {desired_1}, got {current_1.state}"
                            if not getattr(self, "_relay_1_warned", False):
                                _LOGGER.warning(self.relay_warning)
                                self._relay_1_warned = True
                    else:
                        self.relay_mismatch_1 = False
                        self._relay_1_warned = False

        switch_2_id = self.get_config_or_option(CONF_SWITCH_2)
        if switch_2_id:
            desired_2 = "on" if (self.enabled and self.contact_2_enabled) else "off"
            current_2 = self.hass.states.get(switch_2_id)
            if current_2 and current_2.state != desired_2:
                self.hass.async_create_task(
                    self.hass.services.async_call(
                        "switch",
                        "turn_on" if desired_2 == "on" else "turn_off",
                        {"entity_id": switch_2_id},
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

    def set_contact_1(self, enabled: bool) -> None:
        """Enable or disable contact 1 smart thermostat control."""
        self.contact_1_enabled = bool(enabled)
        self.evaluate()

    def set_contact_2(self, enabled: bool) -> None:
        """Enable or disable contact 2 programmer bypass."""
        self.contact_2_enabled = bool(enabled)
        self.sync_output()
        self._notify_listeners()

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


    @property
    def effective_target_temperature(self) -> float:
        """Target temperature taking into account eco timer or active schedule.

        When no program is explicitly selected, the card still runs on the
        default schedule (P1) rather than ignoring schedules altogether --
        only an explicit deactivate (active_program cleared with no
        fallback) or a program list without P1 falls through to the raw
        manual target.
        """
        now_ts = time.time()
        if self.eco_timer_until and now_ts < self.eco_timer_until:
            return self.eco_temperature
        if self.active_program and self.active_program in self.programs:
            prog = self.programs[self.active_program]
        elif not self.active_program and "P1" in self.programs:
            prog = self.programs["P1"]
        else:
            prog = None
        if prog is not None:
            hours = prog.get("hours", [])
            # HA core or system local hour
            import datetime
            cur_hour = datetime.datetime.now().hour
            if 0 <= cur_hour < len(hours) and hours[cur_hour] == 0:
                return self.eco_temperature
        return self.target_temperature

    def set_eco_temperature(self, value: float) -> None:
        """Change the eco target temperature and re-evaluate."""
        self.eco_temperature = clamp(float(value), MIN_ECO_TEMPERATURE, MAX_ECO_TEMPERATURE)
        self.evaluate()

    def set_relay_timeout(self, value: float) -> None:
        """Set verification timeout in seconds for relay feedback."""
        self.relay_timeout = clamp(float(value), MIN_RELAY_TIMEOUT, MAX_RELAY_TIMEOUT)
        self.evaluate()

    def set_temp_step(self, value: float) -> None:
        """Set the target-temperature adjustment step used by the +/- buttons."""
        self.temp_step = clamp(float(value), MIN_TEMP_STEP, MAX_TEMP_STEP)
        self._notify_listeners()

    def set_program(self, program_id: str | None, programs: dict[str, Any] | None = None) -> None:
        """Activate a schedule program or deactivate (None / 'none')."""
        if programs:
            self.programs.update(programs)
        if program_id in (None, "", "none", "off"):
            self.active_program = None
        elif program_id in self.programs:
            self.active_program = program_id
        self.evaluate()

    def set_eco_timer(self, minutes: int) -> None:
        """Set temporary eco mode for N minutes (0 to cancel)."""
        if minutes <= 0:
            self.eco_timer_until = None
        else:
            self.eco_timer_until = time.time() + (minutes * 60)
        self.evaluate()

    # -- card-facing data --------------------------------------------------

    def source_value(self, key: str) -> str | None:
        """Raw state of an optional source entity, or None when unusable."""
        entity_id = self.get_config_or_option(key)
        state = self.hass.states.get(entity_id) if entity_id else None
        if not state or state.state in UNAVAILABLE_STATES:
            return None
        return state.state

    def weather_attr(self, attr_name: str) -> Any:
        """Read attribute from configured weather entity."""
        entity_id = self.get_config_or_option(CONF_WEATHER)
        state = self.hass.states.get(entity_id) if entity_id else None
        if not state or state.state in UNAVAILABLE_STATES:
            return None
        if attr_name == "state":
            return state.state
        return state.attributes.get(attr_name)

    @property
    def attributes(self) -> dict[str, Any]:
        """Extra attributes consumed by the Lovelace card."""
        is_burning = self.heating if (self.enabled and self.contact_1_enabled) else False
        outdoor = self.source_value(CONF_OUTDOOR_TEMPERATURE)
        if outdoor is None:
            w_temp = self.weather_attr("temperature")
            if w_temp is not None:
                outdoor = str(w_temp)

        hum = self.source_value(CONF_HUMIDITY)
        if hum is None:
            w_hum = self.weather_attr("humidity")
            if w_hum is not None:
                hum = str(w_hum)

        wind = self.source_value(CONF_WIND)
        if wind is None:
            w_wind = self.weather_attr("wind_speed")
            if w_wind is not None:
                wind = str(w_wind)

        precip = self.source_value(CONF_PRECIPITATION)
        if precip is None:
            w_precip = self.weather_attr("precipitation")
            if w_precip is not None:
                precip = str(w_precip)

        now_ts = time.time()
        eco_remaining = max(0, int(self.eco_timer_until - now_ts)) if self.eco_timer_until else 0
        return {
            "enabled": self.enabled,
            ATTR_HEATING: is_burning,
            "eco_temperature": self.eco_temperature,
            "effective_target_temperature": self.effective_target_temperature,
            "active_program": self.active_program,
            "programs": self.programs,
            "eco_timer_remaining": eco_remaining,
            "eco_timer_until": self.eco_timer_until,
            "relay_timeout": self.relay_timeout,
            "temp_step": self.temp_step,
            "relay_mismatch": (self.relay_mismatch_1 or self.relay_mismatch_2),
            "relay_warning": self.relay_warning if (self.relay_mismatch_1 or self.relay_mismatch_2) else None,
            "contact_1_enabled": self.contact_1_enabled,
            "contact_2_enabled": self.contact_2_enabled,
            "contact_1_state": is_burning,
            "contact_2_state": (self.source_value(CONF_SWITCH_2) == "on") if self.enabled else False,
            "room_temperature": self.room_temperature,
            "target_temperature": self.target_temperature,
            "hysteresis": self.hysteresis,
            "hysteresis_on": self.hysteresis_on,
            "hysteresis_off": self.hysteresis_off,
            "humidity": hum,
            "outdoor_temperature": outdoor,
            "weather": self.source_value(CONF_WEATHER),
            "weather_condition": self.weather_attr("state"),
            "wind": wind,
            "precipitation": precip,
            "switch_1": self.get_config_or_option(CONF_SWITCH_1),
            "switch_2": self.get_config_or_option(CONF_SWITCH_2),
            "switch_2_state": self.source_value(CONF_SWITCH_2),
        }
