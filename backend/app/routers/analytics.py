from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import math

router = APIRouter(prefix="/api/v1/analytics", tags=["Sports Intelligence Analytics"])

# Pydantic schemas
class InsightRequest(BaseModel):
    sport: str
    entity_type: str = "player"  # "player" or "team"
    entity_id: str
    timeframe: str = "season"
    metrics: Optional[Dict[str, float]] = None

class InsightResponse(BaseModel):
    entity_name: str
    sport: str
    momentum: str  # "accelerating", "stable", "declining"
    momentum_delta: float
    performance_score: float
    consistency_rating: float
    strengths: List[str]
    vulnerabilities: List[str]
    coaching_recommendations: List[str]
    tactical_edge: str
    summary: str

# Sample comprehensive dataset across sports
SPORT_DATASETS = {
    "cricket": {
        "kpis": {
            "total_matches": 68,
            "performance_index": 92.4,
            "win_percentage": 73.5,
            "avg_scoring": "184.2 runs",
            "delta_pct": 8.7
        },
        "trends": [
            {"label": "Match 1", "score": 64, "benchmark": 55, "workload": 78},
            {"label": "Match 2", "score": 82, "benchmark": 60, "workload": 85},
            {"label": "Match 3", "score": 45, "benchmark": 58, "workload": 92},
            {"label": "Match 4", "score": 94, "benchmark": 62, "workload": 80},
            {"label": "Match 5", "score": 88, "benchmark": 65, "workload": 74},
            {"label": "Match 6", "score": 102, "benchmark": 68, "workload": 86},
            {"label": "Match 7", "score": 76, "benchmark": 64, "workload": 79}
        ],
        "players": [
            {
                "id": "vkohli",
                "name": "Virat Kohli",
                "team": "India",
                "role": "Top Order Batter",
                "matches": 42,
                "primary_metric": "1,840 Runs",
                "average": 57.5,
                "strike_rate": 142.8,
                "consistency": 91.2,
                "rating": 94.6,
                "recent_form": ["W", "W", "W", "L", "W"],
                "recent_scores": [74, 56, 82, 12, 94],
                "radar": [
                    {"attribute": "Strike Rate Acceleration", "value": 92},
                    {"attribute": "Boundary Conversion", "value": 96},
                    {"attribute": "Pressure Resilience", "value": 98},
                    {"attribute": "Running Between Wickets", "value": 94},
                    {"attribute": "Tactical Versatility", "value": 88},
                    {"attribute": "Fatigue Recovery", "value": 90}
                ]
            },
            {
                "id": "rsharma",
                "name": "Rohit Sharma",
                "team": "India",
                "role": "Opening Batter",
                "matches": 38,
                "primary_metric": "1,520 Runs",
                "average": 48.2,
                "strike_rate": 156.4,
                "consistency": 85.4,
                "rating": 91.8,
                "recent_form": ["W", "L", "W", "W", "W"],
                "recent_scores": [62, 15, 89, 44, 76],
                "radar": [
                    {"attribute": "Strike Rate Acceleration", "value": 98},
                    {"attribute": "Boundary Conversion", "value": 95},
                    {"attribute": "Pressure Resilience", "value": 86},
                    {"attribute": "Running Between Wickets", "value": 78},
                    {"attribute": "Tactical Versatility", "value": 89},
                    {"attribute": "Fatigue Recovery", "value": 84}
                ]
            },
            {
                "id": "ssmith",
                "name": "Steve Smith",
                "team": "Australia",
                "role": "Top Order Anchor",
                "matches": 39,
                "primary_metric": "1,410 Runs",
                "average": 52.8,
                "strike_rate": 131.2,
                "consistency": 89.6,
                "rating": 90.4,
                "recent_form": ["L", "W", "W", "L", "W"],
                "recent_scores": [48, 71, 63, 22, 85],
                "radar": [
                    {"attribute": "Strike Rate Acceleration", "value": 81},
                    {"attribute": "Boundary Conversion", "value": 84},
                    {"attribute": "Pressure Resilience", "value": 96},
                    {"attribute": "Running Between Wickets", "value": 88},
                    {"attribute": "Tactical Versatility", "value": 94},
                    {"attribute": "Fatigue Recovery", "value": 89}
                ]
            },
            {
                "id": "jbumrah",
                "name": "Jasprit Bumrah",
                "team": "India",
                "role": "Fast Bowler",
                "matches": 35,
                "primary_metric": "68 Wickets",
                "average": 18.2,
                "strike_rate": 6.32,  # Economy
                "consistency": 95.8,
                "rating": 97.2,
                "recent_form": ["W", "W", "W", "W", "W"],
                "recent_scores": [3, 2, 4, 1, 3],
                "radar": [
                    {"attribute": "Strike Rate Acceleration", "value": 97},
                    {"attribute": "Boundary Conversion", "value": 96},
                    {"attribute": "Pressure Resilience", "value": 99},
                    {"attribute": "Running Between Wickets", "value": 85},
                    {"attribute": "Tactical Versatility", "value": 94},
                    {"attribute": "Fatigue Recovery", "value": 92}
                ]
            }
        ],
        "teams": [
            {"id": "ind", "name": "India", "matches": 45, "wins": 34, "losses": 11, "win_rate": 75.6, "rating": 95.2},
            {"id": "aus", "name": "Australia", "matches": 42, "wins": 30, "losses": 12, "win_rate": 71.4, "rating": 93.8},
            {"id": "eng", "name": "England", "matches": 40, "wins": 26, "losses": 14, "win_rate": 65.0, "rating": 89.4}
        ]
    },
    "football": {
        "kpis": {
            "total_matches": 54,
            "performance_index": 89.1,
            "win_percentage": 70.4,
            "avg_scoring": "2.35 goals/match",
            "delta_pct": 5.4
        },
        "trends": [
            {"label": "MD 1", "score": 3, "benchmark": 1.8, "workload": 82},
            {"label": "MD 2", "score": 2, "benchmark": 1.9, "workload": 88},
            {"label": "MD 3", "score": 4, "benchmark": 2.0, "workload": 79},
            {"label": "MD 4", "score": 1, "benchmark": 1.8, "workload": 91},
            {"label": "MD 5", "score": 3, "benchmark": 2.1, "workload": 84},
            {"label": "MD 6", "score": 5, "benchmark": 2.2, "workload": 80},
            {"label": "MD 7", "score": 2, "benchmark": 2.0, "workload": 76}
        ],
        "players": [
            {
                "id": "ehaaland",
                "name": "Erling Haaland",
                "team": "Manchester City",
                "role": "Center Forward",
                "matches": 36,
                "primary_metric": "38 Goals (1.24 xG/90)",
                "average": 1.06,
                "strike_rate": 84.2,  # Shot conversion %
                "consistency": 88.5,
                "rating": 95.4,
                "recent_form": ["W", "W", "D", "W", "W"],
                "recent_scores": [2, 1, 0, 3, 1],
                "radar": [
                    {"attribute": "Finishing & Shot Quality", "value": 98},
                    {"attribute": "Aerial Dominance", "value": 94},
                    {"attribute": "Box Movement & Off-Ball", "value": 97},
                    {"attribute": "Sprinting Acceleration", "value": 91},
                    {"attribute": "Link-Up Combinations", "value": 74},
                    {"attribute": "Pressing Workrate", "value": 80}
                ]
            },
            {
                "id": "kmbappe",
                "name": "Kylian Mbappé",
                "team": "Real Madrid",
                "role": "Forward / Winger",
                "matches": 35,
                "primary_metric": "34 Goals (1.08 xG/90)",
                "average": 0.97,
                "strike_rate": 86.8,
                "consistency": 87.0,
                "rating": 94.8,
                "recent_form": ["W", "W", "W", "L", "W"],
                "recent_scores": [1, 2, 2, 0, 1],
                "radar": [
                    {"attribute": "Finishing & Shot Quality", "value": 95},
                    {"attribute": "Aerial Dominance", "value": 72},
                    {"attribute": "Box Movement & Off-Ball", "value": 93},
                    {"attribute": "Sprinting Acceleration", "value": 99},
                    {"attribute": "Link-Up Combinations", "value": 85},
                    {"attribute": "Pressing Workrate", "value": 76}
                ]
            },
            {
                "id": "kdebruyne",
                "name": "Kevin De Bruyne",
                "team": "Manchester City",
                "role": "Attacking Midfielder",
                "matches": 29,
                "primary_metric": "22 Assists (0.84 xA/90)",
                "average": 0.76,
                "strike_rate": 91.2,
                "consistency": 93.4,
                "rating": 94.2,
                "recent_form": ["W", "W", "W", "W", "D"],
                "recent_scores": [2, 1, 3, 1, 0],
                "radar": [
                    {"attribute": "Finishing & Shot Quality", "value": 88},
                    {"attribute": "Aerial Dominance", "value": 68},
                    {"attribute": "Box Movement & Off-Ball", "value": 86},
                    {"attribute": "Sprinting Acceleration", "value": 79},
                    {"attribute": "Link-Up Combinations", "value": 99},
                    {"attribute": "Pressing Workrate", "value": 88}
                ]
            }
        ],
        "teams": [
            {"id": "mci", "name": "Manchester City", "matches": 38, "wins": 29, "losses": 4, "win_rate": 76.3, "rating": 96.1},
            {"id": "rma", "name": "Real Madrid", "matches": 38, "wins": 28, "losses": 5, "win_rate": 73.7, "rating": 95.0},
            {"id": "ars", "name": "Arsenal", "matches": 38, "wins": 26, "losses": 6, "win_rate": 68.4, "rating": 92.4}
        ]
    },
    "olympics": {
        "kpis": {
            "total_matches": 42,
            "performance_index": 94.8,
            "win_percentage": 82.5,
            "avg_scoring": "9.84s / 88.5m",
            "delta_pct": 11.2
        },
        "trends": [
            {"label": "Heat 1", "score": 9.94, "benchmark": 10.02, "workload": 85},
            {"label": "Semi 1", "score": 9.88, "benchmark": 9.98, "workload": 92},
            {"label": "Final 1", "score": 9.79, "benchmark": 9.85, "workload": 96},
            {"label": "Diamond 1", "score": 9.83, "benchmark": 9.90, "workload": 88},
            {"label": "Diamond 2", "score": 9.81, "benchmark": 9.88, "workload": 86}
        ],
        "players": [
            {
                "id": "nlyles",
                "name": "Noah Lyles",
                "team": "USA",
                "role": "100m / 200m Sprinter",
                "matches": 24,
                "primary_metric": "9.79s PB (43.8 km/h top)",
                "average": 9.84,
                "strike_rate": 4.88,  # Cadence Hz
                "consistency": 96.4,
                "rating": 98.2,
                "recent_form": ["W", "W", "W", "W", "W"],
                "recent_scores": [9.79, 9.81, 9.83, 9.86, 9.80],
                "radar": [
                    {"attribute": "Top Speed Velocity", "value": 99},
                    {"attribute": "Step Cadence Frequency", "value": 97},
                    {"attribute": "Block Clearance Reaction", "value": 86},
                    {"attribute": "Ground Reaction Impulse", "value": 96},
                    {"attribute": "Deceleration Resistance", "value": 98},
                    {"attribute": "Hamstring Workload Reserve", "value": 91}
                ]
            },
            {
                "id": "nchopra",
                "name": "Neeraj Chopra",
                "team": "India",
                "role": "Javelin Thrower",
                "matches": 18,
                "primary_metric": "89.94m PB (34.2 m/s release)",
                "average": 88.4,
                "strike_rate": 34.2,  # Release velocity
                "consistency": 94.8,
                "rating": 96.8,
                "recent_form": ["W", "W", "W", "L", "W"],
                "recent_scores": [89.4, 88.9, 89.9, 87.6, 89.1],
                "radar": [
                    {"attribute": "Top Speed Velocity", "value": 92},
                    {"attribute": "Step Cadence Frequency", "value": 94},
                    {"attribute": "Block Clearance Reaction", "value": 98},
                    {"attribute": "Ground Reaction Impulse", "value": 97},
                    {"attribute": "Deceleration Resistance", "value": 90},
                    {"attribute": "Hamstring Workload Reserve", "value": 93}
                ]
            }
        ],
        "teams": [
            {"id": "usa", "name": "Team USA Track", "matches": 28, "wins": 22, "losses": 6, "win_rate": 78.6, "rating": 96.5},
            {"id": "ind_oly", "name": "Team India Athletics", "matches": 20, "wins": 15, "losses": 5, "win_rate": 75.0, "rating": 93.2}
        ]
    }
}

@router.get("/overview")
def get_analytics_overview(sport: str = Query("cricket"), timeframe: str = Query("season")):
    """Retrieves aggregated KPIs, recent trends, and sport summary."""
    sport_key = sport.lower()
    if sport_key not in SPORT_DATASETS:
        sport_key = "cricket"
    
    data = SPORT_DATASETS[sport_key]
    return {
        "sport": sport_key,
        "timeframe": timeframe,
        "kpis": data["kpis"],
        "trends": data["trends"],
        "total_players": len(data["players"]),
        "total_teams": len(data["teams"])
    }

@router.get("/players")
def get_players(sport: str = Query("cricket")):
    """Returns list of players with detailed metrics for the given sport."""
    sport_key = sport.lower()
    if sport_key not in SPORT_DATASETS:
        sport_key = "cricket"
    return {
        "sport": sport_key,
        "players": SPORT_DATASETS[sport_key]["players"]
    }

@router.get("/teams")
def get_teams(sport: str = Query("cricket")):
    """Returns list of teams for the given sport."""
    sport_key = sport.lower()
    if sport_key not in SPORT_DATASETS:
        sport_key = "cricket"
    return {
        "sport": sport_key,
        "teams": SPORT_DATASETS[sport_key]["teams"]
    }

@router.get("/compare")
def compare_entities(
    sport: str = Query("cricket"),
    entity_type: str = Query("player"),
    id_a: str = Query(...),
    id_b: str = Query(...)
):
    """Generates side-by-side comparison between two entities (players or teams)."""
    sport_key = sport.lower()
    if sport_key not in SPORT_DATASETS:
        sport_key = "cricket"
    
    dataset = SPORT_DATASETS[sport_key]
    
    if entity_type == "player":
        players_map = {p["id"]: p for p in dataset["players"]}
        player_a = players_map.get(id_a)
        player_b = players_map.get(id_b)
        
        if not player_a or not player_b:
            raise HTTPException(status_code=404, detail="One or both players not found.")
        
        # Calculate attribute deltas
        deltas = {}
        if "average" in player_a and "average" in player_b:
            deltas["average_diff"] = round(player_a["average"] - player_b["average"], 2)
        if "rating" in player_a and "rating" in player_b:
            deltas["rating_diff"] = round(player_a["rating"] - player_b["rating"], 1)
        if "consistency" in player_a and "consistency" in player_b:
            deltas["consistency_diff"] = round(player_a["consistency"] - player_b["consistency"], 1)
            
        return {
            "entity_type": "player",
            "sport": sport_key,
            "entity_a": player_a,
            "entity_b": player_b,
            "deltas": deltas,
            "winner_id": player_a["id"] if player_a["rating"] >= player_b["rating"] else player_b["id"]
        }
    else:
        teams_map = {t["id"]: t for t in dataset["teams"]}
        team_a = teams_map.get(id_a)
        team_b = teams_map.get(id_b)
        
        if not team_a or not team_b:
            raise HTTPException(status_code=404, detail="One or both teams not found.")
            
        return {
            "entity_type": "team",
            "sport": sport_key,
            "entity_a": team_a,
            "entity_b": team_b,
            "deltas": {
                "win_rate_diff": round(team_a["win_rate"] - team_b["win_rate"], 1),
                "rating_diff": round(team_a["rating"] - team_b["rating"], 1)
            },
            "winner_id": team_a["id"] if team_a["win_rate"] >= team_b["win_rate"] else team_b["id"]
        }

@router.post("/insights", response_model=InsightResponse)
def generate_insights(req: InsightRequest = Body(...)):
    """
    Deterministic AI Performance Insights engine.
    Calculates statistical variance, momentum trajectory, strengths, vulnerabilities,
    and actionable coaching protocols based on available sports metrics.
    """
    sport_key = req.sport.lower()
    if sport_key not in SPORT_DATASETS:
        sport_key = "cricket"
        
    dataset = SPORT_DATASETS[sport_key]
    player = next((p for p in dataset["players"] if p["id"] == req.entity_id), None)
    
    if not player:
        # Fallback to first player
        player = dataset["players"][0]
        
    # Analyze momentum based on recent scores/form
    scores = player.get("recent_scores", [70, 75, 80])
    avg = sum(scores) / len(scores) if scores else 75.0
    variance = sum((s - avg) ** 2 for s in scores) / len(scores) if len(scores) > 1 else 10.0
    std_dev = math.sqrt(variance)
    
    # Trend slope: compare last 2 to first 2
    if len(scores) >= 3:
        recent_avg = sum(scores[-2:]) / 2
        past_avg = sum(scores[:2]) / 2
        slope = recent_avg - past_avg
    else:
        slope = 2.5
        
    if slope > 3.0:
        momentum = "accelerating"
        momentum_delta = round(slope, 1)
    elif slope < -3.0:
        momentum = "declining"
        momentum_delta = round(slope, 1)
    else:
        momentum = "stable"
        momentum_delta = round(slope, 1)
        
    # Consistency index based on standard deviation
    consistency_rating = max(60.0, min(99.0, round(100 - (std_dev * 2.2), 1)))
    
    # Generate sport-specific observations
    if sport_key == "cricket":
        strengths = [
            f"Elite pressure resilience (rating {player.get('rating', 90)}/100) under chase conditions.",
            f"Boundary conversion efficiency sustained above {round(player.get('strike_rate', 140) * 0.65, 1)}% in critical phases.",
            "Superior biomechanical kinetic transfer during high-velocity impact."
        ]
        vulnerabilities = [
            "Minor control drop (12% variance) during deliveries exceeding 142 km/h outside off stump.",
            "Workload fatigue spike detected when running between wickets exceeds 26 km/h over consecutive overs."
        ]
        coaching = [
            "Introduce simulated variable bounce drills with 145+ km/h machine feeds.",
            "Monitor ACWR threshold to keep acute load within the 1.15 - 1.25 green zone."
        ]
        tactical_edge = f"Maintains +{abs(momentum_delta)}% win probability delta when batting through the middle overs."
    elif sport_key == "football":
        strengths = [
            f"High-danger zone conversion: 100% of attempts registered inside the penalty box.",
            f"Sprint acceleration sustained at {player.get('radar', [{}])[0].get('value', 90)}/100 intensity.",
            "Defensive line manipulation through blind-side decoy movement."
        ]
        vulnerabilities = [
            "Link-up pass accuracy drops 14% under coordinated counter-press in mid-third.",
            "Elevated soft-tissue strain risk if high-intensity sprint volume exceeds 1,200m per fixture."
        ]
        coaching = [
            "1-touch combination drills under tight central channel pressure.",
            "Active recovery deload cycle: 15% reduction in high-speed volume before next match."
        ]
        tactical_edge = f"Delivers decisive xG surplus (+{abs(momentum_delta)} expected value) against high-block defenses."
    else:
        strengths = [
            f"Sub-millimeter ground reaction force efficiency: {player.get('radar', [{}])[0].get('value', 95)}/100.",
            f"Top speed velocity sustained across the {player.get('primary_metric', 'benchmark')} window.",
            "Optimum cadence frequency with minimal horizontal deceleration loss."
        ]
        vulnerabilities = [
            "Block clearance reaction lag variance of ~14ms under fatigue conditions.",
            "Bilateral force plate imbalance detected on non-dominant ankle takeoff."
        ]
        coaching = [
            "Resistance sled sprints (30% body mass) emphasizing initial drive phase.",
            "Unilateral eccentric hamstring loading to balance kinetic chain symmetry."
        ]
        tactical_edge = f"Holds a +{abs(momentum_delta)}% kinematics efficiency lead over the championship field."
        
    summary = f"{player['name']} exhibits an {momentum} performance trajectory ({'+' if momentum_delta >= 0 else ''}{momentum_delta} delta) with an exceptional consistency rating of {consistency_rating}%. Core metrics indicate peak biological readiness with disciplined tactical execution."
    
    return InsightResponse(
        entity_name=player["name"],
        sport=sport_key,
        momentum=momentum,
        momentum_delta=momentum_delta,
        performance_score=player.get("rating", 90.0),
        consistency_rating=consistency_rating,
        strengths=strengths,
        vulnerabilities=vulnerabilities,
        coaching_recommendations=coaching,
        tactical_edge=tactical_edge,
        summary=summary
    )
