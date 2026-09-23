# AI Agent Instructions for Home Assistant Smart Heating

## 1. Operating Rules & Workflow

1. **Self-Modification Restriction**:
   - The AI must NEVER edit or modify `AGENTS.md` unilaterally.
   - If the AI identifies missing rules, optimizations, or necessary changes to this file, it must explicitly propose them to the user for approval first.

2. **User Interaction & Tone**:
   - Communicate with the user in Ukrainian.
   - Keep answers concise, clear, and directly to the point without filler or unnecessary verbosity.
   - When given a direct command to fix/do something, execute directly.
   - When asked to analyze, review, or evaluate ideas, first present a concise plan/analysis and wait for approval before modifying code.

3. **Version & Release Policy**:
   - **Default Rule**: Always update the current version in place until the user explicitly commands to create a new version.
   - **Version Format**: Follow semantic versioning matching current style (`v1.0.x`).
   - **Version Bumping**: When instructed to create a new version, increment the last digit (patch, e.g., `1.0.8` -> `1.0.9`).
   - For major architectural or feature overhauls, the second digit may be bumped (minor, e.g., `1.1.0`); the AI should proactively suggest this to the user when appropriate.
   - When creating a new version, synchronize version strings across:
     - `custom_components/smart_heating/manifest.json` (`version`)
     - `custom_components/smart_heating/__init__.py` (`CARD_VERSION`)
     - Both copies of `smart-heating-card.js` (`CARD_VERSION` / log)
     - `README.md` and `CHANGELOG.md` (if applicable)

4. **Source of Truth & Git Discipline**:
   - Always verify and rebase against the latest `origin/main` before making changes.
   - Maintain minimal diffs: touch only lines strictly related to the task.
   - Never overwrite user configurations or introduce breaking changes without warning.
   - Git commits should be concise, following conventional commit format (`fix:`, `feat:`, `docs:`, `perf:`).
   - Commit author identity: `kdinya <tomchik2@gmail.com>`.

---

## 2. Core Architecture & Strict Invariants

1. **Dual Card Copy Synchronization**:
   - There are TWO copies of the frontend card in the repository:
     - `www/smart-heating-card.js` (for direct/HACS frontend distribution)
     - `custom_components/smart_heating/www/smart-heating-card.js` (for integration static serving)
   - **Strict Invariant**: Both files MUST remain 100% byte-for-byte identical at all times.
   - Any edit applied to one must be copied to the other, verified with `cmp -s`.

2. **Frontend Resource Delivery & HACS**:
   - Canonical card URL: `/hacsfiles/ha-smart-heating/smart-heating-card.js`.
   - Never revert to `/local/` in code or documentation.
   - Increment `CARD_BUILD` in `custom_components/smart_heating/__init__.py` whenever frontend JS changes to bust browser cache.

3. **Typography (7-Segment Font)**:
   - Digital temperature and clock displays rely on the custom 7-segment font (`www/fonts/7segment.woff`).
   - Due to WebKit/Chromium shadow DOM font scoping quirks, `@font-face` inside `shadowRoot` alone is insufficient.
   - The font MUST be registered globally in `document.head` (`<style id="smart-heating-7segment-font">`) and added via `document.fonts.add()` on load and in `connectedCallback`.

4. **Card Layout & Scalability**:
   - The card utilizes a fixed logical canvas (600×400) scaled via CSS transform (`--ui-scale`).
   - Dynamic scaling uses `clamp(0.01, min(calc(100cqw / 600px), calc(100cqh / (600px / var(--card-ratio, 1.5)))), 10)`.
   - Do not reintroduce `transform: none` on `.device`.
   - Internal coordinates should prioritize stable container query units (`cqw`, `cqh`) to prevent elements from drifting on non-standard card dimensions.

5. **Performance & Zero Resource Consumption**:
   - When the card is disconnected from DOM, hidden (`display: none`), collapsed, or the browser tab is in background, all active timers (clock updates, animations) must pause.
   - Use `IntersectionObserver` and `visibilitychange` listeners with clean teardown in `disconnectedCallback`.
   - In Home Assistant backend (`coordinator.py`):
     - Avoid triggering `evaluate()` on irrelevant entity state updates (secondary weather/humidity changes should update attributes without recalculating heating duty cycles).
     - Debounce storage writes and avoid redundant entity state calls.

6. **Failsafe Shutdown & Restart Preservation**:
   - On Home Assistant shutdown (`EVENT_HOMEASSISTANT_STOP`), contacts configured for shutdown failsafe must be cleanly switched off.
   - Unregister event listeners immediately during shutdown to prevent race conditions where subsequent events re-enable contacts.
   - State preservation: After reboot, the integration must restore its previous operational state (if it was active, resume heating; if turned off, remain off).

---

## 3. Pre-Flight Verification Checklist

Before pushing any commit or releasing:
1. **Python Unit Tests**:
   ```bash
   python3 -m unittest discover tests
   ```
   Must pass 100% with zero errors.
2. **Card Synchronization**:
   ```bash
   cmp -s www/smart-heating-card.js custom_components/smart_heating/www/smart-heating-card.js
   ```
3. **JavaScript Syntax Check**:
   ```bash
   node --check www/smart-heating-card.js
   node --check custom_components/smart_heating/www/smart-heating-card.js
   ```
4. **Smoke Test** (if environment permits):
   ```bash
   node tests/card_smoke.mjs
   ```
5. **Clean Working Tree**: Ensure no temporary artifacts or unstaged files remain.
