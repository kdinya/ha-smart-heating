# Changelog

## 1.0.2 — 2026-09-16

- Fixed: restored the "Room humidity" block (visibility toggle, horizontal/vertical position, size) in the Climate editor tab, bound to its own `humidity_x`/`humidity_y`/`humidity_s`/`humidity_visible` keys. It no longer shares config with the central dial (`dial_x`/`dial_y`/`dial_s`), so adjusting humidity parameters never changes the central-circuit dial's position, size, or any other setting.
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
- Moved the Climate tab directly after Header, expanded group and dial scaling beyond 1.5, and refined current/target temperature typography and +/- button controls.
- Removed humidity, target-entity, hysteresis, and integer-temperature visibility controls from the Climate tab; changed the card resource build identifier to force Home Assistant cache refresh.
- Fixed a runtime `oneDecimal` initialization error that prevented the card from rendering after the climate controls update.
- Restored the movable gradient header line while hiding only the thick orange brand rule; fixed decimal ratio display, card-radius updates, grouped header controls, temperature labels, and extended +/- spacing and icon-size ranges.
- Grouped all current-temperature, target-temperature, and +/- controls into labeled Climate blocks and added per-slider reset-to-default buttons.
- Refined the Climate editor so Current temperature contains only its requested controls, while target typography controls remain grouped with Target temperature; added reset-to-default buttons for toggles and made reset values independent from saved values.
- Fixed card-radius application and removed the actual thick orange header border; made the whole header Y-only, separated brand and date/time group offsets, and kept time changes from moving the date or signal.
- Refreshed the Home Assistant card resource build identifier so the same v1.0.2 tag is fetched after these fixes.
- Applied card radius through the actual `ha-card` variable, moved the entire header shell vertically together with the gradient line, and separated the date/time group from the signal indicator.
- Fixed the later reference-skin `ha-card` rule that was overriding the configurable radius, while retaining container-relative sizing for layout coordinates when the card ratio changes.
- Added a final layout override to neutralize the legacy UI-scale transform, keep the device anchored to the card bounds, and apply ratio/radius directly to the visible outer card.
- Made Lovelace resource lifecycle prefix-independent: legacy `/hacsfiles`, `/api`, and old `/local` card URLs are recognized by filename, migrated to the canonical resource, and duplicate resources are removed; removal cleans up all matching card resources.
- Added a compatibility static route for the legacy HACS card path and separated the top-left device name container from its adjacent icon so editor controls affect only their intended element.
- Switched the card to one canonical HACS resource, `/hacsfiles/ha-smart-heating/smart-heating-card.js`, removed `/local` and extra-JS registration, and served the bundled font from the same HACS endpoint.
- Stabilized the card canvas for ratio changes by removing the nested screen aspect-ratio constraint, anchoring the device to the card bounds, and using fixed relative 30%/40%/30% columns for the main objects.
- Reworked resource delivery to use exactly one canonical HACS-style URL without `/local`, `/api` card routes, or extra-JS registration; the card font now uses the same endpoint.
- Restored the fixed 600×400 logical canvas: the layout override no longer redeclares `.device` with `transform:none`, and `--ui-scale` can grow up to `10` so all `cqw`/`cqh` coordinates scale uniformly at larger card sizes.
- Documented the manual resource replacement required for YAML-mode Lovelace dashboards, where integrations cannot write the dashboard resource store.

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
