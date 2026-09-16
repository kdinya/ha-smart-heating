"""Repository-level checks that do not require Home Assistant to be installed.

These tests deliberately check *structure* — that the two card copies match, that
the version is consistent everywhere, that the editor exposes every positionable
block, and that no stylesheet reads a custom property nobody sets. They do not
pin exact minified substrings: that turned every refactor into a test rewrite.
"""
import json
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components/smart_heating"
CARD = ROOT / "www/smart-heating-card.js"
BUNDLED_CARD = COMPONENT / "www/smart-heating-card.js"

#: Blocks that get a --<id>-x / -y / -s triplet from the card.
GROUPS = ("header", "weather", "climate", "connection", "panel")
ITEMS = (
    "brand", "brand_icon", "date", "clock", "signal", "outdoor", "wind", "rain",
    "dial", "room", "target", "adjust", "humidity", "humidity_int",
    "humidity_dec", "humidity_unit", "scheme", "panel_buttons",
)


def card_source() -> str:
    return CARD.read_text()


def manifest() -> dict:
    return json.loads((COMPONENT / "manifest.json").read_text())


class PackagingTests(unittest.TestCase):
    """What HACS and Home Assistant need to find in the repository."""

    def test_card_copies_are_identical(self):
        self.assertEqual(CARD.read_bytes(), BUNDLED_CARD.read_bytes())

    def test_required_files_exist(self):
        for path in ("hacs.json", "README.md", "LICENSE", "CHANGELOG.md"):
            self.assertTrue((ROOT / path).is_file(), path)
        self.assertTrue((COMPONENT / "brand/icon.png").is_file())
        self.assertTrue((COMPONENT / "translations/uk.json").is_file())

    def test_hacs_manifest_uses_known_keys(self):
        hacs = json.loads((ROOT / "hacs.json").read_text())
        allowed = {
            "name", "content_in_root", "filename", "country", "homeassistant",
            "hacs", "persistent_directory", "render_readme", "zip_release",
        }
        self.assertEqual(hacs["name"], "Smart Heating")
        self.assertFalse(set(hacs) - allowed, "unknown keys in hacs.json")

    def test_manifest_is_release_ready(self):
        data = manifest()
        self.assertRegex(data["version"], r"^\d+\.\d+\.\d+$")
        self.assertEqual(data["domain"], "smart_heating")
        self.assertEqual(data["integration_type"], "device")
        self.assertTrue(data["config_flow"])
        self.assertIn("frontend", data["dependencies"])
        self.assertIn("http", data["dependencies"])

    def test_every_declared_platform_has_a_module(self):
        init = (COMPONENT / "__init__.py").read_text()
        platforms = re.search(r"PLATFORMS = \[([^\]]*)\]", init).group(1)
        found = re.findall(r'"([a-z_]+)"', platforms)
        self.assertTrue(found)
        for platform in found:
            self.assertTrue((COMPONENT / f"{platform}.py").is_file(), platform)

    def test_translations_cover_every_string(self):
        def leaves(blob, prefix=""):
            found = set()
            for key, value in blob.items():
                if isinstance(value, dict):
                    found |= leaves(value, f"{prefix}{key}.")
                else:
                    found.add(f"{prefix}{key}")
            return found

        expected = leaves(json.loads((COMPONENT / "strings.json").read_text()))
        translations = sorted((COMPONENT / "translations").glob("*.json"))
        self.assertTrue(translations)
        for path in translations:
            self.assertEqual(leaves(json.loads(path.read_text())), expected, path.name)

    def test_every_translated_field_is_a_real_config_key(self):
        const = (COMPONENT / "const.py").read_text()
        names = set(re.findall(r'CONF_[A-Z_0-9]+ = "([a-z_0-9]+)"', const))
        strings = json.loads((COMPONENT / "strings.json").read_text())
        labelled = set(strings["config"]["step"]["user"]["data"])
        labelled |= set(strings["options"]["step"]["init"]["data"])
        self.assertTrue(labelled <= names, labelled - names)


class VersionTests(unittest.TestCase):
    """The version must agree across the manifest, the loader and the card."""

    def test_card_version_matches_manifest(self):
        init = (COMPONENT / "__init__.py").read_text()
        version = manifest()["version"]
        self.assertEqual(re.search(r'CARD_VERSION = "([^"]+)"', init).group(1), version)
        self.assertEqual(
            re.search(r"const SH_VERSION = '([^']+)'", card_source()).group(1), version
        )

    def test_card_build_marker_ends_with_a_number(self):
        """scripts/publish.sh bumps the trailing digits to bust the browser cache."""
        init = (COMPONENT / "__init__.py").read_text()
        self.assertRegex(init, r'CARD_BUILD = "[A-Za-z0-9._-]+\d"')

    def test_card_resource_url_carries_version_and_build(self):
        init = (COMPONENT / "__init__.py").read_text()
        self.assertIn("?v={CARD_VERSION}&build={CARD_BUILD}", init)


class CardContractTests(unittest.TestCase):
    """Structural guarantees about the Lovelace card."""

    def test_custom_element_and_editor_are_registered(self):
        card = card_source()
        self.assertIn("customElements.define('smart-heating-card',", card)
        self.assertIn("customElements.define('smart-heating-card-editor',", card)
        self.assertIn("static getConfigElement()", card)
        self.assertIn("static getStubConfig(", card)

    def test_card_calls_only_supported_climate_services(self):
        services = set(re.findall(r"callService\('climate','([a-z_]+)'", card_source()))
        self.assertEqual(services, {"set_hvac_mode", "set_temperature"})

    def test_every_positionable_block_has_editor_controls(self):
        card = card_source()
        placed = set(re.findall(r"this\._place\('([a-z_0-9]+)'\)", card))
        placed |= set(re.findall(r"this\._element\('[^']*','([a-z_0-9]+)'\)", card))
        for prefix in GROUPS + ITEMS:
            self.assertIn(prefix, placed, f"{prefix} has no horizontal/vertical/size controls")

    def test_editor_prefixes_use_underscores(self):
        """A dash in a prefix silently writes a config key the card never reads."""
        card = card_source()
        for match in re.finditer(r"this\._(?:place|element)\((?:'[^']*',)?'([^']+)'\)", card):
            self.assertNotIn("-", match.group(1), match.group(1))

    def test_scalar_sliders_are_declared(self):
        keys = set(re.findall(r"this\._ctrl\('[^']*','([a-z_0-9]+)'", card_source()))
        for key in (
            "screen_aspect_ratio", "card_radius", "row_offset_y", "header_inner_y",
            "line_y", "adjust_gap", "adjust_icon_size", "adjust_button_size",
            "room_letter_spacing", "room_decimal_size", "room_unit_size",
            "target_letter_spacing", "target_decimal_size", "target_unit_size",
            "target_unit_gap", "panel_h", "panel_gap", "effect_opacity",
        ):
            self.assertIn(key, keys, key)

    def test_visibility_toggles_are_declared(self):
        keys = set(re.findall(r"this\._toggle\('[^']*','([a-z_0-9]+)'\)", card_source()))
        for key in (
            "humidity_visible", "outdoor_visible", "wind_visible", "rain_visible",
            "room_int_visible", "room_dec_visible", "room_unit_visible",
            "target_dec_visible", "target_unit_visible", "effect_enabled",
        ):
            self.assertIn(key, keys, key)

    def test_no_custom_property_is_read_without_a_value(self):
        card = card_source()
        # Provided by the Home Assistant theme, not by this card.
        emitted = {"--primary-text-color", "--divider-color", "--card-background-color"}
        emitted |= {f"--{name}" for name in re.findall(r"--([a-z-]+):", card)}
        for prefix in GROUPS + ITEMS:
            dashed = prefix.replace("_", "-")
            emitted |= {f"--{dashed}-{axis}" for axis in "xys"}
        missing = sorted(
            {
                match.group(1)
                for match in re.finditer(r"var\((--[a-z-]+)(,[^)]*)?\)", card)
                if match.group(2) is None and match.group(1) not in emitted
            }
        )
        self.assertFalse(missing, f"read but never set and no fallback: {missing}")

    def test_browser_storage_goes_through_guarded_helpers(self):
        card = card_source()
        self.assertEqual(card.count("localStorage."), 2)
        self.assertIn("const SH_READ_STORE", card)
        self.assertIn("const SH_WRITE_STORE", card)

    def test_card_does_not_rerender_on_every_hass_update(self):
        card = card_source()
        self.assertIn("_shouldRender(previous,value)", card)
        self.assertIn("_watchedEntities()", card)

    def test_defaults_have_a_single_source_of_truth(self):
        self.assertEqual(card_source().count("const SH_DEFAULTS"), 1)


class ConstantsTests(unittest.TestCase):
    """Ranges the integration enforces."""

    def _values(self) -> dict[str, float]:
        const = (COMPONENT / "const.py").read_text()
        return {k: float(v) for k, v in re.findall(r"([A-Z_]+) = ([0-9.]+)\n", const)}

    def test_temperature_range_is_sane(self):
        values = self._values()
        self.assertEqual(values["MIN_TARGET"], 5.0)
        self.assertEqual(values["MAX_TARGET"], 35.0)
        self.assertLess(values["MIN_HYSTERESIS"], values["MAX_HYSTERESIS"])

    def test_defaults_sit_inside_their_ranges(self):
        values = self._values()
        self.assertLessEqual(values["MIN_TARGET"], values["DEFAULT_TARGET"])
        self.assertLessEqual(values["DEFAULT_TARGET"], values["MAX_TARGET"])
        self.assertLessEqual(values["MIN_HYSTERESIS"], values["DEFAULT_HYSTERESIS"])
        self.assertLessEqual(values["DEFAULT_HYSTERESIS"], values["MAX_HYSTERESIS"])


if __name__ == "__main__":
    unittest.main()
