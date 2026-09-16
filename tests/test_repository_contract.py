"""Repository-level checks that do not require Home Assistant to be installed."""
import json
import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]


class RepositoryContractTests(unittest.TestCase):
    def test_card_sources_are_identical(self):
        source = (ROOT / "www/smart-heating-card.js").read_bytes()
        bundled = (ROOT / "custom_components/smart_heating/www/smart-heating-card.js").read_bytes()
        self.assertEqual(source, bundled)

    def test_card_has_responsive_and_flame_layout_contract(self):
        card = (ROOT / "www/smart-heating-card.js").read_text()
        self.assertIn("const cardRatio=screenRatio", card)
        self.assertIn("Number.isFinite(screenValue)", card)
        self.assertIn("--effect-y:${n('effect_y',-2)}", card)
        self.assertIn("--ui-scale:clamp(.01,min(calc(100cqw / 600px),calc(100cqh / 400px)),1)", card)
        self.assertIn("width:calc(100% / var(--ui-scale))", card)
        self.assertIn("position:relative;display:block", card)
        self.assertIn("control-panel{position:relative", card)
        self.assertIn("overflow:hidden;display:grid", card)
        self.assertIn("data-power", card)
        self.assertIn("set_hvac_mode", card)
        self.assertIn("set_temperature", card)
        self.assertIn(".group-climate{position:absolute", card)
        self.assertIn("left:calc(50% + var(--climate-x,0) * 1%)", card)
        self.assertIn("top:calc(50% + var(--climate-y,0) * 1%)", card)
        self.assertIn("element-humidity group-humidity", card)
        self.assertIn("var(--weather-y,0) * 1cqh", card)
        self.assertIn("var(--dial-y,0) * 1cqh", card)
        self.assertIn("var(--item-y,0) * 1cqh", card)
        self.assertIn("this.config={...this.config,[k]:value}", card)
        self.assertIn("data-reset=\"${key}\"", card)
        self.assertIn("this.shadowRoot.querySelectorAll('[data-reset]')", card)
        self.assertIn("<b>${this._ui('Поточна температура')}</b>", card)
        self.assertIn("<b>${this._ui('Цільова температура')}</b>", card)
        self.assertIn("<b>${this._ui('Кнопки −/+')}</b>", card)
        self.assertIn("flame-effect", card)
        self.assertIn("this._section('entities','◉','СУТНОСТІ'", card)
        self.assertIn("this._section('layout','▤','Розкладка'", card)
        self.assertIn("this._ctrl('Пропорція картки (Шир/Вис)','screen_aspect_ratio'", card)
        self.assertIn("this._ctrl('Заокруглення картки','card_radius'", card)
        self.assertIn(".line{height:1px", card)
        self.assertIn("this._ctrl('Зсув по Y','header_inner_y'", card)
        self.assertIn("this._ui('Назва та іконка')", card)
        self.assertIn("this._ui('Дата і поточний час')", card)
        self.assertLess(card.index("this._section('header'"), card.index("this._section('climate'"))
        self.assertLess(card.index("this._section('climate'"), card.index("this._section('weather'"))
        self.assertIn("Math.max(.25,Math.min(4,n(key+'_s',1)))", card)
        self.assertIn("prefix+'_s','s',.25,4,.01", card)
        self.assertIn("this._ctrl('Відстань між цифрами','room_letter_spacing'", card)
        self.assertIn("this._ctrl('Розмір десяткової частини','room_decimal_size'", card)
        self.assertIn("this._ctrl('Розмір знаку температури','room_unit_size'", card)
        self.assertIn("this._ctrl('Відстань між цифрами','target_letter_spacing'", card)
        self.assertIn("this._ctrl('Розмір десяткової частини','target_decimal_size'", card)
        self.assertIn("this._ctrl('Розмір знаку температури','target_unit_size'", card)
        self.assertIn("this._ctrl('Розмір іконок кнопок','adjust_icon_size'", card)
        self.assertIn("this._ctrl('Зсув по X','header_inner_x'", card)
        self.assertIn(".brand .rule{display:none}", card)
        self.assertIn("background:linear-gradient(90deg,var(--orange),#505c65", card)
        self.assertIn("vertical-align:baseline", card)
        self.assertIn("this._ctrl('Відстань між кнопками','adjust_gap','x',18,180,1,'px')", card)
        self.assertIn("this._ctrl('Розмір іконок кнопок','adjust_icon_size','x',12,100,1,'px')", card)
        self.assertIn("id==='screen_aspect_ratio'?2:0", card)
        self.assertNotIn("toggle('Ціла частина температури'", card)
        self.assertNotIn("toggle('Показувати вологість'", card)
        self.assertNotIn("this._field('Ентіті вологості'", card)
        self.assertNotIn("this._field('Гістерезіс'", card)

    def test_responsive_coordinates_and_editor_numeric_updates_are_safe(self):
        card = (ROOT / "www/smart-heating-card.js").read_text()
        self.assertIn("calc(var(--row-offset,0) * 1cqh)", card)
        self.assertIn("calc(100cqh / 400px)", card)
        self.assertIn("--adjust-button-size:${buttonSize}px", card)
        self.assertIn("Number.isFinite(raw)?Math.max(min,Math.min(max,raw)):min", card)
        self.assertIn("toFixed(6)", card)
        self.assertLess(card.index("const oneDecimal="), card.index("oneDecimal(target)"))

    def test_manifest_is_release_ready(self):
        manifest = json.loads((ROOT / "custom_components/smart_heating/manifest.json").read_text())
        self.assertEqual(manifest["version"], "1.0.2")
        self.assertEqual(manifest["domain"], "smart_heating")
        self.assertEqual(manifest["integration_type"], "device")
        self.assertTrue(manifest["config_flow"])

    def test_hacs_files_and_brand_asset_exist(self):
        hacs = json.loads((ROOT / "hacs.json").read_text())
        self.assertEqual(hacs["name"], "Smart Heating")
        self.assertTrue((ROOT / "README.md").is_file())
        self.assertTrue((ROOT / "custom_components/smart_heating/brand/icon.png").is_file())


if __name__ == "__main__":
    unittest.main()
