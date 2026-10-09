from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LiveTeam(BaseModel):
    id: str
    name: str
    short_name: str
    logo: Optional[str] = None
    score: Optional[str] = None  # e.g. "178/4 (18.2 ov)" or "2"
    secondary_score: Optional[str] = None  # e.g. "xG 1.84" or "Target 192"
    overs: Optional[str] = None
    run_rate: Optional[float] = None
    color: Optional[str] = None

class LiveMatchSummary(BaseModel):
    id: str
    sport: str  # "cricket", "football", "olympics"
    league: str
    season: str
    venue: str
    status: str  # "LIVE", "SCHEDULED", "COMPLETED", "DELAYED", "POSTPONED"
    status_detail: str  # e.g. "Innings 2 - Ov 18.2", "72' 2nd Half", "FT", "Today 19:30 UTC"
    match_time: str
    team_home: LiveTeam
    team_away: LiveTeam
    is_live: bool
    is_demo: bool = True
    provider_name: str = "APEX Local Relay"
    win_probability_home: Optional[float] = None
    win_probability_away: Optional[float] = None
    current_over_or_minute: Optional[str] = None
    broadcaster: Optional[str] = None

class MatchEvent(BaseModel):
    time: str
    team: str
    type: str  # "wicket", "boundary", "goal", "card", "var", "checkpoint"
    description: str
    score_after: Optional[str] = None

class PlayerStatItem(BaseModel):
    name: str
    team: str
    primary_metric: str  # e.g. "74 (41)" or "1 Goal, 2 Shots"
    secondary_metric: str  # e.g. "SR 180.4" or "91% Pass Acc"
    rating: float

class LiveMatchDetail(BaseModel):
    summary: LiveMatchSummary
    events: List[MatchEvent]
    lineup_home: List[PlayerStatItem]
    lineup_away: List[PlayerStatItem]
    telemetry_metrics: Dict[str, Any]
    commentary_headline: str

class StandingsRow(BaseModel):
    rank: int
    team_name: str
    sport: str
    league: str
    played: int
    won: int
    drawn: int
    lost: int
    points: int
    difference: str  # NRR or Goal Difference
    form: List[str]  # e.g. ["W", "W", "L", "W", "D"]

class ProviderStatus(BaseModel):
    provider_name: str
    is_connected: bool
    is_live_feed: bool
    response_time_ms: int
    rate_limit_remaining: int
    supported_sports: List[str]
    supported_leagues: List[str]
    message: str
