"""Tests for the Smart Heating hysteresis contract."""
import unittest


def hysteresis_step(room, target, hysteresis_on, heating, hysteresis_off=0.0):
    if heating and room >= target + hysteresis_off:
        return False
    if not heating and room <= target - hysteresis_on:
        return True
    return heating


class HysteresisTests(unittest.TestCase):
    def test_turns_on_at_lower_bound(self):
        self.assertTrue(hysteresis_step(20.5, 21, 0.5, False))

    def test_stays_on_inside_band(self):
        self.assertTrue(hysteresis_step(20.8, 21, 0.5, True))

    def test_turns_off_at_target_when_offset_zero(self):
        self.assertFalse(hysteresis_step(21, 21, 0.5, True, 0.0))

    def test_stays_off_above_lower_bound(self):
        self.assertFalse(hysteresis_step(20.6, 21, 0.5, False))

    def test_stays_on_until_target_plus_hysteresis_off(self):
        # target=21, hysteresis_off=0.5 -> turns off at 21.5
        self.assertTrue(hysteresis_step(21.2, 21, 0.5, True, 0.5))
        self.assertFalse(hysteresis_step(21.5, 21, 0.5, True, 0.5))

    def test_zero_hysteresis_on(self):
        # target=21, hysteresis_on=0.0 -> turns on at 21.0
        self.assertTrue(hysteresis_step(21.0, 21, 0.0, False))


if __name__ == "__main__":
    unittest.main()
