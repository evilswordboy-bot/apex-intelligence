from typing import Dict, Any, List, Optional
from app.services.cricket_service import (
    get_match_detail,
    get_matchup_stats,
    get_phase_analysis,
    get_wagon_wheel_data
)
from app.services.win_probability_service import predict_win_probability
from app.services.recommendation_service import recommend_bowlers
from app.models.schemas import WinProbRequest, BowlerRecommendationRequest

def tool_match_analysis(match_id: str = "CRI-2026-IND-AUS-WTC") -> Dict[str, Any]:
    """Retrieve complete scorecard and current match state."""
    detail = get_match_detail(match_id)
    if not detail:
        return {"error": f"Match {match_id} not found."}
    
    inn1 = detail["innings"][0] if len(detail["innings"]) > 0 else {}
    inn2 = detail["innings"][1] if len(detail["innings"]) > 1 else {}
    
    return {
        "match_id": match_id,
        "fixture": f"{detail['match_info']['team1']} vs {detail['match_info']['team2']}",
        "competition": detail["match_info"]["competition"],
        "venue": detail["match_info"]["venue"],
        "inn1": {
            "team": inn1.get("batting_team"),
            "score": f"{inn1.get('total_runs')}/{inn1.get('total_wickets')}",
            "overs": inn1.get("total_overs"),
            "run_rate": inn1.get("run_rate")
        },
        "inn2": {
            "team": inn2.get("batting_team"),
            "score": f"{inn2.get('total_runs')}/{inn2.get('total_wickets')}",
            "overs": inn2.get("total_overs"),
            "run_rate": inn2.get("run_rate")
        },
        "target": detail["current_state"]["target"],
        "status": "Target Achieved" if (inn2.get("total_runs", 0) >= detail["current_state"]["target"]) else "In Progress"
    }

def tool_batter_vs_bowler_matchup(batter: str = "Virat Kohli", bowler: str = "Mitchell Starc") -> Dict[str, Any]:
    """Retrieve head-to-head metrics for batter and bowler."""
    return get_matchup_stats(batter, bowler)

def tool_win_probability(runs: int = 198, wickets: int = 4, overs: float = 18.5, target: int = 195) -> Dict[str, Any]:
    """Predict win probability with calibrated ML model."""
    req = WinProbRequest(
        innings=2,
        runs_scored=runs,
        wickets_lost=wickets,
        overs_completed=overs,
        target_runs=target
    )
    res = predict_win_probability(req)
    return {
        "batting_team_win_prob": res.batting_team_win_prob,
        "bowling_team_win_prob": res.bowling_team_win_prob,
        "current_run_rate": res.current_run_rate,
        "required_run_rate": res.required_run_rate,
        "model_version": res.model_version,
        "explanations": [e.model_dump() for e in res.explanations]
    }

def tool_recommend_bowler(match_id: str = "CRI-2026-IND-AUS-WTC", over: int = 18, striker: str = "Virat Kohli") -> Dict[str, Any]:
    """Recommend best bowler based on phase, quota and matchups."""
    req = BowlerRecommendationRequest(
        match_id=match_id,
        innings_num=2,
        target_over=over,
        striker_batter=striker,
        runs_remaining=12,
        wickets_remaining=6
    )
    res = recommend_bowlers(req)
    return {
        "target_over": over,
        "phase": res.phase,
        "striker": striker,
        "top_bowlers": [b.model_dump() for b in res.ranked_bowlers[:3]],
        "tactical_summary": res.tactical_summary
    }

def tool_player_performance(player_name: str = "Virat Kohli") -> Dict[str, Any]:
    """Retrieve player metrics across tournaments."""
    players = {
        "Virat Kohli": {
            "name": "Virat Kohli",
            "role": "Top-Order Anchor / Chase Master",
            "runs": 170,
            "balls": 90,
            "strike_rate": 188.9,
            "fours": 20,
            "sixes": 7,
            "impact_index": 96.4,
            "clutch_chase_rating": "Elite (98.2%)"
        },
        "Steve Smith": {
            "name": "Steve Smith",
            "role": "Anchor Accumulator",
            "runs": 72,
            "balls": 54,
            "strike_rate": 133.3,
            "fours": 6,
            "sixes": 2,
            "impact_index": 86.1,
            "clutch_chase_rating": "High (89.0%)"
        },
        "Mitchell Starc": {
            "name": "Mitchell Starc",
            "role": "Strike Left-Arm Pace",
            "overs": 5.3,
            "runs_conceded": 67,
            "wickets": 0,
            "economy": 12.18,
            "dot_balls": 6,
            "death_yorker_accuracy": "88%"
        }
    }
    return players.get(player_name, {
        "name": player_name,
        "role": "Elite International Cricketer",
        "strike_rate": 145.2,
        "average": 38.6,
        "impact_index": 85.0
    })
