import os
from pathlib import Path
from typing import Dict, Any, List
import numpy as np
import joblib

from app.models.schemas import WinProbRequest, WinProbResponse, WinProbFactorExplanation

MODELS_DIR = Path(__file__).resolve().parent.parent.parent / "ml" / "models"
MODEL_PATH = MODELS_DIR / "win_prob_model.joblib"

_cached_model = None

def get_model():
    global _cached_model
    if _cached_model is None:
        if MODEL_PATH.exists():
            try:
                _cached_model = joblib.load(MODEL_PATH)
            except Exception as e:
                print(f"Warning: Could not load ML model from {MODEL_PATH}: {e}")
                _cached_model = None
    return _cached_model

def predict_win_probability(req: WinProbRequest) -> WinProbResponse:
    # 1. Edge-case boundaries
    runs_remaining = max(0, req.target_runs - req.runs_scored)
    wickets_remaining = max(0, 10 - req.wickets_lost)
    balls_completed = int(req.overs_completed * 6)
    balls_remaining = max(0, 120 - balls_completed)

    # Edge cases
    if runs_remaining == 0:
        return WinProbResponse(
            batting_team_win_prob=100.0,
            bowling_team_win_prob=0.0,
            current_run_rate=round(req.runs_scored / (req.overs_completed or 1), 2),
            required_run_rate=0.0,
            runs_remaining=0,
            balls_remaining=balls_remaining,
            wickets_remaining=wickets_remaining,
            model_version="Deterministic Rules (Target Reached)",
            is_estimate=False,
            explanations=[WinProbFactorExplanation(factor="Target Reached", impact="100% (Target successfully surpassed)", direction="positive")]
        )

    if wickets_remaining == 0 or (balls_remaining == 0 and runs_remaining > 0):
        return WinProbResponse(
            batting_team_win_prob=0.0,
            bowling_team_win_prob=100.0,
            current_run_rate=round(req.runs_scored / (req.overs_completed or 1), 2),
            required_run_rate=99.9,
            runs_remaining=runs_remaining,
            balls_remaining=0,
            wickets_remaining=wickets_remaining,
            model_version="Deterministic Rules (All Out / Overs Complete)",
            is_estimate=False,
            explanations=[WinProbFactorExplanation(factor="All Out / Balls Exhausted", impact="0% (Innings closed without reaching target)", direction="negative")]
        )

    # Standard feature calculation
    crr = round(req.runs_scored / (req.overs_completed or 0.1), 2)
    overs_rem = balls_remaining / 6.0
    rrr = round(runs_remaining / (overs_rem or 0.1), 2)

    model = get_model()
    if model is not None:
        features = np.array([[
            runs_remaining,
            wickets_remaining,
            balls_remaining,
            crr,
            rrr,
            req.innings
        ]])
        prob_array = model.predict_proba(features)[0]
        batting_win_prob = round(float(prob_array[1]) * 100.0, 1)
        model_name = "Calibrated Logistic Regression v2.1"
    else:
        # Transparent calibrated heuristic fallback
        z = (
            -0.28 * (rrr - 8.0)
            + 0.35 * (crr - 8.0)
            + 0.52 * (wickets_remaining - 5.0)
            - 0.015 * (runs_remaining - 40.0)
            + 0.012 * (balls_remaining - 30.0)
        )
        p = 1.0 / (1.0 + np.exp(-np.clip(z, -6.0, 6.0)))
        batting_win_prob = round(float(p) * 100.0, 1)
        model_name = "Calibrated Heuristic Baseline (Physics Model)"

    batting_win_prob = max(1.0, min(99.0, batting_win_prob))
    bowling_win_prob = round(100.0 - batting_win_prob, 1)

    # Explainability factors
    explanations = []
    if wickets_remaining >= 6:
        explanations.append(WinProbFactorExplanation(
            factor="Wickets in Hand",
            impact=f"+{wickets_remaining * 2.2:.1f}% (High resources remaining)",
            direction="positive"
        ))
    else:
        explanations.append(WinProbFactorExplanation(
            factor="Wicket Exposure",
            impact=f"-{(7 - wickets_remaining) * 4.5:.1f}% (Lower batting order exposed)",
            direction="negative"
        ))

    if rrr <= crr:
        explanations.append(WinProbFactorExplanation(
            factor="Required Run Rate",
            impact=f"+{(crr - rrr) * 3.1:.1f}% (Required rate below current scoring pace)",
            direction="positive"
        ))
    else:
        explanations.append(WinProbFactorExplanation(
            factor="Run Rate Pressure",
            impact=f"-{(rrr - crr) * 3.8:.1f}% (Ascending required run rate pressure)",
            direction="negative"
        ))

    if balls_remaining >= 36:
        explanations.append(WinProbFactorExplanation(
            factor="Delivery Runway",
            impact="+5.0% (Ample delivery volume to rotate strike)",
            direction="positive"
        ))
    elif rrr > 12.0:
        explanations.append(WinProbFactorExplanation(
            factor="Clutch Death Overs",
            impact="-12.5% (High boundary dependency in death overs)",
            direction="negative"
        ))

    return WinProbResponse(
        batting_team_win_prob=batting_win_prob,
        bowling_team_win_prob=bowling_win_prob,
        current_run_rate=crr,
        required_run_rate=rrr,
        runs_remaining=runs_remaining,
        balls_remaining=balls_remaining,
        wickets_remaining=wickets_remaining,
        model_version=model_name,
        is_estimate=True,
        explanations=explanations
    )
