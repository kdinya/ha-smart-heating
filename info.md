# Smart Heating for Home Assistant

Custom climate integration for gas boilers, electric heaters, and thermostats with advanced hysteresis control and a realistic hardware-inspired Lovelace card.

## Highlights
- **Precise Dual-Delta Hysteresis**: Separate turn-on and turn-off deltas preventing boiler short-cycling.
- **Fail-safe Logic**: Automatically turns heating off if room sensor becomes unavailable.
- **Two Contact Control**: Contact 1 for boiler relay, Contact 2 for auxiliary heating/pump.
- **Interactive Lovelace Card**: Built-in 7-segment digital displays, real-time flame glow, settings modal, and visual card editor.
- **Multi-Sensor Integration**: Seamlessly binds room temperature, humidity, outdoor weather (Open-Meteo), wind, and rain.
