# Smart Heating

[![Validate](https://github.com/kdinya/ha-smart-heating/actions/workflows/validate.yml/badge.svg)](https://github.com/kdinya/ha-smart-heating/actions/workflows/validate.yml)
[![Latest release](https://img.shields.io/github/v/release/kdinya/ha-smart-heating?sort=semver)](https://github.com/kdinya/ha-smart-heating/releases) — газовий котел для Home Assistant

Повноцінна інтеграція Home Assistant для керування газовим котлом за кімнатною температурою. Інтерфейс містить графітову панель з помаранчевими акцентами, круговим індикатором температури, кнопками `−/+`, станом котла та метеоданими.

## Можливості

- Створення пристрою через UI Home Assistant.
- Обов'язковий вибір сенсора **температури в кімнаті**.
- Необов'язкові сутності: **перемикач 1**, **перемикач 2**, **вологість у кімнаті**, **температура на вулиці**, **вітер**, **опади**.
- Автоматичне керування перемикачем 1 за гістерезісом.
- Сутність `climate` для котла та сутності `number` для цільової температури й гістерезісу.
- Українські назви та адаптивна Lovelace-картка.
- **JavaScript-картка автоматично копіюється в `/config/www` і додається в Lovelace Resources**.

## HACS

[![Додати до HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=kdinya&repository=ha-smart-heating&category=integration)

У HACS відкрийте **Custom repositories**, додайте `kdinya/ha-smart-heating` як **Integration**, встановіть інтеграцію та перезапустіть Home Assistant. Для оновлення через HACS використовуйте релізи GitHub і після оновлення виконайте повний перезапуск Home Assistant.

## Встановлення інтеграції

Для HACS додайте цей репозиторій як custom repository типу **Integration**, встановіть **Smart Heating** і перезапустіть Home Assistant. Для ручного встановлення скопіюйте `custom_components/smart_heating` у каталог `config/custom_components/`.

Під час запуску інтеграція автоматично:

1. копіює `www/smart-heating-card.js` у `config/www/smart-heating-card.js`;
2. після запуску Home Assistant створює або оновлює ресурс типу `JavaScript module`;
3. використовує стандартну адресу `/local/smart-heating-card.js?v=1.0.2&build=reference-dashboard-v102-layout7`.

Адреса `/hacsfiles/ha-smart-heating/...` є типовою для HACS-репозиторіїв типу **Dashboard/Plugin**, які встановлюються у `www/community`. Цей репозиторій має тип **Integration** і встановлюється у `custom_components/smart_heating`, тому HACS сам по собі не публікує його `www` як `/hacsfiles`. Інтеграція тепер копіює картку в стандартний `/config/www`, тому використовується гарантований URL `/local`.

Додавати ресурс вручну не потрібно. Після оновлення через HACS виконайте **повний перезапуск Home Assistant**, а потім оновіть браузер через `Ctrl+F5`. У розділі `Налаштування → Панелі керування → Ресурси` має з'явитися:

```text
/local/smart-heating-card.js?v=1.0.2&build=reference-dashboard-v102-layout7
```

Якщо раніше були додані ресурси `/api/...` або `/hacsfiles/...`, їх можна видалити, щоб картка не завантажувалася двічі.

## Видалення

Спочатку видаліть запис **Smart Heating** у `Налаштування → Пристрої та сервіси`, дочекайтеся завершення видалення та перезапустіть Home Assistant. Інтеграція видалить Lovelace-ресурс і скопійовані файли картки та шрифту, якщо це був останній запис Smart Heating. Лише після цього видаляйте репозиторій через HACS. Якщо спочатку видалити файли інтеграції через HACS, автоматичне очищення не запуститься; у такому разі ресурс `/local/smart-heating-card.js` потрібно видалити вручну в `Налаштування → Панелі керування → Ресурси`.

## Картка

```yaml
type: custom:smart-heating-card
entity: climate.gazovyi_kotel
```

Поле `entity` — сутність клімату, створена інтеграцією. Кнопки змінюють цільову температуру з кроком 0,5 °C.

## Логіка гістерезісу

Котел вмикається, коли кімнатна температура нижча або дорівнює `цільова температура − гістерезіс`, і вимикається, коли досягає цільової температури. Значення цілі: 5–35 °C, гістерезісу: 0,1–5 °C.

## Ліцензія

MIT. Поточна версія: **1.0.2**. Дивіться [CHANGELOG.md](CHANGELOG.md) для історії змін.

## English

Version 1.0.2 introduces a reference-matched industrial dashboard skin while preserving the integration behavior and editor controls.

Smart Heating is a local Home Assistant custom integration for hysteresis-based room heating control. It creates a climate entity, target-temperature and hysteresis number entities, optional switch entities, and an adaptive Lovelace card. The integration does not require a cloud account or external Python packages.

### Installation with HACS

Open HACS, choose **Custom repositories**, add `kdinya/ha-smart-heating`, select **Integration**, and install **Smart Heating**. Restart Home Assistant after installation. The repository publishes GitHub releases, so HACS can offer versioned upgrades.

### Manual installation

Copy the `custom_components/smart_heating` directory into your Home Assistant `config/custom_components/` directory. Restart Home Assistant. The integration copies its bundled card and 7-segment font into `config/www/` and registers the `/local/smart-heating-card.js` Lovelace module automatically.

### Configuration

Go to **Settings → Devices & services → Add integration**, search for **Smart Heating**, and select a unique device name. The room-temperature sensor is required. Select `switch_1` if the integration should control a physical or helper switch automatically. `switch_2` is an optional independently exposed contact and is not changed by the hysteresis controller. Humidity, outdoor temperature, wind, and precipitation sensors are optional.

The integration creates a climate entity with `heat` and `off` modes, a target-temperature number from 5 to 35 °C, and a hysteresis number from 0.1 to 5 °C. The target and hysteresis can be changed from Home Assistant entities or from the card buttons. The climate entity restores its last enabled state, target temperature, and hysteresis after a Home Assistant restart.

### Hysteresis behavior

When enabled, heating turns on when the room temperature is less than or equal to `target - hysteresis`. It turns off when the room temperature reaches the target. While the temperature remains inside the hysteresis band, the previous heating state is retained. Turning the climate entity off always turns the controlled `switch_1` off.

### Lovelace card

Add the following card after the integration has created the climate entity:

```yaml
type: custom:smart-heating-card
entity: climate.your_smart_heating_entity
```

The card displays the current temperature, target temperature, humidity, weather values, connection scheme, boiler status, and control buttons. The `−` and `+` buttons request a 0.5 °C target-temperature change through the climate entity. The settings button opens the card popup; the visual editor is available from the Lovelace card editor.

The visual editor provides language selection, block position and scale controls, screen and panel proportions, panel height and spacing, line offset, effect enable/disable, flame opacity, flame position and flame scale. Visibility switches are placed immediately before the block they control: temperature integer, temperature decimal, temperature unit, humidity, outdoor temperature, wind, and precipitation. The heating effect is rendered as animated flame tongues rising behind the dial, so the digits remain readable.

### Updating and troubleshooting

After a HACS update, restart Home Assistant completely. The integration automatically finds old Smart Heating resources by filename, updates one to `/local/smart-heating-card.js?v=1.0.2&build=reference-dashboard-v102-layout7`, and removes duplicates. If the old card is still displayed, refresh the browser with `Ctrl+F5` or clear the browser cache.

The integration automatically finds old Smart Heating resources by filename, including `/hacsfiles/...`, `/api/...`, and old `/local/...` URLs, updates one to the canonical `/local` URL, and deletes duplicates. If the climate entity is unavailable, check the configured room-temperature sensor and its state. If `switch_1` does not respond, verify that the selected entity is a switch and that Home Assistant can call its `turn_on` and `turn_off` services. The optional `switch_2` entity reflects the state of its configured switch and is not part of the automatic hysteresis output.

### Development

The source card is `www/smart-heating-card.js`; the bundled runtime copy is `custom_components/smart_heating/www/smart-heating-card.js`. Keep them identical. Run `python3 -m unittest discover -v`, `python3 -m py_compile custom_components/smart_heating/*.py`, `node --check www/smart-heating-card.js`, and `cmp www/smart-heating-card.js custom_components/smart_heating/www/smart-heating-card.js` before submitting changes.

## Українська — повна інструкція

### Встановлення через HACS

Відкрийте HACS, виберіть **Custom repositories**, додайте `kdinya/ha-smart-heating`, тип **Integration**, і встановіть **Smart Heating**. Після встановлення повністю перезапустіть Home Assistant. Версійні GitHub Releases використовуються HACS для оновлень.

### Ручне встановлення

Скопіюйте каталог `custom_components/smart_heating` до `config/custom_components/` Home Assistant і перезапустіть систему. Інтеграція автоматично копіює картку та шрифт у `config/www/` і реєструє Lovelace-ресурс `/local/smart-heating-card.js`.

### Налаштування

Перейдіть до **Налаштування → Пристрої та сервіси → Додати інтеграцію**, знайдіть **Smart Heating** і задайте унікальну назву пристрою. Сенсор кімнатної температури є обов’язковим. `switch_1` — основний фізичний або допоміжний вимикач, яким керує гістерезіс. `switch_2` — необов’язковий незалежний контакт: інтеграція лише показує його фактичний стан і не вмикає його автоматично. Вологість, температура на вулиці, вітер та опади є необов’язковими сенсорами.

Інтеграція створює climate-сутність із режимами `heat` і `off`, числову сутність цільової температури в межах 5–35 °C та числову сутність гістерезісу в межах 0,1–5 °C. Після перезапуску Home Assistant відновлюються останній стан увімкнення, цільова температура та гістерезіс.

### Логіка гістерезісу

Коли керування увімкнене, котел вмикається при температурі кімнати, меншій або рівній `цільова температура − гістерезіс`. Вимикається він при досягненні цільової температури. Усередині смуги гістерезісу попередній стан зберігається. Перемикання climate у режим `off` завжди вимикає `switch_1`.

### Додавання картки

```yaml
type: custom:smart-heating-card
entity: climate.ваша_сутність_smart_heating
```

Картка показує поточну й цільову температуру, вологість, погоду, схему підключення, стан котла та кнопки керування. Кнопки `−` і `+` змінюють цільову температуру через climate із кроком 0,5 °C. Кнопка налаштувань відкриває попап, а візуальний редактор доступний у редакторі Lovelace.

У редакторі можна змінювати мову, положення й масштаб блоків, пропорції екрана та панелі, висоту й відстань між кнопками, положення лінії, увімкнення ефекту, прозорість, положення та масштаб полум’я. Перемикачі видимості розташовані безпосередньо перед блоками, якими керують: ціла й десяткова частини температури, одиниця температури, вологість, температура на вулиці, вітер та опади. Під час нагрівання язики полум’я виходять з-за верхньої частини кола, а цифри залишаються читабельними.

### Оновлення та усунення проблем

Після оновлення через HACS повністю перезапустіть Home Assistant. Інтеграція автоматично знаходить старі ресурси Smart Heating за назвою файлу, зокрема `/hacsfiles/...`, `/api/...` та старі `/local/...`, оновлює один до canonical URL `/local/smart-heating-card.js?v=1.0.2&build=reference-dashboard-v102-layout7` і видаляє дублікати. Якщо відображається стара картка, виконайте `Ctrl+F5` або очистьте кеш браузера.

Якщо climate недоступний, перевірте сенсор кімнатної температури та його стан. Якщо `switch_1` не реагує, перевірте, що вибрана сутність є switch і Home Assistant має право викликати `turn_on` та `turn_off`. `switch_2` показує стан налаштованого вимикача і не є частиною автоматичного керування гістерезісом.
