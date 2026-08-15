"""
Corrective-action recommendation engine.

Maps an isolated fault (from diagnostic_engine.py) to a prioritized list of
technician actions. These are PROTOTYPE recommendations for demonstration
purposes only and are NOT validated KONE maintenance instructions.
"""

from typing import Any, Dict, List


_GENERIC_ACTIONS: List[str] = [
    "Take the affected elevator out of service if severity is HIGH.",
    "Perform a visual and mechanical inspection of the isolated subsystem.",
    "Verify telemetry returns to normal simulated ranges after inspection.",
    "Perform controlled testing before returning the elevator to service.",
]


def build_recommendation(scenario: Dict[str, Any], diagnostic_result: Dict[str, Any]) -> Dict[str, Any]:
    actions = scenario.get("recommendedActions") or _GENERIC_ACTIONS
    severity = diagnostic_result.get("severity", "MEDIUM")
    priority = "HIGH" if severity in ("HIGH", "CRITICAL") else severity

    return {
        "priority": priority,
        "actions": actions,
        "disclaimer": (
            "These are prototype recommendations generated for demonstration "
            "purposes and are NOT validated KONE maintenance instructions. "
            "A certified technician must verify all findings before acting."
        ),
    }
