"""
KONE AI Fault Assistant — backend API.

All elevator telemetry, thresholds, historical records and diagnostic
scenarios served by this API are SIMULATED for demonstration purposes only.
Nothing here represents real KONE operational data or validated production
diagnostics.
"""

import copy
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from dotenv import load_dotenv

    load_dotenv()
except Exception:
    pass

import diagnostic_engine
import rca_engine
import recommendation_engine
import ai_engine

DATA_PATH = Path(__file__).parent / "data" / "elevator_data.json"

app = FastAPI(title="KONE AI Fault Assistant API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_data() -> Dict[str, Any]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


class AnalyzeRequest(BaseModel):
    elevatorId: str
    scenarioId: Optional[str] = None


class ReportRequest(BaseModel):
    elevatorId: str
    scenarioId: Optional[str] = None


def _find_elevator(data: Dict[str, Any], elevator_id: str) -> Dict[str, Any]:
    for elevator in data["elevators"]:
        if elevator["id"] == elevator_id:
            return elevator
    raise HTTPException(status_code=404, detail=f"Elevator '{elevator_id}' not found")


def _resolve_scenario(data: Dict[str, Any], elevator: Dict[str, Any], scenario_id: Optional[str]) -> Dict[str, Any]:
    sid = scenario_id or elevator.get("scenarioId")
    if not sid:
        raise HTTPException(
            status_code=400,
            detail=f"Elevator '{elevator['id']}' has no active fault scenario to analyze.",
        )
    scenario = data["scenarios"].get(sid)
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario '{sid}' not found")
    return scenario


def _run_full_analysis(data: Dict[str, Any], elevator_id: str, scenario_id: Optional[str]) -> Dict[str, Any]:
    elevator = _find_elevator(data, elevator_id)
    scenario = _resolve_scenario(data, elevator, scenario_id)

    diagnostic_result = diagnostic_engine.evaluate_telemetry(scenario.get("telemetrySnapshot", {}), scenario)
    rca = rca_engine.build_rca_summary(scenario, diagnostic_result)
    recommendation = recommendation_engine.build_recommendation(scenario, diagnostic_result)
    ai_output = ai_engine.generate_explanation(elevator_id, scenario, diagnostic_result, rca, recommendation)

    return {
        "elevatorId": elevator_id,
        "scenarioId": scenario["id"],
        "scenarioLabel": scenario.get("label"),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "telemetrySnapshot": scenario.get("telemetrySnapshot", {}),
        "series": scenario.get("series", {}),
        "events": scenario.get("events", []),
        "diagnostic": diagnostic_result,
        "rca": rca,
        "recommendation": recommendation,
        "ai": ai_output,
        "isSimulated": True,
    }


@app.get("/api/health")
def health() -> Dict[str, Any]:
    return {"status": "ok", "aiConfigured": bool(os.environ.get("ANTHROPIC_API_KEY"))}


@app.get("/api/elevators")
def list_elevators() -> Dict[str, Any]:
    data = load_data()
    elevators = data["elevators"]
    summary = {
        "active": len(elevators),
        "healthy": sum(1 for e in elevators if e["status"] == "healthy"),
        "warning": sum(1 for e in elevators if e["status"] == "warning"),
        "critical": sum(1 for e in elevators if e["status"] == "critical"),
    }
    return {"elevators": elevators, "summary": summary, "isSimulated": True}


@app.get("/api/elevators/{elevator_id}")
def get_elevator(elevator_id: str) -> Dict[str, Any]:
    data = load_data()
    elevator = _find_elevator(data, elevator_id)
    result = copy.deepcopy(elevator)

    scenario_id = elevator.get("scenarioId")
    if scenario_id:
        scenario = data["scenarios"].get(scenario_id)
        if scenario:
            result["telemetrySnapshot"] = scenario.get("telemetrySnapshot", {})
            result["series"] = scenario.get("series", {})
            result["events"] = scenario.get("events", [])
            result["scenarioLabel"] = scenario.get("label")
    else:
        nominal = data.get("nominalTelemetry", {})
        result["telemetrySnapshot"] = nominal.get("telemetrySnapshot", {})
        result["series"] = nominal.get("series", {})
        result["events"] = nominal.get("events", [])
        result["scenarioLabel"] = None

    result["isSimulated"] = True
    return result


@app.get("/api/scenarios")
def list_scenarios(full: bool = False) -> Dict[str, Any]:
    data = load_data()
    if full:
        scenarios = list(data["scenarios"].values())
    else:
        scenarios = [
            {
                "id": s["id"],
                "label": s["label"],
                "shortLabel": s["shortLabel"],
                "defaultElevator": s["defaultElevator"],
                "healthScore": s["healthScore"],
            }
            for s in data["scenarios"].values()
        ]
    return {"scenarios": scenarios, "isSimulated": True}


@app.get("/api/history")
def get_history() -> Dict[str, Any]:
    data = load_data()
    return {"historicalPatterns": data.get("historicalPatterns", []), "isSimulated": True}


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest) -> Dict[str, Any]:
    data = load_data()
    return _run_full_analysis(data, req.elevatorId, req.scenarioId)


@app.post("/api/report")
def report(req: ReportRequest) -> Dict[str, Any]:
    data = load_data()
    result = _run_full_analysis(data, req.elevatorId, req.scenarioId)
    return {
        "reportText": result["ai"]["reportText"],
        "generatedAt": result["generatedAt"],
        "elevatorId": result["elevatorId"],
        "diagnostic": result["diagnostic"],
        "isSimulated": True,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)
