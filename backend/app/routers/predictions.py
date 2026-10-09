"""
APEX Sports Intelligence - Predictions Router (Phase 7)
Endpoints for pre-match AI outcome probabilities, scenario simulations,
model evaluation benchmarks, and historical prediction audit logs.
"""

from fastapi import APIRouter, Query, HTTPException, Body
from typing import List, Optional
from app.models.prediction_schemas import (
    UpcomingMatchPredictionItem,
    MatchPredictionRequest,
    MatchPredictionResponse,
    ModelEvaluationResponse,
    PredictionHistoryItem
)
from app.services.prediction_service import get_prediction_service

router = APIRouter(prefix="/api/v1/predictions", tags=["AI Sports Prediction Engine"])

@router.get("/upcoming", response_model=List[UpcomingMatchPredictionItem])
def list_upcoming_predictions(
    sport: str = Query("all", description="Filter by sport: all, cricket, football")
):
    """
    Returns upcoming match predictions with calibrated outcome probabilities,
    expected scores, key influencing factors, head-to-head records, and recent form.
    """
    service = get_prediction_service()
    return service.get_upcoming_predictions(sport=sport)

@router.post("/match", response_model=MatchPredictionResponse)
def predict_custom_match(
    request: MatchPredictionRequest = Body(..., description="Custom match parameters")
):
    """
    Generates a calibrated outcome prediction for a custom matchup or modified conditions
    (e.g., altered squad availability, specific venue, toss decision).
    Returns 'insufficient_data' if teams lack adequate historical samples.
    """
    service = get_prediction_service()
    return service.predict_custom_match(request)

@router.get("/metrics", response_model=ModelEvaluationResponse)
def get_model_evaluation():
    """
    Returns time-aware validation metrics comparing baseline models to calibrated ML classifiers:
    Log Loss, Brier Score, Accuracy, Expected Calibration Error, and feature importance.
    """
    service = get_prediction_service()
    return service.get_evaluation_metrics()

@router.get("/history", response_model=List[PredictionHistoryItem])
def get_prediction_history():
    """
    Returns audit trail of past predictions verified against actual match outcomes.
    """
    service = get_prediction_service()
    return service.get_history()

@router.post("/retrain")
def retrain_models():
    """
    Triggers model re-training and re-calibration pipeline on historical datasets.
    """
    import subprocess
    import sys
    from pathlib import Path
    train_script = Path(__file__).resolve().parent.parent.parent / "ml" / "train_prediction_engine.py"
    try:
        res = subprocess.run([sys.executable, str(train_script)], capture_output=True, text=True, check=True)
        # Reload service models
        service = get_prediction_service()
        service._load_metadata()
        service._load_models()
        return {"status": "success", "message": "Models successfully retrained and calibrated.", "output": res.stdout[-300:]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training pipeline error: {str(e)}")
