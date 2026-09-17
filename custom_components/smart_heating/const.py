"""Constants for Smart Heating."""
from __future__ import annotations

DOMAIN = "smart_heating"

CONF_NAME = "name"
CONF_ROOM_TEMPERATURE = "room_temperature"
CONF_SWITCH_1 = "switch_1"
CONF_SWITCH_2 = "switch_2"
CONF_HUMIDITY = "humidity"
CONF_OUTDOOR_TEMPERATURE = "outdoor_temperature"
CONF_WIND = "wind"
CONF_PRECIPITATION = "precipitation"

CONF_TARGET_TEMPERATURE = "target_temperature"
CONF_HYSTERESIS = "hysteresis"
CONF_HYSTERESIS_ON = "hysteresis_on"
CONF_HYSTERESIS_OFF = "hysteresis_off"

#: Every optional/required source entity, in config-flow order.
ENTITY_KEYS = (
    CONF_ROOM_TEMPERATURE,
    CONF_SWITCH_1,
    CONF_SWITCH_2,
    CONF_HUMIDITY,
    CONF_OUTDOOR_TEMPERATURE,
    CONF_WIND,
    CONF_PRECIPITATION,
)

DEFAULT_NAME = "Smart Heating"
DEFAULT_TARGET = 21.0
DEFAULT_HYSTERESIS = 0.5
DEFAULT_HYSTERESIS_ON = 0.5
DEFAULT_HYSTERESIS_OFF = 0.0
MIN_TARGET = 5.0
MAX_TARGET = 35.0
TARGET_STEP = 0.5
MIN_HYSTERESIS = 0.1
MAX_HYSTERESIS = 5.0
MIN_HYSTERESIS_ON = 0.0
MAX_HYSTERESIS_ON = 5.0
MIN_HYSTERESIS_OFF = 0.0
MAX_HYSTERESIS_OFF = 5.0

ATTR_HEATING = "heating"
