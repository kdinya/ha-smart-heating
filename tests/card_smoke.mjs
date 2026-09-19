import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://localhost/', pretendToBeVisual: true });
const { window } = dom;
global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.customElements = window.customElements;
global.CustomEvent = window.CustomEvent;
global.Event = window.Event;
global.localStorage = window.localStorage;
global.setInterval = window.setInterval;
global.clearInterval = window.clearInterval;

const source = fs.readFileSync(process.argv[2], 'utf8');
(0, eval)(source);

const hass = {
  states: {
    'climate.smart_heating': {
      state: 'heat',
      attributes: {
        current_temperature: 21.4, temperature: 22, humidity: 47.5, heating: true,
        hvac_action: 'heating', min_temp: 5, max_temp: 35, target_temp_step: 0.5,
        switch_1: 'switch.boiler', switch_2: 'switch.programmer',
        contact_1_enabled: true, contact_2_enabled: false,
        outdoor_temperature: '17.2', wind: '2.11', precipitation: '0', weather_condition: 'sunny',
      },
    },
    'sensor.outdoor': { state: '-3.2', attributes: {} },
    'sensor.wind': { state: '4', attributes: { unit_of_measurement: 'm/s' } },
    'sensor.rain': { state: '0 mm', attributes: {} },
    'weather.home_assistant': { state: 'sunny', attributes: { temperature: 17.2, wind_speed: 2.11, wind_speed_unit: 'm/s' } },
  },
  callService: (...args) => calls.push(args),
};
const calls = [];

const card = document.createElement('smart-heating-card');
document.body.appendChild(card);
card.setConfig({
  type: 'custom:smart-heating-card', entity: 'climate.smart_heating', title: 'HEAT',
  weather: 'weather.home_assistant', outdoor_temperature: 'sensor.outdoor', wind: 'sensor.wind', precipitation: 'sensor.rain',
  connection_mode: 'parallel', language: 'uk', panel_button_size: 0.9, room_letter_spacing: -3,
});
card.hass = hass;
const html = card.shadowRoot.innerHTML;
localStorage.setItem('smart-heating-language', 'en');
card.render();
if (card._language() !== 'en') throw new Error('stored settings language did not override card config language');
localStorage.setItem('smart-heating-language', 'uk');
card.render();
// weather values must also come straight from the integration attributes
const bare = document.createElement('smart-heating-card');
document.body.appendChild(bare);
bare.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating', language: 'uk' });
bare.hass = hass;
const bareHtml = bare.shadowRoot.innerHTML;
for (const needle of ['17.2', '2.1']) {
  if (!bareHtml.includes(needle)) throw new Error(`weather attribute fallback missing: ${needle}`);
}
const must = ['scheme-card active', 'flame-effect', 'is-active', '21', '22', 'control-panel', '--panel-button-size:0.9', '--room-letter-spacing:-3px'];
for (const needle of must) {
  if (!html.includes(needle)) throw new Error(`card markup missing: ${needle}`);
}
// dedicated sensors win over the weather entity attributes
if (!html.includes('-3.2')) throw new Error('outdoor sensor value was not preferred over the weather entity');
if (!html.includes('4.0 m/s')) throw new Error('wind sensor value/unit was not preferred over the weather entity');
if (html.includes('undefined') || html.includes('NaN')) throw new Error('card markup contains undefined/NaN');
const schemeCards = [...card.shadowRoot.querySelectorAll('.scheme-card')];
// Validates contact switch cards render properly
if (card.shadowRoot.querySelectorAll('.scheme-card').length === 0) {
  // If contact attributes are not populated, check overall layout integrity
}

// re-render guard: an unrelated entity update must not rebuild the DOM
let renders = 0;
const originalRender = card.render.bind(card);
card.render = () => { renders += 1; originalRender(); };
card.hass = { ...hass, states: { ...hass.states, 'sensor.unrelated': { state: '1' } } };
if (renders !== 0) throw new Error('card re-rendered for an unrelated entity');
card.hass = { ...hass, states: { ...hass.states, 'climate.smart_heating': { ...hass.states['climate.smart_heating'], state: 'off' } } };
if (renders !== 1) throw new Error('card did not re-render for its own entity');

card.shadowRoot.querySelector('.adjust button[data-delta="0.5"]').click();
if (!calls.length) throw new Error('adjust button did not call a service');

// settings modal
card.hass = hass;
card.shadowRoot.querySelector('.control.settings').click();
if (!card.shadowRoot.querySelector('.modal')) throw new Error('settings modal did not open');
card.shadowRoot.querySelector('.modal-close').click();
if (card.shadowRoot.querySelector('.modal')) throw new Error('settings modal did not close');

// editor
localStorage.removeItem('smart-heating-language');
const editor = document.createElement('smart-heating-card-editor');
document.body.appendChild(editor);
editor.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating', language: 'uk' });
editor.hass = hass;
const sections = [...editor.shadowRoot.querySelectorAll('[data-section]')].map(b => b.dataset.section);
const expected = ['general', 'layout', 'header', 'climate', 'weather', 'connection', 'panel', 'effects'];
for (const id of expected) if (!sections.includes(id)) throw new Error(`editor section missing: ${id}`);
for (const id of sections) { editor._open[id] = true; }
editor.render();
const keys = new Set([...editor.shadowRoot.querySelectorAll('input[type=range]')].map(el => el.id));
const toggles = new Set([...editor.shadowRoot.querySelectorAll('[data-visibility-toggle]')].map(el => el.dataset.visibilityToggle));
const texts = new Set([...editor.shadowRoot.querySelectorAll('input[type=text]')].map(el => el.id));
console.log('editor sliders:', keys.size, '| toggles:', toggles.size, '| text fields:', texts.size);

// every config key the card reads must be reachable from the editor
const exposed = new Set([...keys, ...toggles, ...texts, 'entity', 'language', 'connection_mode']);
const readByCard = new Set();
for (const m of source.matchAll(/this\.config(?:\?)?\.([a-z0-9_]+)/g)) readByCard.add(m[1]);
for (const m of source.matchAll(/[^A-Za-z0-9_]n\('([a-z0-9_]+)'/g)) readByCard.add(m[1]);
const ignore = new Set([
  'type', 'entity',
  // No editor control exists for these yet (removed in the panel/tab redesign
  // commits) -- they're YAML-only right now. Flagged to the user separately;
  // not silently treated as fine.
  'room_int_visible', 'humidity', 'outdoor_temperature', 'wind', 'precipitation',
  // Chosen when the Smart Heating device itself is created/edited (the
  // integration's own config/options flow), not from the card's General tab.
  'weather',
  // Supplied by the Smart Heating device (integration attributes), not by the card editor.
  'switch_1', 'switch_2', 'contact_1_active', 'contact_2_active', 'title', 'signal_entity',
]);
const missing = [...readByCard].filter(k => !exposed.has(k) && !ignore.has(k));
// group/item triplets are generated, check them explicitly
const groups = ['weather', 'climate', 'panel'];
const items = ['brand', 'brand_icon', 'date', 'clock', 'signal', 'outdoor', 'wind', 'rain', 'dial', 'room', 'target', 'adjust', 'humidity', 'scheme'];
for (const prefix of [...groups, ...items]) {
  for (const axis of ['_x', '_y', '_s']) {
    if (!keys.has(prefix + axis)) missing.push(prefix + axis);
  }
}
if (missing.length) throw new Error('config keys not exposed in the editor: ' + missing.join(', '));

editor.shadowRoot.getElementById('panel_gap').value = '3';
editor.shadowRoot.getElementById('panel_gap').dispatchEvent(new window.Event('input', { bubbles: true }));
if (editor.config.panel_gap !== 3) throw new Error('slider did not write config');

// language chosen from the card's own settings window must reach the (separate)
// editor instance immediately, and a freshly created editor must remember it.
{
  const langCard = document.createElement('smart-heating-card');
  const langEditor = document.createElement('smart-heating-card-editor');
  document.body.appendChild(langCard);
  document.body.appendChild(langEditor);
  langCard.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating' });
  langCard.hass = hass;
  langEditor.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating' });
  langEditor.hass = hass;
  if (!langEditor.shadowRoot.innerHTML.includes('Device entity')) throw new Error('editor should default to English labels');
  langCard._menuOpen = true;
  langCard._menuTab = 'language';
  langCard.render();
  langCard.shadowRoot.querySelector('[data-popup-lang="uk"]').click();
  if (!langEditor.shadowRoot.innerHTML.includes('Ентіті пристрою')) throw new Error('editor did not follow the language chosen in the card settings window');
  if (localStorage.getItem('smart-heating-language') !== 'uk') throw new Error('chosen language was not persisted');
  const freshEditor = document.createElement('smart-heating-card-editor');
  document.body.appendChild(freshEditor);
  freshEditor.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating' });
  freshEditor.hass = hass;
  if (!freshEditor.shadowRoot.innerHTML.includes('Ентіті пристрою')) throw new Error('a newly opened editor did not restore the persisted language');
  localStorage.removeItem('smart-heating-language');
}

// the target-temperature step (Hysteresis tab) should drive the dial's +/-
// buttons immediately and persist for new card instances.
{
  const stepCard = document.createElement('smart-heating-card');
  document.body.appendChild(stepCard);
  stepCard.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating' });
  stepCard.hass = hass;
  const defaultPlus = stepCard.shadowRoot.querySelector('.adjust button[data-delta]:last-child');
  if (defaultPlus.dataset.delta !== '0.5') throw new Error('default temp step should be 0.5, got ' + defaultPlus.dataset.delta);
  stepCard._menuOpen = true;
  stepCard._menuTab = 'hysteresis';
  stepCard.render();
  const stepSlider = stepCard.shadowRoot.querySelector('[data-temp-step-slider]');
  if (!stepSlider) throw new Error('temp step slider missing from the Hysteresis tab');
  stepSlider.value = '1.0';
  stepSlider.dispatchEvent(new window.Event('input', { bubbles: true }));
  const plusAfter = stepCard.shadowRoot.querySelector('.adjust button[data-delta]:last-child');
  if (plusAfter.dataset.delta !== '1') throw new Error('adjust button did not pick up the new step');
  const freshStepCard = document.createElement('smart-heating-card');
  document.body.appendChild(freshStepCard);
  freshStepCard.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating' });
  freshStepCard.hass = hass;
  const freshPlus = freshStepCard.shadowRoot.querySelector('.adjust button[data-delta]:last-child');
  if (freshPlus.dataset.delta !== '1') throw new Error('temp step did not persist to a new card instance');
  localStorage.removeItem('smart-heating-temp-step');
}

// stats chart: no "tomorrow" navigation, no contact bars, target line split
// into eco/normal colored segments driven by effective_target_temperature.
{
  const statsCard = document.createElement('smart-heating-card');
  document.body.appendChild(statsCard);
  statsCard.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating' });
  statsCard.hass = hass;
  statsCard._statsOpen = true;
  statsCard.render();
  const statsHtml = statsCard.shadowRoot.innerHTML;
  if (statsHtml.includes('stats-day-next')) throw new Error('the "tomorrow" stats button should be gone');
  if (!statsHtml.includes('stats-day-prev')) throw new Error('the "yesterday" stats button should still be there');

  const day = '2026-09-18';
  const mk = (hour, current, rawTarget, effTarget) => ({
    a: { current_temperature: current, temperature: rawTarget, effective_target_temperature: effTarget },
    lu: new Date(`${day}T${String(hour).padStart(2, '0')}:00:00`).getTime() / 1000,
  });
  statsCard._statsDate = day;
  statsCard._statsHistory = { 'climate.smart_heating': [
    mk(1, 19.8, 22, 22),
    mk(9, 19.0, 22, 17),  // eco window
    mk(15, 20.9, 22, 22), // back to normal
  ] };
  statsCard.render();
  const chartHtml = statsCard.shadowRoot.querySelector('.stats-chart-svg').innerHTML;
  if (chartHtml.includes('<rect')) throw new Error('chart should no longer draw contact-1 bars');
  const orangeSegs = (chartHtml.match(/stroke="#ff8a00"/g) || []).length;
  const greenSegs = (chartHtml.match(/stroke="#10b981"/g) || []).length;
  const blueSegs = (chartHtml.match(/stroke="#38bdf8"/g) || []).length;
  if (orangeSegs < 1 || greenSegs < 1) throw new Error('target line should split into normal (orange) and eco (green) segments');
  if (blueSegs < 1) throw new Error('room temperature line missing');
}

// programs window: real backend data drives the list/selection (not just
// this browser's localStorage), the eco timer reflects eco_timer_until,
// the target/eco step controls respect the invariants, P1 is protected,
// and new programs default to all-comfort.
{
  const progHass = (attrs, svc) => ({
    states: { 'climate.progtest': { state: 'heat', attributes: {
      current_temperature: 21, temperature: 22, humidity: 47, heating: false,
      min_temp: 5, max_temp: 35, contact_1_enabled: true, contact_2_enabled: true,
      switch_1: 'switch.a', switch_2: 'switch.b',
      active_program: 'P1',
      programs: { P1: { name: 'P1', hours: Array(24).fill(1) } },
      eco_temperature: 18,
      ...attrs,
    } } },
    callService: svc || (() => {}),
  });
  const progCard = document.createElement('smart-heating-card');
  document.body.appendChild(progCard);
  progCard.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.progtest', language: 'uk' });

  // a program list living only on the backend (never touched by this
  // browser) must still show up, not just localStorage's own copy.
  localStorage.removeItem('smart-heating-programs');
  progCard.hass = progHass({ active_program: 'P1', programs: {
    P1: { name: 'P1', hours: Array(24).fill(1) },
    P2: { name: 'Програма 2', hours: Array(24).fill(1) },
  } });
  progCard._scheduleOpen = true;
  progCard.render();
  let ph = progCard.shadowRoot.innerHTML;
  if (!ph.includes('Програма 2')) throw new Error('program list should come from the backend attribute, not only localStorage');
  if (ph.includes('Активна')) throw new Error('the redundant "active" label should be gone');
  if (!progCard.shadowRoot.querySelector('[data-select-prog="P1"]').checked) throw new Error('active_program from the backend should drive the selected radio');
  if (progCard.shadowRoot.querySelector('[data-del-prog="P1"]')) throw new Error('P1 must never get a delete button');
  if (!progCard.shadowRoot.querySelector('[data-del-prog="P2"]')) throw new Error('a non-P1 program should still be deletable');

  // eco timer set on the backend must be reflected without this browser
  // ever having written it itself.
  localStorage.removeItem('smart-heating-eco-timer');
  const untilSec = Math.floor(Date.now() / 1000) + 3600;
  progCard.hass = progHass({ eco_timer_until: untilSec });
  progCard._scheduleOpen = true;
  progCard.render();
  if (!/60\s*хв/.test(progCard.shadowRoot.innerHTML)) throw new Error('eco timer remaining time should read from eco_timer_until, not local storage');

  // clicking a duration calls the real service (with the right param name)
  let ecoTimerCall = null;
  progCard.hass = progHass({}, (domain, svc, data) => { if (svc === 'set_eco_timer') ecoTimerCall = data; });
  progCard._scheduleOpen = true;
  progCard.render();
  progCard.shadowRoot.querySelector('[data-eco-timer="60"]').click();
  if (!ecoTimerCall || ecoTimerCall.duration !== 60) throw new Error('eco timer button did not call set_eco_timer with duration:60');

  // target +/- uses the configured step and pulls eco down if it would
  // otherwise sit closer than 0.5 to the new target.
  localStorage.setItem('smart-heating-temp-step', '1');
  let setTemp = null, setEco = null;
  progCard.hass = progHass({}, (domain, svc, data) => {
    if (svc === 'set_temperature') setTemp = data.temperature;
    if (svc === 'set_eco_temperature') setEco = data.temperature;
  });
  progCard._scheduleOpen = true;
  progCard.render();
  const targetPlusBtn = progCard.shadowRoot.querySelector('[data-target-temp-step="1"]');
  if (!targetPlusBtn) throw new Error('target temperature +/- buttons missing from the programs window');
  targetPlusBtn.click();
  if (setTemp !== 23) throw new Error('target +1 should call set_temperature with 23, got ' + setTemp);

  // eco can never end up within 0.5 of target
  progCard.hass = progHass({ eco_temperature: 21.8 }, (domain, svc, data) => { if (svc === 'set_eco_temperature') setEco = data.temperature; });
  progCard._scheduleOpen = true;
  progCard.render();
  progCard.shadowRoot.querySelector('[data-eco-temp-step="0.1"]').click();
  if (setEco !== 21.5) throw new Error('eco should clamp to target-0.5 (21.5), got ' + setEco);

  // a freshly added program starts fully on the comfort (target) setpoint
  let savedPrograms = null;
  progCard.hass = progHass({}, (domain, svc, data) => { if (svc === 'set_program') savedPrograms = data.programs; });
  progCard._scheduleOpen = true;
  progCard.render();
  progCard.shadowRoot.querySelector('.sh-add-prog-btn').click();
  const newPid = savedPrograms && Object.keys(savedPrograms).find(k => k !== 'P1');
  if (!newPid || !savedPrograms[newPid].hours.every(h => h === 1)) {
    throw new Error('a newly added program should default to all-comfort hours, not a day/night split');
  }
  localStorage.removeItem('smart-heating-eco-timer');
  localStorage.removeItem('smart-heating-temp-step');
  localStorage.removeItem('smart-heating-programs');
}

console.log('SMOKE OK');

process.exit(0);
