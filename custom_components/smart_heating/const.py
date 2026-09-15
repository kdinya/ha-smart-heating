"""Constants for Smart Heating."""
from __future__ import annotations

from homeassistant.const import Platform

DOMAIN = "smart_heating"
CONF_ROOM_TEMPERATURE = "room_temperature"
CONF_SWITCH_1 = "switch_1"
CONF_SWITCH_2 = "switch_2"
CONF_HUMIDITY = "humidity"
CONF_OUTDOOR_TEMPERATURE = "outdoor_temperature"
CONF_WIND = "wind"
CONF_PRECIPITATION = "precipitation"
CONF_NAME = "name"
DEFAULT_NAME = "Smart Heating"
DEFAULT_TARGET = 21.0
DEFAULT_HYSTERESIS = 0.5
MIN_TARGET = 5.0
MAX_TARGET = 35.0
MIN_HYSTERESIS = 0.1
MAX_HYSTERESIS = 5.0
ATTR_HEATING = "heating"
