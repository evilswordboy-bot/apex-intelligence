"""
APEX AI — Olympic Intelligence REST API Router
Provides endpoints for Olympic Games analytics, search, rankings, gender parity, and natural language queries.
"""
from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import PlainTextResponse
from typing import Optional

from app.models.olympic_schemas import (
    OverviewSummaryResponse,
    AthleteListResponse,
    AthleteDetail,
    CoachListResponse,
    TeamListResponse,
    MedalTableResponse,
    NationDossierResponse,
    GenderParticipationResponse,
    DisciplineListResponse,
    DisciplineDetailResponse,
    DelegationEfficiencyResponse,
    CorrelationResponse,
    GiniAnalysisResponse,
    OlympicNLQRequest,
    OlympicNLQResponse
)
from app.services.olympic_service import (
    get_overview_summary,
    get_athletes,
    get_athlete_detail,
    get_coaches,
    get_teams,
    get_medals_table,
    get_nation_dossier,
    get_gender_participation,
    get_disciplines_summary,
    get_discipline_detail,
    get_delegation_efficiency,
    get_correlation_analysis,
    get_gini_analysis,
    get_dataset_dataframe
)
from app.services.olympic_nlq_service import process_olympic_nlq

router = APIRouter(prefix="/api/v1/olympics", tags=["Olympic Intelligence Engine"])

@router.get(
    "/overview",
    response_model=OverviewSummaryResponse,
    summary="High-Level Olympic Games Overview",
    description="Returns global census metrics: total athletes, participating nations, disciplines, medals awarded, and gender balance."
)
def overview():
    try:
        return get_overview_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve Olympic overview: {str(e)}")

@router.get(
    "/athletes",
    response_model=AthleteListResponse,
    summary="Search & Paginated Athletes Roster",
    description="Retrieve athletes with fuzzy name matching and exact filtering by National Olympic Committee (NOC) and discipline."
)
def list_athletes(
    q: Optional[str] = Query(None, description="Fuzzy search across name, NOC, and discipline"),
    noc: Optional[str] = Query(None, description="Filter by Country/NOC (e.g. 'United States of America', 'India')"),
    discipline: Optional[str] = Query(None, description="Filter by discipline (e.g. 'Athletics', 'Swimming')"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    limit: int = Query(20, ge=1, le=100, description="Items per page (max 100)")
):
    try:
        return get_athletes(q=q, noc=noc, discipline=discipline, page=page, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list athletes: {str(e)}")

@router.get(
    "/athletes/{athlete_name}",
    response_model=AthleteDetail,
    summary="Athlete Comprehensive Dossier",
    description="Returns individual athlete information joined with national delegation size, medal rank, coaches, and team event entries."
)
def athlete_profile(athlete_name: str):
    try:
        detail = get_athlete_detail(athlete_name)
        if not detail:
            raise HTTPException(status_code=404, detail=f"Athlete '{athlete_name}' not found in verified Olympic records.")
        return detail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve athlete details: {str(e)}")

@router.get(
    "/coaches",
    response_model=CoachListResponse,
    summary="Search & List Accredited Coaches",
    description="Browse coaches across sports, delegations, and specialized events."
)
def list_coaches(
    q: Optional[str] = Query(None, description="Search term for coach name, NOC, or discipline"),
    noc: Optional[str] = Query(None, description="Filter by NOC"),
    discipline: Optional[str] = Query(None, description="Filter by discipline"),
    event: Optional[str] = Query(None, description="Filter by specific event"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    try:
        return get_coaches(q=q, noc=noc, discipline=discipline, event=event, page=page, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list coaches: {str(e)}")

@router.get(
    "/teams",
    response_model=TeamListResponse,
    summary="Search & List National Teams",
    description="Browse official team entries across team sports (e.g. Men's Football, Women's 3x3 Basketball, Mixed Relay)."
)
def list_teams(
    q: Optional[str] = Query(None, description="Search term"),
    noc: Optional[str] = Query(None, description="Filter by NOC"),
    discipline: Optional[str] = Query(None, description="Filter by discipline"),
    event: Optional[str] = Query(None, description="Filter by event (e.g. 'Men', 'Women', 'Mixed')"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    try:
        return get_teams(q=q, noc=noc, discipline=discipline, event=event, page=page, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list teams: {str(e)}")

@router.get(
    "/medals",
    response_model=MedalTableResponse,
    summary="Official Olympic Medal Table",
    description="Returns verified medal counts with flexible sorting (by gold rank, total medals, or weighted 3G+2S+1B score)."
)
def medals_table(
    sort_by: str = Query("gold", description="Sort by 'gold', 'total', 'rank', 'silver', 'bronze', or 'weighted_score'"),
    order: str = Query("desc", description="Sort direction ('asc' or 'desc')"),
    q: Optional[str] = Query(None, description="Filter by Country/NOC"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    try:
        return get_medals_table(sort_by=sort_by, order=order, q=q, page=page, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve medal table: {str(e)}")

@router.get(
    "/medals/{noc}",
    response_model=NationDossierResponse,
    summary="National Olympic Dossier",
    description="Comprehensive national breakdown: medal standings, athlete contingent share, gold conversion rate, and contested sports."
)
def nation_dossier(noc: str):
    try:
        dossier = get_nation_dossier(noc)
        if not dossier:
            raise HTTPException(status_code=404, detail=f"No Olympic delegation found matching '{noc}'.")
        return dossier
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve nation dossier: {str(e)}")

@router.get(
    "/gender",
    response_model=GenderParticipationResponse,
    summary="Gender Participation & Parity Analytics",
    description="Examines gender representation across all 46 Olympic disciplines, computing parity gaps, indices, and dominant categories."
)
def gender_analytics():
    try:
        return get_gender_participation()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute gender analytics: {str(e)}")

@router.get(
    "/disciplines",
    response_model=DisciplineListResponse,
    summary="List All 46 Olympic Disciplines",
    description="Comparative overview across sports: total participants, female/male counts, team events, and accredited coaches."
)
def list_disciplines():
    try:
        return get_disciplines_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list disciplines: {str(e)}")

@router.get(
    "/disciplines/{discipline_name}",
    response_model=DisciplineDetailResponse,
    summary="Discipline Detailed Breakdown",
    description="In-depth profile of an Olympic discipline, including top national contingents and registered teams."
)
def discipline_profile(discipline_name: str):
    try:
        detail = get_discipline_detail(discipline_name)
        if not detail:
            raise HTTPException(status_code=404, detail=f"Discipline '{discipline_name}' not found.")
        return detail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve discipline details: {str(e)}")

@router.get(
    "/analytics/efficiency",
    response_model=DelegationEfficiencyResponse,
    summary="Delegation Athletic Efficiency Analysis",
    description="Calculates medals-won per athlete fielded, highlighting high-yield delegations and conversion rates."
)
def delegation_efficiency(
    min_athletes: int = Query(5, ge=1, description="Minimum number of fielded athletes to qualify for efficiency ranking")
):
    try:
        return get_delegation_efficiency(min_athletes=min_athletes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute delegation efficiency: {str(e)}")

@router.get(
    "/analytics/correlation",
    response_model=CorrelationResponse,
    summary="Correlation: Delegation Size vs Medal Yield",
    description="Performs Pearson correlation, R-squared evaluation, and linear regression residual modeling."
)
def correlation_model():
    try:
        return get_correlation_analysis()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute statistical correlation: {str(e)}")

@router.get(
    "/analytics/gini",
    response_model=GiniAnalysisResponse,
    summary="Gini Inequality Metric for Medal Concentration",
    description="Evaluates the concentration of Olympic podium medals across competing nations using the Gini coefficient."
)
def gini_analysis():
    try:
        return get_gini_analysis()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute Gini index: {str(e)}")

@router.post(
    "/query",
    response_model=OlympicNLQResponse,
    summary="Natural Language Query (NLQ) Engine",
    description="Processes plain-English inquiries, extracts entities and intents, queries validated SQLite datasets, and returns markdown answers and chart configs."
)
def natural_language_query(payload: OlympicNLQRequest):
    try:
        return process_olympic_nlq(payload.query, include_chart=payload.include_chart)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process natural language query: {str(e)}")

@router.get(
    "/export/csv",
    summary="Export Olympic Dataset to CSV",
    description="Streams verified datasets ('athletes', 'coaches', 'gender', 'medals', 'teams') as standard CSV files."
)
def export_csv(dataset: str = Query("medals", description="'athletes', 'coaches', 'gender', 'medals', or 'teams'")):
    try:
        df = get_dataset_dataframe(dataset)
        csv_data = df.to_csv(index=False)
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=olympics_{dataset.lower()}.csv"}
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export CSV: {str(e)}")
