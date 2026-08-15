# KONE AI Fault Assistant

A prototype built for **KONE ELEVATE '26 — Problem Statement 13: Autonomous Fault Isolation and Root Cause Analysis Assistant**.

> **⚠️ All elevator telemetry, thresholds, historical records and diagnostic scenarios in this prototype are simulated for demonstration purposes.** Nothing in this repository represents real KONE operational data, and no threshold, fault mapping, or confidence score here is a validated KONE production diagnostic. AI-assisted diagnostic recommendation — technician verification required.

## Problem Statement

Elevator technicians spend significant time manually correlating telemetry, alarm logs and historical patterns to identify the root cause of a fault. Problem Statement 13 asks for an intelligent assistant that can automatically isolate faults and perform root-cause analysis — explainably, not as a black box.

## Solution

This prototype demonstrates the complete workflow:

```
Simulated telemetry + alarms + historical patterns
        → Anomaly detection
        → Fault isolation
        → Root-cause analysis
        → Evidence-based explanation
        → Confidence score
        → Corrective-action recommendation
        → Technician-ready fault report
```

It is built as an industrial command-center dashboard, not a chatbot: a fleet overview, a per-elevator diagnostic workspace with live telemetry cards and charts, an animated diagnostic pipeline, an explainability panel ("Why this diagnosis?"), and a generated maintenance report.

## Architecture

```
kone-ai-fault-assistant/
├── frontend/            React + Vite + Tailwind + Recharts + Framer Motion
│   └── src/
│       ├── components/  Sidebar, telemetry cards/charts, pipeline, evidence panel, report view…
│       ├── pages/       Overview, Elevators, Diagnostics, Fault History, Reports
│       ├── data/        Shared status/color mappings
│       └── services/    api.js — thin fetch wrapper around the backend
│
└── backend/             Python + FastAPI
    ├── main.py                 API routes
    ├── diagnostic_engine.py    Deterministic rule engine — decides WHICH fault
    ├── rca_engine.py           Builds evidence, root-cause chain, historical match
    ├── recommendation_engine.py Maps a fault to prioritized corrective actions
    ├── ai_engine.py            LLM explanation layer, with offline fallback
    └── data/elevator_data.json Simulated fleet, scenarios, telemetry series, events
```

### Hybrid diagnostic design

The rule engine (`diagnostic_engine.py`) is the **only** thing that decides which fault is present — it evaluates simulated telemetry against simulated thresholds. The LLM layer (`ai_engine.py`) is only ever used *after* the fault is already decided, to turn the structured result into technician-friendly prose (explanation, evidence summary, root-cause narrative, recommendation summary). It is explicitly prompted not to change or invent a diagnosis. If no `ANTHROPIC_API_KEY` is configured, or the API call fails for any reason, a deterministic offline fallback generates equivalent text — the app never crashes and never blocks on AI availability.

## Features

- Fleet dashboard with health-score summary cards and a sortable/filterable elevator table
- Per-elevator diagnostic workspace: health score, 6 live telemetry cards, 4 trend charts (Recharts), and an alarm/event timeline
- Scenario selector — simulate any of 4 fault types on any elevator
- Animated 7-step diagnostic pipeline ("Collecting telemetry" → … → "Generating recommendation")
- Diagnostic result card: fault, location, probable root cause, severity, confidence
- "Why this diagnosis?" explainability panel: evidence list, AI evidence summary, visual root-cause chain, simulated historical-pattern similarity match
- Recommended corrective actions with priority and a standing safety disclaimer
- Maintenance report generator with Copy Report / Download Report, built from the same structured diagnosis
- One-click **Demo Mode**: auto-selects KONE-E204, auto-runs analysis, auto-opens the evidence panel, and auto-generates the report — full workflow in under 3 minutes
- Visible safety/trust disclaimers throughout: AI-assisted diagnostic recommendation, technician verification required

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide React, Framer Motion, React Router
**Backend:** Python, FastAPI, Pydantic, Uvicorn
**AI:** Anthropic API (optional, via `anthropic` SDK) with a deterministic offline fallback
**Data:** Simulated JSON telemetry/event/scenario dataset — no database required

## Setup

### Backend

```bash
cd kone-ai-fault-assistant/backend
pip install -r requirements.txt
cp .env.example .env   # optional — see Environment Variables below
python -m uvicorn main:app --reload --port 8000
```

The API is now available at `http://localhost:8000` (docs at `/docs`).

### Frontend

```bash
cd kone-ai-fault-assistant/frontend
npm install
cp .env.example .env   # optional — defaults to http://localhost:8000
npm run dev
```

The app is now available at `http://localhost:5173`.

## Environment Variables

**Backend (`backend/.env`):**

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | No | Enables the LLM explanation layer. Without it, a deterministic offline fallback is used and the app works fully. |
| `ANTHROPIC_MODEL` | No | Overrides the Claude model used for explanations (default `claude-sonnet-5`). |
| `CORS_ORIGINS` | No | Comma-separated allowed origins for the frontend dev server. |
| `PORT` | No | Port for the FastAPI server (default `8000`). |

**Frontend (`frontend/.env`):**

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | No | Base URL of the backend API (default `http://localhost:8000`). |

## Demo Scenarios

All scenarios and thresholds below are simulated for this prototype and are not validated KONE diagnostics.

| Scenario | Elevator | Subsystem | Probable Cause |
|---|---|---|---|
| A — Drive / Motor Overcurrent | KONE-E204 (primary demo) | Drive System | Power-electronics / IGBT abnormality |
| B — Door Mechanism Abnormality | KONE-E118 | Door System | Door operator belt wear / obstruction resistance |
| C — Abnormal Vibration | KONE-E117 | Mechanical / Guidance System | Guide roller wear or rail alignment deviation |
| D — Temperature / Cooling Anomaly | KONE-E221 | Cooling System | Cooling fan underperformance / airflow restriction |

Use the **Demo Mode** button (top of the sidebar) for the fastest end-to-end walkthrough, or open any elevator's Diagnostics page and pick a scenario from the selector to simulate a fault on it manually.

## Safety Disclaimer

This is a hackathon prototype. It does not represent real KONE operational data, validated thresholds, certified diagnostic rules, or production-accurate confidence scores. AI-assisted diagnostic output is a recommendation only — a certified technician must always verify findings before acting. This system does not replace certified maintenance personnel.

## Future Scope

- Replace simulated telemetry with a real streaming ingestion pipeline (MQTT/Kafka) from actual elevator controllers
- Expand the rule engine with a larger, KONE-validated fault taxonomy and threshold set
- Persist historical fault data in a real database to support genuine similarity search (e.g. vector embeddings over past incidents)
- Add authentication/role-based access for technicians vs. supervisors
- Closed-loop feedback: let technicians confirm/correct diagnoses to improve the rule set over time
- Native PDF export for reports and offline/mobile technician view
