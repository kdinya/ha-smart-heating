/* Smart Heating Card 1.0.0 — dark graphite/orange boiler dashboard */
class SmartHeatingCard extends HTMLElement {
  static getConfigElement() { return document.createElement('smart-heating-card-editor'); }
  setConfig(config) { this.config = config; this.entity = config.entity; this.attachShadow({mode:'open'}); this.render(); }
  set hass(hass) { this._hass = hass; this.render(); }
  getCardSize() { return 6; }
  val(id, fallback='—') { const s = id && this._hass?.states[id]; return s && !['unknown','unavailable'].includes(s.state) ? s.state : fallback; }
  render() {
    if (!this.shadowRoot || !this._hass) return;
    const c=this.config||{}, s=this._hass.states[c.entity]||{}, a=s.attributes||{};
    const room=a.room_temperature ?? s.attributes.current_temperature ?? '—', target=a.target_temperature ?? s.attributes.temperature ?? '—';
    const icon=(type)=>({home:'⌂',wind:'≋',rain:'☁',drop:'♢'}[type]||'•');
    this.shadowRoot.innerHTML=`<style>
      :host{display:block;font-family:Arial,sans-serif;color:#edf1f7}ha-card{background:radial-gradient(circle at 50% 45%,#172027 0,#0c1216 53%,#091014 100%);border:1px solid #354049;border-radius:20px;overflow:hidden;box-shadow:0 12px 34px #0009;padding:22px 24px 16px;min-width:500px}.top{display:flex;justify-content:space-between;align-items:flex-start}.brand{display:flex;gap:13px;align-items:center}.flame{font-size:45px;color:#ff9418;text-shadow:0 0 15px #ff8a0033}.brand b{font-size:24px;letter-spacing:2px}.brand small{display:block;color:#ff9418;font-size:14px;letter-spacing:2px;margin-top:3px}.clock{text-align:right;color:#bfc7d6;font-size:16px}.clock strong{display:block;color:#fff;font-size:40px;font-weight:500;letter-spacing:3px;margin-top:3px}.line{height:1px;background:#ff9218;margin:13px 0 16px}.body{display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:17px;align-items:center}.side{display:flex;flex-direction:column;gap:13px}.metric{border-bottom:1px solid #303a40;padding:7px 2px 12px;display:flex;gap:12px;align-items:center}.metric .ico{font-size:34px;color:#d9dee7;min-width:38px;text-align:center}.metric.orange .ico{color:#ff9418}.metric label{display:block;color:#c1cad8;font-size:14px;margin-bottom:4px}.metric strong{font-size:27px;font-weight:500}.center{height:280px;border:1px solid #77818b;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:inset 0 0 35px #0008,0 0 0 10px #182229}.center .flame{font-size:38px}.center label{font-size:15px;letter-spacing:.4px;margin:2px 0 10px}.temp{font-size:70px;line-height:1;font-weight:300;letter-spacing:-4px}.temp sup{font-size:23px;letter-spacing:0}.target{color:#ff9418;text-align:center;font-size:13px;margin-top:11px}.target b{display:block;color:#fff;font-size:29px;margin-top:3px;font-weight:500}.actions{display:flex;justify-content:center;gap:22px;margin-top:15px}.actions button{border:2px solid #ff9418;border-radius:50%;background:#111a1e;color:#fff;width:62px;height:62px;font-size:37px;line-height:1;cursor:pointer}.actions button:hover{background:#ff9418;color:#111}.footer{border-top:1px solid #303a40;margin-top:16px;padding-top:13px;display:flex;justify-content:space-around;color:#aeb7c5;font-size:12px;text-align:center}.footer div:first-child{color:#ff9418}.footer span{display:block;font-size:25px;margin-bottom:3px}@media(max-width:700px){ha-card{min-width:0;padding:16px}.body{grid-template-columns:1fr}.center{order:-1;height:230px}.clock{display:none}}
    </style><ha-card><div class="top"><div class="brand"><div class="flame">♨</div><div><b>HEAT</b><small>GAS BOILER</small></div></div><div class="clock">${new Date().toLocaleDateString('uk-UA',{weekday:'short',day:'2-digit',month:'long',year:'numeric'})}<strong>${new Date().toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'})}</strong></div></div><div class="line"></div><div class="body"><div class="side"><div class="metric"><div class="ico">${icon('home')}</div><div><label>Температура в кімнаті</label><strong>${room} °C</strong></div></div><div class="metric"><div class="ico">${icon('wind')}</div><div><label>Вітер на вулиці</label><strong>${a.wind??'—'}</strong></div></div><div class="metric"><div class="ico">${icon('rain')}</div><div><label>Опади на вулиці</label><strong>${a.precipitation??'—'}</strong></div></div></div><div><div class="center"><div class="flame">♨</div><label>ТЕМПЕРАТУРА ПОВІТРЯ</label><div class="temp">${room}<sup>°C</sup></div><div class="target">ЦІЛЬОВА ТЕМП.<b>${target}°C</b></div></div><div class="actions"><button data-delta="-0.5">−</button><button data-delta="0.5">+</button></div></div><div class="side"><div class="metric orange"><div class="ico">${icon('drop')}</div><div><label>Вологість в кімнаті</label><strong>${a.humidity??'—'}%</strong></div></div><div class="metric"><div><label>Стан котла</label><strong>${a.heating?'Працює':'Очікування'}</strong></div></div><div class="metric"><div><label>Гістерезіс</label><strong>${a.hysteresis??'—'}°C</strong></div></div></div></div><div class="footer"><div><span>⏻</span>ЖИВЛЕННЯ</div><div><span>♨</span>ПРОГРАМА</div><div><span>▥</span>ІСТОРІЯ</div><div><span>⚙</span>НАЛАШТУВАННЯ</div></div></ha-card>`;
    this.shadowRoot.querySelectorAll('button').forEach(b=>b.onclick=()=>this._hass.callService('climate','set_temperature',{entity_id:c.entity,temperature:Number(target)+Number(b.dataset.delta)}));
  }
}
customElements.define('smart-heating-card',SmartHeatingCard);

class SmartHeatingCardEditor extends HTMLElement {
  setConfig(config) { this.config = {...config}; this.render(); }
  set hass(hass) { this._hass = hass; this.render(); }
  render() {
    if (!this.shadowRoot || !this._hass) { if (!this.shadowRoot) this.attachShadow({mode:'open'}); return; }
    const climates = Object.values(this._hass.states).filter(s => s.entity_id.startsWith('climate.'));
    const selected = this.config?.entity || '';
    this.shadowRoot.innerHTML = `<style>
      .box{font-family:var(--paper-font-body1_-_font-family,Arial);padding:12px 0;display:grid;gap:12px}.title{font-size:16px;font-weight:500}.field{display:grid;gap:6px}label{font-size:13px;color:var(--secondary-text-color)}select,input{box-sizing:border-box;width:100%;padding:10px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit}button{justify-self:start;padding:9px 18px;border:0;border-radius:4px;background:var(--primary-color);color:#fff;cursor:pointer}
    </style><div class="box"><div class="title">Smart Heating — налаштування картки</div><div class="field"><label>Кліматична сутність котла</label><select id="entity"><option value="">Оберіть сутність…</option>${climates.map(s=>`<option value="${s.entity_id}" ${s.entity_id===selected?'selected':''}>${s.attributes.friendly_name||s.entity_id}</option>`).join('')}</select></div><div class="field"><label>Назва картки (необов’язково)</label><input id="title" value="${this.config?.title||''}" placeholder="Smart Heating"></div><button id="save">Зберегти</button></div>`;
    this.shadowRoot.getElementById('save').onclick = () => this._save();
    this.shadowRoot.getElementById('entity').onchange = () => this._save();
    this.shadowRoot.getElementById('title').onchange = () => this._save();
  }
  _save() {
    const entity = this.shadowRoot.getElementById('entity').value;
    const title = this.shadowRoot.getElementById('title').value.trim();
    if (!entity) return;
    const config = {...this.config, entity};
    if (title) config.title = title; else delete config.title;
    this.config = config;
    this.dispatchEvent(new CustomEvent('config-changed', {detail:{config}, bubbles:true, composed:true}));
  }
}
customElements.define('smart-heating-card-editor',SmartHeatingCardEditor);
window.customCards=window.customCards||[];window.customCards.push({type:'smart-heating-card',name:'Smart Heating Card',description:'Graphite and orange gas boiler dashboard card',preview:true,config_element:'smart-heating-card-editor'});
