"""Config and options flow for Smart Heating."""
from __future__ import annotations

from typing import Any
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import (
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
    CONF_WEATHER,
    CONF_WIND,
    DEFAULT_HYSTERESIS,
    DEFAULT_HYSTERESIS_ON,
    DEFAULT_HYSTERESIS_OFF,
    DEFAULT_NAME,
    DEFAULT_TARGET,
    DOMAIN,
    ENTITY_KEYS,
    MAX_HYSTERESIS_ON,
    MIN_HYSTERESIS_ON,
    MAX_HYSTERESIS_OFF,
    MIN_HYSTERESIS_OFF,
    MAX_TARGET,
    MIN_TARGET,
)


def _sensor_selector(device_class: str | None = None) -> selector.EntitySelector:
    config = (
        selector.EntitySelectorConfig(domain="sensor", device_class=device_class)
        if device_class
        else selector.EntitySelectorConfig(domain="sensor")
    )
    return selector.EntitySelector(config)


def _switch_selector() -> selector.EntitySelector:
    return selector.EntitySelector(selector.EntitySelectorConfig(domain="switch"))


def _weather_selector() -> selector.EntitySelector:
    return selector.EntitySelector(
        selector.EntitySelectorConfig(domain=["weather", "sensor"])
    )


def _number_slider(min_val: float, max_val: float, step: float = 0.1) -> selector.NumberSelector:
    return selector.NumberSelector(
        selector.NumberSelectorConfig(
            min=min_val,
            max=max_val,
            step=step,
            mode=selector.NumberSelectorMode.SLIDER,
            unit_of_measurement="°C",
        )
    )


def _user_schema() -> vol.Schema:
    """Schema of the initial setup step."""
    return vol.Schema(
        {
            vol.Required(CONF_NAME, default=DEFAULT_NAME): str,
            vol.Required(CONF_ROOM_TEMPERATURE): _sensor_selector("temperature"),
            vol.Required(CONF_TARGET_TEMPERATURE, default=DEFAULT_TARGET): _number_slider(
                MIN_TARGET, MAX_TARGET, 0.5
            ),
            vol.Required(CONF_HYSTERESIS_ON, default=DEFAULT_HYSTERESIS_ON): _number_slider(
                MIN_HYSTERESIS_ON, MAX_HYSTERESIS_ON, 0.1
            ),
            vol.Required(CONF_HYSTERESIS_OFF, default=DEFAULT_HYSTERESIS_OFF): _number_slider(
                MIN_HYSTERESIS_OFF, MAX_HYSTERESIS_OFF, 0.1
            ),
            vol.Optional(CONF_SWITCH_1): _switch_selector(),
            vol.Optional(CONF_SWITCH_2): _switch_selector(),
            vol.Optional(CONF_WEATHER): _weather_selector(),
            vol.Optional(CONF_OUTDOOR_TEMPERATURE): _sensor_selector("temperature"),
            vol.Optional(CONF_HUMIDITY): _sensor_selector("humidity"),
            vol.Optional(CONF_WIND): _sensor_selector(),
            vol.Optional(CONF_PRECIPITATION): _sensor_selector(),
        }
    )


class SmartHeatingConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a Smart Heating setup."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Collect the device name and its source entities."""
        errors: dict[str, str] = {}
        if user_input is not None:
            chosen = [user_input[key] for key in ENTITY_KEYS if user_input.get(key)]
            if len(chosen) != len(set(chosen)):
                errors["base"] = "duplicate_entity"
            else:
                await self.async_set_unique_id(
                    user_input[CONF_NAME].strip().lower().replace(" ", "_")
                )
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=user_input[CONF_NAME],
                    data=user_input,
                    options={
                        CONF_TARGET_TEMPERATURE: user_input.get(CONF_TARGET_TEMPERATURE, DEFAULT_TARGET),
                        CONF_HYSTERESIS_ON: user_input.get(CONF_HYSTERESIS_ON, DEFAULT_HYSTERESIS_ON),
                        CONF_HYSTERESIS_OFF: user_input.get(CONF_HYSTERESIS_OFF, DEFAULT_HYSTERESIS_OFF),
                    },
                )
        return self.async_show_form(
            step_id="user", data_schema=_user_schema(), errors=errors
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Return the options flow handler."""
        return SmartHeatingOptionsFlow()


class SmartHeatingOptionsFlow(config_entries.OptionsFlow):
    """Change runtime options, entities and sensors."""

    async def async_step_init(self, user_input=None):
        """Show and store runtime options."""
        errors: dict[str, str] = {}
        if user_input is not None:
            chosen = [user_input[key] for key in ENTITY_KEYS if user_input.get(key)]
            if len(chosen) != len(set(chosen)):
                errors["base"] = "duplicate_entity"
            else:
                payload = dict(user_input)
                for k in ENTITY_KEYS:
                    if not payload.get(k):
                        payload[k] = None
                return self.async_create_entry(title="", data=payload)

        options = self.config_entry.options
        data = self.config_entry.data

        def get_val(key: str, default: Any = None) -> Any:
            if key in options:
                val = options[key]
                return val if val is not None and val != "" else default
            val = data.get(key)
            return val if val is not None and val != "" else default

        cur_room = get_val(CONF_ROOM_TEMPERATURE)
        cur_target = float(get_val(CONF_TARGET_TEMPERATURE, DEFAULT_TARGET))
        cur_h_on = float(get_val(CONF_HYSTERESIS_ON, get_val(CONF_HYSTERESIS, DEFAULT_HYSTERESIS_ON)))
        cur_h_off = float(get_val(CONF_HYSTERESIS_OFF, DEFAULT_HYSTERESIS_OFF))

        schema_dict: dict[Any, Any] = {}

        # Room temperature sensor is required
        if cur_room:
            schema_dict[vol.Required(CONF_ROOM_TEMPERATURE, default=cur_room)] = _sensor_selector("temperature")
        else:
            schema_dict[vol.Required(CONF_ROOM_TEMPERATURE)] = _sensor_selector("temperature")

        # Target temperature & hysteresis
        schema_dict[vol.Required(CONF_TARGET_TEMPERATURE, default=cur_target)] = _number_slider(
            MIN_TARGET, MAX_TARGET, 0.5
        )
        schema_dict[vol.Required(CONF_HYSTERESIS_ON, default=cur_h_on)] = _number_slider(
            MIN_HYSTERESIS_ON, MAX_HYSTERESIS_ON, 0.1
        )
        schema_dict[vol.Required(CONF_HYSTERESIS_OFF, default=cur_h_off)] = _number_slider(
            MIN_HYSTERESIS_OFF, MAX_HYSTERESIS_OFF, 0.1
        )

        # Output switches
        cur_s1 = get_val(CONF_SWITCH_1)
        cur_s2 = get_val(CONF_SWITCH_2)
        schema_dict[vol.Optional(CONF_SWITCH_1, default=cur_s1) if cur_s1 else vol.Optional(CONF_SWITCH_1)] = _switch_selector()
        schema_dict[vol.Optional(CONF_SWITCH_2, default=cur_s2) if cur_s2 else vol.Optional(CONF_SWITCH_2)] = _switch_selector()

        # Weather & environmental sensors
        cur_w = get_val(CONF_WEATHER)
        cur_out = get_val(CONF_OUTDOOR_TEMPERATURE)
        cur_hum = get_val(CONF_HUMIDITY)
        cur_wind = get_val(CONF_WIND)
        cur_precip = get_val(CONF_PRECIPITATION)

        schema_dict[vol.Optional(CONF_WEATHER, default=cur_w) if cur_w else vol.Optional(CONF_WEATHER)] = _weather_selector()
        schema_dict[vol.Optional(CONF_OUTDOOR_TEMPERATURE, default=cur_out) if cur_out else vol.Optional(CONF_OUTDOOR_TEMPERATURE)] = _sensor_selector("temperature")
        schema_dict[vol.Optional(CONF_HUMIDITY, default=cur_hum) if cur_hum else vol.Optional(CONF_HUMIDITY)] = _sensor_selector("humidity")
        schema_dict[vol.Optional(CONF_WIND, default=cur_wind) if cur_wind else vol.Optional(CONF_WIND)] = _sensor_selector()
        schema_dict[vol.Optional(CONF_PRECIPITATION, default=cur_precip) if cur_precip else vol.Optional(CONF_PRECIPITATION)] = _sensor_selector()

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(schema_dict),
            errors=errors,
        )
