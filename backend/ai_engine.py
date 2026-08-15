"""
AI explanation layer.

This module NEVER decides what the fault is. The deterministic
diagnostic_engine.py + rca_engine.py + recommendation_engine.py have already
produced the fault, evidence, root-cause chain and recommended actions by
the time anything here runs.

All this layer does is turn that structured, already-decided result into
readable technician-facing prose:
  - a plain-language explanation of the diagnosis
  - an evidence summary
  - a root-cause narrative
  - a technician recommendation summary
  - report-ready text

If an LLM API key (ANTHROPIC_API_KEY) is configured, it is used to generate
higher-quality prose. If it is missing, misconfigured, or the call fails for
any reason, a deterministic offline fallback is used instead. The app must
NEVER crash because an AI API key is missing or an API call fails.
"""

import os
from typing import Any, Dict, Optional

_client: Optional[Any] = None
_client_init_attempted = False


def _get_client():
    """Lazily construct an Anthropic client if a key is configured.
    Returns None (and never raises) if unavailable for any reason."""
    global _client, _client_init_attempted
    if _client_init_attempted:
        return _client
    _client_init_attempted = True

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None

    try:
        import anthropic  # type: ignore

        _client = anthropic.Anthropic(api_key=api_key)
    except Exception:
        _client = None

    return _client


def _fallback_explanation(
    elevator_id: str,
    scenario: Dict[str, Any],
    diagnostic_result: Dict[str, Any],
    rca: Dict[str, Any],
    recommendation: Dict[str, Any],
) -> Dict[str, str]:
    fault = diagnostic_result.get("fault", "Unknown Fault")
    location = diagnostic_result.get("location", "Unknown Location")
    cause = diagnostic_result.get("probableCause", "Unknown")
    confidence = diagnostic_result.get("confidence", 0)
    severity = diagnostic_result.get("severity", "MEDIUM")
    evidence = rca.get("evidence", [])
    chain = rca.get("rootCauseChain", [])
    historical = rca.get("historicalPattern", {})
    actions = recommendation.get("actions", [])

    explanation = (
        f"Simulated telemetry from {elevator_id} triggered the deterministic "
        f"rule engine, isolating the fault to the {diagnostic_result.get('subsystem', 'affected subsystem')} "
        f"at the {location}. The rule engine assigned a probable root cause of "
        f"\"{cause}\" with a prototype confidence score of {confidence}% and severity {severity}. "
        f"This diagnosis is derived entirely from the simulated telemetry thresholds and event sequence "
        f"below, not from free-form AI reasoning."
    )

    evidence_summary = (
        "The diagnosis is supported by " + str(len(evidence)) + " pieces of simulated evidence: "
        + "; ".join(evidence) + "."
        if evidence
        else "No specific evidence items were recorded for this simulated scenario."
    )

    if chain:
        chain_text = " → ".join(chain)
        root_cause_narrative = (
            f"The simulated fault progression can be traced as: {chain_text}. "
            f"This chain represents how the anomaly is believed to have propagated through the "
            f"{diagnostic_result.get('subsystem', 'subsystem')} in this demo dataset."
        )
    else:
        root_cause_narrative = "No root-cause propagation chain is available for this scenario."

    if historical.get("occurrences"):
        root_cause_narrative += (
            f" A similar simulated historical pattern (\"{historical.get('description')}\") has been "
            f"recorded {historical.get('occurrences')} time(s) previously, with a "
            f"{historical.get('similarity')}% similarity score to the current event."
        )

    if actions:
        numbered = "; ".join(f"{i+1}) {a}" for i, a in enumerate(actions))
        technician_recommendation = (
            f"Priority: {recommendation.get('priority', severity)}. Recommended steps: {numbered}. "
            f"{recommendation.get('disclaimer', '')}"
        )
    else:
        technician_recommendation = "No recommended actions are available for this scenario."

    report_text = (
        f"KONE AI FAULT ANALYSIS REPORT (SIMULATED DEMO DATA)\n\n"
        f"Elevator ID: {elevator_id}\n"
        f"Fault: {fault}\n"
        f"Fault Location: {location}\n"
        f"Probable Root Cause: {cause}\n"
        f"Severity: {severity}\n"
        f"Confidence (prototype score, not validated accuracy): {confidence}%\n\n"
        f"Telemetry Evidence:\n- " + "\n- ".join(evidence) + "\n\n"
        f"Root-Cause Chain:\n" + " -> ".join(chain) + "\n\n"
        f"Historical Pattern (simulated): {historical.get('description', 'N/A')} "
        f"(similarity {historical.get('similarity', 0)}%, {historical.get('occurrences', 0)} prior occurrence(s))\n\n"
        f"Recommended Action (priority {recommendation.get('priority', severity)}):\n"
        + "\n".join(f"{i+1}. {a}" for i, a in enumerate(actions)) + "\n\n"
        f"Disclaimer: {recommendation.get('disclaimer', '')} "
        f"AI-assisted diagnostic recommendation — technician verification required. "
        f"All data in this report is simulated for demonstration purposes."
    )

    return {
        "explanation": explanation,
        "evidenceSummary": evidence_summary,
        "rootCauseNarrative": root_cause_narrative,
        "technicianRecommendation": technician_recommendation,
        "reportText": report_text,
        "source": "offline-fallback",
    }


def _build_prompt(
    elevator_id: str,
    diagnostic_result: Dict[str, Any],
    rca: Dict[str, Any],
    recommendation: Dict[str, Any],
) -> str:
    return f"""You are a technical writing assistant for elevator maintenance technicians.
A DETERMINISTIC rule engine has ALREADY diagnosed the fault below from simulated telemetry.
Do NOT change, second-guess, or invent a different diagnosis, cause, or confidence score.
Your only job is to write clear, professional, technician-friendly prose explaining this
already-decided diagnosis, using ONLY the facts provided.

Elevator: {elevator_id}
Fault: {diagnostic_result.get('fault')}
Subsystem: {diagnostic_result.get('subsystem')}
Location: {diagnostic_result.get('location')}
Probable root cause: {diagnostic_result.get('probableCause')}
Severity: {diagnostic_result.get('severity')}
Confidence (prototype score): {diagnostic_result.get('confidence')}%
Evidence: {rca.get('evidence')}
Root-cause chain: {rca.get('rootCauseChain')}
Historical pattern: {rca.get('historicalPattern')}
Recommended actions: {recommendation.get('actions')}

Respond in this exact format with four sections, each 2-4 sentences, plain text, no markdown headers:

EXPLANATION: <plain language explanation of the diagnosis>
EVIDENCE_SUMMARY: <summary of why the evidence supports this diagnosis>
ROOT_CAUSE_NARRATIVE: <narrative walking through the root cause chain>
TECHNICIAN_RECOMMENDATION: <summary of what the technician should do and why, ending with a reminder that this is a prototype recommendation requiring technician verification>
"""


def _parse_llm_response(text: str) -> Optional[Dict[str, str]]:
    markers = {
        "EXPLANATION:": "explanation",
        "EVIDENCE_SUMMARY:": "evidenceSummary",
        "ROOT_CAUSE_NARRATIVE:": "rootCauseNarrative",
        "TECHNICIAN_RECOMMENDATION:": "technicianRecommendation",
    }
    result: Dict[str, str] = {}
    remaining = text
    positions = []
    for marker in markers:
        idx = remaining.find(marker)
        if idx != -1:
            positions.append((idx, marker))
    if not positions:
        return None
    positions.sort()
    for i, (idx, marker) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(remaining)
        value = remaining[idx + len(marker):end].strip()
        result[markers[marker]] = value

    if len(result) < 4:
        return None
    return result


def generate_explanation(
    elevator_id: str,
    scenario: Dict[str, Any],
    diagnostic_result: Dict[str, Any],
    rca: Dict[str, Any],
    recommendation: Dict[str, Any],
) -> Dict[str, str]:
    """Generate the AI explanation layer output. Always returns a valid
    result dict — falls back to a deterministic template on any failure."""

    fallback = _fallback_explanation(elevator_id, scenario, diagnostic_result, rca, recommendation)

    client = _get_client()
    if client is None:
        return fallback

    try:
        prompt = _build_prompt(elevator_id, diagnostic_result, rca, recommendation)
        message = client.messages.create(
            model=os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5"),
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}],
        )
        text = "".join(
            block.text for block in message.content if getattr(block, "type", None) == "text"
        )
        parsed = _parse_llm_response(text)
        if not parsed:
            return fallback

        parsed["reportText"] = fallback["reportText"]
        parsed["source"] = "llm"
        return parsed
    except Exception:
        return fallback
