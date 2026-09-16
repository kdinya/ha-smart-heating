# Changelog

## 1.0.2 — 2026-09-16

- Reworked the card skin to closely match the supplied reference dashboard: wide 3:2 framing, layered metal housing, inset screen, orange/steel dial, dense side metrics, connection cards, and a five-button lower control rail.
- Preserved all existing entities, controls, editor settings, hysteresis behavior, responsive aspect-ratio handling, and card resource registration.
- Added finite-value validation for the aspect-ratio setting, height-aware compact rendering for extreme ratios, and aligned runtime flame defaults with the editor.
- Verified power and temperature-adjustment service calls in a browser harness across wide, medium, and narrow layouts.

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
