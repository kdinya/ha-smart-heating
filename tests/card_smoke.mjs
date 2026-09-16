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
      },
    },
    'sensor.outdoor': { state: '-3.2', attributes: {} },
    'sensor.wind': { state: '4 m/s', attributes: {} },
    'sensor.rain': { state: '0 mm', attributes: {} },
  },
  callService: (...args) => calls.push(args),
};
const calls = [];

const card = document.createElement('smart-heating-card');
document.body.appendChild(card);
card.setConfig({
  type: 'custom:smart-heating-card', entity: 'climate.smart_heating', title: 'HEAT',
  outdoor_temperature: 'sensor.outdoor', wind: 'sensor.wind', precipitation: 'sensor.rain',
  connection_mode: 'parallel', language: 'uk', panel_buttons_x: 62, room_letter_spacing: -3,
});
card.hass = hass;
const html = card.shadowRoot.innerHTML;
const must = ['scheme-card active', 'flame-effect', 'is-active', '21', '22', 'control-panel', '--panel-buttons-x:62', '--room-letter-spacing:-3px'];
for (const needle of must) {
  if (!html.includes(needle)) throw new Error(`card markup missing: ${needle}`);
}
if (html.includes('undefined') || html.includes('NaN')) throw new Error('card markup contains undefined/NaN');
const activeScheme = [...card.shadowRoot.querySelectorAll('.scheme-card')].findIndex(el => el.classList.contains('active'));
if (activeScheme !== 2) throw new Error(`connection_mode not applied, active index ${activeScheme}`);

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
const editor = document.createElement('smart-heating-card-editor');
document.body.appendChild(editor);
editor.setConfig({ type: 'custom:smart-heating-card', entity: 'climate.smart_heating', language: 'uk' });
editor.hass = hass;
const sections = [...editor.shadowRoot.querySelectorAll('[data-section]')].map(b => b.dataset.section);
const expected = ['general', 'layout', 'header', 'climate', 'humidity', 'weather', 'connection', 'panel', 'effects'];
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
const ignore = new Set(['type', 'entity']);
const missing = [...readByCard].filter(k => !exposed.has(k) && !ignore.has(k));
// group/item triplets are generated, check them explicitly
const groups = ['header', 'weather', 'climate', 'connection', 'panel'];
const items = ['brand', 'brand_icon', 'date', 'clock', 'signal', 'outdoor', 'wind', 'rain', 'dial', 'room', 'target', 'adjust', 'humidity', 'humidity_int', 'humidity_dec', 'humidity_unit', 'scheme', 'panel_buttons'];
for (const prefix of [...groups, ...items]) {
  for (const axis of ['_x', '_y', '_s']) {
    if (!keys.has(prefix + axis)) missing.push(prefix + axis);
  }
}
if (missing.length) throw new Error('config keys not exposed in the editor: ' + missing.join(', '));

editor.shadowRoot.getElementById('panel_gap').value = '3';
editor.shadowRoot.getElementById('panel_gap').dispatchEvent(new window.Event('input', { bubbles: true }));
if (editor.config.panel_gap !== 3) throw new Error('slider did not write config');

console.log('SMOKE OK');

process.exit(0);
