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
        self.assertIn("position:relative;display:block", card)
        self.assertIn("control-panel{position:relative", card)
        self.assertIn("overflow:visible;display:grid", card)
        self.assertIn("flame-effect", card)

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
