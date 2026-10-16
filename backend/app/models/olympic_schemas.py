from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PaginationMeta(BaseModel):
    total: int
    page: int
    limit: int
    pages: int

class AthleteItem(BaseModel):
    id: int
    name: str
    noc: str
    discipline: str

class AthleteDetail(BaseModel):
    id: int
    name: str
    noc: str
    discipline: str
    delegation_total_athletes: int
    nation_medal_rank: Optional[int] = None
    nation_total_medals: Optional[int] = None
    nation_gold_medals: Optional[int] = None
    coaches: List[str] = []
    team_events: List[str] = []

class AthleteListResponse(BaseModel):
    items: List[AthleteItem]
    pagination: PaginationMeta

class CoachItem(BaseModel):
    id: int
    name: str
    noc: str
    discipline: str
    event: Optional[str] = None

class CoachListResponse(BaseModel):
    items: List[CoachItem]
    pagination: PaginationMeta

class TeamItem(BaseModel):
    id: int
    name: str
    discipline: str
    noc: str
    event: str

class TeamListResponse(BaseModel):
    items: List[TeamItem]
    pagination: PaginationMeta

class MedalItem(BaseModel):
    rank: int
    noc: str
    gold: int
    silver: int
    bronze: int
    total: int
    rank_by_total: int
    gold_ratio: float
    weighted_score: int

class MedalTableResponse(BaseModel):
    total_nations: int
    total_medals: int
    total_gold: int
    total_silver: int
    total_bronze: int
    items: List[MedalItem]
    pagination: PaginationMeta

class NationDossierResponse(BaseModel):
    noc: str
    medal_record: Optional[MedalItem] = None
    total_athletes: int
    athlete_share_percent: float
    total_coaches: int
    total_teams: int
    disciplines_entered: List[str]
    medals_per_100_athletes: Optional[float] = None
    gold_conversion_rate: Optional[float] = None
    efficiency_rank: Optional[int] = None

class GenderDisciplineItem(BaseModel):
    id: int
    discipline: str
    female: int
    male: int
    total: int
    female_ratio: float
    male_ratio: float
    gender_parity_gap: float
    parity_category: str

class GenderParticipationResponse(BaseModel):
    total_female: int
    total_male: int
    overall_total: int
    overall_female_percent: float
    overall_male_percent: float
    parity_index: float
    balanced_disciplines_count: int
    female_dominated_count: int
    male_dominated_count: int
    disciplines: List[GenderDisciplineItem]

class DisciplineItem(BaseModel):
    discipline: str
    athlete_count: int
    female_count: int
    male_count: int
    female_percent: float
    team_events_count: int
    coaches_count: int

class DisciplineListResponse(BaseModel):
    total_disciplines: int
    items: List[DisciplineItem]

class DisciplineDetailResponse(BaseModel):
    discipline: str
    athlete_count: int
    female_count: int
    male_count: int
    female_percent: float
    participating_nations_count: int
    top_nations: List[Dict[str, Any]]
    teams: List[TeamItem]
    coaches: List[CoachItem]

class DelegationEfficiencyItem(BaseModel):
    noc: str
    rank: int
    gold: int
    total_medals: int
    total_athletes: int
    medals_per_athlete: float
    athletes_per_medal: float
    gold_ratio: float
    efficiency_score: float

class DelegationEfficiencyResponse(BaseModel):
    analysis_type: str = "Delegation Medal Yield & Athletic Efficiency"
    items: List[DelegationEfficiencyItem]

class CorrelationResponse(BaseModel):
    metric: str
    sample_size: int
    pearson_r: float
    r_squared: float
    slope: float
    intercept: float
    p_value_summary: str
    interpretation: str
    data_points: List[Dict[str, Any]]

class GiniAnalysisResponse(BaseModel):
    metric: str
    gini_coefficient: float
    interpretation: str
    top_10_percent_medal_share: float
    top_20_percent_medal_share: float
    bottom_50_percent_medal_share: float
    total_medaling_nations: int
    total_competing_nations: int

class OverviewSummaryResponse(BaseModel):
    olympiad: str
    total_athletes: int
    total_nations: int
    total_disciplines: int
    total_coaches: int
    total_teams: int
    total_medals: int
    total_gold: int
    overall_female_percent: float
    overall_male_percent: float
    top_nation_by_gold: str
    top_nation_by_total: str
    most_efficient_nation: str
    most_female_discipline: str
    most_participated_discipline: str

class OlympicNLQRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=500, description="Natural language inquiry regarding Olympic athletes, medals, disciplines, or analytics")
    include_chart: bool = True

class ChartConfig(BaseModel):
    chart_type: str # 'bar', 'pie', 'scatter', 'radar', 'table'
    title: str
    x_axis_key: Optional[str] = None
    data_keys: List[str] = []
    data: List[Dict[str, Any]] = []

class OlympicNLQResponse(BaseModel):
    status: str
    query: str
    detected_intent: str
    confidence: float
    answer_markdown: str
    data_summary: Dict[str, Any]
    chart: Optional[ChartConfig] = None
    sources: List[str]
    execution_time_ms: float
