from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class MatchListItem(BaseModel):
    id: str
    competition: str
    match_type: str
    season: str
    match_date: str
    venue: str
    team1: str
    team2: str
    winner: Optional[str] = None
    win_margin: Optional[str] = None
    target_runs: Optional[int] = None
    is_demo: bool = False

class DeliveryItem(BaseModel):
    id: int
    over: int
    ball: int
    batter: str
    non_striker: str
    bowler: str
    runs_batter: int
    runs_extras: int
    runs_total: int
    is_wicket: bool
    dismissal_kind: Optional[str] = None
    dismissed_player: Optional[str] = None
    shot_zone: Optional[str] = None
    shot_angle: Optional[float] = None
    shot_distance: Optional[float] = None
    is_simulated: bool = False

class BatterScorecard(BaseModel):
    name: str
    runs: int
    balls: int
    fours: int
    sixes: int
    strike_rate: float
    is_out: bool
    dismissal_info: Optional[str] = None

class BowlerScorecard(BaseModel):
    name: str
    overs: float
    maidens: int
    runs: int
    wickets: int
    economy: float
    dot_balls: int

class InningsSummary(BaseModel):
    innings_num: int
    batting_team: str
    bowling_team: str
    total_runs: int
    total_wickets: int
    total_overs: float
    run_rate: float
    batters: List[BatterScorecard]
    bowlers: List[BowlerScorecard]
    recent_deliveries: List[str]

class MatchDetail(BaseModel):
    match_info: MatchListItem
    innings: List[InningsSummary]
    current_state: Dict[str, Any]

class MatchupStats(BaseModel):
    batter: str
    bowler: str
    balls_faced: int
    runs_scored: int
    strike_rate: float
    fours: int
    sixes: int
    dot_balls: int
    dot_ball_percentage: float
    dismissals: int
    control_percentage: float
    sample_sufficiency: str # "High Confidence", "Moderate Sample", "Low Sample (<10 balls)"
    head_to_head_rating: str # "Batter Favored", "Bowler Dominated", "Even Contest"

class PhaseMetrics(BaseModel):
    phase_name: str # "Powerplay (1-6)", "Middle (7-15)", "Death (16-20)"
    overs_range: str
    runs_scored: int
    wickets_lost: int
    run_rate: float
    boundary_percentage: float
    dot_ball_percentage: float

class PhaseAnalysisResponse(BaseModel):
    match_id: str
    innings_num: int
    team_name: str
    phases: List[PhaseMetrics]
    key_takeaway: str

class ShotPoint(BaseModel):
    angle: float # 0-360
    distance: float # 0-85m
    runs: int
    zone: str
    is_simulated: bool

class WagonWheelZone(BaseModel):
    zone: str
    runs: int
    percentage: float
    count: int = 0
    shots: List[ShotPoint] = []

class WagonWheelResponse(BaseModel):
    match_id: str
    batter_filter: Optional[str] = None
    total_runs: int
    recorded_shots_count: int
    illustrative_shots_count: int
    zones: List[Dict[str, Any]]

class WinProbRequest(BaseModel):
    match_id: Optional[str] = None
    innings: int = 2
    runs_scored: int = Field(..., ge=0)
    wickets_lost: int = Field(..., ge=0, le=10)
    overs_completed: float = Field(..., ge=0.0, le=20.0)
    target_runs: int = Field(..., gt=0)

class WinProbFactorExplanation(BaseModel):
    factor: str
    impact: str # e.g. "+14.2% (Wickets in hand)", "-9.4% (Steep RRR)"
    direction: str # "positive" or "negative"

class WinProbResponse(BaseModel):
    batting_team_win_prob: float # 0.0 - 100.0
    bowling_team_win_prob: float # 0.0 - 100.0
    current_run_rate: float
    required_run_rate: float
    runs_remaining: int
    balls_remaining: int
    wickets_remaining: int
    model_version: str
    is_estimate: bool = True
    explanations: List[WinProbFactorExplanation]

class BowlerRecommendationRequest(BaseModel):
    match_id: str
    innings_num: int
    target_over: int = Field(..., ge=1, le=20)
    striker_batter: str
    non_striker_batter: Optional[str] = None
    runs_remaining: int
    wickets_remaining: int

class BowlerCandidate(BaseModel):
    bowler_name: str
    overs_bowled: float
    max_overs_allowed: float = 4.0
    overs_remaining: float
    current_economy: float
    matchup_strike_rate: Optional[float]
    recommended_rank: int
    score: float # 0 - 100
    primary_reason: str
    data_sufficiency: str # "Sufficient Data", "Limited Sample Size"

class BowlerRecommendationResponse(BaseModel):
    match_id: str
    target_over: int
    phase: str # Powerplay, Middle, Death
    striker: str
    ranked_bowlers: List[BowlerCandidate]
    tactical_summary: str
