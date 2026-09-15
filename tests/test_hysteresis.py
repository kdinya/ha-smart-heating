"""Regression examples for the controller contract.
Run with a Home Assistant test environment and pytest-homeassistant-custom-component.
"""

def hysteresis_step(room, target, hysteresis, heating):
    if heating and room >= target:
        return False
    if not heating and room <= target - hysteresis:
        return True
    return heating

def test_turns_on_below_lower_bound():
    assert hysteresis_step(20.4, 21, 0.5, False) is True

def test_stays_on_inside_band():
    assert hysteresis_step(20.8, 21, 0.5, True) is True

def test_turns_off_at_target():
    assert hysteresis_step(21, 21, 0.5, True) is False
