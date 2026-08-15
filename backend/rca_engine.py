"""
Root-cause analysis engine.

Builds the explainability payload (evidence list + root-cause chain +
historical-pattern match) for a fault that has already been isolated by
diagnostic_engine.py. All output here is derived from simulated demo data.
"""

from typing import Any, Dict, List


def build_evidence(scenario: Dict[str, Any], diagnostic_result: Dict[str, Any]) -> List[str]:
    evidence = scenario.get("evidence")
    if evidence:
        return evidence

    matched = diagnostic_result.get("matchedRules", [])
    fallback = [f"Rule matched: {rule.replace('_', ' ')}" for rule in matched]
    fallback.append("Event sequence is consistent with the simulated fault pattern.")
    return fallback


def build_root_cause_chain(scenario: Dict[str, Any]) -> List[str]:
    return scenario.get(
        "rootCauseChain",
        ["Anomaly Detected", "Subsystem Isolated", "Probable Root Cause"],
    )


def match_historical_pattern(scenario: Dict[str, Any]) -> Dict[str, Any]:
    pattern = scenario.get("historicalPattern")
    if pattern:
        return {**pattern, "isSimulated": True}
    return {
        "description": "No closely matching historical pattern found.",
        "similarity": 0,
        "occurrences": 0,
        "isSimulated": True,
    }


def build_rca_summary(scenario: Dict[str, Any], diagnostic_result: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "evidence": build_evidence(scenario, diagnostic_result),
        "rootCauseChain": build_root_cause_chain(scenario),
        "historicalPattern": match_historical_pattern(scenario),
        "confidence": diagnostic_result.get("confidence", 75),
    }
