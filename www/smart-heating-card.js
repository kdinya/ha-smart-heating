/* Smart Heating Card 1.0.5 — reference-matched 3D boiler controller */
const SH_VERSION = '1.0.8';
const SH_7SEGMENT_BASE64 = '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';

function ensureGlobal7SegmentFont() {
  if (typeof document === 'undefined') return;
  const FONT_ID = 'smart-heating-7segment-font';
  if (!document.getElementById(FONT_ID)) {
    const style = document.createElement('style');
    style.id = FONT_ID;
    style.textContent = `@font-face {
  font-family: '7segment';
  src: url('data:font/woff;base64,${SH_7SEGMENT_BASE64}') format('woff'),
       url('/hacsfiles/ha-smart-heating/fonts/7segment.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`;
    try {
      (document.head || document.documentElement).appendChild(style);
    } catch (e) {}
  }
  if (typeof FontFace !== 'undefined' && document.fonts) {
    try {
      const isLoaded = document.fonts.check && document.fonts.check('12px 7segment');
      if (!isLoaded) {
        const font = new FontFace('7segment', `url('data:font/woff;base64,${SH_7SEGMENT_BASE64}') format('woff'), url('/hacsfiles/ha-smart-heating/fonts/7segment.woff') format('woff')`, {
          weight: 'normal',
          style: 'normal',
          display: 'swap'
        });
        font.load().then(loadedFont => {
          document.fonts.add(loadedFont);
        }).catch(() => {});
      }
    } catch (e) {}
  }
}
ensureGlobal7SegmentFont();

const SH_LANG_KEY = 'smart-heating-language';
const SH_TEMP_STEP_KEY = 'smart-heating-temp-step';
const SH_OPEN_KEY = 'smart-heating-open-sections';
const SH_PROG_KEY = 'smart-heating-programs';
const SH_ACTIVE_PROG_KEY = 'smart-heating-active-program';
const SH_ECO_TIMER_KEY = 'smart-heating-eco-timer';
const SH_RELAY_TIMEOUT_KEY = 'smart-heating-relay-timeout';
const SH_ECO_TEMP_KEY = 'smart-heating-eco-temp';
const SH_MIN_TARGET_KEY = 'smart-heating-min-target';
const SH_MAX_TARGET_KEY = 'smart-heating-max-target';
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
  contact_1_active: false,
  panel_x: 0, panel_y: 0, panel_s: 1.32, panel_h: 2, panel_gap: 11.25,
  panel_button_size: 0.9, 'panel-buttons_x': 6, 'panel-buttons_y': 8.5,
  'panel-buttons_s': 0.84, panel_buttons_s: 0.7, panel_buttons_y: 65.5,
  effect_enabled: true, effect_x: 0, effect_y: 1.5, effect_s: 0.96, effect_opacity: 0.5};
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
  'exceptional': '<path d="M16 3 3 27h26L16 3Z"/><path d="M16 13v7"/><circle cx="16" cy="23" r="0.9" fill="currentColor" stroke="none"/>'};
const SH_WEATHER_TEXT = (raw, tr) => {
  if (raw === null || raw === undefined || raw === '' || raw === '—') return '—';
  const s = String(raw).trim().toLowerCase();
  if (s === 'sunny') return tr('weather_sunny');
  if (s === 'clear') return tr('weather_clear');
  if (s === 'clear-night') return tr('weather_night');
  if (s === 'partlycloudy') return tr('weather_partlycloudy');
  if (s === 'cloudy') return tr('weather_cloudy');
  if (s === 'overcast') return tr('weather_overcast');
  if (s === 'rainy' || s === 'rain') return tr('weather_rainy');
  if (s === 'pouring') return tr('weather_pouring');
  if (s === 'snowy' || s === 'snow') return tr('weather_snowy');
  if (s === 'snowy-rainy') return tr('weather_sleet');
  if (s === 'fog') return tr('weather_fog');
  if (s === 'hail') return tr('weather_hail');
  if (s === 'lightning' || s === 'lightning-rainy') return tr('weather_thunder');
  if (s === 'windy' || s === 'windy-variant') return tr('weather_windy');
  const num = Number(raw);
  if (Number.isFinite(num)) {
    if (num <= 0) return tr('weather_dry');
    return (Math.round(num * 10) / 10) + ' мм';
  }
  return String(raw);
};

const SH_RAIN_ICON = (state) => SH_RAIN_ICONS[String(state ?? '').trim().toLowerCase()] || SH_RAIN_ICON_RAINY;
const SH_DOTS = '<span class="sh-dots"><i></i><i></i><i></i></span>';
const SH_DICT = {
  uk: {stats_title: 'Добова статистика роботи', prev_day: '◀ Вчора', today: 'Сьогодні', c1_runtime: 'Час роботи контакту #1', cycles: 'Циклів запуску', temp_range: 'Діапазон t°', no_data: 'Немає даних за цей день', boiler_info_title: 'Статус котла', boiler_info_text: 'Котел працює автономно за власною внутрішньою логікою нагріву. Контакти лише надають дозвіл на запуск опалення.', settings: 'НАЛАШТУВАННЯ', outdoor: 'Температура на вулиці', wind: 'Вітер на вулиці', rain: 'Опади на вулиці', humidity: 'ВОЛОГІСТЬ В КІМНАТІ', scheme: 'СХЕМА ПІДКЛЮЧЕННЯ', contact1: 'ТЕРМОСТАТ ХА<br><small>АВТОМАТИКА</small>', contact2: 'ПРОГРАМАТОР<br><small>ТАЙМЕР</small>', language: 'МОВА', locale: 'uk-UA', wind_unit: 'м/с', alert_hint: 'Аварійне повідомлення: натисніть для деталей', c1_badge: 'ХА', c2_badge: 'ТАЙМЕР', alert_unavailable: "Сутність контакту #{n} ({id}) має статус '{state}'. Перевірте живлення реле або мережу.", alert_state_missing: 'не знайдено', alert_mismatch: 'Немає зворотного зв\'язку від {id} після команди перемикання (таймаут {timeout}с). Стан не відповідає бажаному.', weather_sunny: 'Ясно', weather_clear: 'Ясно', weather_night: 'Ясно', weather_partlycloudy: 'Мінлива хмарність', weather_cloudy: 'Хмарно', weather_overcast: 'Похмуро', weather_rainy: 'Дощ', weather_pouring: 'Злива', weather_snowy: 'Сніг', weather_sleet: 'Сніг з дощем', weather_fog: 'Туман', weather_hail: 'Град', weather_thunder: 'Гроза', weather_windy: 'Вітряно', weather_dry: 'Без опадів', hysteresis: 'ШВИДКІ НАЛАШТУВАННЯ', labels: 'НАЗВИ ТА ПІДПИСИ', hysteresis_on: 'Гістерезіс увімкнення (дельта)', hysteresis_off: 'Гістерезіс вимкнення (дельта)', hyst_on_desc: 'Дельта зниження температури для вмикання котла', hyst_off_desc: 'Дельта підвищення температури для вимикання котла', temp_step: 'Крок зміни цільової температури', temp_step_desc: 'Крок кнопок +/− цільової температури під колом клімата', labels_hint: 'Введіть власний текст або залиште порожнім для стандартного. Вимикач поруч приховує або показує підпис.', reset_labels: 'Скинути всі тексти', relay_timeout: 'Час перевірки реле (сек)', relay_timeout_desc: 'Час очікування підтвердження фактичного перемикання реле', min_target: 'Мінімальна цільова температура', min_target_desc: 'Нижня межа, нижче якої не можна встановити цільову температуру', max_target: 'Максимальна цільова температура', max_target_desc: 'Верхня межа, вище якої не можна встановити цільову температуру', relay_warning: 'УВАГА: Стан реле не відповідає заданому!', programs_title: 'Опалювальні програми та розклад', eco_mode: 'Режим ЕКО', target_mode: 'Цільова', eco_temp: 'Еко температура', quick_eco: 'Швидкий режим ЕКО (таймер)', quick_eco_desc: 'Тимчасове зниження температури до ЕКО на вибраний час', add_program: '+ Додати програму', active_prog: 'Активна', use_prog: 'Використовувати цю програму', delete_prog: 'Видалити', all_comfort: 'Всі 24г Цільова', all_eco: 'Всі 24г Еко', day_night: 'День/Ніч', remaining: 'залишилось', off: 'Вимкнути', lbl_title: 'Заголовок картки', lbl_subtitle: 'Підзаголовок', lbl_outdoor: 'Температура на вулиці', lbl_wind: 'Вітер на вулиці', lbl_rain: 'Опади на вулиці', lbl_humidity: 'Вологість в кімнаті', lbl_scheme: 'Схема підключення', lbl_contact1: 'Контакт 1', lbl_contact2: 'Контакт 2'},
  en: {stats_title: 'Daily Heating Statistics', prev_day: '◀ Prev Day', today: 'Today', c1_runtime: 'Contact #1 Runtime', cycles: 'Heating Cycles', temp_range: 'Temp Range', no_data: 'No history recorded for this day', boiler_info_title: 'Boiler Status', boiler_info_text: 'The boiler operates autonomously according to its internal heating curve. The contacts only grant permission to heat.', settings: 'SETTINGS', outdoor: 'Outdoor temperature', wind: 'Wind outside', rain: 'Precipitation', humidity: 'ROOM HUMIDITY', scheme: 'CONNECTION SCHEME', contact1: 'HA THERMOSTAT<br><small>SMART AUTO</small>', contact2: 'PROGRAMMER<br><small>TIMER DIAL</small>', language: 'LANGUAGE', locale: 'en-GB', wind_unit: 'm/s', alert_hint: 'Alert message: tap for details', c1_badge: 'HA', c2_badge: 'TIMER', alert_unavailable: "Contact #{n} entity ({id}) reports state '{state}'. Check the relay power supply or network.", alert_state_missing: 'not found', alert_mismatch: 'No feedback from {id} after the switch command (timeout {timeout}s). The state does not match the desired one.', weather_sunny: 'Sunny', weather_clear: 'Clear', weather_night: 'Clear', weather_partlycloudy: 'Partly cloudy', weather_cloudy: 'Cloudy', weather_overcast: 'Overcast', weather_rainy: 'Rain', weather_pouring: 'Heavy rain', weather_snowy: 'Snow', weather_sleet: 'Sleet', weather_fog: 'Fog', weather_hail: 'Hail', weather_thunder: 'Thunderstorm', weather_windy: 'Windy', weather_dry: 'No rain', hysteresis: 'QUICK SETTINGS', labels: 'TEXTS & LABELS', hysteresis_on: 'Turn-on hysteresis (delta)', hysteresis_off: 'Turn-off hysteresis (delta)', hyst_on_desc: 'Drop below target temperature before firing boiler', hyst_off_desc: 'Rise above target temperature before stopping boiler', temp_step: 'Target temperature step', temp_step_desc: 'Step used by the +/− buttons under the climate dial', labels_hint: 'Enter custom text or leave empty for default. The switch next to each field shows or hides that label.', reset_labels: 'Reset all labels', relay_timeout: 'Relay verification timeout (s)', relay_timeout_desc: 'Seconds to wait for physical switch confirmation before warning', min_target: 'Minimum target temperature', min_target_desc: 'Lower bound the target temperature cannot go below', max_target: 'Maximum target temperature', max_target_desc: 'Upper bound the target temperature cannot go above', relay_warning: 'WARNING: Relay state mismatch detected!', programs_title: 'Heating Schedules & Programs', eco_mode: 'Eco Mode', target_mode: 'Target', eco_temp: 'Eco temperature', quick_eco: 'Quick Eco Timer', quick_eco_desc: 'Temporary Eco mode for selected duration before returning to normal', add_program: '+ Add Program', active_prog: 'Active', use_prog: 'Use this program', delete_prog: 'Delete', all_comfort: 'All 24h Target', all_eco: 'All 24h Eco', day_night: 'Day/Night', remaining: 'remaining', off: 'Turn off', lbl_title: 'Card title', lbl_subtitle: 'Subtitle', lbl_outdoor: 'Outdoor temperature', lbl_wind: 'Wind outside', lbl_rain: 'Precipitation', lbl_humidity: 'Room humidity', lbl_scheme: 'Connection scheme', lbl_contact1: 'Contact 1', lbl_contact2: 'Contact 2'}};
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
  set hass(value){const previous=this._hass;this._hass=value;if(this._shouldRender(previous,value)){this.render();}}
  get hass(){return this._hass;}
  _startClock(){
    if(this._clockTimer)return;
    this._tickClock();
    this._clockTimer=setInterval(()=>this._tickClock(),10000);
  }
  _stopClock(){
    if(this._clockTimer){
      clearInterval(this._clockTimer);
      this._clockTimer=null;
    }
  }
  connectedCallback(){
    if(typeof document==='undefined'||!document.hidden){
      this._startClock();
    }
    this._onVisibilityChange=()=>{
      if(typeof document!=='undefined'&&!document.hidden){
        this._startClock();
        if(this._pendingRender){
          this._pendingRender=false;
          this.render();
        }
      } else {
        this._stopClock();
      }
    };
    if(typeof document!=='undefined'){
      document.addEventListener('visibilitychange',this._onVisibilityChange);
    }
    try{
      this._observer=new IntersectionObserver((entries)=>{
        for(const entry of entries){
          this._isLowVisibility=entry.intersectionRatio<0.1;
          if(!this._isLowVisibility){
            this._startClock();
            if(this._pendingRender){
              this._pendingRender=false;
              this.render();
            }
          } else {
            this._stopClock();
          }
        }
      },{threshold:[0,0.1,1.0]});
      this._observer.observe(this);
    }catch(e){}
  }
  disconnectedCallback(){
    this._stopClock();
    if(this._onVisibilityChange&&typeof document!=='undefined'){
      document.removeEventListener('visibilitychange',this._onVisibilityChange);
      this._onVisibilityChange=null;
    }
    if(this._observer){this._observer.disconnect();this._observer=null;}
  }
  getCardSize(){return 9;}
  /* Re-render only when a watched entity actually changed: `hass` is replaced on every state update in HA. */
  _watchedEntities(){return [this.config?.entity,this.config?.switch_1,this._hass?.states?.[this.config?.entity]?.attributes?.switch_1,this.config?.switch_2,this._hass?.states?.[this.config?.entity]?.attributes?.switch_2,this.config?.weather,this.config?.humidity,this.config?.outdoor_temperature,this.config?.wind,this.config?.precipitation].filter(Boolean);}
  _shouldRender(previous,next){if(!previous||!next||!this.config)return true;return this._watchedEntities().some(id=>previous.states?.[id]!==next.states?.[id]);}
  _tickClock(){if(!this.shadowRoot||(typeof document!=='undefined'&&document.hidden))return;const lang=this._language(),locale=SH_DICT[lang]?.locale||'uk-UA',now=new Date();const date=this.shadowRoot.querySelector('.clock .date'),time=this.shadowRoot.querySelector('.clock-time');if(date)date.textContent=now.toLocaleDateString(locale,{weekday:'short',day:'2-digit',month:'long',year:'numeric'}).toUpperCase();if(time)time.textContent=now.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});}
  _language(){const saved=SH_READ_STORE(SH_LANG_KEY);if(saved)return saved;
    if(this.config?.language)return this.config.language;
    const hl=this._hass?.locale?.language||this._hass?.language;
    if(hl)return hl.toLowerCase().startsWith('uk')?'uk':'en';
    return 'en';}
  /* User-chosen step for the dial's +/- buttons; falls back to the climate
     entity's own target_temp_step, then to the historical 0.5 default. */
  _tempStep(){const v=Number(SH_READ_STORE(SH_TEMP_STEP_KEY));return Number.isFinite(v)&&v>0?Math.min(2,Math.max(.1,v)):null;}
  state(id){return id&&this._hass?.states[id];}
  _contact1EntityId(){const a=this.state(this.config?.entity)?.attributes||{};return a.switch_1||this.config?.switch_1||'';}
  attr(name,fallback='—'){const id=this.config?.[name],s=this.state(id);return s&&!SH_UNAVAILABLE.includes(s.state)?s.state:fallback;}
  _unitOf(name){const id=this.config?.[name],s=this.state(id);return s?.attributes?.unit_of_measurement||'';}
  _weatherValues(){const weather=this.state(this.config?.weather);const a=weather?.attributes||{};const unavailable=!weather||SH_UNAVAILABLE.includes(weather.state);const value=(v,fallback='—')=>v!==undefined&&v!==null&&v!==''?v:fallback;return {state:unavailable?'—':weather.state,temperature:value(a.temperature),wind:value(a.wind_speed),windUnit:value(a.wind_speed_unit,''),precipitation:value(a.precipitation)};}

  _getSignalInfo(c, a) {
    let val = null;
    let unit = 'dBm';
    if (this.config.signal_entity && this._hass?.states[this.config.signal_entity]) {
      const s = this._hass.states[this.config.signal_entity];
      val = parseFloat(s.state);
      unit = s.attributes.unit_of_measurement || 'dBm';
    } else {
      const candidates = ['signal_strength', 'rssi', 'wifi_signal', 'wifi_strength', 'signal', 'linkquality'];
      for (const k of candidates) {
        if (a && a[k] !== undefined && a[k] !== null && a[k] !== '') {
          val = parseFloat(a[k]);
          break;
        }
      }
    }
    if (val === null || isNaN(val)) {
      // Auto-detect related wifi sensor if available
      if (this.config.entity && this._hass) {
        const base = this.config.entity.split('.')[1] || '';
        for (const [id, s] of Object.entries(this._hass.states)) {
          if (id.startsWith('sensor.') && (id.includes(base) || base.includes(id.replace('sensor.', ''))) && (id.includes('rssi') || id.includes('wifi') || id.includes('signal'))) {
            const parsed = parseFloat(s.state);
            if (!isNaN(parsed)) {
              val = parsed;
              unit = s.attributes.unit_of_measurement || 'dBm';
              break;
            }
          }
        }
      }
    }
    if (val === null || isNaN(val)) {
      return { bars: 4, color: '#10b981', title: 'Signal: 100% (OK)' };
    }
    let bars = 4;
    let color = '#10b981';
    if (val < 0) {
      // RSSI in dBm
      if (val >= -55) { bars = 4; color = '#10b981'; }
      else if (val >= -67) { bars = 3; color = '#06b6d4'; }
      else if (val >= -80) { bars = 2; color = '#f59e0b'; }
      else if (val >= -90) { bars = 1; color = '#ef4444'; }
      else { bars = 0; color = '#64748b'; }
    } else if (val <= 4) {
      // Direct bar count (0-4)
      bars = Math.max(0, Math.min(4, Math.round(val)));
      color = bars >= 4 ? '#10b981' : (bars === 3 ? '#06b6d4' : (bars === 2 ? '#f59e0b' : (bars === 1 ? '#ef4444' : '#64748b')));
    } else {
      // Percentage 0..100
      if (val >= 75) { bars = 4; color = '#10b981'; }
      else if (val >= 50) { bars = 3; color = '#06b6d4'; }
      else if (val >= 25) { bars = 2; color = '#f59e0b'; }
      else if (val > 0) { bars = 1; color = '#ef4444'; }
      else { bars = 0; color = '#64748b'; }
    }
    return { bars, color, title: `Signal: ${val} ${unit}` };
  }

  _getPrograms() {
    let p = null;
    const attrProgs = this.state(this.config?.entity)?.attributes?.programs;
    if (!this._scheduleOpen && attrProgs && typeof attrProgs === 'object' && Object.keys(attrProgs).length > 0) {
      p = { ...attrProgs };
      this._progsList = p;
    } else if (this._progsList && typeof this._progsList === 'object' && Object.keys(this._progsList).length > 0) {
      p = { ...this._progsList };
    } else if (attrProgs && typeof attrProgs === 'object' && Object.keys(attrProgs).length > 0) {
      p = { ...attrProgs };
      this._progsList = p;
    } else {
      p = SH_GET_STORE_JSON(SH_PROG_KEY);
      if (p && typeof p === 'object' && Object.keys(p).length > 0) {
        this._progsList = { ...p };
      }
    }
    if (!p || typeof p !== 'object') p = {};
    if (!p.P1) {
      p.P1 = {
        name: 'P1',
        hours: [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0]
      };
    }
    Object.keys(p).forEach(k => {
      if (k.startsWith('P') && p[k] && typeof p[k] === 'object') {
        if (!p[k].name) {
          p[k].name = k;
        }
      }
    });
    return p;
  }
  _getActiveProgram() {
    const attrs = this.state(this.config?.entity)?.attributes;
    if (attrs && 'active_program' in attrs) {
      const ap = attrs.active_program;
      if (!ap || ap === 'none' || ap === 'off' || ap === 'None') return '';
      return String(ap);
    }
    const s = SH_READ_STORE(SH_ACTIVE_PROG_KEY);
    return (!s || s === 'none' || s === 'off' || s === 'None') ? '' : s;
  }
  _getEcoTemp() {
    const v = parseFloat(SH_READ_STORE(SH_ECO_TEMP_KEY));
    return Number.isFinite(v) ? v : 18.0;
  }
  _getEcoTimerUntil() {
    const v = parseInt(SH_READ_STORE(SH_ECO_TIMER_KEY), 10);
    return Number.isFinite(v) ? v : 0;
  }
  _getRelayTimeout() {
    const v = parseFloat(SH_READ_STORE(SH_RELAY_TIMEOUT_KEY));
    return Number.isFinite(v) ? v : 10.0;
  }
  _getMinTarget() {
    const v = parseFloat(SH_READ_STORE(SH_MIN_TARGET_KEY));
    return Number.isFinite(v) ? v : 16.0;
  }
  _getMaxTarget() {
    const v = parseFloat(SH_READ_STORE(SH_MAX_TARGET_KEY));
    return Number.isFinite(v) ? v : 30.0;
  }

  safe(x){return String(x).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  render(){
    if(!this.shadowRoot||!this._hass||!this.config?.entity)return;
    const isDocHidden=typeof document!=='undefined'&&document.hidden;
    if((isDocHidden||this._isLowVisibility)&&this._hasRenderedOnce){this._pendingRender=true;return;}
    if(this._activeSliderDragging)return;
    const _prevTabs=this.shadowRoot.querySelector('.tabs');
    const _prevModal=this.shadowRoot.querySelector('.modal');
    if(_prevTabs)this._savedTabsScroll=_prevTabs.scrollTop;
    if(_prevModal)this._savedModalScroll=_prevModal.scrollTop;
    const c=this.state(this.config.entity),a=c?.attributes||{};
    const room=a.current_temperature??'—',target=a.temperature??'—';const humidityRaw=this.attr('humidity',a.humidity??'—');const humidityNum=Number(humidityRaw);const humidity=Number.isFinite(humidityNum)?String(Math.round(humidityNum)):humidityRaw;const humidityVisible=this.config.humidity_visible!==false;const roomStr=String(room),[roomInt,roomDec]=roomStr.split('.');
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
    const customLabels=this.config?.custom_labels||SH_GET_STORE_JSON('smart_heating_labels');
    const labelsVisible=this.config?.labels_visible||SH_GET_STORE_JSON('smart_heating_labels_visible');
    const getLabel=(key,defaultText)=>{
      const custom=customLabels[key];
      return (custom!==undefined&&custom!==null&&String(custom).trim()!=='')?String(custom).trim():defaultText;
    };
    const isLabelOn=(key)=>labelsVisible[key]!==false;
    const currentHOn=c?.attributes?.hysteresis_on??c?.attributes?.hysteresis??0.5;
    const currentHOff=c?.attributes?.hysteresis_off??0.5;
    const currentTempStep=a.temp_step!==undefined?Number(a.temp_step):(this._tempStep()??0.5);
    const shNum=(v)=>{const num=Number(v);return Number.isFinite(num)?String(Math.round(num*10)/10):v};
    const weatherValues=this._weatherValues();
    const sensorOutdoor=this.attr('outdoor_temperature',a.outdoor_temperature??'—');
    const outdoor=shNum(sensorOutdoor!=='—'?sensorOutdoor:weatherValues.temperature);
    const sensorWind=this.attr('wind',a.wind??'—');
    const windFromSensor=sensorWind!=='—';
    const windValue=windFromSensor?sensorWind:weatherValues.wind;
    const windUnit=(windFromSensor?this._unitOf('wind'):weatherValues.windUnit)||tr('wind_unit');const windNum=Number(windValue);
    const wind=Number.isFinite(windNum)?`${windNum.toFixed(1)} ${windUnit}`:windValue;
    const sensorPrecip=this.attr('precipitation',a.precipitation??'—');
    const rawWeather=sensorPrecip!=='—'?sensorPrecip:(a.weather_condition||a.weather||weatherValues.state);
    const rain=SH_WEATHER_TEXT(rawWeather,tr);
    const rainIcon=SH_RAIN_ICON(rawWeather);const outdoorVisible=this.config.outdoor_visible!==false,windVisible=this.config.wind_visible!==false,rainVisible=this.config.rain_visible!==false;
    
    const progs = this._getPrograms();
    const activeProgId = this._getActiveProgram();
    const activeProg = progs[activeProgId] || null;
    const ecoUntil = (a.eco_timer_until !== undefined && a.eco_timer_until !== null && Number(a.eco_timer_until) > 0)
      ? Number(a.eco_timer_until) * 1000
      : this._getEcoTimerUntil();
    const nowEpoch = Date.now();
    const ecoTimerActive = ecoUntil > nowEpoch;
    const ecoRemainingMin = ecoTimerActive ? Math.ceil((ecoUntil - nowEpoch) / 60000) : 0;
    const curHour = new Date().getHours();
    const currentSlotIsEco = ecoTimerActive || (activeProg ? (activeProg.hours[curHour] === 0) : false);
    const ecoTemp = a.eco_temperature !== undefined ? Number(a.eco_temperature) : this._getEcoTemp();
    const relayTimeoutVal = a.relay_timeout !== undefined ? Number(a.relay_timeout) : this._getRelayTimeout();
    const currentMinTarget = a.min_target_temperature !== undefined ? Number(a.min_target_temperature) : this._getMinTarget(),
      currentMaxTarget = a.max_target_temperature !== undefined ? Number(a.max_target_temperature) : this._getMaxTarget();
    if (a.min_target_temperature !== undefined && Number.isFinite(Number(a.min_target_temperature))) {
      SH_WRITE_STORE(SH_MIN_TARGET_KEY, String(a.min_target_temperature));
    }
    if (a.max_target_temperature !== undefined && Number.isFinite(Number(a.max_target_temperature))) {
      SH_WRITE_STORE(SH_MAX_TARGET_KEY, String(a.max_target_temperature));
    }
    const relayMismatch = Boolean(a.relay_mismatch);
    const localAlert=(n)=>{const code=a[`contact_${n}_alert_code`];const id=a[`contact_${n}_alert_entity`]||'';if(!code)return a[`contact_${n}_alert`]||null;if(code==='unavailable'){const st=a[`contact_${n}_alert_state`];return tr('alert_unavailable').replace('{n}',n).replace('{id}',id).replace('{state}',st||tr('alert_state_missing'));}if(code==='mismatch'){return tr('alert_mismatch').replace('{id}',id).replace('{timeout}',a.relay_timeout??'');}return a[`contact_${n}_alert`]||null;};
    const alert1 = localAlert(1);
    const alert2 = localAlert(2);
    const signalInfo = this._getSignalInfo(c, a);

    const enabled=c?.state!=='off'&&c?.state!=='unavailable';const effectEnabled=this.config.effect_enabled!==false;
    const hasContact1 = Boolean(a.switch_1 || this.config.switch_1);
    const hasContact2 = Boolean(a.switch_2 || this.config.switch_2);
    const hasAnyContact = hasContact1 || hasContact2;
    const contact1On = a.contact_1_enabled !== undefined ? Boolean(a.contact_1_enabled) : (this._visualContact1 !== undefined ? this._visualContact1 : (this.config.contact_1_active !== false));
    const contact2On = a.contact_2_enabled !== undefined ? Boolean(a.contact_2_enabled) : (this._visualContact2 !== undefined ? this._visualContact2 : Boolean(this.config.contact_2_active));
    /* Prefer the integration's own `heating` flag, then hvac_action, then the raw mode. */
    const s1EntityId=a.switch_1||this.config?.switch_1;const s1Entity=s1EntityId?this.state(s1EntityId):null;let contact1Closed=false;if(s1EntityId){if(s1Entity&&s1Entity.state!=='unavailable'&&s1Entity.state!=='unknown'){contact1Closed=(s1Entity.state==='on');}else if(!s1Entity&&a.contact_1_alert_code!=='unavailable'&&a.contact_1_state!==undefined){contact1Closed=Boolean(a.contact_1_state);}else{contact1Closed=false;}}else if(a.contact_1_state!==undefined){contact1Closed=Boolean(a.contact_1_state);}else if(a.heating!==undefined){contact1Closed=Boolean(a.heating);}else{contact1Closed=Boolean(a.hvac_action==='heating'||c?.state==='heat');}const showFlame=Boolean(contact1On&&contact1Closed&&effectEnabled);const flameDim=showFlame&&!enabled;const heating=enabled&&contact1Closed;
    const now=new Date();const date=now.toLocaleDateString(locale,{weekday:'short',day:'2-digit',month:'long',year:'numeric'}).toUpperCase(),time=now.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});
    this.shadowRoot.innerHTML=`<style>
      @font-face{font-family:'7segment';src:url('data:font/woff;base64,d09GRgABAAAAAAegAA4AAAAAEKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAADpAAAADAAAABWCdMC32NtYXAAAAKYAAABDAAAAuwAIEryY3Z0IAAABuwAAAAYAAAAGAMpAENmcGdtAAAHBAAAACIAAAAi18bhKmdseWYAAASUAAACWAAACNBRu2hgaGVhZAAAAUQAAAAzAAAANit/NttoaGVhAAACLAAAACQAAAAkA4AFI2htdHgAAAJQAAAARgAAAIwKUAoaa2VybgAAA9QAAAAYAAAAGAAJAJBsb2NhAAAEDAAAAIYAAACGT7JNkG1heHAAAAPsAAAAIAAAACAAYABCbmFtZQAAAXgAAAC0AAABNBJAOG5wb3N0AAAHiAAAABcAAAAg/79slnByZXAAAAcoAAAAXQAAAHOLNgEkeNpjYGRgAGHX8Ftb4/ltviowszCAwDHnlgYQ/SQlr+//3f8XGB8zg7gcDEwgCgBZCQzhAHjaTcsBRwNhAIDhZ23FUpMiDJxAqF212tUEQpQRjQC4cuqs3eXuEpB+RD84zYcDHi8vNn3r6vT6OnYdBq8ZGAZ3W73X8rp9P8EbdhwF9w0J3jJxHbxtoArec+DXvVQhcqP0rFL6UlvIPcq8+vQuVUkcm6/KUqbQSLxpND5MxWKNUiVXSC2MvCgtxRJ1+zN3Zyby4NbMk0yllisVImMjJ0ZOnRk7d2EicelKtGrT//oHJoIi1wABAAADYP9AAAAB4P/d//8AAAQAAEAAAAAAAAAAAAAAAAAABHjaYwCBLQyGDAz/7zI+YKhmLGSMYfBj0GVwYShg0AWydYE8FyDUZagGi+rigC5w0g9NlR9CBVTGDyrmAobVUPsYALJUEm0AAHjaLdIDckRBFIXhjm3btm3btm1jUVlSljCFmH/PnPvqq/PcNMa4GQ/jTwZyUO7PxlWNSJU2pEs9csQXuRKFPKlBoXihSPxQLO4oRR38US9uaJJqtEgt2iQS7RKODolCp/ijC72IRp8EoB/DiMeI+GMU40jBhIRgUsIwhTmkY14CsSBRWJIarIg3VsUXa9hCDrYlBjsSgV0pxJ54YR8HKMIhjpCIY5ygBKeSgjNcoQzXuEMG7iUQj1KHJ2lg+UMB40eGWToPt3QeYek80tJ5lKXzcsD4khWAqSebAePBlIZD/0xfA0wWXU1EimtPZpcC9r5jDTvOb92+HHjl3J98szhvJd/xwXn4P6d1OCZ42mNgZGBgnMDAysDABIQMDP8gNBADZQgDBwaF3z+ZE/47MDAwJzAcgAkDAMw8BroAAAABAAAAFAABAAEABgAAAAAAAgACAHgAAQAAAEIACAACADAABwABAAAAAQADAAAACgAHAAcAAQAAAAAAFAAhADUASwBhAHQAiQCfALIAyQDUAOgA/AENASEBOAFGAWABdwGOAZ8BswHEAdgB7AH9AhECHwIwAkQCWAJsAnoCjgKcArMCwQLVAuwDAAMOAyIDOQNKA1gDbAN6A4sDnwOqA7gDyQPXA+ID8wQEBA8EGgQrBDYEQQRMBFcEaARoAAB42o2VAWQbURjH/9+7u/faDS3Zeq5KJ8eCLFyF3lgrFVFkZAEMYwdUxmgDEGwAEDZAsKUwiuGqAxgASDEAZKAAALAWsuRl9LP38hzycPm9//f/f999CQT2cIHv4jU8KKBBdeWldbUnM/ly/rnIMupmGUCz37NfiJHAA9SciOWRTPQ3GIhzGnmAhLzyKaAqxZX9FxTSWX68E1+XxHl7S4DojIZ0I/5AQv2gtUCKKqVbG6JCH5499zbLh+LzSdS4ixKA6A0UTai/ZFWwvmBDJVWF3jV3N/yDJ9RMotuj6ASEDkA9ZLo++R5V03qo4nLlS75Tuo6j7C09BqGGGF//KQaKHohqqp42RPjp1SNvo3z4vr0d3+raaNEQV2K6JB/S3GdJVdL9NPzW3N0U4TH9TKK78nYbIJxSl8aUI1jUDnyqlnTx0+blQfOSPiZJgtkMNYBuPKAMD4vT12egT6lPBUBgDXNaZ1/0ackJBLBqGLfXNddx1WJci1W5J9bACdCEKXG/nKs5OGXQAyjDnzujW6/lvGN6VStpZU02YrQxK02MbYShFHMOqnAXzYp8bm7vJic1oayEdCj1xHSlG9O1Kt5xphQbXPF5S1vH2exYrdW9MbiW2aFCGqbrjvme8ESmkpmo4HZweiKmFsJUHVNu13BndDhzV1TcmbVbZl0B6X7jbFV0rsDeG8odiVqOt9bYa8rN2zyh2W++TVZiQn3rznb4tAr85gtI93bxJPpf778NoOH9JNjTrqnGM+h7oyXB7g0Wauypv3TP8nLHoB71eX7nXHSNvx1lGvoDAABgAA0AAAAAAAAAAAAA//gABwAj/9ywACwAuQP+P+ALPi2wASywACuwAf0wMS2wAiywACs+MDEtAAB42h3HBRFDQRAD0M9oIjNx0u76KIOVU5NTeLT4ot7/UE8D1DnvwvPHezEvGv0DjTRo95v2iqPgoN1u0FRz70XdtZyZ1lLcNg83i+dZ3014QoMj3LTQ7lppGYwKIc8AAAB42mNgZmD4/yen7P8BBgUGLAAAeTsEwAA=') format('woff'),url('/hacsfiles/ha-smart-heating/fonts/7segment.woff') format('woff');font-display:block}
      :host{display:block;width:100%;max-width:100%;overflow:visible;color:#eef2f8;font-family:Arial,Helvetica,sans-serif;--orange:#ff9418;--silver:#d8dee6;--muted:#b7c1cf}
      ha-card{container-type:size;position:relative;display:block;width:100%;max-width:100%;aspect-ratio:var(--card-ratio,1.5);box-sizing:border-box;padding:0;overflow:hidden;border-radius:var(--card-radius,27px);border:1px solid #52606b;background:linear-gradient(145deg,#172027 0%,#080e12 42%,#121b21 100%);box-shadow:0 20px 45px #000d,inset 0 1px #ffffff40,inset 0 -4px 14px #000;}
      .device{box-sizing:border-box;position:absolute;inset:0;width:100%;height:100%;min-height:0;display:flex;flex-direction:column;padding:clamp(7px,1.15cqw,17px) clamp(7px,1.15cqw,17px) clamp(6px,.9cqw,13px);border-radius:var(--card-radius,27px);background:linear-gradient(150deg,#243139 0%,#10181d 17%,#080d11 72%,#1a242b 100%);box-shadow:inset 0 0 0 2px #060a0d,inset 0 0 0 4px #ffffff0b,inset 0 0 20px #000;}
      .screen{box-sizing:border-box;width:100%;min-width:0;flex:1 1 auto;min-height:0;aspect-ratio:var(--screen-ratio,1.9);margin-left:auto;margin-right:auto;position:relative;padding:clamp(8px,1.55cqw,22px) clamp(9px,1.7cqw,24px) clamp(7px,1.35cqw,19px);border:1px solid #65717b;border-radius:var(--screen-radius,clamp(9px,1.35cqw,19px));background:radial-gradient(ellipse at 50% 45%,#172329 0%,#0d151a 54%,#080e12 100%);box-shadow:inset 0 0 28px #000c,0 1px #ffffff2b,0 0 0 5px #0a1014,0 0 0 6px #34414a;overflow:hidden}.screen:before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,#fff1,transparent 18%,transparent 78%,#0007)}
      .screen>*{position:relative;z-index:1}.header-shell{transform:translateY(calc(var(--header-inner-y,0) * 1cqh))}.group-header{display:flex;justify-content:space-between;align-items:flex-start}.brand{transform:translate(calc(var(--brand-group-x,0) * 1cqw),calc(var(--brand-group-y,0) * 1cqh));display:flex;align-items:center;gap:clamp(5px,1cqw,14px);min-width:0}.flame{color:var(--orange);font-size:clamp(22px,3.5cqw,49px);line-height:1;text-shadow:0 0 13px #ff8a0066}.brand-icon{transform:translate(calc(var(--brand-icon-x,0) * 1cqw),calc(var(--brand-icon-y,0) * 1cqh)) scale(var(--brand-icon-s,1));transform-origin:center center}.brand-name{transform:translate(calc(var(--brand-x,0) * 1cqw),calc(var(--brand-y,0) * 1cqh)) scale(var(--brand-s,1));transform-origin:left top}.brand b{font-size:clamp(13px,1.9cqw,27px);letter-spacing:2px}.brand small{display:block;color:var(--orange);font-size:clamp(8px,1.05cqw,15px);letter-spacing:2.1px;margin-top:5px}.clock{text-align:right;color:#c4cedb;transform:translate(calc((var(--date-group-x,0)) * 1cqw),calc((var(--date-group-y,0)) * 1cqh));font-size:clamp(7px,1.1cqw,16px);min-width:0;white-space:nowrap}.clock .date{transform:translate(calc(var(--date-x,0) * 1cqw),calc(var(--date-y,0) * 1cqh)) scale(var(--date-s,1));display:block}.clock strong{font-family:'7segment',monospace;display:block;margin-top:3px;color:#fff;font-size:clamp(20px,3cqw,43px);line-height:1;font-weight:300;letter-spacing:3px}.clock-time{transform:translate(calc(var(--clock-x,0) * 1cqw),calc(var(--clock-y,0) * 1cqh)) scale(var(--clock-s,1));transform-origin:top right}.signal{transform:translate(calc(var(--signal-x,0) * 1cqw),calc(var(--signal-y,0) * 1cqh)) scale(var(--signal-s,1));display:flex;align-items:flex-end;justify-content:flex-end;gap:3px;margin-top:6px;height:20px}.signal i{display:block;width:4px;border-radius:2px;background:#c6ced8;box-shadow:0 0 4px #c6ced855}.signal i:nth-child(1){height:6px}.signal i:nth-child(2){height:10px}.signal i:nth-child(3){height:14px}.signal i:nth-child(4){height:19px}.line{height:1px;margin:clamp(6px,1cqw,14px) 0 clamp(8px,1.3cqw,18px);transform:translateY(calc(var(--line-y,0) * 1cqh));background:linear-gradient(90deg,var(--orange),#505c65 38%,#505c65 70%,transparent)}
      .screen-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.45fr) minmax(0,1fr);gap:clamp(3px,1cqw,10px);min-width:0;min-width:0;align-items:center;transform:translateY(calc(var(--row-offset,0) * 1cqh))}.side{display:flex;flex-direction:column;gap:4px;min-width:0;overflow:visible}.group-weather{transform:translate(calc(var(--weather-x,0) * 1cqw),calc(var(--weather-y,0) * 1cqh)) scale(var(--weather-s,1));}.group-climate{transform:translate(calc(var(--climate-x,0) * 1cqw),calc(var(--climate-y,0) * 1cqh)) scale(var(--climate-s,1));}.group-panel{transform:translate(calc(var(--panel-x,0) * 1cqw),calc(var(--panel-y,0) * 1cqh)) scale(calc(var(--panel-s,.89) * .76));transform-origin:bottom center}.screen-grid>.side:first-child{transform-origin:top left}.screen-grid>.center{transform-origin:top center}.screen-grid>.side:last-child{transform-origin:top right}.metric{transform:translate(calc(var(--item-x,0) * 1cqw),calc(var(--item-y,0) * 1cqh));min-height:clamp(34px,4.8cqw,68px);padding:clamp(5px,.85cqw,12px) 2px;border-bottom:1px solid #39454d;display:flex;align-items:center;gap:clamp(4px,.85cqw,12px);min-width:0}.metric-icon{width:clamp(20px,3cqw,43px);flex:0 0 clamp(20px,3cqw,43px);text-align:center;color:#e0e5ec;font-size:clamp(18px,2.65cqw,38px);line-height:1;text-shadow:0 2px 3px #000}.weather-icon svg{width:clamp(20px,2.7cqw,38px);height:clamp(20px,2.7cqw,38px);fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 2px #000)}.metric.orange{transform:translate(calc(var(--humidity-x,0) * 1cqw),calc(var(--humidity-y,0) * 1cqh)) scale(var(--humidity-s,1))}.element-outdoor{transform:translate(calc(var(--outdoor-x,0) * 1cqw),calc(var(--outdoor-y,0) * 1cqh)) scale(var(--outdoor-s,1))}.element-wind{transform:translate(calc(var(--wind-x,0) * 1cqw),calc(var(--wind-y,0) * 1cqh)) scale(var(--wind-s,1))}.element-rain{transform:translate(calc(var(--rain-x,0) * 1cqw),calc(var(--rain-y,0) * 1cqh)) scale(var(--rain-s,1))}.element-rain strong{font-size:clamp(8px,1.15cqw,14px)!important;line-height:1.15!important;font-weight:600!important;white-space:normal;overflow-wrap:anywhere}.metric.orange .metric-icon{color:var(--orange);text-shadow:0 0 13px #ff8a0055}.metric label{display:block;white-space:normal;overflow-wrap:anywhere;color:#c3ccda;font-size:clamp(8px,1cqw,14px);margin-bottom:clamp(2px,.4cqw,5px)}.humidity-value{display:flex;align-items:baseline;gap:0;justify-content:flex-end}.humidity-int{transform:translate(calc(var(--humidity-int-x,0) * 1cqw),calc(var(--humidity-int-y,0) * 1cqh)) scale(var(--humidity-int-s,1));display:inline-block}.humidity-dec{transform:translate(calc(var(--humidity-dec-x,0) * 1cqw),calc(var(--humidity-dec-y,0) * 1cqh)) scale(var(--humidity-dec-s,1));display:inline-block}.humidity-unit{transform:translate(calc(var(--humidity-unit-x,0) * 1cqw),calc(var(--humidity-unit-y,0) * 1cqh)) scale(var(--humidity-unit-s,1));display:inline-block}.sh-dots{display:inline-flex;align-items:center;gap:3px;vertical-align:middle}.sh-dots i{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.25;animation:sh-dots-blink 1.1s ease-in-out infinite}.sh-dots i:nth-child(2){animation-delay:.18s}.sh-dots i:nth-child(3){animation-delay:.36s}@keyframes sh-dots-blink{0%,80%,100%{opacity:.25;transform:scale(.85)}40%{opacity:1;transform:scale(1)}}.temp .sh-dots{display:inline-flex;align-items:center;justify-content:center;gap:clamp(6px,1cqw,12px);vertical-align:middle;height:100%}.temp .sh-dots i{width:clamp(8px,1.2cqw,16px);height:clamp(8px,1.2cqw,16px);border-radius:50%;background:#fafbfc}.metric strong{display:block;color:#f6f8fb;font-size:clamp(13px,2cqw,28px);line-height:1.05;font-weight:500}.metric em{font-style:normal;color:#c6d0db;font-size:clamp(9px,1.3cqw,18px)}.center{display:flex;flex-direction:column;align-items:center}.dial{transform:translate(calc(var(--dial-x,0) * 1cqw),calc(var(--dial-y,0) * 1cqh)) scale(var(--dial-s,1));position:relative;width:min(100%,clamp(120px,29cqw,345px));height:auto;aspect-ratio:1;min-width:0;min-height:0;border-radius:50%;background:conic-gradient(from 215deg,var(--orange) 0deg,#ffad35 92deg,var(--orange) 129deg,#4d5962 130deg,#4d5962 235deg,transparent 236deg);box-shadow:0 0 20px #ff8a0040,0 0 0 2px #10181c,inset 0 0 10px #000}.dial:before{content:'';position:absolute;z-index:1;inset:12px;border-radius:50%;background:radial-gradient(circle at 43% 30%,#1a292f,#0b1318 66%,#070c10);box-shadow:inset 0 0 28px #000,0 0 0 1px #9aa4ae66}.dial.is-heating{box-shadow:0 0 24px color-mix(in srgb,var(--orange) 45%,transparent),0 0 0 2px #10181c,inset 0 0 10px #000}.flame-effect{display:none;position:absolute;inset:9px;border-radius:50%;overflow:hidden;z-index:1;pointer-events:none;opacity:var(--effect-opacity,.85);box-shadow:inset 0 0 20px #0066ff55}.flame-effect.is-active{display:block}.flame-effect.is-dim{opacity:calc(var(--effect-opacity,.85) * 0.35);filter:saturate(0.4) brightness(0.7);box-shadow:inset 0 0 10px #0066ff22}.flame-layer{position:absolute;inset:0;width:100%;height:100%;transform:translate(calc(var(--effect-x,0) * 1cqw),calc(var(--effect-y,0) * 1cqh)) scale(var(--effect-s,1));transform-origin:50% 85%;filter:drop-shadow(0 0 10px #0088ff)}.flame-layer svg{width:100%;height:100%;overflow:hidden}.flame-outer{animation:flame-blue-sway 1.15s ease-in-out infinite alternate;transform-origin:50% 95%}.flame-mid{animation:flame-blue-mid .88s ease-in-out .08s infinite alternate-reverse;transform-origin:50% 95%}.flame-inner{animation:flame-blue-core .72s ease-in-out .15s infinite alternate;transform-origin:50% 95%}@keyframes flame-blue-sway{from{transform:scaleX(.91) scaleY(.96) skewX(-2.5deg);opacity:.85}to{transform:scaleX(1.07) scaleY(1.03) skewX(2.5deg);opacity:1}}@keyframes flame-blue-mid{from{transform:scaleX(.88) scaleY(.94) skewX(2deg);opacity:.88}to{transform:scaleX(1.1) scaleY(1.05) skewX(-2deg);opacity:1}}@keyframes flame-blue-core{from{transform:scaleX(.93) scaleY(.92);opacity:.9}to{transform:scaleX(1.06) scaleY(1.08);opacity:1}}.dial:after{content:'';position:absolute;z-index:1;inset:22px;border-radius:50%;border:1px solid #8f9aa555;box-shadow:inset 0 0 9px #000}.dial-content{position:relative;z-index:2;text-align:center}.dial .flame{font-size:clamp(20px,2.9cqw,41px);margin-top:clamp(1px,.25cqw,3px)}.dial-label{margin-top:9px;color:#e0e6ee;font-size:clamp(8px,1.05cqw,15px)}.temp{font-family:'7segment',monospace;transform:translate(calc((var(--room-x,0) - var(--dial-x,0)) * 1cqw / var(--dial-s,1)),calc((var(--room-y,0) - var(--dial-y,0)) * 1cqh / var(--dial-s,1))) scale(calc(var(--room-s,1) / var(--dial-s,1)));margin-top:8px;color:#fafbfc;font-size:clamp(31px,6.1cqw,82px);line-height:.92;letter-spacing:-5px;font-weight:300;text-shadow:0 3px 6px #000}.temp sup{font-size:calc(clamp(11px,1.8cqw,24px) * var(--room-unit-size,1));letter-spacing:0;margin-left:3px;vertical-align:baseline;line-height:1}.target .target-unit{vertical-align:baseline;line-height:1;margin-left:var(--target-unit-gap,4px)}.temp{letter-spacing:var(--room-letter-spacing,-5px)}.temp .temp-dec{font-size:calc(1em * var(--room-decimal-size,1));letter-spacing:var(--room-letter-spacing,-5px)}.target strong{letter-spacing:var(--target-letter-spacing,0)}.target .target-dec{font-size:calc(1em * var(--target-decimal-size,1));letter-spacing:var(--target-letter-spacing,0)}.target .target-unit{font-size:calc(1em * var(--target-unit-size,1));letter-spacing:0}.target{transform:translate(calc(var(--target-x,0) * 1cqw),calc(var(--target-y,0) * 1cqh)) scale(var(--target-s,1));margin-top:12px;color:var(--orange);font-size:clamp(7px,1cqw,13px);letter-spacing:.5px}.target strong{font-family:'7segment',monospace;display:block;margin-top:3px;color:#fff;font-size:calc(35px * var(--target-scale,1));font-weight:500;letter-spacing:var(--target-letter-spacing,0)}.adjust{transform:translate(calc(var(--adjust-x,0) * 1cqw),calc(var(--adjust-y,0) * 1cqh)) scale(var(--adjust-s,1));display:flex;gap:var(--adjust-gap,42px);margin-top:clamp(7px,1.1cqw,16px)}.adjust button{width:clamp(38px,calc(var(--adjust-button-size,66px) * .75),var(--adjust-button-size,66px));height:clamp(38px,calc(var(--adjust-button-size,66px) * .75),var(--adjust-button-size,66px));border-radius:50%;border:2px solid var(--orange);background:radial-gradient(circle at 32% 22%,#364149,#0a1115 70%);color:#f5f7fa;font-size:var(--adjust-icon-size,32px);display:flex;align-items:center;justify-content:center;line-height:1;box-shadow:0 0 0 5px #0a1014,0 0 14px #ff8a0035,inset 0 2px #ffffff24;cursor:pointer}.adjust button:hover{background:var(--orange);color:#111}
      .scheme-title.element-scheme,.scheme.element-scheme{transform:translate(calc(var(--scheme-x,0) * 1cqw),calc(var(--scheme-y,0) * 1cqh)) scale(var(--scheme-s,1))}.scheme{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1.2cqw,16px);align-items:stretch;justify-content:end}
@keyframes sh-pulse{0%{box-shadow:0 0 0 0 rgba(239,68,68,0.7)}70%{box-shadow:0 0 0 8px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}
.scheme-alert-btn{position:absolute;top:-4px;right:-4px;width:18px;height:18px;border-radius:50%;background:#ef4444;border:1.5px solid #fff;color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:15;box-shadow:0 0 8px #ef4444;animation:sh-pulse 1.5s infinite}
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
      .modal-backdrop{position:fixed;inset:0;width:100vw;height:100vh;overflow-y:auto;z-index:99999;display:flex;align-items:center;justify-content:center;padding:clamp(8px,2vw,16px);background:rgba(2,6,9,0.78);backdrop-filter:blur(6px);box-sizing:border-box}.modal{position:relative;width:min(420px,90%);max-height:min(82vh,720px);overflow:hidden;display:flex;flex-direction:column;box-sizing:border-box;margin:auto;min-height:0;padding:22px;border:1px solid #66737e;border-radius:16px;background:linear-gradient(145deg,#1c2a31,#091115);box-shadow:0 20px 50px #000d,inset 0 1px #fff2}.confirm-backdrop .modal{overflow-y:auto;overscroll-behavior:contain}.modal{overflow-y:auto}.modal-close{position:absolute;top:8px;right:12px;border:0;background:none;color:#d9e0e8;font-size:28px;cursor:pointer}.modal-title{color:var(--orange);font-weight:700;letter-spacing:2px;margin-bottom:15px}.tabs{display:flex;flex:1;min-height:0;flex-direction:column;gap:7px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch;padding:2px 3px 8px}.menu-section{flex-shrink:0;border:1px solid #ffffff1a;border-radius:9px;background:#ffffff06;overflow:hidden}.menu-section.open{border-color:#ff941866;background:#ff94180b}.menu-head{display:grid;grid-template-columns:25px 1fr 20px;align-items:center;width:100%;padding:12px 10px;border:0;background:transparent;color:#cbd5df;text-align:left;cursor:pointer}.menu-head:hover{background:#ffffff0b}.menu-head span{color:var(--orange);font-size:16px}.menu-head b{font-size:11px;letter-spacing:.7px}.menu-head i{color:var(--orange);font-style:normal;text-align:center;font-size:10px}.menu-body{padding:12px 14px 14px;border-top:1px solid #ffffff18;color:#c4ced9;line-height:1.5}.menu-body p{margin:8px 0 0;color:#98a5b3;font-size:12px}
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
.sh-reset-btn:hover{background:#ffffff15;color:#fff}.popup-choice{display:flex;gap:7px;flex-wrap:wrap}.popup-choice button{flex:1;padding:9px 7px;border:1px solid #ffffff20;border-radius:7px;background:#ffffff08;color:#b9c4d0;font-size:11px;cursor:pointer}.popup-choice button.active{border-color:var(--orange);color:var(--orange);background:#ff941813}.control-panel{position:relative;isolation:isolate;box-sizing:border-box;width:100%;transform-origin:bottom center;justify-content:center;flex:0 0 auto;height:calc(clamp(58px,7cqw,90px) + calc(var(--panel-h,0) * 1cqh));min-height:calc(clamp(20px,3cqw,34px) + calc(var(--panel-h,0) * 1cqh));overflow:hidden;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(0px,calc(var(--panel-gap,2) * 1cqw),80px);align-items:start;align-content:start;margin-top:20px;padding:2px 3px 0;background:none}.control-panel:before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,#10191e00,#080d11aa);pointer-events:none}.control{position:relative;z-index:1;width:100%;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;color:#aeb8c5;font-size:clamp(6px,.85cqw,12px);letter-spacing:.5px}.button{position:relative;display:flex;align-items:center;justify-content:center;width:clamp(40px,6.2cqw,76px);height:clamp(40px,6.2cqw,76px);margin:0 auto 3px;border-radius:50%;border:1px solid #65727d;background:radial-gradient(circle at 34% 23%,#52606a 0%,#28343b 22%,#121b20 52%,#05090c 78%);box-shadow:0 8px 10px #000c,0 0 0 5px #080e12,0 0 0 6px #26323a,inset 0 3px 4px #ffffff38,inset 0 -9px 12px #000d;color:#dfe5ec;font-size:clamp(19px,2.45cqw,30px);line-height:1}.button:before{content:'';position:absolute;inset:5px;border-radius:50%;border:1px solid #ffffff20;box-shadow:inset 0 0 0 2px #0006}.button svg{position:relative;z-index:1;width:clamp(21px,3cqw,37px);height:clamp(21px,3cqw,37px);fill:none;stroke:currentColor;stroke-width:2.7;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 2px 2px #000)}.is-disabled{filter:saturate(.35) brightness(.58)}.is-disabled .control.settings{filter:none}.control.active{color:var(--orange)}.control.active .button{border:2px solid var(--orange);color:var(--orange);box-shadow:0 0 19px #ff8a0055,0 8px 10px #000c,0 0 0 5px #080e12,0 0 0 6px #2a2116,inset 0 3px 4px #ffffff38,inset 0 -9px 12px #000d}.control.power:not(.active) .button{color:#88939d;border-color:#59636c;box-shadow:0 6px 10px #000c,0 0 0 5px #080e12,0 0 0 6px #1a2329,inset 0 3px 4px #ffffff15}.control.fire .button svg{fill:currentColor;stroke:currentColor;stroke-width:1.7}.control small{display:block;color:#9faab7;font-size:clamp(6px,.75cqw,11px);margin-top:2px}.control.active small{color:var(--orange)}

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
.scheme-title{font-size:clamp(10px,1.5cqw,22px);color:#cbd4db;letter-spacing:.5px;text-align:right}.scheme-card{padding:clamp(4px,.6cqw,12px) 0;background:none;border:0;box-shadow:none}.scheme-icon{width:clamp(38px,6.6cqw,100px);height:clamp(38px,6.6cqw,100px)}.scheme-card span{font-size:clamp(7px,1.2cqw,18px)}
.control-panel{margin-top:clamp(8px,1.5cqw,24px);padding:0 clamp(5px,3cqw,46px);align-items:center;background:linear-gradient(180deg,#10191e00,#080d11aa);border-radius:0 0 clamp(16px,2.4cqw,38px) clamp(16px,2.4cqw,38px)}
.control{font-size:clamp(8px,1.5cqw,22px);color:#b9c4cd;text-transform:uppercase}.control.active{color:var(--orange)}
.button{width:clamp(42px,8.4cqw,128px);height:clamp(42px,8.4cqw,128px);margin:0 auto clamp(3px,.6cqw,9px);border:2px solid #111a20;box-shadow:0 0 0 4px #05090c,0 0 0 5px #26333a,0 9px 14px #000c,inset 0 3px 5px #ffffff30,inset 0 -10px 15px #000;background:radial-gradient(circle at 35% 22%,#53616a 0%,#26333a 25%,#0b1216 68%);transform:scale(var(--panel-button-size,1));transform-origin:center}
.control.active .button{border-color:var(--orange);box-shadow:0 0 0 4px #05090c,0 0 0 5px #26333a,0 0 13px #ff8a0080,inset 0 3px 5px #ffffff30}.button svg{width:clamp(22px,3.7cqw,56px);height:clamp(22px,3.7cqw,56px)}
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
<style data-layout-override>ha-card{aspect-ratio:var(--card-ratio,1.5);border-radius:var(--card-radius,27px);overflow:hidden}.screen{flex:1 1 0;min-height:0;aspect-ratio:auto}.screen-grid{position:relative;width:100%;height:100%;grid-template-columns:30% 40% 30%;grid-template-rows:100%;gap:0;align-items:center}</style><ha-card class="${enabled?'is-enabled':'is-disabled'}" style="--card-ratio:${cardRatio};--screen-ratio:${screenRatio};${groupVars}${itemVars}--room-letter-spacing:${roomLetterSpacing}px;--room-decimal-size:${roomDecimalSize};--room-unit-size:${roomUnitSize};--target-letter-spacing:${targetLetterSpacing}px;--target-decimal-size:${targetDecimalSize};--target-unit-size:${targetUnitSize};--target-unit-gap:${targetUnitGap}px;--adjust-icon-size:${adjustIconSize}px;--row-offset:${rowOffset};--card-radius:${cardRadius}px;--frame-width:${frameWidth};--header-inner-y:${n('header_inner_y')};--brand-group-x:${n('brand_group_x')};--brand-group-y:${n('brand_group_y')};--date-group-x:${n('date_group_x')};--date-group-y:${n('date_group_y')};--line-y:${n('line_y')};--adjust-gap:${adjustGap}px;--adjust-button-size:${buttonSize}px;--panel-h:${SH_CLAMP(this.config.panel_h,-20,40,SH_DEFAULTS.panel_h)};--effect-x:${n('effect_x')};--effect-y:${n('effect_y',-2)};--effect-s:${SH_CLAMP(n('effect_s'),.25,2.5,SH_DEFAULTS.effect_s)};--effect-opacity:${SH_CLAMP(n('effect_opacity'),.1,1,SH_DEFAULTS.effect_opacity)};--panel-gap:${SH_CLAMP(n('panel_gap'),0,20,SH_DEFAULTS.panel_gap)};--panel-button-size:${SH_CLAMP(n('panel_button_size'),.5,2,SH_DEFAULTS.panel_button_size)}"><div class="device"><section class="screen"><div class="header-shell"><div class="group-header"><div class="brand"><div class="flame brand-icon"><img src="data:image/png;base64,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" alt="" style="width:20px;height:20px;filter:drop-shadow(0 0 5px #0284c799)" /></div><div class="brand-name"><b style="${isLabelOn('title')?'':'visibility:hidden'}">${this.safe(getLabel('title',this.config.title||'HEAT'))}</b><small style="${isLabelOn('subtitle')?'':'visibility:hidden'}">${this.safe(getLabel('subtitle','GAS BOILER'))}</small></div></div><div class="clock"><span class="date">${date}</span><strong class="clock-time">${time}</strong></div><span class="signal" title="${signalInfo.title}">
<i style="${signalInfo.bars >= 1 ? `background:${signalInfo.color};box-shadow:0 0 5px ${signalInfo.color}88;opacity:1` : 'opacity:0.25;background:#64748b;box-shadow:none'}"></i>
<i style="${signalInfo.bars >= 2 ? `background:${signalInfo.color};box-shadow:0 0 5px ${signalInfo.color}88;opacity:1` : 'opacity:0.25;background:#64748b;box-shadow:none'}"></i>
<i style="${signalInfo.bars >= 3 ? `background:${signalInfo.color};box-shadow:0 0 5px ${signalInfo.color}88;opacity:1` : 'opacity:0.25;background:#64748b;box-shadow:none'}"></i>
<i style="${signalInfo.bars >= 4 ? `background:${signalInfo.color};box-shadow:0 0 5px ${signalInfo.color}88;opacity:1` : 'opacity:0.25;background:#64748b;box-shadow:none'}"></i>
</span></div><div class="line"></div></div>${(activeProgId || ecoTimerActive) ? `<div class="program-pill" style="position:absolute;top:10px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:5px;background:#0f181eb8;border:1px solid ${currentSlotIsEco ? '#10b981' : 'var(--orange)'};border-radius:12px;padding:2px 8px;font-size:10px;color:#e2e8f0;backdrop-filter:blur(6px);z-index:10;box-shadow:0 2px 6px #000a"><span style="width:6px;height:6px;border-radius:50%;background:${currentSlotIsEco ? '#10b981' : 'var(--orange)'};box-shadow:0 0 6px ${currentSlotIsEco ? '#10b981' : 'var(--orange)'}"></span><b>${ecoTimerActive ? 'ECO' : activeProgId}</b> <span style="color:#94a3b8;font-size:9px">${currentSlotIsEco ? ('ECO ' + ecoTemp + '°C') : ('TARGET ' + targetStr + '°C')}</span></div>` : ''}<div class="screen-grid"><div class="side group-weather"><div class="metric element-outdoor" style="display:${outdoorVisible?'':'none'}"><div class="metric-icon weather-icon"><svg viewBox="0 0 32 32"><path d="M14 4a3 3 0 0 1 6 0v14.6a6 6 0 1 1-6 0Z"/><path d="M17 11v9.6"/><path d="M11 9h1.5M11 13h1.5M11 17h1.5"/></svg></div><div><label style="${isLabelOn('outdoor')?'':'visibility:hidden'}">${this.safe(getLabel('outdoor',tr('outdoor')))}</label><strong>${outdoor==='—'?SH_DOTS:`${this.safe(outdoor)} <em>°C</em>`}</strong></div></div><div class="metric element-wind" style="display:${windVisible?'':'none'}"><div class="metric-icon weather-icon"><svg viewBox="0 0 32 32"><path d="M3 11h16c3 0 3-5 0-5-1.4 0-2.4.7-3 1.8M3 16h22c4 0 4 6 0 6-1.7 0-2.8-.8-3.5-2M3 21h10"/></svg></div><div><label style="${isLabelOn('wind')?'':'visibility:hidden'}">${this.safe(getLabel('wind',tr('wind')))}</label><strong>${wind==='—'?SH_DOTS:this.safe(wind)}</strong></div></div><div class="metric element-rain" style="display:${rainVisible?'':'none'}"><div class="metric-icon weather-icon"><svg viewBox="0 0 32 32">${rainIcon}</svg></div><div><label style="${isLabelOn('rain')?'':'visibility:hidden'}">${this.safe(getLabel('rain',tr('rain')))}</label><strong>${rain==='—'?SH_DOTS:this.safe(rain)}</strong></div></div></div><div class="center group-climate"><div class="dial ${showFlame&&enabled?'is-heating':''}"><div class="flame-effect ${showFlame?'is-active':''} ${flameDim?'is-dim':''}"><div class="flame-layer"><svg viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true"><defs><radialGradient id="sh-blue-glow" cx="50%" cy="85%" r="70%"><stop offset="0%" stop-color="#00e5ff" stop-opacity="0.6"/><stop offset="30%" stop-color="#0066ff" stop-opacity="0.4"/><stop offset="70%" stop-color="#001a66" stop-opacity="0.15"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient><linearGradient id="sh-flame-outer" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stop-color="#002b80" stop-opacity="0.95"/><stop offset="25%" stop-color="#0055ff" stop-opacity="0.88"/><stop offset="65%" stop-color="#00bfff" stop-opacity="0.8"/><stop offset="100%" stop-color="#80e5ff" stop-opacity="0"/></linearGradient><linearGradient id="sh-flame-mid" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stop-color="#0066ff" stop-opacity="0.95"/><stop offset="35%" stop-color="#00d5ff" stop-opacity="0.9"/><stop offset="80%" stop-color="#80f2ff" stop-opacity="0.85"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></linearGradient><linearGradient id="sh-flame-inner" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stop-color="#00f0ff" stop-opacity="1"/><stop offset="45%" stop-color="#a6f8ff" stop-opacity="0.95"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.85"/></linearGradient></defs><rect width="200" height="200" fill="url(#sh-blue-glow)"/><path class="flame-outer" fill="url(#sh-flame-outer)" d="M100 200C45 200 15 160 25 120c8-25 32-45 45-72 15-28 14-48 30-48s15 20 30 48c13 27 37 47 45 72 10 40-20 80-75 80Z"/><path class="flame-mid" fill="url(#sh-flame-mid)" d="M100 195c-35 0-55-30-48-60 6-22 26-38 36-60 8-18 4-33 12-33s4 15 12 33c10 22 30 38 36 60 7 30-13 60-48 60Z"/><path class="flame-inner" fill="url(#sh-flame-inner)" d="M100 190c-20 0-32-18-28-36 4-14 18-24 24-38 5-10 1-18 4-18s-1 8 4 18c6 14 20 24 24 38 4 18-8 36-28 36Z"/></svg></div></div><div class="dial-content"><div class="temp">${(room==='—'||room===null||room===undefined||room===''||room==='unavailable'||room==='unknown'||room==='None')?SH_DOTS:`<span class="temp-int" style="display:${this.config.room_int_visible!==false?'':'none'}">${this.safe(roomInt)}</span><span class="temp-dec" style="display:${this.config.room_dec_visible!==false?'':'none'}">${roomDec?'.'+this.safe(roomDec):''}</span><sup class="temp-unit" style="display:${this.config.room_unit_visible!==false?'':'none'}">°C</sup>`}</div><div class="target"><strong><span class="target-int">${this.safe(targetInt)}</span><span class="target-dec" style="display:${this.config.target_dec_visible!==false?'':'none'}">${targetDec?'.'+this.safe(targetDec):''}</span><span class="target-unit" style="display:${this.config.target_unit_visible!==false?'':'none'}">°C</span></strong></div></div></div><div class="adjust"><button data-delta="-${currentTempStep}">−</button><button data-delta="${currentTempStep}">+</button></div></div><div class="side"><div class="metric orange element-humidity group-humidity" style="display:${humidityVisible?'':'none'}"><div class="metric-icon weather-icon"><svg viewBox="0 0 32 32"><path d="M16 4c0 0 9 11.7 9 17a9 9 0 1 1-18 0c0-5.3 9-17 9-17Z"/></svg></div><div style="text-align:right"><label style="${isLabelOn('humidity')?'':'visibility:hidden'}">${this.safe(getLabel('humidity',tr('humidity')))}</label><strong class="humidity-value">${humidity==='—'?SH_DOTS:`<span class="humidity-int">${this.safe(String(humidity).split('.')[0])}</span><span class="humidity-dec">${String(humidity).includes('.')?'.'+String(humidity).split('.')[1]:''}</span><em class="humidity-unit">%</em>`}</strong></div></div>${hasAnyContact ? `<div class="scheme-title element-scheme" style="${isLabelOn('scheme')?'':'visibility:hidden'}">${this.safe(getLabel('scheme',tr('scheme')))}</div><div class="scheme element-scheme" style="${hasContact1 && hasContact2 ? '' : 'grid-template-columns:max-content;'}">${hasContact1 ? `<div class="scheme-card ${contact1On?'active':''}" data-scheme-toggle="1" role="button" tabindex="0">${alert1 ? `<button class="scheme-alert-btn" data-alert-contact="1" title="${this.safe(tr('alert_hint'))}">!</button>` : ''}<div class="scheme-header"><div class="scheme-badge"><span class="scheme-num">#1</span><span class="scheme-sub">${this.safe(tr('c1_badge'))}</span></div><div class="scheme-led"></div></div><div class="scheme-icon"><svg viewBox="0 0 24 24" class="contact-icon-svg"><path d="M9.6 14.6V5.4a2.4 2.4 0 1 1 4.8 0v9.2a4.7 4.7 0 1 1-4.8 0Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="17.6" r="1.8" fill="currentColor"/><path d="M12 12.4v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M17.6 8a4.6 4.6 0 0 1 0 5.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M20.4 5.6a8.4 8.4 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity="0.65"/></svg></div><span class="scheme-label" style="${isLabelOn('contact1')?'':'visibility:hidden'}">${getLabel('contact1',tr('contact1'))}</span></div>` : ''}${hasContact2 ? `<div class="scheme-card ${contact2On?'active':''}" data-scheme-toggle="2" role="button" tabindex="0">${alert2 ? `<button class="scheme-alert-btn" data-alert-contact="2" title="${this.safe(tr('alert_hint'))}">!</button>` : ''}<div class="scheme-header"><div class="scheme-badge"><span class="scheme-num">#2</span><span class="scheme-sub">${this.safe(tr('c2_badge'))}</span></div><div class="scheme-led"></div></div><div class="scheme-icon"><svg viewBox="0 0 24 24" class="contact-icon-svg"><circle cx="12" cy="13" r="7.8" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="13" r="4.4" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/><path d="M12 9.2V13l2.9 1.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="13" r="1.2" fill="currentColor"/><path d="M9.4 2.6h5.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 2.6v2.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4.9 6.3 6.6 8M19.1 6.3 17.4 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></div><span class="scheme-label" style="${isLabelOn('contact2')?'':'visibility:hidden'}">${getLabel('contact2',tr('contact2'))}</span></div>` : ''}</div>` : ''}</div></div></section><nav class="control-panel group-panel"><div class="control power ${enabled?'active':''}" data-power><span class="button"><svg viewBox="0 0 24 24"><path d="M12 3v8m-5.7-5A9 9 0 1 0 17.7 6"/></svg></span></div><div class="control program ${activeProgId || ecoTimerActive ? 'active' : ''}" data-program-btn><span class="button"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>${activeProgId || ecoTimerActive ? `<span class="badge" style="position:absolute;bottom:-3px;right:-3px;background:var(--orange);color:#0a1014;font-size:9px;font-weight:800;padding:1px 4px;border-radius:6px;line-height:1;border:1px solid #000">${ecoTimerActive ? 'ECO' : activeProgId}</span>` : ''}</span></div><div class="control fire" style="pointer-events:none"><span class="button" style="pointer-events:none;opacity:0.35;border-color:#334155;color:#475569;box-shadow:none;filter:none"><svg viewBox="0 0 24 24"><path d="M12 21c4 0 6.2-2.7 6.2-6.2 0-3.8-2.9-5.2-4.2-8.8-1.7 1.5-2.2 3-2 4.7-2.5-1.3-3.1-3.2-3-5.7C6.7 7.8 5.8 10.1 5.8 13.5 5.8 18.1 8.4 21 12 21Z"/></svg></span></div><div class="control stats-btn ${this._statsOpen ? 'active' : ''}" data-stats-btn><span class="button"><svg viewBox="0 0 24 24"><path d="M4 19v-5m5 5V9m5 10V5m5 14v-8"/></svg></span></div><div class="control settings"><span class="button"><svg viewBox="0 0 24 24"><path d="M12 2.8l1 2.1c.6.1 1.2.4 1.8.7l2.1-1 1.5 1.5-1 2.1c.3.6.6 1.2.7 1.8l2.1 1v2l-2.1 1c-.1.6-.4 1.2-.7 1.8l1 2.1-1.5 1.5-2.1-1c-.6.3-1.2.6-1.8.7l-1 2.1h-2l-1-2.1c-.6-.1-1.2-.4-1.8-.7l-2.1 1-1.5-1.5 1-2.1c-.3-.6-.6-1.2-.7-1.8l-2.1-1v-2l2.1-1c.1-.6.4-1.2.7-1.8l-1-2.1 1.5-1.5 2.1 1c.6-.3 1.2-.6 1.8-.7l1-2.1h2Z"/><circle cx="12" cy="12" r="3.2"/></svg></span></div>${relayMismatch ? `<div class="relay-warning" style="position:absolute;bottom:75px;left:10px;right:10px;background:#ef444422;border:1px solid #ef4444;border-radius:8px;padding:6px 10px;font-size:11px;color:#fca5a5;display:flex;align-items:center;gap:6px;z-index:20;backdrop-filter:blur(4px)">⚠️ <b>${tr('relay_warning')}</b></div>` : ''}</nav></div></ha-card>${this._alertDialog ? `<div class="modal-backdrop alert-backdrop" style="z-index:1150;padding:12px;background:#0009;position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center"><section class="modal" tabindex="-1" style="max-width:440px;width:100%;background:#111b21;border:1px solid #ef4444;box-shadow:0 12px 36px #ef444433,0 4px 20px #000;border-radius:14px;padding:18px 20px;color:#f1f5f9;position:relative">
  <button class="modal-close alert-close" style="position:absolute;top:12px;right:14px;background:none;border:none;color:#94a3b8;font-size:22px;cursor:pointer">×</button>
  <div style="display:flex;align-items:center;gap:10px;font-size:16px;font-weight:700;color:#ef4444;margin-bottom:12px">
    <span style="font-size:22px">⚠️</span><span>${this.safe(this._alertDialog.title)}</span>
  </div>
  <div style="font-size:13px;line-height:1.5;color:#e2e8f0;background:#1e293b;padding:12px;border-radius:8px;border-left:3px solid #ef4444;margin-bottom:16px">${this.safe(this._alertDialog.message)}</div>
  <div style="font-size:11px;color:#94a3b8;margin-bottom:16px">Порада: перевірте живлення реле, якість сигналу бездротової мережі або перезапустіть відповідний модуль.</div>
  <div style="display:flex;justify-content:flex-end">
    <button class="alert-ok" style="padding:7px 18px;border-radius:8px;background:#ef4444;border:none;color:#fff;font-weight:600;cursor:pointer">Зрозуміло</button>
  </div>
</section></div>` : ''}${this._scheduleOpen ? `<div class="modal-backdrop schedule-backdrop" style="z-index:1050;padding:12px"><section class="modal" tabindex="-1" style="max-width:540px;width:100%;max-height:92vh;overflow-y:auto;background:#0d1419;border:1px solid #2d3b45;box-shadow:0 12px 36px #000e;border-radius:14px;padding:16px 18px">
  <button class="modal-close schedule-close" style="top:12px;right:14px">×</button>
  <div class="modal-title" style="display:flex;align-items:center;gap:8px;font-size:16px;color:#f1f5f9;margin-bottom:14px">
    <span>📅</span><b>${tr('programs_title')}</b>
  </div>

  <!-- Quick Eco Timer Block -->
  <div style="background:#142028;border:1px solid #233440;border-radius:10px;padding:12px 14px;margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <b style="color:#10b981;font-size:13px;display:flex;align-items:center;gap:5px"><span>🌱</span> ${tr('quick_eco')}</b>
      <span style="font-size:11px;color:${ecoTimerActive ? '#10b981' : '#64748b'};font-weight:600">${ecoTimerActive ? (tr('remaining') + ': ' + ecoRemainingMin + ' хв') : tr('off')}</span>
    </div>
    <div style="font-size:11px;color:#94a3b8;margin-bottom:10px">${tr('quick_eco_desc')}</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="sh-eco-btn ${ecoTimerActive ? '' : 'active'}" data-eco-timer="0" style="padding:6px 10px;border-radius:6px;border:1px solid #334155;background:${ecoTimerActive ? '#1e293b' : '#10b98122'};color:${ecoTimerActive ? '#94a3b8' : '#10b981'};cursor:pointer;font-size:11px">${tr('off')}</button>
      <button class="sh-eco-btn" data-eco-timer="30" style="padding:6px 10px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;cursor:pointer;font-size:11px">30 хв</button>
      <button class="sh-eco-btn" data-eco-timer="60" style="padding:6px 10px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;cursor:pointer;font-size:11px">1 год</button>
      <button class="sh-eco-btn" data-eco-timer="120" style="padding:6px 10px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;cursor:pointer;font-size:11px">2 год</button>
      <button class="sh-eco-btn" data-eco-timer="240" style="padding:6px 10px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;cursor:pointer;font-size:11px">4 год</button>
      <button class="sh-eco-btn" data-eco-timer="480" style="padding:6px 10px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;cursor:pointer;font-size:11px">8 год</button>
    </div>
  </div>

  <!-- Temperature Targets -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
    <div style="background:#142028;border:1px solid #ff8a0044;border-radius:10px;padding:10px 12px">
      <div style="color:var(--orange);font-size:11px;font-weight:700;margin-bottom:4px">🔥 ${tr('target_mode')}</div>
      <div style="display:flex;align-items:center;gap:6px">
        <button class="sh-step-btn" data-target-temp-step="-${currentTempStep}" style="width:24px;height:24px;font-size:14px;padding:0;line-height:1">−</button>
        <span style="font-size:18px;font-weight:700;color:#fff;min-width:55px;text-align:center" data-target-temp-val>${Number(target).toFixed(1)} °C</span>
        <button class="sh-step-btn" data-target-temp-step="${currentTempStep}" style="width:24px;height:24px;font-size:14px;padding:0;line-height:1">+</button>
      </div>
    </div>
    <div style="background:#142028;border:1px solid #10b98144;border-radius:10px;padding:10px 12px">
      <div style="color:#10b981;font-size:11px;font-weight:700;margin-bottom:4px">🌱 ${tr('eco_temp')}</div>
      <div style="display:flex;align-items:center;gap:6px">
        <button class="sh-step-btn" data-eco-temp-step="-0.1" style="width:24px;height:24px;font-size:14px;padding:0;line-height:1">−</button>
        <span style="font-size:18px;font-weight:700;color:#fff;min-width:55px;text-align:center" data-eco-temp-val>${Number(ecoTemp).toFixed(1)} °C</span>
        <button class="sh-step-btn" data-eco-temp-step="0.1" style="width:24px;height:24px;font-size:14px;padding:0;line-height:1">+</button>
      </div>
    </div>
  </div>

  <!-- Programs List -->
  <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
    ${Object.entries(progs).map(([pid, p]) => {
      const isProgActive = activeProgId === pid;
      return `<div style="background:#111a21;border:1px solid ${isProgActive ? 'var(--orange)' : '#24323c'};border-radius:10px;padding:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="radio" name="active_prog" value="${pid}" ${isProgActive ? 'checked' : ''} data-select-prog="${pid}" style="accent-color:var(--orange);width:16px;height:16px;cursor:pointer"/>
            <b style="color:${isProgActive ? 'var(--orange)' : '#e2e8f0'};font-size:14px">${this.safe(p.name || pid)}</b>
          </label>
          <div style="display:flex;gap:6px">
            <button class="sh-prog-fill" data-fill-prog="${pid}" data-fill="target" style="padding:3px 8px;border-radius:4px;border:1px solid #ff8a0055;background:#ff8a0015;color:var(--orange);font-size:10px;cursor:pointer">${tr('all_comfort')}</button>
            <button class="sh-prog-fill" data-fill-prog="${pid}" data-fill="eco" style="padding:3px 8px;border-radius:4px;border:1px solid #10b98155;background:#10b98115;color:#10b981;font-size:10px;cursor:pointer">${tr('all_eco')}</button>
            ${(Object.keys(progs).length > 1 && pid !== 'P1') ? `<button class="sh-delete-prog" data-del-prog="${pid}" style="padding:3px 8px;border-radius:4px;border:1px solid #ef444455;background:#ef444415;color:#ef4444;font-size:10px;cursor:pointer">✕</button>` : ''}
          </div>
        </div>
        <!-- 24h interactive timeline -->
        <div style="display:grid;grid-template-columns:repeat(24, 1fr);gap:2px;background:#080d11;padding:6px;border-radius:6px;margin-top:6px">
          ${p.hours.map((val, h) => {
            const isComfort = val === 1;
            const isNowHour = h === curHour;
            return `<button data-hour-toggle="${pid}:${h}" title="${h}:00 - ${isComfort ? tr('target_mode') : tr('eco_mode')}" style="height:26px;border-radius:3px;border:${isNowHour ? '1px solid #fff' : 'none'};background:${isComfort ? 'var(--orange)' : '#10b981'};color:#000;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;position:relative">
              ${h % 3 === 0 ? h : ''}
            </button>`;
          }).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;color:#64748b;font-size:9px;margin-top:3px;padding:0 2px">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
        </div>
      </div>`;
    }).join('')}
  </div>

  <div style="display:flex;gap:10px;justify-content:space-between;align-items:center;border-top:1px solid #233440;padding-top:14px">
    <button class="sh-add-prog-btn" style="padding:8px 16px;border-radius:8px;border:1px dashed #475569;background:#1e293b;color:#e2e8f0;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px">
      <span>➕</span> ${tr('add_program')}
    </button>
    <button class="sh-prog-deactivate" style="padding:8px 14px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#94a3b8;font-size:12px;cursor:pointer">
      ${tr('off')} (${tr('target_mode')})
    </button>
  </div>
</section></div>` : ''}
${this._statsOpen ? `<div class="modal-backdrop stats-backdrop" style="z-index:1050;padding:12px"><section class="modal" tabindex="-1" style="max-width:560px;width:100%;max-height:92vh;overflow-y:auto;background:#0d1419;border:1px solid #2d3b45;box-shadow:0 12px 36px #000e;border-radius:14px;padding:16px 18px">
  <button class="modal-close stats-close" style="top:12px;right:14px">×</button>
  <div class="modal-title" style="display:flex;align-items:center;gap:8px;font-size:16px;color:#f1f5f9;margin-bottom:14px">
    <span>📊</span><b>${tr('history_title')}</b>
  </div>

  <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;background:#142028;border:1px solid #233440;border-radius:10px;padding:8px 12px;margin-bottom:14px">
    <button class="stats-day-prev" style="padding:6px 10px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;cursor:pointer;font-size:12px">◀ ${tr('prev_day')}</button>
    <div style="display:flex;align-items:center;gap:6px">
      <input type="date" class="stats-date-input" value="${this._getStatsDateStr()}" style="background:#091015;border:1px solid #334155;color:#e2e8f0;border-radius:6px;padding:4px 8px;font-size:12px;cursor:pointer" />
      <button class="stats-day-today" style="padding:4px 8px;border-radius:6px;border:1px solid #334155;background:#1e293b;color:var(--orange);cursor:pointer;font-size:11px;font-weight:700">${tr('today')}</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-bottom:14px">
    <div style="background:#142028;border:1px solid #ff8a0033;border-radius:8px;padding:8px 10px;text-align:center">
      <div style="color:#94a3b8;font-size:10px">${tr('contact1_runtime')}</div>
      <div style="color:var(--orange);font-size:15px;font-weight:700;margin-top:2px">${this._calcC1Runtime(this._statsHistory)}</div>
    </div>
    <div style="background:#142028;border:1px solid #38bdf833;border-radius:8px;padding:8px 10px;text-align:center">
      <div style="color:#94a3b8;font-size:10px">${tr('heating_cycles')}</div>
      <div style="color:#38bdf8;font-size:15px;font-weight:700;margin-top:2px">${this._calcC1Cycles(this._statsHistory)}</div>
    </div>
    <div style="background:#142028;border:1px solid #10b98133;border-radius:8px;padding:8px 10px;text-align:center">
      <div style="color:#94a3b8;font-size:10px">${tr('temp_range')}</div>
      <div style="color:#10b981;font-size:15px;font-weight:700;margin-top:2px">${this._calcTempRange(this._statsHistory)}</div>
    </div>
  </div>

  <div style="background:#091015;border:1px solid #1e293b;border-radius:10px;padding:12px 10px;margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-size:11px;color:#94a3b8">${tr('daily_chart')}</span>
      <div style="display:flex;gap:12px;font-size:10px">
        <span style="display:flex;align-items:center;gap:4px;color:#ff8a00"><span style="width:12px;height:2px;background:#ff8a00;display:inline-block"></span> ${tr('target_mode')}</span>
        <span style="display:flex;align-items:center;gap:4px;color:#10b981"><span style="width:12px;height:2px;background:#10b981;display:inline-block"></span> ${tr('eco_mode')}</span>
        <span style="display:flex;align-items:center;gap:4px;color:#38bdf8"><span style="width:12px;height:2px;background:#38bdf8;display:inline-block"></span> ${tr('room_temp')}</span>
      </div>
    </div>
    <div class="stats-chart-svg" style="width:100%;height:190px;overflow:hidden">
      ${this._renderDailyChartSvg(this._statsHistory, target)}
    </div>
  </div>

  <div style="font-size:10px;color:#64748b;line-height:1.4;text-align:center;padding:0 6px">
    ℹ️ ${tr('stats_notice')}
  </div>
</section></div>` : ''}
${this._confirmDialog?`<div class="modal-backdrop confirm-backdrop" style="z-index:1100"><section class="modal" tabindex="-1" style="max-width:380px"><button class="modal-close confirm-cancel">×</button><div class="modal-title" style="color:var(--orange)">${this._confirmDialog.title}</div><div style="margin:14px 0 10px;font-size:clamp(12px,1.2cqw,16px);line-height:1.45;color:#d8e2ea">${this._confirmDialog.message}</div><div style="margin:10px 0 18px;padding:9px 12px;background:#ff8a0015;border-left:3px solid var(--orange);border-radius:6px;font-size:clamp(11px,1.05cqw,14px);color:#ffaa44;line-height:1.4">${this._confirmDialog.impact}</div><div style="display:flex;gap:10px;justify-content:flex-end;margin-top:14px"><button class="confirm-cancel" style="padding:8px 16px;border-radius:8px;border:1px solid #4f5d68;background:#182228;color:#c8d2dc;cursor:pointer;font-weight:600">Скасувати</button><button class="confirm-ok" style="padding:8px 18px;border-radius:8px;border:none;background:var(--orange);color:#0a1014;cursor:pointer;font-weight:700">Підтвердити</button></div></section></div>`:''}${this._menuOpen?`<div class="modal-backdrop"><section class="modal" tabindex="-1"><button class="modal-close">×</button><div class="modal-title">${tr('settings')}</div><div class="tabs">
<div class="menu-section ${tab==='hysteresis'?'open':''}"><button data-menu-section="hysteresis" class="menu-head"><span>∿</span><b>${tr('hysteresis')}</b><i>${tab==='hysteresis'?'▲':'▼'}</i></button>${tab==='hysteresis'?`<div class="menu-body">
<div class="sh-hyst-group">
  <div class="sh-hyst-label"><span>${tr('hysteresis_on')}</span><span class="sh-hyst-val" data-hyst-val="on">${Number(currentHOn).toFixed(1)} °C</span></div>
  <div class="sh-hyst-desc">${tr('hyst_on_desc')}</div>
  <div class="sh-hyst-controls">
    <button class="sh-step-btn" data-hyst-step="on" data-step="-0.1">−</button>
    <input type="range" class="sh-slider" data-hyst-slider="on" min="0" max="5" step="0.1" value="${Number(currentHOn).toFixed(1)}" />
    <button class="sh-step-btn" data-hyst-step="on" data-step="0.1">+</button>
  </div>
</div>
<div class="sh-hyst-group">
  <div class="sh-hyst-label"><span>${tr('hysteresis_off')}</span><span class="sh-hyst-val" data-hyst-val="off">${Number(currentHOff).toFixed(1)} °C</span></div>
  <div class="sh-hyst-desc">${tr('hyst_off_desc')}</div>
  <div class="sh-hyst-controls">
    <button class="sh-step-btn" data-hyst-step="off" data-step="-0.1">−</button>
    <input type="range" class="sh-slider" data-hyst-slider="off" min="0" max="5" step="0.1" value="${Number(currentHOff).toFixed(1)}" />
    <button class="sh-step-btn" data-hyst-step="off" data-step="0.1">+</button>
  </div>
</div>
<div class="sh-hyst-group">
  <div class="sh-hyst-label"><span>${tr('temp_step')}</span><span class="sh-hyst-val" data-temp-step-val>${Number(currentTempStep).toFixed(1)} °C</span></div>
  <div class="sh-hyst-desc">${tr('temp_step_desc')}</div>
  <div class="sh-hyst-controls">
    <button class="sh-step-btn" data-temp-step-btn data-step="-0.1">−</button>
    <input type="range" class="sh-slider" data-temp-step-slider min="0.1" max="2" step="0.1" value="${Number(currentTempStep).toFixed(1)}" />
    <button class="sh-step-btn" data-temp-step-btn data-step="0.1">+</button>
  </div>
</div>
<div class="sh-hyst-group">
  <div class="sh-hyst-label"><span>${tr('relay_timeout')}</span><span class="sh-hyst-val" data-relay-timeout-val>${Number(relayTimeoutVal).toFixed(0)} с</span></div>
  <div class="sh-hyst-desc">${tr('relay_timeout_desc')}</div>
  <div class="sh-hyst-controls">
    <button class="sh-step-btn" data-relay-timeout-btn data-step="-1">−</button>
    <input type="range" class="sh-slider" data-relay-timeout-slider min="5" max="60" step="1" value="${Number(relayTimeoutVal).toFixed(0)}" />
    <button class="sh-step-btn" data-relay-timeout-btn data-step="1">+</button>
  </div>
</div>
<div class="sh-hyst-group">
  <div class="sh-hyst-label"><span>${tr('min_target')}</span><span class="sh-hyst-val" data-min-target-val>${Number(currentMinTarget).toFixed(1)} °C</span></div>
  <div class="sh-hyst-desc">${tr('min_target_desc')}</div>
  <div class="sh-hyst-controls">
    <button class="sh-step-btn" data-min-target-btn data-step="-0.5">−</button>
    <input type="range" class="sh-slider" data-min-target-slider min="5" max="35" step="0.5" value="${Number(currentMinTarget).toFixed(1)}" />
    <button class="sh-step-btn" data-min-target-btn data-step="0.5">+</button>
  </div>
</div>
<div class="sh-hyst-group">
  <div class="sh-hyst-label"><span>${tr('max_target')}</span><span class="sh-hyst-val" data-max-target-val>${Number(currentMaxTarget).toFixed(1)} °C</span></div>
  <div class="sh-hyst-desc">${tr('max_target_desc')}</div>
  <div class="sh-hyst-controls">
    <button class="sh-step-btn" data-max-target-btn data-step="-0.5">−</button>
    <input type="range" class="sh-slider" data-max-target-slider min="5" max="35" step="0.5" value="${Number(currentMaxTarget).toFixed(1)}" />
    <button class="sh-step-btn" data-max-target-btn data-step="0.5">+</button>
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
    {key:'contact2',title:tr('lbl_contact2'),def:tr('contact2')}
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
</div></section></div>`:''}`;
    const root=this.shadowRoot;
    const closeMenu=()=>{this._menuOpen=false;this.render()};
    
    // Schedule modal toggle and close
    root.querySelector('[data-program-btn]')?.addEventListener('click', () => {
      this._scheduleOpen = !this._scheduleOpen;
      if (this._scheduleOpen) {
        this._statsOpen = false;
        this._menuOpen = false;
      }
      this.render();
    });

    root.querySelectorAll('.schedule-close, .schedule-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || el.classList.contains('schedule-close')) {
          this._scheduleOpen = false;
          this.render();
        }
      });
    });

    // Program selection
    root.querySelectorAll('[data-select-prog]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const pid = e.target.value;
        this._activeProgId = pid;
        SH_WRITE_STORE(SH_ACTIVE_PROG_KEY, pid);
        this._hass.callService('smart_heating', 'set_program', { entity_id: this.config.entity, program: pid });
        this.render();
      });
    });

    // Toggle hour in program
    root.querySelectorAll('[data-hour-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [pid, hStr] = btn.dataset.hourToggle.split(':');
        const h = Number(hStr);
        const pList = this._getProgramsList();
        if (pList[pid]) {
          pList[pid].hours[h] = pList[pid].hours[h] === 1 ? 0 : 1;
          this._saveProgramsList(pList);
          this._hass.callService('smart_heating', 'set_program', { entity_id: this.config.entity, programs: pList });
          this.render();
        }
      });
    });

    // Fill all target / all eco
    root.querySelectorAll('[data-fill-prog]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.fillProg;
        const mode = btn.dataset.fill;
        const pList = this._getProgramsList();
        if (pList[pid]) {
          pList[pid].hours = Array(24).fill(mode === 'target' ? 1 : 0);
          this._saveProgramsList(pList);
          this._hass.callService('smart_heating', 'set_program', { entity_id: this.config.entity, programs: pList });
          this.render();
        }
      });
    });

    // Add new program
    root.querySelector('.sh-add-prog-btn')?.addEventListener('click', () => {
      const pList = this._getProgramsList();
      let nextNum = 1;
      while (pList['P' + nextNum]) {
        nextNum++;
      }
      const newPid = 'P' + nextNum;
      pList[newPid] = {
        name: newPid,
        hours: Array(24).fill(1)
      };
      this._saveProgramsList(pList);
      this._hass.callService('smart_heating', 'set_program', { entity_id: this.config.entity, programs: pList });
      this.render();
    });

    // Delete program
    root.querySelectorAll('[data-del-prog]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const pid = btn.dataset.delProg;
        const pList = this._getProgramsList();
        if (Object.keys(pList).length > 1 && pid !== 'P1') {
          delete pList[pid];
          if (this._activeProgId === pid) {
            this._activeProgId = '';
            SH_WRITE_STORE(SH_ACTIVE_PROG_KEY, '');
            this._hass.callService('smart_heating', 'set_program', { entity_id: this.config.entity, program: '', programs: pList });
          } else {
            this._hass.callService('smart_heating', 'set_program', { entity_id: this.config.entity, programs: pList });
          }
          this._saveProgramsList(pList);
          this.render();
        }
      });
    });

    // Deactivate program
    root.querySelector('.sh-prog-deactivate')?.addEventListener('click', () => {
      this._activeProgId = '';
      SH_WRITE_STORE(SH_ACTIVE_PROG_KEY, '');
      this._hass.callService('smart_heating', 'set_program', { entity_id: this.config.entity, program: '' });
      this.render();
    });

    // Quick eco timer buttons
    root.querySelectorAll('[data-eco-timer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dur = Number(btn.dataset.ecoTimer);
        SH_WRITE_STORE(SH_ECO_TIMER_KEY, String(dur > 0 ? Date.now() + dur * 60000 : 0));
        this._hass.callService('smart_heating', 'set_eco_timer', { entity_id: this.config.entity, duration: dur });
        this.render();
      });
    });

    // Target temp step (same step configured in the Hysteresis tab)
    root.querySelectorAll('[data-target-temp-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = Number(btn.dataset.targetTempStep);
        const curTarget = Number(a.temperature ?? target);
        if (!Number.isFinite(curTarget)) return;
        const min = Number.isFinite(Number(a.min_temp)) ? Number(a.min_temp) : this._getMinTarget();
        const max = Number.isFinite(Number(a.max_temp)) ? Number(a.max_temp) : this._getMaxTarget();
        const nextTarget = Math.min(max, Math.max(min, Number((curTarget + step).toFixed(2))));
        if (nextTarget === curTarget) return;
        this._hass.callService('climate', 'set_temperature', { entity_id: this.config.entity, temperature: nextTarget });
        // eco must stay at least 0.5 below target; pull it down if the new
        // target no longer leaves room for it.
        const curEco = Number(a.eco_temperature ?? this._getEcoTemp());
        if (Number.isFinite(curEco) && curEco > nextTarget - 0.5) {
          this._hass.callService('smart_heating', 'set_eco_temperature', { entity_id: this.config.entity, temperature: Number((nextTarget - 0.5).toFixed(1)) });
        }
        this.render();
      });
    });

    // Eco temp step
    root.querySelectorAll('[data-eco-temp-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = Number(btn.dataset.ecoTempStep);
        const curEco = Number(a.eco_temperature ?? 18);
        const curTarget = Number(a.temperature ?? target);
        const ecoCeiling = Number.isFinite(curTarget) ? curTarget - 0.5 : 30;
        const nextEco = Math.max(10, Math.min(30, Math.min(ecoCeiling, Number((curEco + step).toFixed(1)))));
        this._hass.callService('smart_heating', 'set_eco_temperature', { entity_id: this.config.entity, temperature: nextEco });
        this.render();
      });
    });

    // Stats modal toggle and navigation
    root.querySelector('[data-stats-btn]')?.addEventListener('click', () => {
      this._statsOpen = !this._statsOpen;
      if (this._statsOpen) {
        this._scheduleOpen = false;
        this._menuOpen = false;
        this._fetchHistoryForStats(this._getStatsDateStr());
      }
      this.render();
    });

    root.querySelectorAll('.stats-close, .stats-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || el.classList.contains('stats-close')) {
          this._statsOpen = false;
          this.render();
        }
      });
    });

    root.querySelector('.stats-day-prev')?.addEventListener('click', () => {
      const cur = new Date(this._getStatsDateStr());
      cur.setDate(cur.getDate() - 1);
      const yr = cur.getFullYear(), mo = String(cur.getMonth()+1).padStart(2,'0'), da = String(cur.getDate()).padStart(2,'0');
      this._statsDate = `${yr}-${mo}-${da}`;
      this._fetchHistoryForStats(this._statsDate);
      this.render();
    });

    root.querySelector('.stats-day-today')?.addEventListener('click', () => {
      const now = new Date();
      const yr = now.getFullYear(), mo = String(now.getMonth()+1).padStart(2,'0'), da = String(now.getDate()).padStart(2,'0');
      this._statsDate = `${yr}-${mo}-${da}`;
      this._fetchHistoryForStats(this._statsDate);
      this.render();
    });

    root.querySelector('.stats-date-input')?.addEventListener('change', (e) => {
      if (e.target.value) {
        this._statsDate = e.target.value;
        this._fetchHistoryForStats(this._statsDate);
        this.render();
      }
    });

    root.querySelector('[data-power]')?.addEventListener('click',()=>this._hass.callService('climate','set_hvac_mode',{entity_id:this.config.entity,hvac_mode:enabled?'off':'heat'}));
    root.querySelector('.control.settings')?.addEventListener('click',()=>{this._scheduleOpen=false;this._statsOpen=false;this._menuTab='';this._menuOpen=true;this.render()});
    // Alert badge click listeners
    root.querySelectorAll('[data-alert-contact]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const contactNum = btn.dataset.alertContact;
        const msg = contactNum === '1' ? alert1 : alert2;
        this._alertDialog = {
          title: `Аварія: Блок ${contactNum} (Контакт ${contactNum})`,
          message: msg || 'Немає зв’язку або сталася помилка синхронізації з реле.'
        };
        this.render();
      });
    });

    root.querySelectorAll('.alert-close, .alert-ok').forEach(btn => {
      btn.addEventListener('click', () => {
        this._alertDialog = null;
        this.render();
      });
    });

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
    const curTabs=this.shadowRoot.querySelector('.tabs');
    const curModal=this.shadowRoot.querySelector('.modal');
    if(curTabs&&this._savedTabsScroll!==undefined)curTabs.scrollTop=this._savedTabsScroll;
    if(curModal&&this._savedModalScroll!==undefined)curModal.scrollTop=this._savedModalScroll;
    root.querySelectorAll('[data-menu-section]').forEach(b=>b.addEventListener('click',()=>{this._menuTab=this._menuTab===b.dataset.menuSection?'':b.dataset.menuSection;this.render()}));
    root.querySelectorAll('[data-popup-lang]').forEach(b=>b.addEventListener('click',()=>{
      const chosen=b.dataset.popupLang;
      SH_WRITE_STORE(SH_LANG_KEY,chosen);
      this.config={...this.config,language:chosen};
      this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:this.config},bubbles:true,composed:true}));
      window.dispatchEvent(new CustomEvent('sh-language-changed',{detail:{language:chosen}}));
      this.render();
    }));
    const applyHyst=(onVal,offVal)=>{
      const newOn=Math.min(5,Math.max(0,Number(Number(onVal).toFixed(1))));
      const newOff=Math.min(5,Math.max(0,Number(Number(offVal).toFixed(1))));
      this._hass.callService('smart_heating','set_hysteresis',{entity_id:this.config.entity,hysteresis_on:newOn,hysteresis_off:newOff});
    };
    root.querySelectorAll('[data-hyst-slider="on"]').forEach(sl=>{
      sl.addEventListener('pointerdown',()=>{this._activeSliderDragging=true;});
      sl.addEventListener('input',e=>{const d=root.querySelector('[data-hyst-val="on"]');if(d)d.textContent=Number(e.target.value).toFixed(1)+' °C';});
      sl.addEventListener('change',e=>{this._activeSliderDragging=false;applyHyst(e.target.value,currentHOff);});
      sl.addEventListener('pointerup',()=>{this._activeSliderDragging=false;});
    });
    root.querySelectorAll('[data-hyst-slider="off"]').forEach(sl=>{
      sl.addEventListener('pointerdown',()=>{this._activeSliderDragging=true;});
      sl.addEventListener('input',e=>{const d=root.querySelector('[data-hyst-val="off"]');if(d)d.textContent=Number(e.target.value).toFixed(1)+' °C';});
      sl.addEventListener('change',e=>{this._activeSliderDragging=false;applyHyst(currentHOn,e.target.value);});
      sl.addEventListener('pointerup',()=>{this._activeSliderDragging=false;});
    });
    root.querySelectorAll('[data-hyst-step]').forEach(btn=>btn.addEventListener('click',()=>{
      const which=btn.dataset.hystStep;
      const step=Number(btn.dataset.step)||0.1;
      if(which==='on')applyHyst(Number(currentHOn)+step,currentHOff);
      else applyHyst(currentHOn,Number(currentHOff)+step);
    }));
    const applyRelayTimeout=(val)=>{
      const next=Math.min(60,Math.max(5,Math.round(Number(val))));
      this._hass.callService('smart_heating','set_relay_timeout',{entity_id:this.config.entity,timeout:next});
    };
    root.querySelectorAll('[data-relay-timeout-slider]').forEach(sl=>{
      sl.addEventListener('pointerdown',()=>{this._activeSliderDragging=true;});
      sl.addEventListener('input',e=>{const d=root.querySelector('[data-relay-timeout-val]');if(d)d.textContent=Math.round(Number(e.target.value))+' с';});
      sl.addEventListener('change',e=>{this._activeSliderDragging=false;applyRelayTimeout(e.target.value);});
      sl.addEventListener('pointerup',()=>{this._activeSliderDragging=false;});
    });
    root.querySelectorAll('[data-relay-timeout-btn]').forEach(btn=>btn.addEventListener('click',()=>{
      const step=Number(btn.dataset.step)||1;
      applyRelayTimeout(Number(relayTimeoutVal)+step);
    }));
    const applyMinTarget=(val)=>{
      const next=Math.min(35,Math.max(5,Number(Number(val).toFixed(1))));
      SH_WRITE_STORE(SH_MIN_TARGET_KEY, String(next));
      this._hass.callService('smart_heating','set_min_target_temperature',{entity_id:this.config.entity,temperature:next});
    };
    root.querySelectorAll('[data-min-target-slider]').forEach(sl=>{
      sl.addEventListener('pointerdown',()=>{this._activeSliderDragging=true;});
      sl.addEventListener('input',e=>{const d=root.querySelector('[data-min-target-val]');if(d)d.textContent=Number(e.target.value).toFixed(1)+' °C';});
      sl.addEventListener('change',e=>{this._activeSliderDragging=false;applyMinTarget(e.target.value);});
      sl.addEventListener('pointerup',()=>{this._activeSliderDragging=false;});
    });
    root.querySelectorAll('[data-min-target-btn]').forEach(btn=>btn.addEventListener('click',()=>{
      const step=Number(btn.dataset.step)||0.5;
      applyMinTarget(Number(currentMinTarget)+step);
    }));
    const applyMaxTarget=(val)=>{
      const next=Math.min(35,Math.max(5,Number(Number(val).toFixed(1))));
      SH_WRITE_STORE(SH_MAX_TARGET_KEY, String(next));
      this._hass.callService('smart_heating','set_max_target_temperature',{entity_id:this.config.entity,temperature:next});
    };
    root.querySelectorAll('[data-max-target-slider]').forEach(sl=>{
      sl.addEventListener('pointerdown',()=>{this._activeSliderDragging=true;});
      sl.addEventListener('input',e=>{const d=root.querySelector('[data-max-target-val]');if(d)d.textContent=Number(e.target.value).toFixed(1)+' °C';});
      sl.addEventListener('change',e=>{this._activeSliderDragging=false;applyMaxTarget(e.target.value);});
      sl.addEventListener('pointerup',()=>{this._activeSliderDragging=false;});
    });
    root.querySelectorAll('[data-max-target-btn]').forEach(btn=>btn.addEventListener('click',()=>{
      const step=Number(btn.dataset.step)||0.5;
      applyMaxTarget(Number(currentMaxTarget)+step);
    }));
    const applyTempStep=(val)=>{
      const next=Math.min(2,Math.max(.1,Number(Number(val).toFixed(1))));
      SH_WRITE_STORE(SH_TEMP_STEP_KEY,String(next));
      this._hass.callService('smart_heating','set_temp_step',{entity_id:this.config.entity,step:next});
    };
    root.querySelectorAll('[data-temp-step-slider]').forEach(sl=>{
      sl.addEventListener('pointerdown',()=>{this._activeSliderDragging=true;});
      sl.addEventListener('input',e=>{
        const val=Number(e.target.value);
        const d=root.querySelector('[data-temp-step-val]');
        if(d)d.textContent=val.toFixed(1)+' °C';
        const next=Math.min(2,Math.max(.1,Number(val.toFixed(1))));
        root.querySelectorAll('.adjust button[data-delta]').forEach(btn=>{
          const sign=Number(btn.dataset.delta)<0?-1:1;
          btn.dataset.delta=String(sign*next);
        });
        SH_WRITE_STORE(SH_TEMP_STEP_KEY,String(next));
      });
      sl.addEventListener('change',e=>{this._activeSliderDragging=false;applyTempStep(e.target.value);});
      sl.addEventListener('pointerup',()=>{this._activeSliderDragging=false;});
    });
    root.querySelectorAll('[data-temp-step-btn]').forEach(btn=>btn.addEventListener('click',()=>{
      const step=Number(btn.dataset.step)||0.1;
      applyTempStep(Number(currentTempStep)+step);
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
      tabsContainer.addEventListener('pointerdown',e=>{
        if(e.target.closest('input,button,.sh-toggle-btn,.menu-head,.popup-choice'))return;
        isDown=true;startY=e.pageY-tabsContainer.offsetTop;scrollTop=tabsContainer.scrollTop;
        tabsContainer.setPointerCapture?.(e.pointerId);
      });
      tabsContainer.addEventListener('pointerup',e=>{
        isDown=false;
        try{tabsContainer.releasePointerCapture?.(e.pointerId);}catch(_e){}
      });
      tabsContainer.addEventListener('pointercancel',()=>isDown=false);
      tabsContainer.addEventListener('pointermove',e=>{
        if(!isDown)return;
        e.preventDefault();
        const y=e.pageY-tabsContainer.offsetTop;
        tabsContainer.scrollTop=scrollTop-(y-startY)*1.2;
      });
    }
    root.querySelectorAll('.adjust button').forEach(b=>b.addEventListener('click',()=>{
      const current=Number(target);if(!Number.isFinite(current))return;
      const step=(this._tempStep()??Number(a.target_temp_step))||Math.abs(Number(b.dataset.delta))||.5;
      const min=Number.isFinite(Number(a.min_temp))?Number(a.min_temp):this._getMinTarget(),max=Number.isFinite(Number(a.max_temp))?Number(a.max_temp):this._getMaxTarget();
      const next=Math.min(max,Math.max(min,current+Math.sign(Number(b.dataset.delta))*step));
      if(next!==current)this._hass.callService('climate','set_temperature',{entity_id:this.config.entity,temperature:Number(next.toFixed(2))});
    }));
    this._hasRenderedOnce = true;
  }

  _getStatsDateStr() {
    if (!this._statsDate) {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      this._statsDate = `${yr}-${mo}-${da}`;
    }
    return this._statsDate;
  }

  _getProgramsList() {
    return this._getPrograms();
  }

  _saveProgramsList(progs) {
    this._progsList = progs;
    SH_SET_STORE_JSON(SH_PROG_KEY, progs);
  }

  async _fetchHistoryForStats(dateStr) {
    if (!this._hass || !dateStr) return;
    try {
      const parts = dateStr.split('-');
      const start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0);
      const end = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 23, 59, 59, 999);
      const entities = [];
      if (this.config?.entity) entities.push(this.config.entity);
      if (this._contact1EntityId()) entities.push(this._contact1EntityId());
      if (!entities.length) return;
      const res = await this._hass.callWS({
        type: 'history/history_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: entities,
        minimal_response: false,
        no_attributes: false
      });
      this._statsHistory = res;
      this.render();
    } catch (err) {
      console.warn('SmartHeatingCard: history fetch failed', err);
    }
  }

  _calcC1Runtime(history) {
    if (!history) return '0 хв';
    const c1Id = this._contact1EntityId();
    const states = (c1Id && history[c1Id]) ? history[c1Id] : [];
    if (!states.length) return '0 хв';
    let totalMs = 0;
    let onStart = null;
    for (const pt of states) {
      const st = pt.s || pt.state;
      const ts = (pt.lu || pt.last_updated_ts || 0) * 1000 || (pt.last_updated ? new Date(pt.last_updated).getTime() : 0);
      if (st === 'on') {
        if (!onStart) onStart = ts;
      } else {
        if (onStart && ts) {
          totalMs += Math.max(0, ts - onStart);
          onStart = null;
        }
      }
    }
    const mins = Math.round(totalMs / 60000);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return hrs > 0 ? `${hrs} год ${remMins} хв` : `${remMins} хв`;
  }

  _calcC1Cycles(history) {
    if (!history) return '0';
    const c1Id = this._contact1EntityId();
    const states = (c1Id && history[c1Id]) ? history[c1Id] : [];
    let count = 0;
    for (const pt of states) {
      if ((pt.s || pt.state) === 'on') count++;
    }
    return String(count);
  }

  _calcTempRange(history) {
    try {
      const climateId = this.config?.entity;
      const states = (climateId && history?.[climateId]) ? history[climateId] : [];
      const temps = [];
      for (const pt of states) {
        const val = parseFloat(pt.a?.current_temperature ?? pt.s ?? pt.state);
        if (!isNaN(val)) temps.push(val);
      }
      if (!temps.length) {
        const cur = climateId ? this.state(climateId)?.attributes?.current_temperature : null;
        return cur != null ? `${cur} °C` : '—';
      }
      return `${Math.min(...temps).toFixed(1)} – ${Math.max(...temps).toFixed(1)} °C`;
    } catch (e) {
      return '—';
    }
  }

  _renderDailyChartSvg(history, target) {
    const W = 520, H = 180, padL = 35, padR = 15, padT = 15, padB = 25;
    const chartW = W - padL - padR, chartH = H - padT - padB;

    let gridSvg = '';
    const hours = [0, 6, 12, 18, 24];
    for (const h of hours) {
      const x = padL + (h / 24) * chartW;
      gridSvg += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + chartH}" stroke="#1e293b" stroke-dasharray="3,3" />`;
      gridSvg += `<text x="${x}" y="${H - 8}" fill="#64748b" font-size="10" text-anchor="${h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}">${String(h).padStart(2,'0')}:00</text>`;
    }

    const climateId = this.config?.entity;
    const clStates = (climateId && history?.[climateId]) ? history[climateId] : [];
    const dateStr = this._getStatsDateStr();
    const dayStart = new Date(`${dateStr}T00:00:00`).getTime();
    const dayEnd = new Date(`${dateStr}T23:59:59`).getTime();

    /* Room (current) temperature, and the target actually applied at that
       moment -- effective_target_temperature already accounts for the eco
       timer/schedule, falling back to the raw setpoint on older history
       points that predate that attribute. A point is "eco" whenever the
       applied target sits below the raw one. */
    const pts = [];
    const targetPts = [];
    for (const pt of clStates) {
      const a = pt.a || {};
      const ts = (pt.lu || pt.last_updated_ts || 0) * 1000 || (pt.last_updated ? new Date(pt.last_updated).getTime() : 0);
      if (ts < dayStart || ts > dayEnd) continue;
      const val = parseFloat(a.current_temperature ?? pt.s ?? pt.state);
      if (!isNaN(val)) pts.push({ t: ts, v: val });
      const rawTarget = parseFloat(a.temperature);
      const effTarget = parseFloat(a.effective_target_temperature);
      const tv = !isNaN(effTarget) ? effTarget : rawTarget;
      if (!isNaN(tv)) {
        const eco = !isNaN(rawTarget) && !isNaN(effTarget) && effTarget < rawTarget - 0.05;
        targetPts.push({ t: ts, v: tv, eco });
      }
    }

    let minT = 18, maxT = 26;
    const allVals = pts.map(p => p.v).concat(targetPts.map(p => p.v));
    if (allVals.length) {
      minT = Math.floor(Math.min(...allVals) - 1);
      maxT = Math.ceil(Math.max(...allVals) + 1);
    } else if (target != null && !isNaN(Number(target))) {
      minT = Math.floor(Number(target) - 1);
      maxT = Math.ceil(Number(target) + 1);
    }
    if (maxT <= minT) maxT = minT + 5;

    let yAxisSvg = '';
    yAxisSvg += `<text x="${padL - 6}" y="${padT + 10}" fill="#64748b" font-size="9" text-anchor="end">${maxT}°</text>`;
    yAxisSvg += `<text x="${padL - 6}" y="${padT + chartH}" fill="#64748b" font-size="9" text-anchor="end">${minT}°</text>`;

    const xOf = (t) => padL + ((t - dayStart) / (dayEnd - dayStart)) * chartW;
    const yOf = (v) => padT + (1 - (v - minT) / (maxT - minT)) * chartH;

    /* One <path> per contiguous eco/normal run, sharing the boundary point
       with its neighbour so the line stays visually unbroken. */
    let targetSvg = '';
    if (targetPts.length > 1) {
      let run = [targetPts[0]];
      const flushRun = (nextPoint) => {
        if (nextPoint) run.push(nextPoint);
        if (run.length > 1) {
          const d = run.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.t).toFixed(1)} ${yOf(p.v).toFixed(1)}`).join(' ');
          const color = run[0].eco ? '#10b981' : '#ff8a00';
          targetSvg += `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
        }
      };
      for (let i = 1; i < targetPts.length; i++) {
        const p = targetPts[i];
        if (p.eco === run[run.length - 1].eco) {
          run.push(p);
        } else {
          flushRun(p);
          run = [p];
        }
      }
      flushRun(null);
    } else if (target != null && !isNaN(Number(target))) {
      const yT = yOf(Number(target));
      targetSvg = `<line x1="${padL}" y1="${yT}" x2="${padL + chartW}" y2="${yT}" stroke="#ff8a00" stroke-width="1.2" stroke-dasharray="4,4" opacity="0.8" />`;
    }

    let tempSvg = '';
    if (pts.length > 1) {
      const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.t).toFixed(1)} ${yOf(p.v).toFixed(1)}`).join(' ');
      tempSvg = `<path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
    } else {
      tempSvg = `<text x="${W/2}" y="${H/2}" fill="#475569" font-size="12" text-anchor="middle">Дані історії завантажуються або відсутні</text>`;
    }

    return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="none">
      ${gridSvg}
      ${yAxisSvg}
      ${targetSvg}
      ${tempSvg}
    </svg>`;
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
  'Жоден контакт не підключено в налаштуваннях пристрою Smart Heating.': 'No contact is connected in the Smart Heating device settings.',
  'Контакт 1 (Термостат) при вимкненні HA': 'Contact 1 (Thermostat) on HA shutdown',
  'Контакт 2 (Програматор) при вимкненні HA': 'Contact 2 (Programmer) on HA shutdown',
  'Вимкнути': 'Turn off', 'Залишити як є': 'Keep as is'};
class SmartHeatingCardEditor extends HTMLElement {
  setConfig(config){this.config={...config};if(this._dragging)return;if(!this._open)this._open=this._restoreOpen();this.render()}
  set hass(hass){const prev=this._hass;this._hass=hass;if(this._dragging)return;const ent=this.config?.entity;if(!prev||!ent||prev.states?.[ent]!==hass?.states?.[ent])this.render()}
  _restoreOpen(){const fallback={general:true,layout:false,header:false,climate:false,humidity:false,weather:false,connection:false,panel:false,effects:false};try{return {...fallback,...JSON.parse(SH_READ_STORE(SH_OPEN_KEY)||'{}')}}catch(error){return fallback}}
  _emit(){this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:{...this.config}},bubbles:true,composed:true}))}
  _set(k,v){const value=typeof v==='number'?(Number.isFinite(v)?v:(this.config[k]??0)):v;this.config={...this.config,[k]:value};this._emit()}
  _toggleSection(k){if(k==='connection'&&!this._hasAnyContact())return;this._open[k]=!this._open[k];SH_WRITE_STORE(SH_OPEN_KEY,JSON.stringify(this._open));this.render()}
  connectedCallback(){if(this._onLangChange)return;this._onLangChange=()=>this.render();window.addEventListener('sh-language-changed',this._onLangChange);}
  disconnectedCallback(){if(!this._onLangChange)return;window.removeEventListener('sh-language-changed',this._onLangChange);this._onLangChange=null;}
  /* The settings-window preference is authoritative; config.language is only a
     migration fallback for cards that have no saved local preference yet. */
  _language(){const saved=SH_READ_STORE(SH_LANG_KEY);if(saved)return saved;
    if(this.config?.language)return this.config.language;
    const hl=this._hass?.locale?.language||this._hass?.language;
    if(hl)return hl.toLowerCase().startsWith('uk')?'uk':'en';
    return 'en';}
  _ui(value){return this._language()==='en'?(SH_EDITOR_EN[value]||value):value}
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
    const c=this.config,lang=this._language();
    const stateObj=this._hass?.states?.[this.config?.entity], a=stateObj?.attributes||{};
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
    let connection = '';
    const hasContact1 = Boolean(a.switch_1 || this.config?.switch_1);
    const hasContact2 = Boolean(a.switch_2 || this.config?.switch_2);
    if (!hasContact1 && !hasContact2) {
      connection = `<div class="field"><p style="color:#8898a8;font-size:11px;margin:0;">${this._ui('Жоден контакт не підключено в налаштуваннях пристрою Smart Heating.')}</p></div>`;
    } else {
      if (hasContact1) {
        const s1Val = this.config.shutdown_contact_1 || a.shutdown_contact_1 || 'turn_off';
        connection += `<div class="element"><b>${this._ui('Контакт 1 (Термостат) при вимкненні HA')}</b>`
          + `<div class="choices"><button type="button" data-shutdown-1="turn_off" class="${s1Val==='turn_off'?'active':''}">${this._ui('Вимкнути')}</button><button type="button" data-shutdown-1="keep" class="${s1Val==='keep'?'active':''}">${this._ui('Залишити як є')}</button></div></div>`;
      }
      if (hasContact2) {
        const s2Val = this.config.shutdown_contact_2 || a.shutdown_contact_2 || 'turn_off';
        connection += `<div class="element"><b>${this._ui('Контакт 2 (Програматор) при вимкненні HA')}</b>`
          + `<div class="choices"><button type="button" data-shutdown-2="turn_off" class="${s2Val==='turn_off'?'active':''}">${this._ui('Вимкнути')}</button><button type="button" data-shutdown-2="keep" class="${s2Val==='keep'?'active':''}">${this._ui('Залишити як є')}</button></div></div>`;
      }
      connection += this._element('Підключення','scheme');
    }
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
    root.querySelectorAll('[data-shutdown-1]').forEach(b=>b.addEventListener('click',()=>{const val=b.getAttribute('data-shutdown-1');if(!val)return;this._set('shutdown_contact_1',val);root.querySelectorAll('[data-shutdown-1]').forEach(x=>x.classList.toggle('active',x.getAttribute('data-shutdown-1')===val));if(this.config.entity){this._hass.callService('smart_heating','set_contact_shutdown',{entity_id:this.config.entity,contact:1,action:val});}}));
    root.querySelectorAll('[data-shutdown-2]').forEach(b=>b.addEventListener('click',()=>{const val=b.getAttribute('data-shutdown-2');if(!val)return;this._set('shutdown_contact_2',val);root.querySelectorAll('[data-shutdown-2]').forEach(x=>x.classList.toggle('active',x.getAttribute('data-shutdown-2')===val));if(this.config.entity){this._hass.callService('smart_heating','set_contact_shutdown',{entity_id:this.config.entity,contact:2,action:val});}}));
  }
  /* Live-update the numeric readout while dragging, without re-rendering the whole editor. */
  _update(el){const out=this.shadowRoot.getElementById(el.id+'-value');if(out)out.textContent=Number(el.value).toFixed(Number(el.dataset.digits)||0)+(el.dataset.unit||'')}
}
if(!customElements.get('smart-heating-card-editor'))customElements.define('smart-heating-card-editor',SmartHeatingCardEditor);
window.customCards=window.customCards||[];
if(!window.customCards.some(card=>card.type==='smart-heating-card'))window.customCards.push({type:'smart-heating-card',name:'Smart Heating Card',description:'Reference-matched 3D gas boiler dashboard',preview:true,documentationURL:'https://github.com/kdinya/ha-smart-heating',configElement:'smart-heating-card-editor'});
console.info(`%c SMART-HEATING-CARD %c ${SH_VERSION} `,'color:#0b1216;background:#ff9418;font-weight:700','color:#ff9418;background:#0b1216');
