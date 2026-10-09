"""
APEX Sports Intelligence - Prediction Schemas (Phase 7)
Pydantic schemas for AI outcome predictions, time-aware model evaluation,
probabilistic outcome distributions, explainable factor attribution, and history.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class KeyFactor(BaseModel):
    name: str
    impact_percent: float # e.g. +14.2 or -8.5
    impact_label: str # e.g. "+14.2% (Wankhede Stadium Home Advantage)"
    direction: str # "positive" | "negative"
    category: str # "venue" | "form" | "h2h" | "availability" | "tactical"

class HeadToHeadSummary(BaseModel):
    total_meetings: int
    home_wins: int
    away_wins: int
    draws: int = 0
    home_win_ratio: float
    last_5_results: List[str]

class TeamFormSummary(BaseModel):
    team_name: str
    last_5: List[str] # ["W", "W", "L", "W", "D"]
    form_points: int # e.g. 10 out of 15
    avg_score_recent: float

class PredictedProbabilities(BaseModel):
    p_home: float
    p_away: float
    p_draw: Optional[float] = None
    most_likely_outcome: str

class ExpectedScoreSummary(BaseModel):
    home_expected: float
    away_expected: Optional[float] = None
    score_range_label: str
    metric_type: str # "runs" or "goals"

class UpcomingMatchPredictionItem(BaseModel):
    id: str
    sport: str
    league: str
    match_date: str
    venue: str
    team_home: str
    team_away: str
    team_home_logo: str
    team_away_logo: str
    probabilities: PredictedProbabilities
    expected_score: ExpectedScoreSummary
    confidence_level: str
    data_sufficiency: str # "sufficient" | "insufficient_data"
    key_factors: List[KeyFactor]
    h2h: HeadToHeadSummary
    form_home: TeamFormSummary
    form_away: TeamFormSummary
    model_version: str

class MatchPredictionRequest(BaseModel):
    sport: str = Field("cricket", description="Sport: cricket or football")
    team_home: str = Field(..., description="Home or Team 1 name")
    team_away: str = Field(..., description="Away or Team 2 name")
    venue: Optional[str] = Field(None, description="Venue stadium name")
    toss_winner: Optional[str] = Field(None, description="Toss winning team (cricket)")
    toss_decision: Optional[str] = Field("field", description="bat or field (cricket)")
    player_availability_home: Optional[float] = Field(1.0, ge=0.5, le=1.0, description="Availability multiplier 0.5-1.0")
    player_availability_away: Optional[float] = Field(1.0, ge=0.5, le=1.0, description="Availability multiplier 0.5-1.0")

class MatchPredictionResponse(BaseModel):
    matchup: str
    sport: str
    data_sufficiency: str # "sufficient" | "insufficient_data"
    sufficiency_message: Optional[str] = None
    probabilities: PredictedProbabilities
    expected_score: ExpectedScoreSummary
    confidence_level: str
    key_factors: List[KeyFactor]
    h2h: Optional[HeadToHeadSummary] = None
    model_assumptions: List[str]
    limitations_disclaimer: str

class ModelEvaluationResponse(BaseModel):
    engine_version: str
    pipeline_name: str
    trained_at: str
    framework: str
    temporal_validation: str
    probability_calibration: str
    models: Dict[str, Any]
    disclaimer: str

class PredictionHistoryItem(BaseModel):
    id: str
    date: str
    sport: str
    matchup: str
    predicted_winner: str
    predicted_probability: float
    actual_winner: Optional[str] = None
    actual_scoreline: Optional[str] = None
    status: str # "CORRECT", "INCORRECT", "PENDING"
    brier_error: Optional[float] = None
