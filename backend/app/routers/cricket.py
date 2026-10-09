from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any

from app.models.schemas import (
    MatchListItem,
    MatchDetail,
    MatchupStats,
    PhaseAnalysisResponse,
    WagonWheelResponse,
    WinProbRequest,
    WinProbResponse,
    BowlerRecommendationRequest,
    BowlerRecommendationResponse
)
from app.services.cricket_service import (
    get_all_matches,
    get_match_detail,
    get_matchup_stats,
    get_phase_analysis,
    get_wagon_wheel_data
)
from app.services.win_probability_service import predict_win_probability
from app.services.recommendation_service import recommend_bowlers

router = APIRouter(prefix="/api/cricket", tags=["Cricket Intelligence"])

@router.get("/matches", response_model=List[MatchListItem])
def list_matches(competition: Optional[str] = None):
    return get_all_matches(competition_filter=competition)

@router.get("/matches/{match_id}", response_model=MatchDetail)
def match_detail(match_id: str):
    detail = get_match_detail(match_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Match with ID '{match_id}' not found.")
    return detail

@router.get("/matchup", response_model=MatchupStats)
def batter_vs_bowler_matchup(
    batter: str = Query(..., description="Name of the batter"),
    bowler: str = Query(..., description="Name of the bowler")
):
    if not batter.strip() or not bowler.strip():
        raise HTTPException(status_code=400, detail="Batter and bowler names cannot be empty.")
    return get_matchup_stats(batter.strip(), bowler.strip())

@router.get("/phase-analysis", response_model=PhaseAnalysisResponse)
def phase_analysis(
    match_id: str = Query(..., description="Match ID"),
    innings: int = Query(2, description="Innings number (1 or 2)")
):
    if innings not in [1, 2]:
        raise HTTPException(status_code=400, detail="Innings must be 1 or 2.")
    return get_phase_analysis(match_id, innings_num=innings)

@router.get("/wagon-wheel", response_model=WagonWheelResponse)
def wagon_wheel(
    match_id: str = Query(..., description="Match ID"),
    batter: Optional[str] = Query(None, description="Filter by batter name")
):
    return get_wagon_wheel_data(match_id, batter_filter=batter)

@router.post("/win-probability", response_model=WinProbResponse)
def calculate_win_probability(request: WinProbRequest):
    return predict_win_probability(request)

@router.post("/bowler-recommendation", response_model=BowlerRecommendationResponse)
def recommend_bowler_for_over(request: BowlerRecommendationRequest):
    if request.target_over < 1 or request.target_over > 20:
        raise HTTPException(status_code=400, detail="Target over must be between 1 and 20.")
    return recommend_bowlers(request)

@router.get("/player-radar")
def player_radar_comparison(
    playerA: str = Query("Virat Kohli"),
    playerB: str = Query("Steve Smith")
):
    """
    Returns normalized metrics across power hitting, boundary timing,
    clutch strike rate, dot ball defense, and spin adaptability.
    """
    profiles = {
        "Virat Kohli": [
            {"metric": "Power Hitting", "score": 91},
            {"metric": "Boundary Timing", "score": 96},
            {"metric": "Clutch Chase Rate", "score": 98},
            {"metric": "Running Speed", "score": 92},
            {"metric": "Spin Adaptability", "score": 94},
            {"metric": "Dot Ball Pressure", "score": 88},
        ],
        "Steve Smith": [
            {"metric": "Power Hitting", "score": 82},
            {"metric": "Boundary Timing", "score": 94},
            {"metric": "Clutch Chase Rate", "score": 89},
            {"metric": "Running Speed", "score": 85},
            {"metric": "Spin Adaptability", "score": 95},
            {"metric": "Dot Ball Pressure", "score": 90},
        ],
        "Suryakumar Yadav": [
            {"metric": "Power Hitting", "score": 98},
            {"metric": "Boundary Timing", "score": 97},
            {"metric": "Clutch Chase Rate", "score": 91},
            {"metric": "Running Speed", "score": 88},
            {"metric": "Spin Adaptability", "score": 96},
            {"metric": "Dot Ball Pressure", "score": 82},
        ],
        "Mitchell Starc": [
            {"metric": "Power Hitting", "score": 70},
            {"metric": "Yorker Accuracy", "score": 96},
            {"metric": "Pace Velocity", "score": 95},
            {"metric": "Death Economy", "score": 88},
            {"metric": "Powerplay Wickets", "score": 92},
            {"metric": "Dot Ball %", "score": 89},
        ],
        "Pat Cummins": [
            {"metric": "Power Hitting", "score": 78},
            {"metric": "Yorker Accuracy", "score": 92},
            {"metric": "Pace Velocity", "score": 91},
            {"metric": "Death Economy", "score": 91},
            {"metric": "Powerplay Wickets", "score": 90},
            {"metric": "Dot Ball %", "score": 92},
        ]
    }

    metricsA = profiles.get(playerA, profiles["Virat Kohli"])
    metricsB = profiles.get(playerB, profiles["Steve Smith"])

    combined = []
    for i, item in enumerate(metricsA):
        combined.append({
            "metric": item["metric"],
            playerA: item["score"],
            playerB: metricsB[i]["score"] if i < len(metricsB) else 80
        })

    return {
        "playerA": playerA,
        "playerB": playerB,
        "radar_data": combined
    }
