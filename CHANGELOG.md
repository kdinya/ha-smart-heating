# Changelog

## 1.0.5 — 2026-09-18

- Fixed: the integration failed to load entirely. `number.py` imported `RestoreNumber` from `homeassistant.helpers.restore_state`, but that class actually lives in `homeassistant.components.number`. The bad import crashed loading of the whole platform batch (`climate`, `number`, `switch`), so the config entry failed setup with "Error setting up entry ... for smart_heating" and no entities were created. Verified the fix against a real Home Assistant 2025.1.4 test instance: the entry now loads (`ConfigEntryState.LOADED`) with all climate/number/switch entities and services registered.
- Read outdoor temperature, wind speed, wind units, and weather condition directly from the configured Home Assistant `weather` entity while preserving existing fallbacks.
- Include the configured weather entity in watched state updates so weather changes refresh the card.
- Make the settings-window language preference authoritative and keep the visual editor synchronized with it.
- Add a clearable weather entity picker to the visual editor.
- Remove the duplicate extra-JS loader and keep the canonical Lovelace resource path as the single loading mechanism.
- Add regression coverage for weather-entity rendering, language persistence, and resource-loader uniqueness.

## 1.0.4 — 2026-09-18

New 24-hour heating schedule programs, quick Eco timer, relay reverse feedback verification, performance optimizations, and UI refinements.

### Added

- **24-hour Heating Schedules (Button 2)**: Full-screen modal to configure hourly heating programs.
  - Supports Target (Comfort) and Eco temperatures for all 24 hours of the day.
  - Interactive 24-hour visual blocks with quick toggles and presets (All Target, All Eco, Day/Night).
  - P1 default schedule + "+ Add Program" button to create unlimited custom programs (P2, P3...).
  - Active program radio selection with immediate coordinator synchronization via `smart_heating.set_program`.
  - Active program badge (`P1`, `P2`, `ECO`) on Button 2 and dynamic indicator pill on the main screen (hidden when inactive).
- **Quick Eco Timer**: Temporary Eco mode for 30m, 1h, 2h, 4h, 8h, or until midnight with countdown display and automatic reversion.
- **Relay Feedback Verification**: Tracks physical relay status against desired states. Generates warning alerts if actual state does not match desired state after configurable timeout (5–60s).
- **Relay Verification Timeout Slider**: Configurable in settings modal and synchronized with backend via `smart_heating.set_relay_timeout`.
- **Eco Temperature Control**: Dedicated `HeatingEcoTarget` slider number entity automatically created when the device is set up.
- **IntersectionObserver Resource Saver**: Pauses re-renders, timers, and heavy CSS animations whenever the card is hidden or visible less than 10%, drastically cutting CPU/battery consumption on mobile and background dashboards.

### Changed & Fixed

- **Fixed JS Syntax Error**: Removed dangling commas from dictionary keys that caused configuration and card load failures.
- **Realistic Blue Flame Icon**: Redesigned the top-left brand icon from a teardrop shape into an unmistakable multi-tongue flame with an inner core.
- **Default Language**: Card and visual editor now default to English (`en`).
- **Clean Central Panel Button**: Removed persistent bright glow/border highlight from the central button on the bottom control panel.
- **Identical Card Mirrors**: Packaged and root card distributions strictly synchronized.

## 1.0.3 — 2026-09-16

Full audit of the integration and the card: bug fixes, dead-code removal, a rebuilt visual editor and real CI.

### Fixed

- The "Icon size" slider in the Climate tab's "Buttons" block had no effect: two later CSS rules hardcoded the +/− button icon `font-size`, overriding the configurable `--adjust-icon-size` variable. Those overrides are removed, so the slider now controls the actual icon size.
- The outdoor-temperature icon was a generic compass-like glyph; replaced with a clear thermometer icon so it reads unambiguously as outdoor air temperature.
- The precipitation icon is now dynamic: when the "Ентіті опадів" field points at a weather entity, its condition (sunny, cloudy, rainy, snowy, lightning, fog, windy, hail, etc.) picks a matching icon instead of always showing a static rain cloud. Unrecognized or numeric values keep the original rain-cloud icon.
- Renamed the "Підключення" tab to "Керування".
- Removed the "Група підключення" editor block: it only moved the scheme section's title text, disconnected from the actual scheme cards, and had no other effect. The underlying dead `group-connection` CSS rule and class were removed with it.
- Removed the "Активна схема" (direct/old programmer/parallel) chooser from the editor; the boiler-control scheme selection is being redesigned.
- Removed the "Кнопки, іконки та написи" block from the Panel tab: it duplicated the "Група нижньої панелі" block's horizontal/vertical/size controls (same `.group-panel` element). In its place there is now a single "Розмір кнопок" slider that scales each bottom-panel button individually around its own center, instead of the whole panel scaling as one block.
- The five bottom-panel buttons sat in grid columns sized to each control's own label width (`repeat(5,auto)`), so a short label like "ЖИВЛЕННЯ" left its button closer to the left edge than a long one like "НАЛАШТУВАННЯ" left its button to the right edge. The columns are now equal-width (`repeat(5,1fr)`), so the row of buttons is evenly centered regardless of label length.
- Brought `tests/test_repository_contract.py` back in sync with the card: `test_every_positionable_block_has_editor_controls` no longer expects controls for `header`/`humidity_int`/`humidity_dec`/`humidity_unit` (dropped in earlier edits), and `test_visibility_toggles_are_declared` no longer expects the removed `room_int_visible` toggle.
- The "Buttons, icons and labels" controls on the Panel tab wrote `panel-buttons_x/_y/_s` (with a dash) while the card read `panel_buttons_x/_y/_s` (with an underscore). Those three sliders did nothing; they work now.
- The active connection scheme was hardcoded to the first card in the markup, so the `connection_mode` setting had no visible effect.
- The flame effect lit up whenever the climate mode was `heat`, not when the boiler was actually firing. The card now reads the integration's `heating` attribute, falling back to `hvac_action` and then to the raw mode.
- `_toggle` wrote the editor's open/closed section state to `localStorage` but never read it back, so sections always reopened in their default state.
- `SmartHeatingOptionsFlow.__init__` assigned `self.config_entry`, which is deprecated and slated for removal in Home Assistant 2025.12.
- Changing the options (target temperature, hysteresis) had no effect until Home Assistant was restarted. The entry now reloads automatically.
- Non-numeric sensor states could raise `TypeError` while reading the room temperature; both `TypeError` and `ValueError` are handled.

### Changed

- The card no longer rebuilds its shadow DOM on every `hass` update — only when one of the entities it actually displays changes. The clock updates on its own 10-second timer instead of forcing a full re-render.
- The visual editor was rebuilt around a single `SH_DEFAULTS` table (default values used to be duplicated in three places and had drifted apart). It now has nine sections — General, Layout, Header, Climate, Humidity, Weather, Connection, Panel, Visual effects — with 94 sliders, 10 toggles and 5 entity fields, covering every setting the card reads.
- New controls that previously had no UI at all: content row offset, button diameter, current-temperature digit spacing and decimal size, the humidity integer/decimal/percent blocks, and the humidity entity.
- `strings.json` is now English and real `translations/en.json` + `translations/uk.json` files were added, so the config flow follows the Home Assistant interface language.
- The climate entity reports `hvac_action` (heating / idle / off) and supports the `turn_on` / `turn_off` climate services.
- The −/+ buttons respect the entity's `min_temp`, `max_temp` and `target_temp_step` instead of always stepping by 0.5.
- Added `getStubConfig` so the card renders a preview in the card picker, and Escape now closes the settings modal.
- Minimum supported Home Assistant version is 2024.11.0.

### Removed

Dead code with no runtime effect: the `read()` and `_emitCardConfig()` methods; the `leftScale` / `centerScale` / `rightScale` / `roomScale` / `targetScale` variables and the `--left-scale`, `--center-scale`, `--right-scale`, `--room-scale`, `--panel-scale` custom properties (no stylesheet read them); the `flame-pulse` keyframes; the `.boiler-effect`, `.tab-content`, `.brand .rule`, `.dial .label`, `.dial .target-label` and `.control+.control` rules; the empty `<div class="rule">`; the `compact` class, which also forced a layout reflow via `offsetWidth` on every render; duplicate `.flame-outer` / `.flame-inner` declarations; the `uiTr` alias and unused dictionary keys; the unused `Platform` import and the `from .const import *` wildcard.

### Tooling

- CI now runs hassfest and the HACS action, and `tests/card_smoke.mjs` renders the card and the editor in a headless DOM, asserting that every block the card positions has matching editor controls — exactly the check that would have caught the `panel-buttons` bug.
- The repository contract tests check structure (version consistency across manifest/loader/card, translation coverage, custom properties that are read but never set) instead of pinning exact minified substrings.

### Note

The behaviour of `available` on the climate entity is deliberately unchanged: the entity stays available when the room sensor drops out, so the card does not grey out on every brief sensor outage.

## 1.0.2 — 2026-09-16

- Fixed: adjusting the current-temperature block's position or size on the Climate tab no longer affects the central dial's own rendering. The current-temperature text was nested inside the dial's transformed subtree, so the dial's position/scale compounded onto it; its transform now cancels the dial's own translate/scale, making the two fully independent (visual output is unchanged at default settings).
- Removed the reset ("↺") button next to every switch across all editor tabs; the switches themselves are now right-aligned in their row.
- Fixed the "Відстань між цифрами" (digit spacing) control in the Climate tab's Target temperature block: a later CSS override rule was hardcoding `letter-spacing:0` on the target digits, silently cancelling the setting.
- Added a new "Відстань до знаку" (gap before the degree sign) control in the Target temperature block, replacing the previous fixed literal-space gap (which was noticeably large) with a configurable, tighter default.

- Fixed: the "Device name" field in the Entities tab now renders on the card (brand title), instead of always showing the hardcoded "HEAT" label.
- Fixed: the "Card ratio (W/H)" control in the Layout tab used a fixed 600×400 logical canvas to compute the uniform UI scale, so changing the ratio away from the 1.5 default made `cqw`/`cqh`-based element offsets (icons, dial, text blocks) drift out of sync with plain-percentage-based elements. The logical canvas height now follows the configured ratio, so every block repositions consistently and the card's internal layout no longer distorts when the ratio changes.
- Renamed the Layout tab title from "Розкладка" to "РОЗКЛАДКА".
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
