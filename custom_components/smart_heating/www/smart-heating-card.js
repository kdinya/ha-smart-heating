/* Smart Heating Card 1.0.3 — reference-matched 3D boiler controller */
const SH_VERSION = '1.0.3';
const SH_LANG_KEY = 'smart-heating-language';
const SH_OPEN_KEY = 'smart-heating-open-sections';
/* Single source of truth for every tunable the card and its editor share. */
const SH_DEFAULTS = {
  screen_aspect_ratio: 1.75, card_radius: 20, row_offset_y: 0, frame_width: 0,
  header_inner_x: -8.5, header_inner_y: -5, line_y: 0.5,
  header_x: 92.5, header_y: -5.5, header_s: 1.53,
  brand_group_x: -1.5, brand_group_y: 1.5,
  brand_x: 4, brand_y: 3, brand_s: 0.81,
  'brand-x': -2, 'brand-y': -5,
  brand_icon_x: 1.5, brand_icon_y: 1, brand_icon_s: 1.77,
  'brand-icon_x': -18, 'brand-icon_y': -26, 'brand-icon_s': 1.3,
  date_group_x: 23, date_group_y: 1, date_x: 7.5, date_y: 14.5, date_s: 1.14,
  clock_x: 2.5, clock_y: -3, clock_s: 1.2, 'clock-x': -11, 'clock-y': -19,
  signal_x: 0.5, signal_y: 5.5, signal_s: 0.96,
  weather_x: -1.5, weather_y: -16, weather_s: 0.98,
  outdoor_visible: true, outdoor_x: 0, outdoor_y: 2, outdoor_s: 0.99,
  wind_visible: true, wind_x: 1, wind_y: -1.5, wind_s: 0.99,
  rain_visible: true, rain_x: 0, rain_y: -5, rain_s: 0.99,
  climate_x: 0, climate_y: -17, climate_s: 2.44,
  dial_x: 0, dial_y: -20, dial_s: 0.62,
  room_x: 0, room_y: -9.5, room_s: 0.95,
  room_int_visible: true, room_dec_visible: true, room_unit_visible: true,
  room_letter_spacing: 3.5, room_decimal_size: 0.6, room_unit_size: 0.95,
  target_x: 0, target_y: 23.5, target_s: 2.01,
  target_dec_visible: true, target_unit_visible: false, target_unit_gap: 4,
  target_letter_spacing: 2, target_decimal_size: 0.85, target_unit_size: 0.25,
  adjust_x: 0, adjust_y: -22.5, adjust_s: 0.38,
  adjust_gap: 128, adjust_icon_size: 36, adjust_button_size: 69,
  humidity_visible: true, humidity_x: 5, humidity_y: -16.5, humidity_s: 0.9,
  'humidity-int_s': 0.99, 'humidity-dec_s': 1.01, 'humidity-unit_s': 1.18,
  humidity_unit_x: 0.5,
  scheme_x: 2, scheme_y: -16, scheme_s: 0.9,
  connection_x: 0, connection_y: 18.5, connection_s: 1,
  connection_mode: 'direct', contact_1_active: false,
  panel_x: 0, panel_y: 0, panel_s: 1.32, panel_h: 2, panel_gap: 11.25,
  panel_button_size: 0.9, 'panel-buttons_x': 6, 'panel-buttons_y': 8.5,
  'panel-buttons_s': 0.84, panel_buttons_s: 0.7, panel_buttons_y: 65.5,
  effect_enabled: true, effect_x: 0, effect_y: 1.5, effect_s: 0.96, effect_opacity: 0.5,
};
/* Groups get a --<id>-x/-y/-s triplet; items are the individual blocks inside them. */
const SH_GROUPS = ['header', 'weather', 'climate', 'panel'];
const SH_ITEMS = ['brand', 'brand-icon', 'date', 'clock', 'signal', 'outdoor', 'wind', 'rain', 'dial', 'room', 'target', 'adjust', 'humidity', 'humidity-int', 'humidity-dec', 'humidity-unit', 'scheme'];
const SH_UNAVAILABLE = ['unknown', 'unavailable', 'none'];
const SH_RAIN_ICON_SUN = '<circle cx="16" cy="16" r="6"/><path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.3 6.3l2.8 2.8M22.9 22.9l2.8 2.8M25.7 6.3l-2.8 2.8M9.1 22.9l-2.8 2.8"/>';
const SH_RAIN_ICON_CLOUD_LIGHT = '<path d="M7 25h17a5 5 0 0 0 0-10 7.5 7.5 0 0 0-14.4 2A4.5 4.5 0 0 0 7 25Z"/>';
const SH_RAIN_ICON_RAINY = '<path d="M7 21h17a5 5 0 0 0 .5-10A8 8 0 0 0 9 12a4.5 4.5 0 0 0-2 9Z"/><path d="m10 25-2 4m8-4-2 4m8-4-2 4"/>';
const SH_RAIN_ICON_WINDY = '<path d="M3 11h16c3 0 3-5 0-5-1.4 0-2.4.7-3 1.8M3 16h22c4 0 4 6 0 6-1.7 0-2.8-.8-3.5-2M3 21h10"/>';
const SH_RAIN_ICONS = {
  'sunny': SH_RAIN_ICON_SUN,
  'clear': SH_RAIN_ICON_SUN,
  'clear-night': '<path d="M22 19a9 9 0 1 1-8-14 7.5 7.5 0 0 0 8 14Z"/>',
  'partlycloudy': '<circle cx="11" cy="10" r="4.5"/><path d="M11 2.5v2.5M11 15v2M3 10h2M17 10h2M5.6 4.6l1.8 1.8M16.4 4.6l-1.8 1.8"/><path d="M9 26h14a5 5 0 0 0 .5-10 7.5 7.5 0 0 0-13.3-3 4.5 4.5 0 0 0-1.2 13Z"/>',
  'cloudy': SH_RAIN_ICON_CLOUD_LIGHT,
  'overcast': SH_RAIN_ICON_CLOUD_LIGHT,
  'fog': '<path d="M8 16h16a5 5 0 0 0 0-10 7.5 7.5 0 0 0-14.2 2.2"/><path d="M4 21h24M4 26h24"/>',
  'rainy': SH_RAIN_ICON_RAINY,
  'pouring': '<path d="M7 19h17a5 5 0 0 0 .5-10A8 8 0 0 0 9 10a4.5 4.5 0 0 0-2 9Z"/><path d="m9 23-2 6m6-6-2 6m6-6-2 6m6-6-2 6"/>',
  'snowy': '<path d="M7 16h17a5 5 0 0 0 0-10A8 8 0 0 0 9 8a4.5 4.5 0 0 0-2 8Z"/><path d="M11 21v6m-3-3h6m4-3v6m-3-3h6m4-3v6m-3-3h6"/>',
  'snowy-rainy': '<path d="M7 16h17a5 5 0 0 0 0-10A8 8 0 0 0 9 8a4.5 4.5 0 0 0-2 8Z"/><path d="M11 21v6m-3-3h6m4-3v6m-3-3h6m4-3v6m-3-3h6"/>',
  'lightning': '<path d="M7 17h17a5 5 0 0 0 0-10A8 8 0 0 0 9 9a4.5 4.5 0 0 0-2 8Z"/><path d="M18 17l-5 8h5l-4 6"/>',
  'lightning-rainy': '<path d="M7 17h17a5 5 0 0 0 0-10A8 8 0 0 0 9 9a4.5 4.5 0 0 0-2 8Z"/><path d="M18 17l-5 8h5l-4 6"/>',
  'hail': '<path d="M7 16h17a5 5 0 0 0 0-10A8 8 0 0 0 9 8a4.5 4.5 0 0 0-2 8Z"/><circle cx="11" cy="23" r="1.6"/><circle cx="17" cy="25" r="1.6"/><circle cx="23" cy="22" r="1.6"/>',
  'windy': SH_RAIN_ICON_WINDY,
  'windy-variant': SH_RAIN_ICON_WINDY,
  'exceptional': '<path d="M16 3 3 27h26L16 3Z"/><path d="M16 13v7"/><circle cx="16" cy="23" r="0.9" fill="currentColor" stroke="none"/>',
};
const SH_RAIN_ICON = (state) => SH_RAIN_ICONS[String(state ?? '').trim().toLowerCase()] || SH_RAIN_ICON_RAINY;
const SH_DICT = {
  uk: {power: 'ЖИВЛЕННЯ', program: 'ПРОГРАМА', history: 'ІСТОРІЯ', settings: 'НАЛАШТУВАННЯ', outdoor: 'Температура на вулиці', wind: 'Вітер на вулиці', rain: 'Опади на вулиці', humidity: 'ВОЛОГІСТЬ В КІМНАТІ', scheme: 'СХЕМА ПІДКЛЮЧЕННЯ', contact1: 'ТЕРМОСТАТ ХА<br><small>АВТОМАТИКА</small>', contact2: 'ПРОГРАМАТОР<br><small>ТАЙМЕР</small>', direct: 'ПРЯМИЙ<br>КОНТАКТ', old: 'СТАРИЙ<br>ПРОГРАМАТОР', parallel: 'ПАРАЛЕЛЬНО', boiler: 'КОТЕЛ ПРАЦЮЄ', waiting: 'КОТЕЛ', overview: 'ОГЛЯД', appearance: 'ВИГЛЯД', entities: 'ЕНТІТІ', language: 'МОВА', locale: 'uk-UA', hysteresis: 'ГІСТЕРЕЗИС', labels: 'НАЗВИ ТА ПІДПИСИ', hysteresis_on: 'Гістерезіс увімкнення (дельта)', hysteresis_off: 'Гістерезіс вимкнення (дельта)', hyst_on_desc: 'Дельта зниження температури для вмикання котла', hyst_off_desc: 'Дельта підвищення температури для вимикання котла', labels_hint: 'Введіть власний текст або залиште порожнім для стандартного. Вимикач поруч приховує або показує підпис.', reset_labels: 'Скинути всі тексти', lbl_title: 'Заголовок картки', lbl_subtitle: 'Підзаголовок', lbl_outdoor: 'Температура на вулиці', lbl_wind: 'Вітер на вулиці', lbl_rain: 'Опади на вулиці', lbl_humidity: 'Вологість в кімнаті', lbl_scheme: 'Схема підключення', lbl_contact1: 'Контакт 1', lbl_contact2: 'Контакт 2', lbl_power: 'Кнопка «Живлення»', lbl_program: 'Кнопка «Програма»', lbl_boiler: 'Статус «Котел працює»', lbl_waiting: 'Статус «Котел» (очікування)', lbl_history: 'Кнопка «Історія»', lbl_settings: 'Кнопка «Налаштування»', hint_overview: 'Керуйте температурою котла кнопками картки.', hint_appearance: 'Використовуйте візуальний редактор для зміни положення та розміру кожного блоку.', hint_entities: 'Дані беруться з конфігурації пристрою Smart Heating.', title_appearance: 'Вигляд картки', title_entities: 'Підключені ентіті', contact1_status: 'Контакт 1 (Термостат)', contact2_status: 'Контакт 2 (Програматор)', contact2_entity: 'Сутність Контакту 2'},
  en: {power: 'POWER', program: 'PROGRAM', history: 'HISTORY', settings: 'SETTINGS', outdoor: 'Outdoor temperature', wind: 'Wind outside', rain: 'Precipitation', humidity: 'ROOM HUMIDITY', scheme: 'CONNECTION SCHEME', contact1: 'HA THERMOSTAT<br><small>SMART AUTO</small>', contact2: 'PROGRAMMER<br><small>TIMER DIAL</small>', direct: 'DIRECT<br>CONTACT', old: 'OLD<br>PROGRAMMER', parallel: 'PARALLEL', boiler: 'BOILER RUNNING', waiting: 'BOILER', overview: 'OVERVIEW', appearance: 'APPEARANCE', entities: 'ENTITIES', language: 'LANGUAGE', locale: 'en-GB', hysteresis: 'HYSTERESIS', labels: 'TEXTS & LABELS', hysteresis_on: 'Turn-on hysteresis (delta)', hysteresis_off: 'Turn-off hysteresis (delta)', hyst_on_desc: 'Drop below target temperature before firing boiler', hyst_off_desc: 'Rise above target temperature before stopping boiler', labels_hint: 'Enter custom text or leave empty for default. The switch next to each field shows or hides that label.', reset_labels: 'Reset all labels', lbl_title: 'Card title', lbl_subtitle: 'Subtitle', lbl_outdoor: 'Outdoor temperature', lbl_wind: 'Wind outside', lbl_rain: 'Precipitation', lbl_humidity: 'Room humidity', lbl_scheme: 'Connection scheme', lbl_contact1: 'Contact 1', lbl_contact2: 'Contact 2', lbl_power: 'Power button', lbl_program: 'Program button', lbl_boiler: 'Status «Boiler running»', lbl_waiting: 'Status «Boiler» (standby)', lbl_history: 'History button', lbl_settings: 'Settings button', hint_overview: 'Control the boiler temperature from the card buttons.', hint_appearance: 'Use the visual editor to change each block position and size.', hint_entities: 'Data is read from the Smart Heating device configuration.', title_appearance: 'Card appearance', title_entities: 'Connected entities', contact1_status: 'Contact 1 (Thermostat)', contact2_status: 'Contact 2 (Programmer)', contact2_entity: 'Contact 2 Entity'},
};
const SH_CLAMP = (value, min, max, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};
const SH_READ_STORE = (key) => {
  try { return localStorage.getItem(key) || ''; } catch (error) { return ''; }
};
const SH_WRITE_STORE = (key, value) => {
  try { localStorage.setItem(key, value); } catch (error) { /* private mode */ }
};
const SH_GET_STORE_JSON = (key) => {
  try { const raw = SH_READ_STORE(key); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
};
const SH_SET_STORE_JSON = (key, val) => {
  try { SH_WRITE_STORE(key, JSON.stringify(val)); } catch (e) {}
};
class SmartHeatingCard extends HTMLElement {
  static getConfigElement(){return document.createElement('smart-heating-card-editor');}
  static getStubConfig(hass){const entity=Object.keys(hass?.states||{}).find(id=>id.startsWith('climate.'))||'';return {type:'custom:smart-heating-card',entity};}
  setConfig(config){if(!config||!config.entity)throw new Error('Smart Heating: вкажіть climate-ентіті / define a climate entity');this.config={...config};this._menuOpen=Boolean(this._menuOpen);this._visualContact1=this._visualContact1??Boolean(SH_READ_STORE('visual_contact_1',true));this._visualContact2=this._visualContact2??Boolean(SH_READ_STORE('visual_contact_2',false));this._menuTab=this._menuTab||'';if(!this.shadowRoot)this.attachShadow({mode:'open'});this.render();}
  set hass(value){const previous=this._hass;this._hass=value;if(this._shouldRender(previous,value))this.render();}
  get hass(){return this._hass;}
  connectedCallback(){this._clockTimer=setInterval(()=>this._tickClock(),10000);}
  disconnectedCallback(){clearInterval(this._clockTimer);this._clockTimer=null;}
  getCardSize(){return 9;}
  /* Re-render only when a watched entity actually changed: `hass` is replaced on every state update in HA. */
  _watchedEntities(){return [this.config?.entity,this.config?.switch_2,this._hass?.states?.[this.config?.entity]?.attributes?.switch_2,this.config?.humidity,this.config?.outdoor_temperature,this.config?.wind,this.config?.precipitation].filter(Boolean);}
  _shouldRender(previous,next){if(!previous||!next||!this.config)return true;return this._watchedEntities().some(id=>previous.states?.[id]!==next.states?.[id]);}
  _tickClock(){if(!this.shadowRoot)return;const lang=this._language(),locale=SH_DICT[lang]?.locale||'uk-UA',now=new Date();const date=this.shadowRoot.querySelector('.clock .date'),time=this.shadowRoot.querySelector('.clock-time');if(date)date.textContent=now.toLocaleDateString(locale,{weekday:'short',day:'2-digit',month:'long',year:'numeric'}).toUpperCase();if(time)time.textContent=now.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});}
  _language(){return this.config?.language||SH_READ_STORE(SH_LANG_KEY)||'en';}
  state(id){return id&&this._hass?.states[id];}
  attr(name,fallback='—'){const id=this.config?.[name],s=this.state(id);return s&&!SH_UNAVAILABLE.includes(s.state)?s.state:fallback;}
  safe(x){return String(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  render(){
    if(!this.shadowRoot||!this._hass||!this.config?.entity)return;
    const _menuEl=this.shadowRoot.querySelector('.modal'),_tabsEl=this.shadowRoot.querySelector('.tabs');
    const _menuScroll=_menuEl?_menuEl.scrollTop:0,_tabsScroll=_tabsEl?_tabsEl.scrollTop:0;
    const c=this.state(this.config.entity),a=c?.attributes||{};
    const room=a.current_temperature??'—',target=a.temperature??'—',humidity=this.attr('humidity',a.humidity??'—');const humidityVisible=this.config.humidity_visible!==false;const roomStr=String(room),[roomInt,roomDec]=roomStr.split('.');
    const oneDecimal=(v)=>{const n=Number(v);return Number.isFinite(n)?n.toFixed(1):v};const targetStr=String(oneDecimal(target)),[targetInt,targetDec]=targetStr.split('.');const screenRatio=SH_CLAMP(this.config.screen_aspect_ratio,1.2,2.5,SH_DEFAULTS.screen_aspect_ratio),cardRatio=screenRatio;
    const cardRadius=SH_CLAMP(this.config.card_radius,0,100,SH_DEFAULTS.card_radius),rowOffset=SH_CLAMP(this.config.row_offset_y,-100,140,SH_DEFAULTS.row_offset_y),roomLetterSpacing=SH_CLAMP(this.config.room_letter_spacing,-12,8,SH_DEFAULTS.room_letter_spacing),roomDecimalSize=SH_CLAMP(this.config.room_decimal_size,.25,2.5,SH_DEFAULTS.room_decimal_size),roomUnitSize=SH_CLAMP(this.config.room_unit_size,.25,2.5,SH_DEFAULTS.room_unit_size),targetLetterSpacing=SH_CLAMP(this.config.target_letter_spacing,-12,8,SH_DEFAULTS.target_letter_spacing),targetDecimalSize=SH_CLAMP(this.config.target_decimal_size,.25,2.5,SH_DEFAULTS.target_decimal_size),targetUnitSize=SH_CLAMP(this.config.target_unit_size,.25,2.5,SH_DEFAULTS.target_unit_size),targetUnitGap=SH_CLAMP(this.config.target_unit_gap,0,40,SH_DEFAULTS.target_unit_gap),adjustIconSize=SH_CLAMP(this.config.adjust_icon_size,12,100,SH_DEFAULTS.adjust_icon_size),adjustGap=SH_CLAMP(this.config.adjust_gap,18,180,SH_DEFAULTS.adjust_gap),buttonSize=SH_CLAMP(this.config.adjust_button_size,48,86,SH_DEFAULTS.adjust_button_size),frameWidth=SH_CLAMP(this.config.frame_width,0,8,SH_DEFAULTS.frame_width);
    const n=(key,fallback=0)=>{
      const cands=[key,key.replaceAll('-','_'),key.replaceAll('_','-')];
      for(const k of cands){if(this.config&&Number.isFinite(Number(this.config[k])))return Number(this.config[k]);}
      for(const k of cands){if(Object.prototype.hasOwnProperty.call(SH_DEFAULTS,k))return SH_DEFAULTS[k];}
      return fallback;
    };const g=(id)=>{const key=id.replaceAll('-','_');return `--${id}-x:${n(key+'_x')};--${id}-y:${n(key+'_y')};--${id}-s:${SH_CLAMP(n(key+'_s',1),.25,4,1)};`};const groupVars=SH_GROUPS.map(g).join('');const itemVars=SH_ITEMS.map(g).join('');
    const tab=this._menuTab||'';
    const lang=this._language(),locale=SH_DICT[lang]?.locale||'uk-UA';
    const tr=(key)=>SH_DICT[lang]?.[key]??SH_DICT.uk[key];
    const customLabels=SH_GET_STORE_JSON('smart_heating_labels');
    const labelsVisible=SH_GET_STORE_JSON('smart_heating_labels_visible');
    const getLabel=(key,defaultText)=>{
      const custom=customLabels[key];
      return (custom!==undefined&&custom!==null&&String(custom).trim()!=='')?String(custom).trim():defaultText;
    };
    const isLabelOn=(key)=>labelsVisible[key]!==false;
    const currentHOn=c?.attributes?.hysteresis_on??c?.attributes?.hysteresis??0.5;
    const currentHOff=c?.attributes?.hysteresis_off??0.5;
    const shNum=(v)=>{const num=Number(v);return Number.isFinite(num)?String(Math.round(num*10)/10):v};const outdoor=shNum(this.attr('outdoor_temperature',a.outdoor_temperature??'—')),wind=shNum(this.attr('wind',a.wind??'—')),rain=shNum(this.attr('precipitation',a.precipitation??'—')),rainIcon=SH_RAIN_ICON(a.weather_condition??a.weather??rain);const outdoorVisible=this.config.outdoor_visible!==false,windVisible=this.config.wind_visible!==false,rainVisible=this.config.rain_visible!==false;
    const enabled=c?.state!=='off'&&c?.state!=='unavailable';const effectEnabled=this.config.effect_enabled!==false;
    const hasContact1 = Boolean(a.switch_1 || this.config.switch_1);
    const hasContact2 = Boolean(a.switch_2 || this.config.switch_2);
    const hasAnyContact = hasContact1 || hasContact2;
    const contact1On = a.contact_1_enabled !== undefined ? Boolean(a.contact_1_enabled) : (this._visualContact1 !== undefined ? this._visualContact1 : (this.config.contact_1_active !== false));
    const contact2On = a.contact_2_enabled !== undefined ? Boolean(a.contact_2_enabled) : (this._visualContact2 !== undefined ? this._visualContact2 : Boolean(this.config.contact_2_active));
    /* Prefer the integration's own `heating` flag, then hvac_action, then the raw mode. */
    const burning=a.heating!==undefined?Boolean(a.heating):(a.hvac_action?a.hvac_action==='heating':c?.state==='heat');const heating=enabled&&contact1On&&burning;
    const schemeMode=['direct','old','parallel'].includes(this.config.connection_mode)?this.config.connection_mode:'direct';
    const now=new Date();const date=now.toLocaleDateString(locale,{weekday:'short',day:'2-digit',month:'long',year:'numeric'}).toUpperCase(),time=now.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});
    this.shadowRoot.innerHTML=`<style>
      @font-face{font-family:'7segment';src:url('/hacsfiles/ha-smart-heating/fonts/7segment.woff') format('woff');font-display:swap}
      :host{display:block;width:100%;max-width:100%;overflow:visible;color:#eef2f8;font-family:Arial,Helvetica,sans-serif;--orange:#ff9418;--silver:#d8dee6;--muted:#b7c1cf}
      ha-card{container-type:size;position:relative;display:block;width:100%;max-width:100%;aspect-ratio:var(--card-ratio,1.5);box-sizing:border-box;padding:0;overflow:hidden;border-radius:var(--card-radius,27px);border:1px solid #52606b;background:linear-gradient(145deg,#172027 0%,#080e12 42%,#121b21 100%);box-shadow:0 20px 45px #000d,inset 0 1px #ffffff40,inset 0 -4px 14px #000;}
      .device{box-sizing:border-box;position:absolute;inset:0;width:100%;height:100%;min-height:0;display:flex;flex-direction:column;padding:clamp(7px,1.15cqw,17px) clamp(7px,1.15cqw,17px) clamp(6px,.9cqw,13px);border-radius:var(--card-radius,27px);background:linear-gradient(150deg,#243139 0%,#10181d 17%,#080d11 72%,#1a242b 100%);box-shadow:inset 0 0 0 2px #060a0d,inset 0 0 0 4px #ffffff0b,inset 0 0 20px #000;}
      .screen{box-sizing:border-box;width:100%;min-width:0;flex:1 1 auto;min-height:0;aspect-ratio:var(--screen-ratio,1.9);margin-left:auto;margin-right:auto;position:relative;padding:clamp(8px,1.55cqw,22px) clamp(9px,1.7cqw,24px) clamp(7px,1.35cqw,19px);border:1px solid #65717b;border-radius:var(--screen-radius,clamp(9px,1.35cqw,19px));background:radial-gradient(ellipse at 50% 45%,#172329 0%,#0d151a 54%,#080e12 100%);box-shadow:inset 0 0 28px #000c,0 1px #ffffff2b,0 0 0 5px #0a1014,0 0 0 6px #34414a;overflow:hidden}.screen:before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,#fff1,transparent 18%,transparent 78%,#0007)}
      .screen>*{position:relative;z-index:1}.header-shell{transform:translateY(calc(var(--header-inner-y,0) * 1cqh))}.group-header{display:flex;justify-content:space-between;align-items:flex-start}.brand{transform:translate(calc(var(--brand-group-x,0) * 1cqw),calc(var(--brand-group-y,0) * 1cqh));display:flex;align-items:center;gap:clamp(5px,1cqw,14px);min-width:0}.flame{color:var(--orange);font-size:clamp(22px,3.5cqw,49px);line-height:1;text-shadow:0 0 13px #ff8a0066}.brand-icon{transform:translate(calc(var(--brand-icon-x,0) * 1cqw),calc(var(--brand-icon-y,0) * 1cqh)) scale(var(--brand-icon-s,1));transform-origin:center center}.brand-name{transform:translate(calc(var(--brand-x,0) * 1cqw),calc(var(--brand-y,0) * 1cqh)) scale(var(--brand-s,1));transform-origin:left top}.brand b{font-size:clamp(13px,1.9cqw,27px);letter-spacing:2px}.brand small{display:block;color:var(--orange);font-size:clamp(8px,1.05cqw,15px);letter-spacing:2.1px;margin-top:5px}.clock{text-align:right;color:#c4cedb;transform:translate(calc((var(--date-group-x,0)) * 1cqw),calc((var(--date-group-y,0)) * 1cqh));font-size:clamp(7px,1.1cqw,16px);min-width:0;white-space:nowrap}.clock .date{transform:translate(calc(var(--date-x,0) * 1cqw),calc(var(--date-y,0) * 1cqh)) scale(var(--date-s,1));display:block}.clock strong{font-family:'7segment',monospace;display:block;margin-top:3px;color:#fff;font-size:clamp(20px,3cqw,43px);line-height:1;font-weight:300;letter-spacing:3px}.clock-time{transform:translate(calc(var(--clock-x,0) * 1cqw),calc(var(--clock-y,0) * 1cqh)) scale(var(--clock-s,1));transform-origin:top right}.signal{transform:translate(calc(var(--signal-x,0) * 1cqw),calc(var(--signal-y,0) * 1cqh)) scale(var(--signal-s,1));display:flex;align-items:flex-end;justify-content:flex-end;gap:3px;margin-top:6px;height:20px}.signal i{display:block;width:4px;border-radius:2px;background:#c6ced8;box-shadow:0 0 4px #c6ced855}.signal i:nth-child(1){height:6px}.signal i:nth-child(2){height:10px}.signal i:nth-child(3){height:14px}.signal i:nth-child(4){height:19px}.line{height:1px;margin:clamp(6px,1cqw,14px) 0 clamp(8px,1.3cqw,18px);transform:translateY(calc(var(--line-y,0) * 1cqh));background:linear-gradient(90deg,var(--orange),#505c65 38%,#505c65 70%,transparent)}
      .screen-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.45fr) minmax(0,1fr);gap:clamp(3px,1cqw,10px);min-width:0;min-width:0;align-items:center;transform:translateY(calc(var(--row-offset,0) * 1cqh))}.side{display:flex;flex-direction:column;gap:4px;min-width:0;overflow:visible}.group-weather{transform:translate(calc(var(--weather-x,0) * 1cqw),calc(var(--weather-y,0) * 1cqh)) scale(var(--weather-s,1));}.group-climate{transform:translate(calc(var(--climate-x,0) * 1cqw),calc(var(--climate-y,0) * 1cqh)) scale(var(--climate-s,1));}.group-panel{transform:translate(calc(var(--panel-x,0) * 1cqw),calc(var(--panel-y,0) * 1cqh)) scale(calc(var(--panel-s,.89) * .76));transform-origin:bottom center}.screen-grid>.side:first-child{transform-origin:top left}.screen-grid>.center{transform-origin:top center}.screen-grid>.side:last-child{transform-origin:top right}.metric{transform:translate(calc(var(--item-x,0) * 1cqw),calc(var(--item-y,0) * 1cqh));min-height:clamp(34px,4.8cqw,68px);padding:clamp(5px,.85cqw,12px) 2px;border-bottom:1px solid #39454d;display:flex;align-items:center;gap:clamp(4px,.85cqw,12px);min-width:0}.metric-icon{width:clamp(20px,3cqw,43px);flex:0 0 clamp(20px,3cqw,43px);text-align:center;color:#e0e5ec;font-size:clamp(18px,2.65cqw,38px);line-height:1;text-shadow:0 2px 3px #000}.weather-icon svg{width:clamp(20px,2.7cqw,38px);height:clamp(20px,2.7cqw,38px);fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 2px #000)}.metric.orange{transform:translate(calc(var(--humidity-x,0) * 1cqw),calc(var(--humidity-y,0) * 1cqh)) scale(var(--humidity-s,1))}.element-outdoor{transform:translate(calc(var(--outdoor-x,0) * 1cqw),calc(var(--outdoor-y,0) * 1cqh)) scale(var(--outdoor-s,1))}.element-wind{transform:translate(calc(var(--wind-x,0) * 1cqw),calc(var(--wind-y,0) * 1cqh)) scale(var(--wind-s,1))}.element-rain{transform:translate(calc(var(--rain-x,0) * 1cqw),calc(var(--rain-y,0) * 1cqh)) scale(var(--rain-s,1))}.metric.orange .metric-icon{color:var(--orange);text-shadow:0 0 13px #ff8a0055}.metric label{display:block;white-space:normal;overflow-wrap:anywhere;color:#c3ccda;font-size:clamp(8px,1cqw,14px);margin-bottom:clamp(2px,.4cqw,5px)}.humidity-value{display:flex;align-items:baseline;gap:0}.humidity-int{transform:translate(calc(var(--humidity-int-x,0) * 1cqw),calc(var(--humidity-int-y,0) * 1cqh)) scale(var(--humidity-int-s,1));display:inline-block}.humidity-dec{transform:translate(calc(var(--humidity-dec-x,0) * 1cqw),calc(var(--humidity-dec-y,0) * 1cqh)) scale(var(--humidity-dec-s,1));display:inline-block}.humidity-unit{transform:translate(calc(var(--humidity-unit-x,0) * 1cqw),calc(var(--humidity-unit-y,0) * 1cqh)) scale(var(--humidity-unit-s,1));display:inline-block}.metric strong{display:block;color:#f6f8fb;font-size:clamp(13px,2cqw,28px);line-height:1.05;font-weight:500}.metric em{font-style:normal;color:#c6d0db;font-size:clamp(9px,1.3cqw,18px)}.center{display:flex;flex-direction:column;align-items:center}.dial{transform:translate(calc(var(--dial-x,0) * 1cqw),calc(var(--dial-y,0) * 1cqh)) scale(var(--dial-s,1));position:relative;width:min(100%,clamp(120px,29cqw,345px));height:auto;aspect-ratio:1;min-width:0;min-height:0;border-radius:50%;background:conic-gradient(from 215deg,var(--orange) 0deg,#ffad35 92deg,var(--orange) 129deg,#4d5962 130deg,#4d5962 235deg,transparent 236deg);box-shadow:0 0 20px #ff8a0040,0 0 0 2px #10181c,inset 0 0 10px #000}.dial:before{content:'';position:absolute;z-index:1;inset:12px;border-radius:50%;background:radial-gradient(circle at 43% 30%,#1a292f,#0b1318 66%,#070c10);box-shadow:inset 0 0 28px #000,0 0 0 1px #9aa4ae66}.dial.is-heating{box-shadow:0 0 24px color-mix(in srgb,var(--orange) 45%,transparent),0 0 0 2px #10181c,inset 0 0 10px #000}.flame-effect{display:none;position:absolute;inset:9px;border-radius:50%;overflow:hidden;z-index:1;pointer-events:none;opacity:var(--effect-opacity,.85);box-shadow:inset 0 0 20px #0066ff55}.flame-effect.is-active{display:block}.flame-layer{position:absolute;inset:0;width:100%;height:100%;transform:translate(calc(var(--effect-x,0) * 1cqw),calc(var(--effect-y,0) * 1cqh)) scale(var(--effect-s,1));transform-origin:50% 85%;filter:drop-shadow(0 0 10px #0088ff)}.flame-layer svg{width:100%;height:100%;overflow:hidden}.flame-outer{animation:flame-blue-sway 1.15s ease-in-out infinite alternate;transform-origin:50% 95%}.flame-mid{animation:flame-blue-mid .88s ease-in-out .08s infinite alternate-reverse;transform-origin:50% 95%}.flame-inner{animation:flame-blue-core .72s ease-in-out .15s infinite alternate;transform-origin:50% 95%}@keyframes flame-blue-sway{from{transform:scaleX(.91) scaleY(.96) skewX(-2.5deg);opacity:.85}to{transform:scaleX(1.07) scaleY(1.03) skewX(2.5deg);opacity:1}}@keyframes flame-blue-mid{from{transform:scaleX(.88) scaleY(.94) skewX(2deg);opacity:.88}to{transform:scaleX(1.1) scaleY(1.05) skewX(-2deg);opacity:1}}@keyframes flame-blue-core{from{transform:scaleX(.93) scaleY(.92);opacity:.9}to{transform:scaleX(1.06) scaleY(1.08);opacity:1}}.dial:after{content:'';position:absolute;z-index:1;inset:22px;border-radius:50%;border:1px solid #8f9aa555;box-shadow:inset 0 0 9px #000}.dial-content{position:relative;z-index:2;text-align:center}.dial .flame{font-size:clamp(20px,2.9cqw,41px);margin-top:clamp(1px,.25cqw,3px)}.dial-label{margin-top:9px;color:#e0e6ee;font-size:clamp(8px,1.05cqw,15px)}.temp{font-family:'7segment',monospace;transform:translate(calc((var(--room-x,0) - var(--dial-x,0)) * 1cqw / var(--dial-s,1)),calc((var(--room-y,0) - var(--dial-y,0)) * 1cqh / var(--dial-s,1))) scale(calc(var(--room-s,1) / var(--dial-s,1)));margin-top:8px;color:#fafbfc;font-size:clamp(31px,6.1cqw,82px);line-height:.92;letter-spacing:-5px;font-weight:300;text-shadow:0 3px 6px #000}.temp sup{font-size:calc(clamp(11px,1.8cqw,24px) * var(--room-unit-size,1));letter-spacing:0;margin-left:3px;vertical-align:baseline;line-height:1}.target .target-unit{vertical-align:baseline;line-height:1;margin-left:var(--target-unit-gap,4px)}.temp{letter-spacing:var(--room-letter-spacing,-5px)}.temp .temp-dec{font-size:calc(1em * var(--room-decimal-size,1));letter-spacing:var(--room-letter-spacing,-5px)}.target strong{letter-spacing:var(--target-letter-spacing,0)}.target .target-dec{font-size:calc(1em * var(--target-decimal-size,1));letter-spacing:var(--target-letter-spacing,0)}.target .target-unit{font-size:calc(1em * var(--target-unit-size,1));letter-spacing:0}.target{transform:translate(calc(var(--target-x,0) * 1cqw),calc(var(--target-y,0) * 1cqh)) scale(var(--target-s,1));margin-top:12px;color:var(--orange);font-size:clamp(7px,1cqw,13px);letter-spacing:.5px}.target strong{font-family:'7segment',monospace;display:block;margin-top:3px;color:#fff;font-size:calc(35px * var(--target-scale,1));font-weight:500;letter-spacing:var(--target-letter-spacing,0)}.adjust{transform:translate(calc(var(--adjust-x,0) * 1cqw),calc(var(--adjust-y,0) * 1cqh)) scale(var(--adjust-s,1));display:flex;gap:var(--adjust-gap,42px);margin-top:clamp(7px,1.1cqw,16px)}.adjust button{width:clamp(38px,calc(var(--adjust-button-size,66px) * .75),var(--adjust-button-size,66px));height:clamp(38px,calc(var(--adjust-button-size,66px) * .75),var(--adjust-button-size,66px));border-radius:50%;border:2px solid var(--orange);background:radial-gradient(circle at 32% 22%,#364149,#0a1115 70%);color:#f5f7fa;font-size:var(--adjust-icon-size,32px);display:flex;align-items:center;justify-content:center;line-height:1;box-shadow:0 0 0 5px #0a1014,0 0 14px #ff8a0035,inset 0 2px #ffffff24;cursor:pointer}.adjust button:hover{background:var(--orange);color:#111}
      .scheme-title.element-scheme,.scheme.element-scheme{transform:translate(calc(var(--scheme-x,0) * 1cqw),calc(var(--scheme-y,0) * 1cqh)) scale(var(--scheme-s,1))}.scheme{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1.2cqw,16px);align-items:stretch}
.scheme-card{position:relative;box-sizing:border-box;width:100%;cursor:pointer;user-select:none;padding:clamp(4px,.6cqw,10px) 0;background:none;border:0;box-shadow:none;text-align:center;transition:transform .2s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:clamp(4px,.6cqw,9px)}
.scheme-card:hover{transform:translateY(-2px)}
.scheme-card:active{transform:translateY(0)}
.scheme-header{position:absolute;top:clamp(1px,.3cqw,5px);left:50%;transform:translateX(clamp(9px,1.5cqw,23px));z-index:3;display:flex;align-items:center;gap:3px;margin:0;width:auto}
.scheme-badge{display:none}
.scheme-led{width:clamp(6px,.75cqw,10px);height:clamp(6px,.75cqw,10px);border-radius:50%;background:#2e3a44;border:1px solid #1a2228;box-shadow:inset 0 1px 2px #000;transition:all .2s ease}
.scheme-card.active .scheme-led{background:#ff9418;box-shadow:0 0 9px #ff9418,0 0 2px #fff}
.scheme-icon{position:relative;display:flex;align-items:center;justify-content:center;width:clamp(38px,5.4cqw,82px);height:clamp(38px,5.4cqw,82px);margin:0;border-radius:50%;color:#9eb2c2;background:radial-gradient(circle at 35% 22%,#53616a 0%,#26333a 26%,#0b1216 70%);border:2px solid #111a20;box-shadow:0 0 0 3px #05090c,0 0 0 4px #26333a,0 7px 12px rgba(0,0,0,.65),inset 0 3px 5px rgba(255,255,255,.18),inset 0 -8px 13px #000;transition:all .24s cubic-bezier(.2,.8,.2,1)}
.scheme-icon:after{content:'';position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(255,255,255,.07);transition:all .24s ease}
.scheme-icon svg{width:52%;height:52%;filter:drop-shadow(0 2px 4px rgba(0,0,0,.55));transition:all .22s ease}
.scheme-card.active .scheme-icon{color:var(--orange,#ff9418);border-color:var(--orange,#ff9418);box-shadow:0 0 0 3px #05090c,0 0 0 4px #26333a,0 0 17px rgba(255,148,24,.6),inset 0 3px 5px rgba(255,255,255,.2),inset 0 -8px 13px #000}
.scheme-card.active .scheme-icon:after{border-color:rgba(255,148,24,.35);box-shadow:0 0 15px rgba(255,148,24,.25)}
.scheme-card.active .scheme-icon svg{filter:drop-shadow(0 0 8px rgba(255,148,24,.65))}
.scheme-card .scheme-label{display:block;color:#cbd6e2;font-size:clamp(7px,.9cqw,11.5px);font-weight:700;letter-spacing:0.04em;line-height:1.2;text-transform:uppercase}
.scheme-card .scheme-label small{font-size:clamp(6px,.75cqw,9px);font-weight:500;opacity:0.85;letter-spacing:0.5px}
.scheme-card.active .scheme-label{color:#fff;text-shadow:0 0 8px rgba(255,148,24,0.4),0 1px 2px rgba(0,0,0,0.8)}
      .modal-backdrop{position:fixed;inset:0;overflow:auto;z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;background:#020609bb;backdrop-filter:blur(6px)}.modal{position:relative;width:min(420px,90%);max-height:min(82vh,720px);overflow:hidden;display:flex;flex-direction:column;box-sizing:border-box;margin:auto;min-height:0;padding:22px;border:1px solid #66737e;border-radius:16px;background:linear-gradient(145deg,#1c2a31,#091115);box-shadow:0 20px 50px #000d,inset 0 1px #fff2}.confirm-backdrop .modal{overflow-y:auto;overscroll-behavior:contain}.modal{overflow-y:auto}.modal-close{position:absolute;top:8px;right:12px;border:0;background:none;color:#d9e0e8;font-size:28px;cursor:pointer}.modal-title{color:var(--orange);font-weight:700;letter-spacing:2px;margin-bottom:15px}.tabs{display:flex;flex:1;min-height:0;flex-direction:column;gap:7px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding:2px 3px 8px}.menu-section{flex-shrink:0;border:1px solid #ffffff1a;border-radius:9px;background:#ffffff06;overflow:hidden}.menu-section.open{border-color:#ff941866;background:#ff94180b}.menu-head{display:grid;grid-template-columns:25px 1fr 20px;align-items:center;width:100%;padding:12px 10px;border:0;background:transparent;color:#cbd5df;text-align:left;cursor:pointer}.menu-head:hover{background:#ffffff0b}.menu-head span{color:var(--orange);font-size:16px}.menu-head b{font-size:11px;letter-spacing:.7px}.menu-head i{color:var(--orange);font-style:normal;text-align:center;font-size:10px}.menu-body{padding:12px 14px 14px;border-top:1px solid #ffffff18;color:#c4ced9;line-height:1.5}.menu-body p{margin:8px 0 0;color:#98a5b3;font-size:12px}
.sh-hyst-group{margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #ffffff12}
.sh-hyst-group:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}
.sh-hyst-label{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:600;color:#d8e2ec;margin-bottom:4px}
.sh-hyst-desc{font-size:11px;color:#8c9dae;margin-bottom:8px;line-height:1.35}
.sh-hyst-controls{display:flex;align-items:center;gap:8px}
.sh-step-btn{width:32px;height:32px;border-radius:6px;background:#1e2c34;border:1px solid #ffffff25;color:#fff;font-size:16px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s ease}
.sh-step-btn:hover{background:#2d414d;border-color:var(--orange)}
.sh-slider{flex:1;accent-color:var(--orange);cursor:pointer;height:6px}
.sh-hyst-val{min-width:54px;text-align:right;font-size:13px;font-weight:700;color:var(--orange)}
.sh-field-row{display:flex;flex-direction:column;gap:5px;padding:8px 0;border-bottom:1px solid #ffffff10}
.sh-field-row:last-child{border-bottom:none}
.sh-field-header{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#a0b0be}
.sh-field-controls{display:flex;gap:8px;align-items:center}
.sh-field-input{flex:1;background:#091217;border:1px solid #ffffff25;border-radius:6px;color:#f0f4f8;padding:6px 9px;font-size:12px;box-sizing:border-box}
.sh-field-input:focus{border-color:var(--orange);outline:none}
.sh-toggle-btn{position:relative;width:38px;height:22px;background:#23313a;border-radius:11px;border:1px solid #ffffff30;cursor:pointer;transition:all .2s ease;flex-shrink:0;padding:0}
.sh-toggle-btn.on{background:var(--orange);border-color:var(--orange)}
.sh-toggle-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#ffffff;transition:transform .2s ease}
.sh-toggle-btn.on .sh-toggle-knob{transform:translateX(16px);background:#0b1216}
.sh-reset-btn{margin-top:12px;width:100%;padding:8px;border-radius:7px;border:1px solid #ffffff20;background:#ffffff08;color:#c0ccd8;cursor:pointer;font-size:11px}
.sh-reset-btn:hover{background:#ffffff15;color:#fff}.popup-choice{display:flex;gap:7px;flex-wrap:wrap}.popup-choice button{flex:1;padding:9px 7px;border:1px solid #ffffff20;border-radius:7px;background:#ffffff08;color:#b9c4d0;font-size:11px;cursor:pointer}.popup-choice button.active{border-color:var(--orange);color:var(--orange);background:#ff941813}.control-panel{position:relative;isolation:isolate;box-sizing:border-box;width:100%;transform-origin:bottom center;justify-content:center;flex:0 0 auto;height:calc(clamp(58px,7cqw,90px) + calc(var(--panel-h,0) * 1cqh));min-height:calc(clamp(20px,3cqw,34px) + calc(var(--panel-h,0) * 1cqh));overflow:hidden;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(0px,calc(var(--panel-gap,2) * 1cqw),80px);align-items:start;align-content:start;margin-top:20px;padding:2px 3px 0;background:none}.control-panel:before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,#10191e00,#080d11aa);pointer-events:none}.control{position:relative;z-index:1;width:100%;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;color:#aeb8c5;font-size:clamp(6px,.85cqw,12px);letter-spacing:.5px}.button{position:relative;display:flex;align-items:center;justify-content:center;width:clamp(40px,6.2cqw,76px);height:clamp(40px,6.2cqw,76px);margin:0 auto 3px;border-radius:50%;border:1px solid #65727d;background:radial-gradient(circle at 34% 23%,#52606a 0%,#28343b 22%,#121b20 52%,#05090c 78%);box-shadow:0 8px 10px #000c,0 0 0 5px #080e12,0 0 0 6px #26323a,inset 0 3px 4px #ffffff38,inset 0 -9px 12px #000d;color:#dfe5ec;font-size:clamp(19px,2.45cqw,30px);line-height:1}.button:before{content:'';position:absolute;inset:5px;border-radius:50%;border:1px solid #ffffff20;box-shadow:inset 0 0 0 2px #0006}.button svg{position:relative;z-index:1;width:clamp(21px,3cqw,37px);height:clamp(21px,3cqw,37px);fill:none;stroke:currentColor;stroke-width:2.7;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 2px #000)}.is-disabled{filter:saturate(.35) brightness(.58)}.is-disabled .control.settings{filter:none}.control.active{color:var(--orange)}.control.active .button,.control.fire .button{border:2px solid var(--orange);color:var(--orange);box-shadow:0 0 19px #ff8a0055,0 8px 10px #000c,0 0 0 5px #080e12,0 0 0 6px #2a2116,inset 0 3px 4px #ffffff38,inset 0 -9px 12px #000d}.control.power:not(.active) .button{color:#88939d;border-color:#59636c;box-shadow:0 6px 10px #000c,0 0 0 5px #080e12,0 0 0 6px #1a2329,inset 0 3px 4px #ffffff15}.control.fire .button svg{fill:currentColor;stroke:currentColor;stroke-width:1.7}.control small{display:block;color:#9faab7;font-size:clamp(6px,.75cqw,11px);margin-top:2px}.control.active small{color:var(--orange)}

/* Reference-matched industrial dashboard skin (1.0.2). */
:host{--orange:#ff951f;--ink:#070d11;--steel:#53616a;--white:#f1f4f7}
ha-card{border-radius:var(--card-radius,27px);border:2px solid #344149;background:linear-gradient(145deg,#263238 0%,#111a20 16%,#080e12 62%,#1b252b 100%);box-shadow:0 24px 55px #000e,inset 0 2px #ffffff36,inset 0 -5px 18px #000,0 0 0 1px #06090b}
.device{padding:clamp(10px,calc(var(--frame-width,2.4) * 1cqw),36px) clamp(10px,calc(var(--frame-width,2.4) * 1cqw),36px) 0;border-radius:var(--card-radius,27px);background:linear-gradient(150deg,#18242a 0%,#0b1217 42%,#071015 78%,#1d282e 100%);box-shadow:inset 0 0 0 2px #05090b,inset 0 0 0 4px #ffffff0d,inset 0 0 25px #000}
.screen{flex:1 1 auto;border-radius:var(--screen-radius,clamp(14px,1.8cqw,28px));padding:clamp(12px,2.1cqw,32px) clamp(14px,2.3cqw,36px) clamp(10px,1.8cqw,28px);border:2px solid #52616a;background:radial-gradient(ellipse at 50% 38%,#1b272d 0%,#10191e 52%,#080f13 100%);box-shadow:inset 0 0 35px #000e,0 1px #ffffff30,0 0 0 6px #080d11,0 0 0 7px #3d4a52}
.screen:after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 18% 82%,#ffffff05 0 1px,transparent 2px),radial-gradient(circle at 83% 20%,#ffffff04 0 1px,transparent 2px);background-size:5px 5px;opacity:.32;mix-blend-mode:screen}
.group-header{padding:0 0 clamp(7px,1.1cqw,16px);min-height:clamp(36px,7cqw,105px)}
.brand .flame{color:#ff951f;font-size:clamp(24px,4.4cqw,68px);filter:drop-shadow(0 0 7px #ff8a0066)}
.brand b{font-size:clamp(18px,3cqw,44px);letter-spacing:1px;color:#f4f6f8}.brand small{font-size:clamp(10px,1.7cqw,25px);letter-spacing:2px;color:#ff951f}
.clock strong{font-size:clamp(28px,5.2cqw,78px);color:#f5f7fa;letter-spacing:2px}.clock{font-size:clamp(9px,1.4cqw,21px);color:#c9d2db}
.screen-grid{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr) minmax(0,1fr);gap:clamp(7px,2cqw,30px);align-items:center;flex:1;min-height:0}.screen-grid{position:relative;width:100%;height:100%}.group-climate{position:absolute;left:calc(50% + var(--climate-x,0) * 1%);top:calc(50% + var(--climate-y,0) * 1%);transform:translate(-50%,-50%) scale(var(--climate-s,1));transform-origin:center center}
.side{gap:clamp(4px,1cqw,16px)}
.metric{min-height:clamp(48px,7cqw,104px);padding:clamp(7px,1.2cqw,18px) 2px;border-bottom:1px solid #3e4a51;gap:clamp(7px,1.2cqw,18px)}
.metric label{font-size:clamp(9px,1.6cqw,24px);color:#d0d8df}.metric strong{font-size:clamp(16px,3.1cqw,46px);color:#f3f5f7}.metric em{font-size:.55em;color:#e8edf1}.metric-icon{width:clamp(24px,4.5cqw,68px);height:clamp(24px,4.5cqw,68px);color:#e9eef2}.weather-icon{color:#dce5ec}
.dial{width:min(100%,clamp(150px,34cqw,520px));background:conic-gradient(from 215deg,var(--orange) 0deg,#ffad35 96deg,var(--orange) 132deg,#4d5962 133deg,#4d5962 236deg,transparent 237deg);box-shadow:0 0 25px #ff8a0055,0 0 0 2px #10181c,inset 0 0 16px #000}
.dial:before{inset:9px;background:radial-gradient(circle at 50% 45%,#162229 0%,#0a1115 72%);box-shadow:inset 0 0 28px #000,0 0 0 1px #69757d,0 0 0 2px #0a0f12}
.dial:after{inset:15px;border:1px solid #526068;opacity:.8}
.dial-content{z-index:2}.dial .temp{font-size:clamp(34px,7.5cqw,110px);color:#f6f8fa;text-shadow:0 2px 6px #000}.dial .target{font-size:clamp(18px,3.6cqw,52px);color:#f6f8fa}
.scheme-title{font-size:clamp(10px,1.5cqw,22px);color:#cbd4db;letter-spacing:.5px}.scheme-card{padding:clamp(4px,.6cqw,12px) 0;background:none;border:0;box-shadow:none}.scheme-icon{width:clamp(38px,6.6cqw,100px);height:clamp(38px,6.6cqw,100px)}.scheme-card span{font-size:clamp(7px,1.2cqw,18px)}
.control-panel{margin-top:clamp(8px,1.5cqw,24px);padding:0 clamp(5px,3cqw,46px);align-items:center;background:linear-gradient(180deg,#10191e00,#080d11aa);border-radius:0 0 clamp(16px,2.4cqw,38px) clamp(16px,2.4cqw,38px)}
.control{font-size:clamp(8px,1.5cqw,22px);color:#b9c4cd;text-transform:uppercase}.control.active,.control.fire{color:var(--orange)}
.button{width:clamp(42px,8.4cqw,128px);height:clamp(42px,8.4cqw,128px);margin:0 auto clamp(3px,.6cqw,9px);border:2px solid #111a20;box-shadow:0 0 0 4px #05090c,0 0 0 5px #26333a,0 9px 14px #000c,inset 0 3px 5px #ffffff30,inset 0 -10px 15px #000;background:radial-gradient(circle at 35% 22%,#53616a 0%,#26333a 25%,#0b1216 68%);transform:scale(var(--panel-button-size,1));transform-origin:center}
.control.active .button,.control.fire .button{border-color:var(--orange);box-shadow:0 0 0 4px #05090c,0 0 0 5px #26333a,0 0 13px #ff8a0080,inset 0 3px 5px #ffffff30}.button svg{width:clamp(22px,3.7cqw,56px);height:clamp(22px,3.7cqw,56px)}
.flame-effect{inset:9px;width:auto;height:auto}
.dial .dial-label{margin-top:clamp(4px,.7cqw,10px);font-size:clamp(8px,1.45cqw,21px);letter-spacing:.2px;color:#dce4ea}.dial .target{margin-top:clamp(5px,1cqw,15px);font-size:clamp(8px,1.35cqw,20px);line-height:1.05;color:var(--orange);font-weight:500}.dial .target strong{display:block;margin-top:clamp(2px,.3cqw,5px);font-size:clamp(16px,3.2cqw,46px);color:#f6f8fa;font-weight:500}.dial .flame{font-size:clamp(18px,3.4cqw,50px);color:var(--orange)}
.center{justify-content:center;min-height:0;overflow:visible}.dial{width:min(100%,clamp(140px,29cqw,440px));flex:0 1 auto}.adjust{flex-shrink:0;margin-top:clamp(4px,.6cqw,9px)}
.center{position:relative}.adjust{position:absolute;left:50%;bottom:clamp(7px,1.4cqh,22px);margin:0;z-index:5;transform:translate(calc(-50% + var(--adjust-x,0) * 1cqw),calc(var(--adjust-y,0) * 1cqh)) scale(var(--adjust-s,1))}
.dial{width:min(100%,clamp(42px,29cqw,440px),calc(100cqh - 125px))}
.adjust{bottom:clamp(10px,2cqw,30px)}
/* 1.0.3: geometry of the climate dial is fixed and independent of the temperature typography */
ha-card{--dial-size:min(clamp(42px,29cqw,440px),calc(100cqh - 125px))}
.center.group-climate{width:var(--dial-size);min-width:var(--dial-size);max-width:var(--dial-size)}
.dial{flex:0 0 auto;aspect-ratio:auto;width:var(--dial-size);height:var(--dial-size);min-width:var(--dial-size);min-height:var(--dial-size);max-width:var(--dial-size);max-height:var(--dial-size)}
.dial-content{position:absolute;left:0;right:0;top:0;width:100%;height:auto;z-index:2}

    .group-climate{position:absolute;left:calc(50% + var(--climate-x,0) * 1%);top:calc(50% + var(--climate-y,0) * 1%);transform:translate(-50%,-50%) scale(var(--climate-s,1));transform-origin:center center}
.group-weather{grid-column:1}
.group-humidity{transform:translate(calc(var(--humidity-x,0) * 1cqw),calc(var(--humidity-y,0) * 1cqh)) scale(var(--humidity-s,1))}.screen-grid>.side:last-child{grid-column:3}
.screen-grid{position:static}
ha-card{--ui-scale:clamp(.01,min(calc(100cqw / 600px),calc(100cqh / (600px / var(--card-ratio,1.5)))),10)}.device{width:calc(100% / var(--ui-scale));height:calc(100% / var(--ui-scale));transform:scale(var(--ui-scale));transform-origin:top left;container-type:size}
<style data-layout-override>ha-card{aspect-ratio:var(--card-ratio,1.5);border-radius:var(--card-radius,27px);overflow:hidden}.screen{flex:1 1 0;min-height:0;aspect-ratio:auto}.screen-grid{position:relative;width:100%;height:100%;grid-template-columns:30% 40% 30%;grid-template-rows:100%;gap:0;align-items:center}</style><ha-card class="${enabled?'is-enabled':'is-disabled'}" style="--card-ratio:${cardRatio};--screen-ratio:${screenRatio};${groupVars}${itemVars}--room-letter-spacing:${roomLetterSpacing}px;--room-decimal-size:${roomDecimalSize};--room-unit-size:${roomUnitSize};--target-letter-spacing:${targetLetterSpacing}px;--target-decimal-size:${targetDecimalSize};--target-unit-size:${targetUnitSize};--target-unit-gap:${targetUnitGap}px;--adjust-icon-size:${adjustIconSize}px;--row-offset:${rowOffset};--card-radius:${cardRadius}px;--frame-width:${frameWidth};--header-inner-y:${n('header_inner_y')};--brand-group-x:${n('brand_group_x')};--brand-group-y:${n('brand_group_y')};--date-group-x:${n('date_group_x')};--date-group-y:${n('date_group_y')};--line-y:${n('line_y')};--adjust-gap:${adjustGap}px;--adjust-button-size:${buttonSize}px;--panel-h:${SH_CLAMP(this.config.panel_h,-20,40,SH_DEFAULTS.panel_h)};--effect-x:${n('effect_x')};--effect-y:${n('effect_y',-2)};--effect-s:${SH_CLAMP(n('effect_s'),.25,2.5,SH_DEFAULTS.effect_s)};--effect-opacity:${SH_CLAMP(n('effect_opacity'),.1,1,SH_DEFAULTS.effect_opacity)};--panel-gap:${SH_CLAMP(n('panel_gap'),0,20,SH_DEFAULTS.panel_gap)};--panel-button-size:${SH_CLAMP(n('panel_button_size'),.5,2,SH_DEFAULTS.panel_button_size)}"><div class="device"><section class="screen"><div class="header-shell"><div class="group-header"><div class="brand"><div class="flame brand-icon"><svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:#38bdf8;filter:drop-shadow(0 0 6px #0284c7)"><path d="M12 2C9.5 6 6 9 6 13.5 6 17.1 8.7 20 12 20s6-2.9 6-6.5C18 9 14.5 6 12 2Zm0 15.5c-1.7 0-3-1.3-3-3 0-1.8 1.5-3.2 3-5.5 1.5 2.3 3 3.7 3 5.5 0 1.7-1.3 3-3 3Z"/></svg></div><div class="brand-name"><b style="${isLabelOn('title')?'':'visibility:hidden'}">${this.safe(getLabel('title',this.config.title||'HEAT'))}</b><small style="${isLabelOn('subtitle')?'':'visibility:hidden'}">${this.safe(getLabel('subtitle','GAS BOILER'))}</small></div></div><div class="clock"><span class="date">${date}</span><strong class="clock-time">${time}</strong></div><span class="signal"><i></i><i></i><i></i><i></i></span></div><div class="line"></div></div><div class="screen-grid"><div class="side group-weather"><div class="metric element-outdoor" style="display:${outdoorVisible?'':'none'}"><div class="metric-icon weather-icon"><svg viewBox="0 0 32 32"><path d="M14 4a3 3 0 0 1 6 0v14.6a6 6 0 1 1-6 0Z"/><path d="M17 11v9.6"/><path d="M11 9h1.5M11 13h1.5M11 17h1.5"/></svg></div><div><label style="${isLabelOn('outdoor')?'':'visibility:hidden'}">${this.safe(getLabel('outdoor',tr('outdoor')))}</label><strong>${this.safe(outdoor)} <em>°C</em></strong></div></div><div class="metric element-wind" style="display:${windVisible?'':'none'}"><div class="metric-icon weather-icon"><svg viewBox="0 0 32 32"><path d="M3 11h16c3 0 3-5 0-5-1.4 0-2.4.7-3 1.8M3 16h22c4 0 4 6 0 6-1.7 0-2.8-.8-3.5-2M3 21h10"/></svg></div><div><label style="${isLabelOn('wind')?'':'visibility:hidden'}">${this.safe(getLabel('wind',tr('wind')))}</label><strong>${this.safe(wind)}</strong></div></div><div class="metric element-rain" style="display:${rainVisible?'':'none'}"><div class="metric-icon weather-icon"><svg viewBox="0 0 32 32">${rainIcon}</svg></div><div><label style="${isLabelOn('rain')?'':'visibility:hidden'}">${this.safe(getLabel('rain',tr('rain')))}</label><strong>${this.safe(rain)}</strong></div></div></div><div class="center group-climate"><div class="dial ${heating&&effectEnabled?'is-heating':''}"><div class="flame-effect ${heating&&effectEnabled?'is-active':''}"><div class="flame-layer"><svg viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true"><defs><radialGradient id="sh-blue-glow" cx="50%" cy="85%" r="70%"><stop offset="0%" stop-color="#00e5ff" stop-opacity="0.6"/><stop offset="30%" stop-color="#0066ff" stop-opacity="0.4"/><stop offset="70%" stop-color="#001a66" stop-opacity="0.15"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient><linearGradient id="sh-flame-outer" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stop-color="#002b80" stop-opacity="0.95"/><stop offset="25%" stop-color="#0055ff" stop-opacity="0.88"/><stop offset="65%" stop-color="#00bfff" stop-opacity="0.8"/><stop offset="100%" stop-color="#80e5ff" stop-opacity="0"/></linearGradient><linearGradient id="sh-flame-mid" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stop-color="#0066ff" stop-opacity="0.95"/><stop offset="35%" stop-color="#00d5ff" stop-opacity="0.9"/><stop offset="80%" stop-color="#80f2ff" stop-opacity="0.85"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></linearGradient><linearGradient id="sh-flame-inner" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stop-color="#00f0ff" stop-opacity="1"/><stop offset="45%" stop-color="#a6f8ff" stop-opacity="0.95"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.85"/></linearGradient></defs><rect width="200" height="200" fill="url(#sh-blue-glow)"/><path class="flame-outer" fill="url(#sh-flame-outer)" d="M100 200C45 200 15 160 25 120c8-25 32-45 45-72 15-28 14-48 30-48s15 20 30 48c13 27 37 47 45 72 10 40-20 80-75 80Z"/><path class="flame-mid" fill="url(#sh-flame-mid)" d="M100 195c-35 0-55-30-48-60 6-22 26-38 36-60 8-18 4-33 12-33s4 15 12 33c10 22 30 38 36 60 7 30-13 60-48 60Z"/><path class="flame-inner" fill="url(#sh-flame-inner)" d="M100 190c-20 0-32-18-28-36 4-14 18-24 24-38 5-10 1-18 4-18s-1 8 4 18c6 14 20 24 24 38 4 18-8 36-28 36Z"/></svg></div></div><div class="dial-content"><div class="temp"><span class="temp-int" style="display:${this.config.room_int_visible!==false?'':'none'}">${this.safe(roomInt)}</span><span class="temp-dec" style="display:${this.config.room_dec_visible!==false?'':'none'}">${roomDec?'.'+this.safe(roomDec):''}</span><sup class="temp-unit" style="display:${this.config.room_unit_visible!==false?'':'none'}">°C</sup></div><div class="target"><strong><span class="target-int">${this.safe(targetInt)}</span><span class="target-dec" style="display:${this.config.target_dec_visible!==false?'':'none'}">${targetDec?'.'+this.safe(targetDec):''}</span><span class="target-unit" style="display:${this.config.target_unit_visible!==false?'':'none'}">°C</span></strong></div></div></div><div class="adjust"><button data-delta="-0.5">−</button><button data-delta="0.5">+</button></div></div><div class="side"><div class="metric orange element-humidity group-humidity" style="display:${humidityVisible?'':'none'}"><div class="metric-icon">♢</div><div><label style="${isLabelOn('humidity')?'':'visibility:hidden'}">${this.safe(getLabel('humidity',tr('humidity')))}</label><strong class="humidity-value"><span class="humidity-int">${this.safe(String(humidity).split('.')[0])}</span><span class="humidity-dec">${String(humidity).includes('.')?'.'+String(humidity).split('.')[1]:''}</span><em class="humidity-unit">%</em></strong></div></div>${hasAnyContact ? `<div class="scheme-title element-scheme" style="${isLabelOn('scheme')?'':'visibility:hidden'}">${this.safe(getLabel('scheme',tr('scheme')))}</div><div class="scheme element-scheme" style="${hasContact1 && hasContact2 ? '' : 'grid-template-columns:1fr;'}">${hasContact1 ? `<div class="scheme-card ${contact1On?'active':''}" data-scheme-toggle="1" role="button" tabindex="0"><div class="scheme-header"><div class="scheme-badge"><span class="scheme-num">#1</span><span class="scheme-sub">ХА</span></div><div class="scheme-led"></div></div><div class="scheme-icon"><svg viewBox="0 0 24 24" class="contact-icon-svg"><path d="M9.6 14.6V5.4a2.4 2.4 0 1 1 4.8 0v9.2a4.7 4.7 0 1 1-4.8 0Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="17.6" r="1.8" fill="currentColor"/><path d="M12 12.4v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M17.6 8a4.6 4.6 0 0 1 0 5.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M20.4 5.6a8.4 8.4 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity="0.65"/></svg></div><span class="scheme-label" style="${isLabelOn('contact1')?'':'visibility:hidden'}">${getLabel('contact1',tr('contact1'))}</span></div>` : ''}${hasContact2 ? `<div class="scheme-card ${contact2On?'active':''}" data-scheme-toggle="2" role="button" tabindex="0"><div class="scheme-header"><div class="scheme-badge"><span class="scheme-num">#2</span><span class="scheme-sub">ТАЙМЕР</span></div><div class="scheme-led"></div></div><div class="scheme-icon"><svg viewBox="0 0 24 24" class="contact-icon-svg"><circle cx="12" cy="13" r="7.8" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="13" r="4.4" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/><path d="M12 9.2V13l2.9 1.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="13" r="1.2" fill="currentColor"/><path d="M9.4 2.6h5.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 2.6v2.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4.9 6.3 6.6 8M19.1 6.3 17.4 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></div><span class="scheme-label" style="${isLabelOn('contact2')?'':'visibility:hidden'}">${getLabel('contact2',tr('contact2'))}</span></div>` : ''}</div>` : ''}</div></div></section><nav class="control-panel group-panel"><div class="control power ${enabled?'active':''}" data-power><span class="button"><svg viewBox="0 0 24 24"><path d="M12 3v8m-5.7-5A9 9 0 1 0 17.7 6"/></svg></span><span class="control-label" style="${isLabelOn('power')?'':'visibility:hidden'}">${this.safe(getLabel('power',tr('power')))}</span></div><div class="control"><span class="button"><svg viewBox="0 0 24 24"><path d="M12 3c-1.6 4.5-5.3 5.5-5.3 9.2A5.3 5.3 0 0 0 12 17.5a5.3 5.3 0 0 0 5.3-5.3C17.3 8.5 13.6 7.5 12 3Z"/></svg></span><span class="control-label" style="${isLabelOn('program')?'':'visibility:hidden'}">${this.safe(getLabel('program',tr('program')))}</span></div><div class="control fire"><span class="button"><svg viewBox="0 0 24 24"><path d="M12 21c4 0 6.2-2.7 6.2-6.2 0-3.8-2.9-5.2-4.2-8.8-1.7 1.5-2.2 3-2 4.7-2.5-1.3-3.1-3.2-3-5.7C6.7 7.8 5.8 10.1 5.8 13.5 5.8 18.1 8.4 21 12 21Z"/></svg></span><small class="control-label" style="${(heating?isLabelOn('boiler'):isLabelOn('waiting'))?'':'visibility:hidden'}">${this.safe(heating?getLabel('boiler',tr('boiler')):getLabel('waiting',tr('waiting')))}</small></div><div class="control"><span class="button"><svg viewBox="0 0 24 24"><path d="M4 19v-5m5 5V9m5 10V5m5 14v-8"/></svg></span><span class="control-label" style="${isLabelOn('history')?'':'visibility:hidden'}">${this.safe(getLabel('history',tr('history')))}</span></div><div class="control settings"><span class="button"><svg viewBox="0 0 24 24"><path d="M12 2.8l1 2.1c.6.1 1.2.4 1.8.7l2.1-1 1.5 1.5-1 2.1c.3.6.6 1.2.7 1.8l2.1 1v2l-2.1 1c-.1.6-.4 1.2-.7 1.8l1 2.1-1.5 1.5-2.1-1c-.6.3-1.2.6-1.8.7l-1 2.1h-2l-1-2.1c-.6-.1-1.2-.4-1.8-.7l-2.1 1-1.5-1.5 1-2.1c-.3-.6-.6-1.2-.7-1.8l-2.1-1v-2l2.1-1c.1-.6.4-1.2.7-1.8l-1-2.1 1.5-1.5 2.1 1c.6-.3 1.2-.6 1.8-.7l1-2.1h2Z"/><circle cx="12" cy="12" r="3.2"/></svg></span><span class="control-label" style="${isLabelOn('settings')?'':'visibility:hidden'}">${this.safe(getLabel('settings',tr('settings')))}</span></div></nav></div>${this._confirmDialog?`<div class="modal-backdrop confirm-backdrop" style="z-index:1100"><section class="modal" tabindex="-1" style="max-width:380px"><button class="modal-close confirm-cancel">×</button><div class="modal-title" style="color:var(--orange)">${this._confirmDialog.title}</div><div style="margin:14px 0 10px;font-size:clamp(12px,1.2cqw,16px);line-height:1.45;color:#d8e2ea">${this._confirmDialog.message}</div><div style="margin:10px 0 18px;padding:9px 12px;background:#ff8a0015;border-left:3px solid var(--orange);border-radius:6px;font-size:clamp(11px,1.05cqw,14px);color:#ffaa44;line-height:1.4">${this._confirmDialog.impact}</div><div style="display:flex;gap:10px;justify-content:flex-end;margin-top:14px"><button class="confirm-cancel" style="padding:8px 16px;border-radius:8px;border:1px solid #4f5d68;background:#182228;color:#c8d2dc;cursor:pointer;font-weight:600">Скасувати</button><button class="confirm-ok" style="padding:8px 18px;border-radius:8px;border:none;background:var(--orange);color:#0a1014;cursor:pointer;font-weight:700">Підтвердити</button></div></section></div>`:''}${this._menuOpen?`<div class="modal-backdrop"><section class="modal" tabindex="-1"><button class="modal-close">×</button><div class="modal-title">${tr('settings')}</div><div class="tabs">
<div class="menu-section ${tab==='hysteresis'?'open':''}"><button data-menu-section="hysteresis" class="menu-head"><span>∿</span><b>${tr('hysteresis')}</b><i>${tab==='hysteresis'?'▲':'▼'}</i></button>${tab==='hysteresis'?`<div class="menu-body">
<div class="sh-hyst-group">
  <div class="sh-hyst-label"><span>${tr('hysteresis_on')}</span><span class="sh-hyst-val">${Number(currentHOn).toFixed(1)} °C</span></div>
  <div class="sh-hyst-desc">${tr('hyst_on_desc')}</div>
  <div class="sh-hyst-controls">
    <button class="sh-step-btn" data-hyst-step="on" data-step="-0.1">−</button>
    <input type="range" class="sh-slider" data-hyst-slider="on" min="0" max="5" step="0.1" value="${Number(currentHOn).toFixed(1)}" />
    <button class="sh-step-btn" data-hyst-step="on" data-step="0.1">+</button>
  </div>
</div>
<div class="sh-hyst-group">
  <div class="sh-hyst-label"><span>${tr('hysteresis_off')}</span><span class="sh-hyst-val">${Number(currentHOff).toFixed(1)} °C</span></div>
  <div class="sh-hyst-desc">${tr('hyst_off_desc')}</div>
  <div class="sh-hyst-controls">
    <button class="sh-step-btn" data-hyst-step="off" data-step="-0.1">−</button>
    <input type="range" class="sh-slider" data-hyst-slider="off" min="0" max="5" step="0.1" value="${Number(currentHOff).toFixed(1)}" />
    <button class="sh-step-btn" data-hyst-step="off" data-step="0.1">+</button>
  </div>
</div>
</div>`:''}</div>
<div class="menu-section ${tab==='language'?'open':''}"><button data-menu-section="language" class="menu-head"><span>文</span><b>${tr('language')}</b><i>${tab==='language'?'▲':'▼'}</i></button>${tab==='language'?`<div class="menu-body"><div class="popup-choice"><button data-popup-lang="uk" class="${lang==='uk'?'active':''}">Українська</button><button data-popup-lang="en" class="${lang==='en'?'active':''}">English</button></div></div>`:''}</div>
<div class="menu-section ${tab==='labels'?'open':''}"><button data-menu-section="labels" class="menu-head"><span>✎</span><b>${tr('labels')}</b><i>${tab==='labels'?'▲':'▼'}</i></button>${tab==='labels'?`<div class="menu-body">
<p style="margin:0 0 12px;font-size:11px;color:#9aa9b7;line-height:1.4">${tr('labels_hint')}</p>
<div class="sh-labels-list">
  ${[
    {key:'title',title:tr('lbl_title'),def:this.config.title||'HEAT'},
    {key:'subtitle',title:tr('lbl_subtitle'),def:'GAS BOILER'},
    {key:'outdoor',title:tr('lbl_outdoor'),def:tr('outdoor')},
    {key:'wind',title:tr('lbl_wind'),def:tr('wind')},
    {key:'rain',title:tr('lbl_rain'),def:tr('rain')},
    {key:'humidity',title:tr('lbl_humidity'),def:tr('humidity')},
    {key:'scheme',title:tr('lbl_scheme'),def:tr('scheme')},
    {key:'contact1',title:tr('lbl_contact1'),def:tr('contact1')},
    {key:'contact2',title:tr('lbl_contact2'),def:tr('contact2')},
    {key:'power',title:tr('lbl_power'),def:tr('power')},
    {key:'program',title:tr('lbl_program'),def:tr('program')},
    {key:'boiler',title:tr('lbl_boiler'),def:tr('boiler')},
    {key:'waiting',title:tr('lbl_waiting'),def:tr('waiting')},
    {key:'history',title:tr('lbl_history'),def:tr('history')},
    {key:'settings',title:tr('lbl_settings'),def:tr('settings')}
  ].map(it=>`<div class="sh-field-row">
    <div class="sh-field-header">
      <span>${it.title}</span>
      <button class="sh-toggle-btn ${isLabelOn(it.key)?'on':''}" data-label-toggle="${it.key}" type="button" title="${isLabelOn(it.key)?'Приховати підпис':'Показати підпис'}"><span class="sh-toggle-knob"></span></button>
    </div>
    <div class="sh-field-controls">
      <input type="text" class="sh-field-input" data-label-input="${it.key}" value="${this.safe(customLabels[it.key]||'')}" placeholder="${this.safe(String(it.def).replace(/<[^>]+>/g,' '))}" />
    </div>
  </div>`).join('')}
</div>
<button class="sh-reset-btn" data-reset-labels type="button">${tr('reset_labels')}</button>
</div>`:''}</div>
</div></section></div>`:''}</ha-card>`;
    const root=this.shadowRoot;
    const closeMenu=()=>{this._menuOpen=false;this.render()};
    root.querySelector('[data-power]')?.addEventListener('click',()=>this._hass.callService('climate','set_hvac_mode',{entity_id:this.config.entity,hvac_mode:enabled?'off':'heat'}));
    root.querySelector('.control.settings')?.addEventListener('click',()=>{this._menuTab='';this._menuOpen=true;this.render()});
    root.querySelector('[data-scheme-toggle="1"]')?.addEventListener('click', () => {
      const willBeOn = !contact1On;
      const impact = willBeOn 
        ? (contact2On ? 'Обидва контакти активні: термостат керує Контактом 1, а старий програматор працює паралельно через Контакт 2.' : 'Активний тільки Блок 1: котел керується за датчиком температури та гістерезисом.')
        : (contact2On ? 'Блок 1 вимкнено. Керування здійснюється тільки старим програматором через Контакт 2.' : 'Обидва блоки вимкнені: режим очікування, котел не запускається.');
      this._confirmDialog = {
        title: willBeOn ? 'Увімкнення Контакту 1' : 'Вимкнення Контакту 1',
        message: willBeOn 
          ? 'Увімкнути Контакт 1 (автоматичний термостат)? Котел працюватиме за температурою та гістерезисом.'
          : 'Вимкнути Контакт 1 (автоматичний термостат)? Автоматичне керування за температурою буде вимкнено.',
        impact: impact,
        action: () => {
          this._visualContact1 = willBeOn;
          SH_WRITE_STORE('visual_contact_1', willBeOn);
          this._hass.callService('smart_heating', 'set_contact', { entity_id: this.config.entity, contact_1: willBeOn });
        }
      };
      this.render();
    });

    root.querySelector('[data-scheme-toggle="2"]')?.addEventListener('click', () => {
      const willBeOn = !contact2On;
      const impact = willBeOn 
        ? (contact1On ? 'Обидва контакти активні: старий програматор працює паралельно з автоматичним термостатом.' : 'Активний тільки Блок 2: котел керується виключно зовнішнім програматором, автоматика в режимі очікування.')
        : (contact1On ? 'Контакт 2 вимкнено. Керування тільки за автоматикою Контакту 1.' : 'Обидва блоки вимкнені: режим очікування, котел не запускається.');
      this._confirmDialog = {
        title: willBeOn ? 'Увімкнення Контакту 2' : 'Вимкнення Контакту 2',
        message: willBeOn 
          ? 'Підключити лінію старого програматора через Контакт 2?'
          : 'Відключити лінію старого програматора (Контакт 2)?',
        impact: impact,
        action: () => {
          this._visualContact2 = willBeOn;
          SH_WRITE_STORE('visual_contact_2', willBeOn);
          this._hass.callService('smart_heating', 'set_contact', { entity_id: this.config.entity, contact_2: willBeOn });
        }
      };
      this.render();
    });

    root.querySelectorAll('.confirm-cancel').forEach(btn => btn.addEventListener('click', () => {
      this._confirmDialog = null;
      this.render();
    }));

    root.querySelector('.confirm-ok')?.addEventListener('click', () => {
      const act = this._confirmDialog?.action;
      this._confirmDialog = null;
      if (act) act();
      this.render();
    });

    root.querySelector('.modal-close')?.addEventListener('click',closeMenu);
    root.querySelector('.modal-backdrop')?.addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))closeMenu()});
    root.querySelector('.modal-backdrop')?.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
    root.querySelector('.modal')?.focus?.({preventScroll:true});
    if(_menuEl===null&&_tabsEl!==null){_tabsEl.scrollTop=_tabsScroll;}else if(_menuEl!==null){_menuEl.scrollTop=_menuScroll;const t=this.shadowRoot.querySelector('.tabs');if(t)t.scrollTop=_tabsScroll;}
    root.querySelectorAll('[data-menu-section]').forEach(b=>b.addEventListener('click',()=>{this._menuTab=this._menuTab===b.dataset.menuSection?'':b.dataset.menuSection;this.render()}));
    root.querySelectorAll('[data-popup-lang]').forEach(b=>b.addEventListener('click',()=>{SH_WRITE_STORE(SH_LANG_KEY,b.dataset.popupLang);this.config={...this.config,language:b.dataset.popupLang};this.render()}));
    const applyHyst=(onVal,offVal)=>{
      const newOn=Math.min(5,Math.max(0,Number(Number(onVal).toFixed(1))));
      const newOff=Math.min(5,Math.max(0,Number(Number(offVal).toFixed(1))));
      this._hass.callService('smart_heating','set_hysteresis',{entity_id:this.config.entity,hysteresis_on:newOn,hysteresis_off:newOff});
    };
    root.querySelectorAll('[data-hyst-slider="on"]').forEach(sl=>sl.addEventListener('input',e=>applyHyst(e.target.value,currentHOff)));
    root.querySelectorAll('[data-hyst-slider="off"]').forEach(sl=>sl.addEventListener('input',e=>applyHyst(currentHOn,e.target.value)));
    root.querySelectorAll('[data-hyst-step]').forEach(btn=>btn.addEventListener('click',()=>{
      const which=btn.dataset.hystStep;
      const step=Number(btn.dataset.step)||0.1;
      if(which==='on')applyHyst(Number(currentHOn)+step,currentHOff);
      else applyHyst(currentHOn,Number(currentHOff)+step);
    }));
    root.querySelectorAll('[data-label-input]').forEach(inp=>{
      inp.addEventListener('input',e=>{
        const key=inp.dataset.labelInput;
        const cur=SH_GET_STORE_JSON('smart_heating_labels');
        cur[key]=e.target.value;
        SH_SET_STORE_JSON('smart_heating_labels',cur);
      });
      inp.addEventListener('blur',()=>this.render());
    });
    const updateLabelVis=(key,visible)=>{
      const visVal=visible?'':'hidden';
      if(key==='title'){const el=root.querySelector('.brand-name b');if(el)el.style.visibility=visVal;}
      else if(key==='subtitle'){const el=root.querySelector('.brand-name small');if(el)el.style.visibility=visVal;}
      else if(key==='outdoor'){const el=root.querySelector('.element-outdoor label');if(el)el.style.visibility=visVal;}
      else if(key==='wind'){const el=root.querySelector('.element-wind label');if(el)el.style.visibility=visVal;}
      else if(key==='rain'){const el=root.querySelector('.element-rain label');if(el)el.style.visibility=visVal;}
      else if(key==='humidity'){const el=root.querySelector('.element-humidity label');if(el)el.style.visibility=visVal;}
      else if(key==='scheme'){const el=root.querySelector('.scheme-title.element-scheme');if(el)el.style.visibility=visVal;}
      else if(key==='contact1'){const el=root.querySelector('[data-scheme-toggle="1"] .scheme-label');if(el)el.style.visibility=visVal;}
      else if(key==='contact2'){const el=root.querySelector('[data-scheme-toggle="2"] .scheme-label');if(el)el.style.visibility=visVal;}
      else if(key==='power'){const el=root.querySelector('.control.power .control-label');if(el)el.style.visibility=visVal;}
      else if(key==='program'){const els=root.querySelectorAll('.control .control-label');if(els[1])els[1].style.visibility=visVal;}
      else if(key==='boiler'||key==='waiting'){const el=root.querySelector('.control.fire .control-label');if(el)el.style.visibility=visVal;}
      else if(key==='history'){const els=root.querySelectorAll('.control .control-label');if(els[3])els[3].style.visibility=visVal;}
      else if(key==='settings'){const el=root.querySelector('.control.settings .control-label');if(el)el.style.visibility=visVal;}
    };
    root.querySelectorAll('[data-label-toggle]').forEach(btn=>btn.addEventListener('click',e=>{
      e.stopPropagation();
      const key=btn.dataset.labelToggle;
      const cur=SH_GET_STORE_JSON('smart_heating_labels_visible');
      const nowVis=!(cur[key]!==false);
      cur[key]=nowVis;
      SH_SET_STORE_JSON('smart_heating_labels_visible',cur);
      if(nowVis){btn.classList.add('on');btn.title='Приховати підпис';}
      else{btn.classList.remove('on');btn.title='Показати підпис';}
      updateLabelVis(key,nowVis);
    }));
    root.querySelector('[data-reset-labels]')?.addEventListener('click',()=>{
      SH_SET_STORE_JSON('smart_heating_labels',{});
      SH_SET_STORE_JSON('smart_heating_labels_visible',{});
      this.render();
    });
    const tabsContainer=root.querySelector('.tabs');
    if(tabsContainer){
      let isDown=false,startY=0,scrollTop=0;
      tabsContainer.addEventListener('mousedown',e=>{
        if(e.target.closest('input,button,.sh-toggle-btn,.menu-head,.popup-choice'))return;
        isDown=true;startY=e.pageY-tabsContainer.offsetTop;scrollTop=tabsContainer.scrollTop;
      });
      window.addEventListener('mouseup',()=>{isDown=false;});
      tabsContainer.addEventListener('mousemove',e=>{
        if(!isDown)return;
        e.preventDefault();
        const y=e.pageY-tabsContainer.offsetTop;
        tabsContainer.scrollTop=scrollTop-(y-startY)*1.2;
      });
    }
    root.querySelectorAll('.adjust button').forEach(b=>b.addEventListener('click',()=>{
      const current=Number(target);if(!Number.isFinite(current))return;
      const step=Number(a.target_temp_step)||Math.abs(Number(b.dataset.delta))||.5;
      const min=Number.isFinite(Number(a.min_temp))?Number(a.min_temp):5,max=Number.isFinite(Number(a.max_temp))?Number(a.max_temp):35;
      const next=Math.min(max,Math.max(min,current+Math.sign(Number(b.dataset.delta))*step));
      if(next!==current)this._hass.callService('climate','set_temperature',{entity_id:this.config.entity,temperature:Number(next.toFixed(2))});
    }));
  }
}
if(!customElements.get('smart-heating-card'))customElements.define('smart-heating-card',SmartHeatingCard);
/* Ukrainian labels are the source strings; the map below provides the English UI. */
const SH_EDITOR_EN = {
  'Налаштування блоків': 'Block settings', 'ОСНОВНЕ': 'GENERAL', 'РОЗКЛАДКА': 'LAYOUT', 'ШАПКА': 'HEADER',
  'КЛІМАТ': 'CLIMATE', 'ВОЛОГІСТЬ': 'HUMIDITY', 'ПОГОДА': 'WEATHER', 'КЕРУВАННЯ': 'CONTROL',
  'ПАНЕЛЬ': 'PANEL', 'ВІЗУАЛЬНІ ЕФЕКТИ': 'VISUAL EFFECTS',
  'Назва пристрою': 'Device name', 'Ентіті пристрою': 'Device entity', 'Мова інтерфейсу': 'Interface language',
  'Пропорція картки (Шир/Вис)': 'Card ratio (W/H)', 'Заокруглення картки': 'Card corner radius', 'Ширина рамки екрана': 'Screen frame width',
  'Вертикальний зсув рядка': 'Content row offset',
  'Горизонталь': 'Horizontal position', 'Вертикаль': 'Vertical position', 'Розмір': 'Size',
  'Зсув по X': 'Offset X', 'Зсув по Y': 'Offset Y', 'Зсув лінії': 'Divider offset',
  'Назва та іконка': 'Name and icon', 'Назва': 'Name', 'Іконка': 'Icon',
  'Дата і поточний час': 'Date and current time', 'Дата': 'Date', 'Поточний час': 'Current time',
  'Рівень сигналу': 'Signal level',
  'Група шапки': 'Header group', 'Група погоди': 'Weather group', 'Група клімату': 'Climate group',
  'Група нижньої панелі': 'Bottom panel group',
  'Центральне коло': 'Center dial', 'Поточна температура': 'Current temperature',
  'Цільова температура': 'Target temperature', 'Кнопки −/+': '−/+ buttons',
  'Ціла частина температури': 'Temperature integer', 'Десяткова частина температури': 'Temperature decimal',
  'Одиниця температури': 'Temperature unit', 'Відстань між цифрами': 'Digit spacing',
  'Розмір десяткової частини': 'Decimal size', 'Розмір знаку температури': 'Unit size',
  'Відстань до знаку': 'Gap before unit', 'Відстань між кнопками': 'Button spacing',
  'Розмір іконок кнопок': 'Button icon size', 'Діаметр кнопок': 'Button diameter',
  'Вологість в кімнаті': 'Room humidity', 'Показувати вологість': 'Show humidity',
  'Ціла частина вологості': 'Humidity integer', 'Десяткова частина вологості': 'Humidity decimal',
  'Знак відсотка': 'Percent sign',
  'Температура на вулиці': 'Outdoor temperature', 'Вітер': 'Wind', 'Опади': 'Precipitation',
  'Показувати температуру на вулиці': 'Show outdoor temperature', 'Показувати вітер': 'Show wind',
  'Показувати опади': 'Show precipitation',
  'Ентіті температури на вулиці': 'Outdoor temperature entity', 'Ентіті вітру': 'Wind entity',
  'Ентіті опадів': 'Precipitation entity', 'Ентіті вологості': 'Humidity entity',
  'Підключення': 'Connection', 'неактивно': 'inactive',
  'Висота панелі': 'Panel height', 'Розмір кнопок': 'Button size',
  'Анімоване полум’я': 'Animated flame', 'Анімація під час роботи котла': 'Boiler animation',
  'Прозорість ефекту': 'Effect opacity', 'Увімкнено': 'Enabled', 'Вимкнено': 'Disabled',
};
class SmartHeatingCardEditor extends HTMLElement {
  setConfig(config){this.config={...config};if(this._dragging)return;if(!this._open)this._open=this._restoreOpen();this.render()}
  set hass(hass){this._hass=hass;if(this._dragging)return;this.render()}
  _restoreOpen(){const fallback={general:true,layout:false,header:false,climate:false,humidity:false,weather:false,connection:false,panel:false,effects:false};try{return {...fallback,...JSON.parse(SH_READ_STORE(SH_OPEN_KEY)||'{}')}}catch(error){return fallback}}
  _emit(){this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:{...this.config}},bubbles:true,composed:true}))}
  _set(k,v){const value=typeof v==='number'?(Number.isFinite(v)?v:(this.config[k]??0)):v;this.config={...this.config,[k]:value};this._emit()}
  _toggleSection(k){if(k==='connection'&&!this._hasAnyContact())return;this._open[k]=!this._open[k];SH_WRITE_STORE(SH_OPEN_KEY,JSON.stringify(this._open));this.render()}
  _ui(value){return (this.config?.language||'en')==='en'?(SH_EDITOR_EN[value]||value):value}
  _default(key,fallback){return Object.prototype.hasOwnProperty.call(SH_DEFAULTS,key)?SH_DEFAULTS[key]:fallback}
  _field(label,id,value,placeholder=''){return `<div class="field"><label>${this._ui(label)}</label><input id="${id}" type="text" value="${value??''}" placeholder="${placeholder}"></div>`}
  /* One slider row: −/+ steppers, range, live value and a reset-to-default button. */
  _ctrl(label,key,{min=-100,max=100,step=.5,unit='%',fallback=0}={}){
    const defaultValue=this._default(key,fallback);
    const value=Number.isFinite(Number(this.config[key]))?Number(this.config[key]):defaultValue;
    const digits=step<1?2:0;
    return `<div class="control-row"><span>${this._ui(label)}</span><div class="control-line"><button data-step="${key}" data-delta="-${step}">−</button><input id="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-default="${defaultValue}" data-unit="${unit}" data-digits="${digits}"><button data-step="${key}" data-delta="${step}">+</button><strong id="${key}-value">${Number(value).toFixed(digits)}${unit}</strong><button class="reset-control" type="button" data-reset="${key}" title="Reset" aria-label="Reset ${this._ui(label)}">↺</button></div></div>`;
  }
  _toggle(label,key){const on=this.config[key]!==false;return `<div class="field switch-row"><label>${this._ui(label)}</label><button class="toggle ${on?'on':''}" data-visibility-toggle="${key}" role="switch" aria-checked="${on}"><span></span><b>${on?this._ui('Увімкнено'):this._ui('Вимкнено')}</b></button></div>`}
  /* Horizontal / vertical / size trio shared by every positionable block. */
  _place(prefix){return this._ctrl('Горизонталь',prefix+'_x',{min:-100,max:100,step:.5,unit:'%'})+this._ctrl('Вертикаль',prefix+'_y',{min:-100,max:100,step:.5,unit:'%'})+this._ctrl('Розмір',prefix+'_s',{min:.25,max:4,step:.01,unit:'',fallback:1})}
  _block(title,body){return `<div class="element"><b>${this._ui(title)}</b>${body}</div>`}
  _element(title,prefix){return this._block(title,this._place(prefix))}
  _hasAnyContact(){const c=this._hass?.states?.[this.config?.entity];const a=c?.attributes||{};return Boolean(a.switch_1||this.config?.switch_1||a.switch_2||this.config?.switch_2);}
  _section(id,icon,title,body,disabled=false){const isOpen=!disabled&&Boolean(this._open[id]);return `<section class="accordion ${isOpen?'open':''} ${disabled?'disabled':''}"><button class="section-head" data-section="${id}" ${disabled?'disabled style="opacity:0.4;cursor:not-allowed;"':''}><span class="section-icon">${icon}</span><span class="section-title">${this._ui(title)}${disabled?` (${this._ui('неактивно')})`:''}</span><span class="section-arrow">${disabled?'—':(isOpen?'▲':'▼')}</span></button>${isOpen?`<div class="section-body">${body}</div>`:''}</section>`}
  render(){
    if(!this.shadowRoot)this.attachShadow({mode:'open'});
    if(!this._hass||!this.config)return;
    if(!this._open)this._open=this._restoreOpen();
    const c=this.config,lang=c.language||'en';
    const general=`<div class="field"><label>${this._ui('Ентіті пристрою')}</label><ha-entity-picker id="entity"></ha-entity-picker></div>`;
    const layout=this._ctrl('Пропорція картки (Шир/Вис)','screen_aspect_ratio',{min:1.2,max:2.5,step:.05,unit:''})
      +this._ctrl('Заокруглення картки','card_radius',{min:0,max:100,step:1,unit:'px'})
      +this._ctrl('Вертикальний зсув рядка','row_offset_y',{min:-100,max:140,step:.5,unit:'%'})
      +this._ctrl('Ширина рамки екрана','frame_width',{min:0,max:8,step:.1,unit:''});
    const header=this._ctrl('Зсув по Y','header_inner_y',{min:-100,max:100,step:.5,unit:'%'})
      +this._block('Назва та іконка',this._ctrl('Зсув по X','brand_group_x',{min:-100,max:100,step:.5,unit:'%'})+this._ctrl('Зсув по Y','brand_group_y',{min:-100,max:100,step:.5,unit:'%'})+this._element('Назва','brand')+this._element('Іконка','brand_icon'))
      +this._block('Дата і поточний час',this._ctrl('Зсув по X','date_group_x',{min:-100,max:100,step:.5,unit:'%'})+this._ctrl('Зсув по Y','date_group_y',{min:-100,max:100,step:.5,unit:'%'})+this._element('Дата','date')+this._element('Поточний час','clock'))
      +this._element('Рівень сигналу','signal')
      +this._ctrl('Зсув лінії','line_y',{min:-40,max:40,step:.5,unit:'%'});
    const climate=this._element('Група клімату','climate')
      +this._element('Центральне коло','dial')
      +this._block('Поточна температура',this._place('room')+this._toggle('Десяткова частина температури','room_dec_visible')+this._ctrl('Розмір десяткової частини','room_decimal_size',{min:.25,max:2.5,step:.05,unit:''})+this._toggle('Одиниця температури','room_unit_visible')+this._ctrl('Розмір знаку температури','room_unit_size',{min:.25,max:2.5,step:.05,unit:''})+this._ctrl('Відстань між цифрами','room_letter_spacing',{min:-12,max:8,step:.5,unit:'px'}))
      +this._block('Цільова температура',this._place('target')+this._toggle('Десяткова частина температури','target_dec_visible')+this._ctrl('Розмір десяткової частини','target_decimal_size',{min:.25,max:2.5,step:.05,unit:''})+this._toggle('Одиниця температури','target_unit_visible')+this._ctrl('Розмір знаку температури','target_unit_size',{min:.25,max:2.5,step:.05,unit:''})+this._ctrl('Відстань між цифрами','target_letter_spacing',{min:-12,max:8,step:.5,unit:'px'})+this._ctrl('Відстань до знаку','target_unit_gap',{min:0,max:40,step:1,unit:'px'}))
      +this._block('Кнопки −/+',this._place('adjust')+this._ctrl('Відстань між кнопками','adjust_gap',{min:18,max:180,step:1,unit:'px'})+this._ctrl('Діаметр кнопок','adjust_button_size',{min:48,max:86,step:1,unit:'px'})+this._ctrl('Розмір іконок кнопок','adjust_icon_size',{min:12,max:100,step:1,unit:'px'}))
      +this._block('Вологість в кімнаті',this._toggle('Показувати вологість','humidity_visible')+this._place('humidity'));
    const weather=this._element('Група погоди','weather')
      +this._block('Температура на вулиці',this._toggle('Показувати температуру на вулиці','outdoor_visible')+this._place('outdoor'))
      +this._block('Вітер',this._toggle('Показувати вітер','wind_visible')+this._place('wind'))
      +this._block('Опади',this._toggle('Показувати опади','rain_visible')+this._place('rain'));
    const connection = this._element('Підключення','scheme');
    const panel=this._element('Група нижньої панелі','panel')
      +this._ctrl('Розмір кнопок','panel_button_size',{min:.5,max:2,step:.05,unit:'',fallback:1})
      +this._ctrl('Висота панелі','panel_h',{min:-20,max:40,step:1,unit:'%'})
      +this._ctrl('Відстань між кнопками','panel_gap',{min:0,max:20,step:.25,unit:'%'});
    const effects=this._toggle('Анімація під час роботи котла','effect_enabled')
      +this._ctrl('Прозорість ефекту','effect_opacity',{min:.1,max:1,step:.05,unit:''})
      +this._element('Анімоване полум’я','effect');
    this.shadowRoot.innerHTML=`<style>:host{display:block;width:100%;max-width:100%;color:var(--primary-text-color);font-family:Arial,sans-serif}.editor{box-sizing:border-box;width:100%;padding:10px;border:1px solid var(--divider-color);border-radius:14px;background:linear-gradient(145deg,#18242a,#0b1216);box-shadow:0 8px 24px #0002}.editor-title{padding:7px 10px 12px;color:#ffae42;font-size:14px;font-weight:700;letter-spacing:1px}.editor-title small{display:block;margin-top:3px;color:#7e8b98;font-size:10px;font-weight:400;letter-spacing:.5px}.accordion{margin:7px 0;border:1px solid #ffffff18;border-radius:10px;overflow:hidden;background:#ffffff05}.accordion.open{border-color:#ff941855}.section-head{display:flex;width:100%;align-items:center;gap:10px;padding:13px 12px;border:0;background:linear-gradient(90deg,#152127,#0d1519);color:#cbd5df;text-align:left;cursor:pointer}.section-icon{width:22px;color:#ffae42;font-size:17px;text-align:center}.section-title{flex:1;font-size:12px;font-weight:700}.section-arrow{color:#ffae42;font-size:10px}.section-body{display:flex;flex-direction:column;gap:12px;padding:13px;background:#071014}.element{padding:10px;border:1px solid #ffffff14;border-radius:8px;background:#ffffff05}.element>b{display:block;margin-bottom:8px;color:#ffae42;font-size:11px}.element .element{margin-top:8px;background:#ffffff08}.field{display:grid;gap:5px}.field label{color:#b8c3cf;font-size:11px}input{box-sizing:border-box;width:100%;padding:8px;border:1px solid #ffffff22;border-radius:7px;background:#050b0e;color:#e6edf4;font:inherit;font-size:12px}.control-row{display:grid;gap:4px;margin:7px 0;color:#aebac6;font-size:10px}.control-line{display:grid;grid-template-columns:27px minmax(0,1fr) 27px 64px 25px;gap:5px;align-items:center}.control-line button{height:25px;border:1px solid #ff941866;border-radius:6px;background:#ff941812;color:#ffae42;font-size:17px;cursor:pointer}.control-line input{padding:0;accent-color:#ff9418}.control-line strong{color:#ffae42;text-align:right;font-size:10px}.control-line .reset-control{width:25px;padding:0;border-color:#ffffff22;color:#9aa8b5;font-size:14px}.control-line .reset-control:hover{border-color:#ff9418;color:#ffae42}.choices{display:flex;gap:6px;flex-wrap:wrap}.choices button{flex:1;min-width:90px;padding:9px 7px;border:1px solid #ffffff20;border-radius:7px;background:#ffffff08;color:#b9c4d0;font-size:11px;cursor:pointer}.choices button.active{border-color:#ff9418;color:#ffae42;background:#ff941815}.switch-row{display:flex;align-items:center;justify-content:space-between;gap:10px}.switch-row .toggle{margin-left:auto}.toggle{display:inline-flex;align-items:center;gap:7px;border:1px solid #ffffff22;border-radius:999px;padding:4px 9px 4px 4px;background:#ffffff08;color:#9aa8b5;cursor:pointer;font-size:10px}.toggle span{width:20px;height:20px;border-radius:50%;background:#65727c;box-shadow:inset 0 1px #fff4}.toggle.on{border-color:#ff9418;color:#ffae42}.toggle.on span{background:#ff9418;box-shadow:0 0 8px #ff9418}ha-entity-picker{display:block;min-height:40px}@media(max-width:480px){.editor{padding:6px}.section-body{padding:10px}.control-line{grid-template-columns:24px minmax(0,1fr) 24px 42px 25px}.choices button{min-width:75px;font-size:10px}}
</style><div class="editor"><div class="editor-title">SMART HEATING — ${this._ui('Налаштування блоків')}<small>v${SH_VERSION}</small></div>${this._section('general','◉','ОСНОВНЕ',general)}${this._section('layout','▤','РОЗКЛАДКА',layout)}${this._section('header','◒','ШАПКА',header)}${this._section('climate','♨','КЛІМАТ',climate)}${this._section('weather','☁','ПОГОДА',weather)}${this._section('connection','⌘','КЕРУВАННЯ',connection,!this._hasAnyContact())}${this._section('panel','▣','ПАНЕЛЬ',panel)}${this._section('effects','✦','ВІЗУАЛЬНІ ЕФЕКТИ',effects)}</div>`;
    this._bind();
  }
  _bind(){
    const root=this.shadowRoot;
    const picker=root.getElementById('entity');
    if(picker){picker.hass=this._hass;picker.value=this.config.entity||'';picker.includeDomains=['climate'];picker.addEventListener('value-changed',e=>this._set('entity',e.detail.value))}
    root.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>this._toggleSection(b.dataset.section));
    root.querySelectorAll('input:not([type=range])').forEach(el=>el.addEventListener('change',()=>this._set(el.id,el.value)));
    root.querySelectorAll('input[type=range]').forEach(el=>{
      const commit=()=>{const min=Number(el.min),max=Number(el.max),step=Number(el.step)||1,raw=Number(el.value);let value=Number.isFinite(raw)?Math.max(min,Math.min(max,raw)):min;value=Number((Math.round((value-min)/step)*step+min).toFixed(6));el.value=String(value);this._set(el.id,value);this._update(el)};
      el.addEventListener('pointerdown',event=>{this._dragging=true;el.setPointerCapture?.(event.pointerId)});
      ['pointerup','pointercancel','lostpointercapture'].forEach(type=>el.addEventListener(type,()=>{this._dragging=false}));
      el.addEventListener('input',commit);
      el.addEventListener('change',commit);
    });
    root.querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>{const el=root.getElementById(b.dataset.reset);if(!el)return;el.value=el.dataset.default??el.defaultValue;el.dispatchEvent(new Event('input',{bubbles:true}))});
    root.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const el=root.getElementById(b.dataset.step);if(!el)return;const min=Number(el.min),max=Number(el.max),delta=Number(b.dataset.delta)||0,raw=Number(el.value);const current=Number.isFinite(raw)?raw:min;el.value=String(Number(Math.max(min,Math.min(max,current+delta)).toFixed(6)));el.dispatchEvent(new Event('input',{bubbles:true}))});
    root.querySelectorAll('[data-visibility-toggle]').forEach(b=>b.addEventListener('click',()=>this._set(b.dataset.visibilityToggle,!(this.config[b.dataset.visibilityToggle]!==false))));
  }
  /* Live-update the numeric readout while dragging, without re-rendering the whole editor. */
  _update(el){const out=this.shadowRoot.getElementById(el.id+'-value');if(out)out.textContent=Number(el.value).toFixed(Number(el.dataset.digits)||0)+(el.dataset.unit||'')}
}
if(!customElements.get('smart-heating-card-editor'))customElements.define('smart-heating-card-editor',SmartHeatingCardEditor);
window.customCards=window.customCards||[];
if(!window.customCards.some(card=>card.type==='smart-heating-card'))window.customCards.push({type:'smart-heating-card',name:'Smart Heating Card',description:'Reference-matched 3D gas boiler dashboard',preview:true,documentationURL:'https://github.com/kdinya/ha-smart-heating',configElement:'smart-heating-card-editor'});
console.info(`%c SMART-HEATING-CARD %c ${SH_VERSION} `,'color:#0b1216;background:#ff9418;font-weight:700','color:#ff9418;background:#0b1216');
