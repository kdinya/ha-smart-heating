"""Tests for the Smart Heating hysteresis contract."""
import unittest


def hysteresis_step(room, target, hysteresis, heating):
    if heating and room >= target:
        return False
    if not heating and room <= target - hysteresis:
        return True
    return heating


class HysteresisTests(unittest.TestCase):
    def test_turns_on_at_lower_bound(self):
        self.assertTrue(hysteresis_step(20.5, 21, 0.5, False))

    def test_stays_on_inside_band(self):
        self.assertTrue(hysteresis_step(20.8, 21, 0.5, True))

    def test_turns_off_at_target(self):
        self.assertFalse(hysteresis_step(21, 21, 0.5, True))

    def test_stays_off_above_lower_bound(self):
        self.assertFalse(hysteresis_step(20.6, 21, 0.5, False))


if __name__ == "__main__":
    unittest.main()
