from typing import List, Dict, Any
from app.models.schemas import (
    BowlerRecommendationRequest,
    BowlerRecommendationResponse,
    BowlerCandidate
)
from app.services.cricket_service import get_matchup_stats

# Squad bowling options for Australia in India vs Australia fixture
AUSTRALIA_BOWLER_PROFILES = [
    {
        "name": "Pat Cummins",
        "role": "Fast Bowler",
        "powerplay_suitability": 88,
        "death_suitability": 94,
        "base_economy": 7.8,
        "overs_bowled": 3.3,
        "specialty": "Deadly yorker execution & back-of-length seam"
    },
    {
        "name": "Mitchell Starc",
        "role": "Fast Bowler",
        "powerplay_suitability": 92,
        "death_suitability": 95,
        "base_economy": 8.5,
        "overs_bowled": 3.0,
        "specialty": "Swinging toe-crusher yorkers at 145+ km/h"
    },
    {
        "name": "Adam Zampa",
        "role": "Leg Spinner",
        "powerplay_suitability": 60,
        "death_suitability": 72,
        "base_economy": 7.2,
        "overs_bowled": 3.0,
        "specialty": "Sharp slider & googly restricting boundary flow"
    },
    {
        "name": "Josh Hazlewood",
        "role": "Fast Bowler",
        "powerplay_suitability": 95,
        "death_suitability": 84,
        "base_economy": 7.4,
        "overs_bowled": 4.0, # Bowled out!
        "specialty": "Metronomic fifth-stump channel discipline"
    },
    {
        "name": "Glenn Maxwell",
        "role": "Off Spinner",
        "powerplay_suitability": 70,
        "death_suitability": 62,
        "base_economy": 8.4,
        "overs_bowled": 2.0,
        "specialty": "Darting wide off-breaks to tempt rash swings"
    }
]

def recommend_bowlers(req: BowlerRecommendationRequest) -> BowlerRecommendationResponse:
    target_over = req.target_over
    
    # Determine phase
    if target_over <= 6:
        phase = "Powerplay (Overs 1-6)"
    elif target_over <= 15:
        phase = "Middle Overs (Overs 7-15)"
    else:
        phase = "Death Overs (Overs 16-20)"

    candidates: List[BowlerCandidate] = []

    for b in AUSTRALIA_BOWLER_PROFILES:
        overs_bowled = b["overs_bowled"]
        overs_rem = max(0.0, round(4.0 - overs_bowled, 1))
        
        # Skip bowlers who have completed quota
        if overs_rem <= 0.0:
            continue

        # Get matchup vs striker
        matchup = get_matchup_stats(req.striker_batter, b["name"])
        matchup_sr = matchup["strike_rate"]
        
        # Scoring algorithm (0-100)
        # 1. Phase suitability
        if target_over >= 16:
            phase_score = b["death_suitability"]
        elif target_over <= 6:
            phase_score = b["powerplay_suitability"]
        else:
            phase_score = 80.0

        # 2. Matchup penalty/bonus (Lower striker SR = higher bowler score)
        matchup_score = max(20.0, min(100.0, 160.0 - (matchup_sr * 0.7)))

        # 3. Economy bonus
        econ_score = max(30.0, 110.0 - (b["base_economy"] * 7.0))

        composite_score = round(
            (phase_score * 0.45) + (matchup_score * 0.35) + (econ_score * 0.20),
            1
        )

        # Explainability reason
        if target_over >= 16:
            if b["name"] in ["Mitchell Starc", "Pat Cummins"]:
                reason = f"Elite death specialist ({b['death_suitability']}/100) with proven reverse-swing yorker capability under clutch pressure."
            else:
                reason = f"Tactical changeup option; maintains {matchup['dot_ball_percentage']}% dot balls against {req.striker_batter}."
        elif target_over <= 6:
            reason = f"High powerplay seam movement index ({b['powerplay_suitability']}/100) targeting top-order outside edges."
        else:
            reason = f"Middle-overs control option holding {b['base_economy']} economy to build boundary dry spell."

        candidates.append(BowlerCandidate(
            bowler_name=b["name"],
            overs_bowled=overs_bowled,
            max_overs_allowed=4.0,
            overs_remaining=overs_rem,
            current_economy=b["base_economy"],
            matchup_strike_rate=matchup_sr,
            recommended_rank=1, # Will be set below
            score=composite_score,
            primary_reason=reason,
            data_sufficiency=matchup["sample_sufficiency"]
        ))

    # Sort descending by score
    candidates.sort(key=lambda x: x.score, reverse=True)

    # Assign ranks
    for idx, c in enumerate(candidates, start=1):
        c.recommended_rank = idx

    top_pick = candidates[0].bowler_name if candidates else "Pat Cummins"
    summary = f"For Over {target_over} ({phase}), {top_pick} is ranked #1 optimal deployment against {req.striker_batter} to suppress boundary risk."

    return BowlerRecommendationResponse(
        match_id=req.match_id,
        target_over=target_over,
        phase=phase,
        striker=req.striker_batter,
        ranked_bowlers=candidates,
        tactical_summary=summary
    )
