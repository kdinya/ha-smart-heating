# Changelog

## 1.0.2 — 2026-09-16

- Reworked the card skin to closely match the supplied reference dashboard: wide 3:2 framing, layered metal housing, inset screen, orange/steel dial, dense side metrics, connection cards, and a five-button lower control rail.
- Preserved all existing entities, controls, editor settings, hysteresis behavior, responsive aspect-ratio handling, and card resource registration.
- Added finite-value validation for the aspect-ratio setting, height-aware compact rendering for extreme ratios, and aligned runtime flame defaults with the editor.
- Verified power and temperature-adjustment service calls in a browser harness across wide, medium, and narrow layouts.
- Reworked the climate circle position to use percentage coordinates relative to the screen container, keeping it stable when the card is resized.
- Isolated room-humidity positioning from climate-group positioning so moving the circle no longer moves the humidity block.
- Replaced width-based vertical offsets with `cqh` coordinates and added uniform card scaling, preserving relative placement from very small to large cards without a breakpoint jump.
- Fixed editor range `input`/`change` handling and immutable configuration updates so every slider and `+/-` control reliably changes and emits its setting.
- Renamed the visual-editor `Device` tab to `Entities` and added a `Layout` tab for card ratio and corner radius.
- Removed the decorative orange header line and separated controls for the header vertical offset, name, icon, date, current time, signal level, and retained line offset.

## 1.0.1 — 2026-09-16

- Fixed the runtime card copy and added CI validation to keep both card sources synchronized.
- Moved visibility toggles before the blocks they control.
- Made the control-panel mask fill the complete panel width and height across orientations.
- Reworked the heating effect into configurable animated flame tongues emerging behind the dial.
- Preserved effect position, scale, enable/disable, and opacity controls.
- Restored climate state after Home Assistant restarts.
- Added repository tests, brand assets, and HACS/GitHub metadata.
- Preserved the configured screen aspect ratio for the complete card at every width.
- Fixed bottom-panel controls being clipped by the panel mask.

## 1.0.0

- Initial public release.
