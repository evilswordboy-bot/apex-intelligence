from fastapi import APIRouter, Query, HTTPException, Path
from typing import Optional, List
from app.models.live_schemas import LiveMatchSummary, LiveMatchDetail, StandingsRow, ProviderStatus
from app.services.sports_provider import get_sports_provider

router = APIRouter(prefix="/api/v1/live", tags=["Live Sports Match Centre"])

@router.get("/matches", response_model=List[LiveMatchSummary])
async def list_matches(
    sport: str = Query("all", description="Filter by sport: all, cricket, football, olympics"),
    status: str = Query("all", description="Filter by status: all, live, scheduled, completed"),
    league: Optional[str] = Query(None, description="Filter by league name")
):
    """
    Retrieves live, upcoming, or completed match fixtures from the active sports provider.
    """
    provider = get_sports_provider()
    matches = await provider.get_matches(sport=sport, status=status, league=league)
    return matches

@router.get("/matches/{match_id}", response_model=LiveMatchDetail)
async def get_match_detail(
    match_id: str = Path(..., description="Unique identifier for the match")
):
    """
    Retrieves detailed breakdown of a match including lineups, telemetry, score breakdowns, and timeline events.
    """
    provider = get_sports_provider()
    detail = await provider.get_match_detail(match_id=match_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Match not found.")
    return detail

@router.get("/standings", response_model=List[StandingsRow])
async def get_league_standings(
    sport: str = Query("cricket", description="Sport: cricket or football"),
    league: Optional[str] = Query(None, description="League name")
):
    """
    Retrieves current team standings, points, form, and net run rate / goal difference.
    """
    provider = get_sports_provider()
    return await provider.get_standings(sport=sport, league=league)

@router.get("/providers/status", response_model=ProviderStatus)
async def get_provider_status():
    """
    Returns connection status, response time, rate limits, and live/demo classification of the active provider.
    """
    provider = get_sports_provider()
    return await provider.get_status()
