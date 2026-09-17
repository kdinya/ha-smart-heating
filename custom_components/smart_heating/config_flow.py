"""Config and options flow for Smart Heating."""
from __future__ import annotations

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
    CONF_WIND,
    DEFAULT_HYSTERESIS,
    DEFAULT_HYSTERESIS_ON,
    DEFAULT_HYSTERESIS_OFF,
    DEFAULT_NAME,
    DEFAULT_TARGET,
    DOMAIN,
    ENTITY_KEYS,
    MAX_HYSTERESIS,
    MAX_HYSTERESIS_ON,
    MIN_HYSTERESIS_ON,
    MAX_HYSTERESIS_OFF,
    MIN_HYSTERESIS_OFF,
    MAX_TARGET,
    MIN_TARGET,
)


def _user_schema() -> vol.Schema:
    """Schema of the initial setup step."""
    def sensor(device_class: str | None = None) -> selector.EntitySelector:
        config = (
            selector.EntitySelectorConfig(domain="sensor", device_class=device_class)
            if device_class
            else selector.EntitySelectorConfig(domain="sensor")
        )
        return selector.EntitySelector(config)

    def switch() -> selector.EntitySelector:
        return selector.EntitySelector(selector.EntitySelectorConfig(domain="switch"))

    def number_slider(min_val: float, max_val: float, step: float = 0.1) -> selector.NumberSelector:
        return selector.NumberSelector(
            selector.NumberSelectorConfig(
                min=min_val,
                max=max_val,
                step=step,
                mode=selector.NumberSelectorMode.SLIDER,
                unit_of_measurement="°C",
            )
        )

    return vol.Schema(
        {
            vol.Required(CONF_NAME, default=DEFAULT_NAME): str,
            vol.Required(CONF_ROOM_TEMPERATURE): sensor("temperature"),
            vol.Required(CONF_TARGET_TEMPERATURE, default=DEFAULT_TARGET): number_slider(
                MIN_TARGET, MAX_TARGET, 0.5
            ),
            vol.Required(CONF_HYSTERESIS_ON, default=DEFAULT_HYSTERESIS_ON): number_slider(
                MIN_HYSTERESIS_ON, MAX_HYSTERESIS_ON, 0.1
            ),
            vol.Required(CONF_HYSTERESIS_OFF, default=DEFAULT_HYSTERESIS_OFF): number_slider(
                MIN_HYSTERESIS_OFF, MAX_HYSTERESIS_OFF, 0.1
            ),
            vol.Optional(CONF_SWITCH_1): switch(),
            vol.Optional(CONF_SWITCH_2): switch(),
            vol.Optional(CONF_HUMIDITY): sensor("humidity"),
            vol.Optional(CONF_OUTDOOR_TEMPERATURE): sensor("temperature"),
            vol.Optional(CONF_WIND): sensor(),
            vol.Optional(CONF_PRECIPITATION): sensor(),
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
    """Change runtime options and contact switches."""

    async def async_step_init(self, user_input=None):
        """Show and store runtime options."""
        errors: dict[str, str] = {}
        if user_input is not None:
            s1 = user_input.get(CONF_SWITCH_1)
            s2 = user_input.get(CONF_SWITCH_2)
            if s1 and s2 and s1 == s2:
                errors["base"] = "duplicate_entity"
            else:
                payload = dict(user_input)
                if not payload.get(CONF_SWITCH_1):
                    payload[CONF_SWITCH_1] = None
                if not payload.get(CONF_SWITCH_2):
                    payload[CONF_SWITCH_2] = None
                return self.async_create_entry(title="", data=payload)

        options = self.config_entry.options
        data = self.config_entry.data

        current_switch_1 = options.get(CONF_SWITCH_1) if CONF_SWITCH_1 in options else data.get(CONF_SWITCH_1)
        current_switch_2 = options.get(CONF_SWITCH_2) if CONF_SWITCH_2 in options else data.get(CONF_SWITCH_2)

        def switch_selector() -> selector.EntitySelector:
            return selector.EntitySelector(
                selector.EntitySelectorConfig(domain="switch")
            )

        def number_slider(min_val: float, max_val: float, step: float = 0.1) -> selector.NumberSelector:
            return selector.NumberSelector(
                selector.NumberSelectorConfig(
                    min=min_val,
                    max=max_val,
                    step=step,
                    mode=selector.NumberSelectorMode.SLIDER,
                    unit_of_measurement="°C",
                )
            )

        schema_dict = {
            vol.Required(
                CONF_TARGET_TEMPERATURE,
                default=options.get(
                    CONF_TARGET_TEMPERATURE, data.get(CONF_TARGET_TEMPERATURE, DEFAULT_TARGET)
                ),
            ): number_slider(MIN_TARGET, MAX_TARGET, 0.5),
            vol.Required(
                CONF_HYSTERESIS_ON,
                default=options.get(
                    CONF_HYSTERESIS_ON,
                    options.get(CONF_HYSTERESIS, data.get(CONF_HYSTERESIS_ON, DEFAULT_HYSTERESIS_ON)),
                ),
            ): number_slider(MIN_HYSTERESIS_ON, MAX_HYSTERESIS_ON, 0.1),
            vol.Required(
                CONF_HYSTERESIS_OFF,
                default=options.get(
                    CONF_HYSTERESIS_OFF, data.get(CONF_HYSTERESIS_OFF, DEFAULT_HYSTERESIS_OFF)
                ),
            ): number_slider(MIN_HYSTERESIS_OFF, MAX_HYSTERESIS_OFF, 0.1),
        }

        if current_switch_1:
            schema_dict[vol.Optional(CONF_SWITCH_1, default=current_switch_1)] = switch_selector()
        else:
            schema_dict[vol.Optional(CONF_SWITCH_1)] = switch_selector()

        if current_switch_2:
            schema_dict[vol.Optional(CONF_SWITCH_2, default=current_switch_2)] = switch_selector()
        else:
            schema_dict[vol.Optional(CONF_SWITCH_2)] = switch_selector()

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(schema_dict),
            errors=errors,
        )
