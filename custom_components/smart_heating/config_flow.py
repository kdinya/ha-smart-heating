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
    CONF_MIN_TARGET_TEMPERATURE,
    CONF_MAX_TARGET_TEMPERATURE,
    DEFAULT_MIN_TARGET_TEMPERATURE,
    DEFAULT_MAX_TARGET_TEMPERATURE,
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
            vol.Required(CONF_MIN_TARGET_TEMPERATURE, default=DEFAULT_MIN_TARGET_TEMPERATURE): _number_slider(
                MIN_TARGET, MAX_TARGET, 0.5
            ),
            vol.Required(CONF_MAX_TARGET_TEMPERATURE, default=DEFAULT_MAX_TARGET_TEMPERATURE): _number_slider(
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
                        CONF_MIN_TARGET_TEMPERATURE: user_input.get(CONF_MIN_TARGET_TEMPERATURE, DEFAULT_MIN_TARGET_TEMPERATURE),
                        CONF_MAX_TARGET_TEMPERATURE: user_input.get(CONF_MAX_TARGET_TEMPERATURE, DEFAULT_MAX_TARGET_TEMPERATURE),
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
            # Empty strings mean "field cleared" - normalise them before validating,
            # so a removed sensor is never compared against the remaining ones.
            cleaned = {
                key: (value if value not in (None, "") else None)
                for key, value in user_input.items()
            }
            chosen = [cleaned[key] for key in ENTITY_KEYS if cleaned.get(key)]
            if len(chosen) != len(set(chosen)):
                errors["base"] = "duplicate_entity"
            else:
                payload = dict(cleaned)
                for key in ENTITY_KEYS:
                    payload.setdefault(key, None)
                return self.async_create_entry(title="", data=payload)

        options = dict(self.config_entry.options)
        data = self.config_entry.data
        if hasattr(self, "hass") and self.hass:
            coord = self.hass.data.get(DOMAIN, {}).get(self.config_entry.entry_id)
            if coord is not None:
                if getattr(coord, "target_temperature", None) is not None:
                    options[CONF_TARGET_TEMPERATURE] = coord.target_temperature
                if getattr(coord, "min_target_temperature", None) is not None:
                    options[CONF_MIN_TARGET_TEMPERATURE] = coord.min_target_temperature
                if getattr(coord, "max_target_temperature", None) is not None:
                    options[CONF_MAX_TARGET_TEMPERATURE] = coord.max_target_temperature
                if getattr(coord, "hysteresis_on", None) is not None:
                    options[CONF_HYSTERESIS_ON] = coord.hysteresis_on
                if getattr(coord, "hysteresis_off", None) is not None:
                    options[CONF_HYSTERESIS_OFF] = coord.hysteresis_off

        def get_val(key: str, default: Any = None) -> Any:
            if key in options:
                val = options[key]
                return val if val is not None and val != "" else default
            val = data.get(key)
            return val if val is not None and val != "" else default

        cur_target = float(get_val(CONF_TARGET_TEMPERATURE, DEFAULT_TARGET))
        cur_min_target = float(get_val(CONF_MIN_TARGET_TEMPERATURE, DEFAULT_MIN_TARGET_TEMPERATURE))
        cur_max_target = float(get_val(CONF_MAX_TARGET_TEMPERATURE, DEFAULT_MAX_TARGET_TEMPERATURE))
        cur_h_on = float(get_val(CONF_HYSTERESIS_ON, get_val(CONF_HYSTERESIS, DEFAULT_HYSTERESIS_ON)))
        cur_h_off = float(get_val(CONF_HYSTERESIS_OFF, DEFAULT_HYSTERESIS_OFF))

        def optional_entity(key: str) -> Any:
            """Optional entity field that can be left empty or cleared again.

            `suggested_value` pre-fills the picker without making the value sticky:
            with `default=` voluptuous re-inserts the old entity when the user
            clears the field, which used to resurface it as a duplicate.
            """
            current = get_val(key)
            description = {"suggested_value": current} if current else None
            return vol.Optional(key, description=description)

        schema_dict: dict[Any, Any] = {}

        # Room temperature sensor is required
        schema_dict[
            vol.Required(
                CONF_ROOM_TEMPERATURE,
                description={"suggested_value": get_val(CONF_ROOM_TEMPERATURE)},
            )
        ] = _sensor_selector("temperature")

        # Target temperature & hysteresis
        schema_dict[vol.Required(CONF_TARGET_TEMPERATURE, default=cur_target)] = _number_slider(
            MIN_TARGET, MAX_TARGET, 0.5
        )
        schema_dict[vol.Required(CONF_MIN_TARGET_TEMPERATURE, default=cur_min_target)] = _number_slider(
            MIN_TARGET, MAX_TARGET, 0.5
        )
        schema_dict[vol.Required(CONF_MAX_TARGET_TEMPERATURE, default=cur_max_target)] = _number_slider(
            MIN_TARGET, MAX_TARGET, 0.5
        )
        schema_dict[vol.Required(CONF_HYSTERESIS_ON, default=cur_h_on)] = _number_slider(
            MIN_HYSTERESIS_ON, MAX_HYSTERESIS_ON, 0.1
        )
        schema_dict[vol.Required(CONF_HYSTERESIS_OFF, default=cur_h_off)] = _number_slider(
            MIN_HYSTERESIS_OFF, MAX_HYSTERESIS_OFF, 0.1
        )

        # Output switches
        schema_dict[optional_entity(CONF_SWITCH_1)] = _switch_selector()
        schema_dict[optional_entity(CONF_SWITCH_2)] = _switch_selector()

        # Weather & environmental sensors
        schema_dict[optional_entity(CONF_WEATHER)] = _weather_selector()
        schema_dict[optional_entity(CONF_OUTDOOR_TEMPERATURE)] = _sensor_selector("temperature")
        schema_dict[optional_entity(CONF_HUMIDITY)] = _sensor_selector("humidity")
        schema_dict[optional_entity(CONF_WIND)] = _sensor_selector()
        schema_dict[optional_entity(CONF_PRECIPITATION)] = _sensor_selector()

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(schema_dict),
            errors=errors,
        )
