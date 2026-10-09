import os
import time
import httpx
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from app.models.live_schemas import (
    LiveMatchSummary, 
    LiveMatchDetail, 
    LiveTeam, 
    MatchEvent, 
    PlayerStatItem, 
    StandingsRow, 
    ProviderStatus
)

# In-memory simple TTL Cache
class TTLMemoryCache:
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry:
            if time.time() < entry["expires_at"]:
                return entry["data"]
            else:
                del self._cache[key]
        return None

    def set(self, key: str, data: Any, ttl_seconds: int = 15):
        self._cache[key] = {
            "data": data,
            "expires_at": time.time() + ttl_seconds
        }

cache = TTLMemoryCache()

# Abstract Base Provider
class BaseSportsProvider(ABC):
    @abstractmethod
    async def get_matches(self, sport: str = "cricket", status: str = "live", league: Optional[str] = None) -> List[LiveMatchSummary]:
        pass

    @abstractmethod
    async def get_match_detail(self, match_id: str) -> Optional[LiveMatchDetail]:
        pass

    @abstractmethod
    async def get_standings(self, sport: str = "cricket", league: Optional[str] = None) -> List[StandingsRow]:
        pass

    @abstractmethod
    async def get_status(self) -> ProviderStatus:
        pass


# 1. Local Calibrated Live Relay Provider (Deterministic / Offline Fallback)
class LocalRelayProvider(BaseSportsProvider):
    def __init__(self):
        self.provider_name = "APEX Calibrated Relay (Local Engine)"
        self.supported_sports = ["cricket", "football", "olympics"]
        self.supported_leagues = [
            "ICC World Championship", 
            "Indian Premier League", 
            "UEFA Champions League", 
            "English Premier League", 
            "Diamond League Athletics"
        ]

    async def get_matches(self, sport: str = "cricket", status: str = "live", league: Optional[str] = None) -> List[LiveMatchSummary]:
        all_matches = self._generate_fixtures()
        
        # Filter by sport
        filtered = [m for m in all_matches if sport == "all" or m.sport.lower() == sport.lower()]
        
        # Filter by status
        if status != "all":
            req_status = status.lower()
            if req_status in ["live", "active"]:
                filtered = [m for m in filtered if m.status.lower() in ["live", "active", "in_progress"]]
            elif req_status in ["upcoming", "scheduled"]:
                filtered = [m for m in filtered if m.status.lower() in ["scheduled", "upcoming"]]
            elif req_status in ["completed", "finished", "ft"]:
                filtered = [m for m in filtered if m.status.lower() in ["completed", "finished", "ft"]]
            else:
                filtered = [m for m in filtered if m.status.lower() == req_status]
            
        # Filter by league
        if league and league != "all":
            filtered = [m for m in filtered if league.lower() in m.league.lower()]
            
        return filtered

    async def get_match_detail(self, match_id: str) -> Optional[LiveMatchDetail]:
        fixtures = self._generate_fixtures()
        match = next((m for m in fixtures if m.id == match_id), None)
        if not match:
            # Fallback to first fixture with requested ID
            match = fixtures[0]

        if match.sport == "cricket":
            events = [
                MatchEvent(time="18.2 ov", team=match.team_home.name, type="boundary", description="Virat Kohli drives powerfully through mid-off for 4 runs.", score_after="178/4"),
                MatchEvent(time="17.5 ov", team=match.team_home.name, type="wicket", description="Rinku Singh caught at long-on by Pat Cummins b Hazlewood.", score_after="172/4"),
                MatchEvent(time="16.1 ov", team=match.team_home.name, type="boundary", description="Virat Kohli steps out and lofts over cover for SIX.", score_after="161/3"),
                MatchEvent(time="14.3 ov", team=match.team_home.name, type="checkpoint", description="Strategic Timeout taken. Target requires 38 runs off 33 balls.", score_after="146/3")
            ]
            lineup_home = [
                PlayerStatItem(name="Virat Kohli", team=match.team_home.name, primary_metric="74* (41)", secondary_metric="SR 180.4 • 6x4, 3x6", rating=94.6),
                PlayerStatItem(name="Rohit Sharma", team=match.team_home.name, primary_metric="45 (28)", secondary_metric="SR 160.7 • 5x4, 2x6", rating=88.2),
                PlayerStatItem(name="Suryakumar Yadav", team=match.team_home.name, primary_metric="32 (18)", secondary_metric="SR 177.8 • 3x4, 2x6", rating=89.5),
                PlayerStatItem(name="Jasprit Bumrah", team=match.team_home.name, primary_metric="4-0-24-3", secondary_metric="Econ 6.00 • 14 dots", rating=96.4)
            ]
            lineup_away = [
                PlayerStatItem(name="Travis Head", team=match.team_away.name, primary_metric="68 (44)", secondary_metric="SR 154.5 • 8x4, 2x6", rating=91.0),
                PlayerStatItem(name="Steve Smith", team=match.team_away.name, primary_metric="42 (32)", secondary_metric="SR 131.2 • 4x4", rating=86.5),
                PlayerStatItem(name="Pat Cummins", team=match.team_away.name, primary_metric="3.2-0-34-1", secondary_metric="Econ 10.20", rating=84.0),
                PlayerStatItem(name="Mitchell Starc", team=match.team_away.name, primary_metric="4-0-38-2", secondary_metric="Econ 9.50", rating=85.2)
            ]
            telemetry = {
                "run_rate_current": 9.71,
                "run_rate_required": 7.36,
                "win_probability": "India 76% - Australia 24%",
                "projected_score": "194 Runs",
                "seam_torque_avg": "2,380 RPM",
                "boundary_percentage": "62.4%"
            }
            commentary = "India needs 14 runs from 10 balls. Virat Kohli anchoring with masterclass pacing."
        elif match.sport == "football":
            events = [
                MatchEvent(time="72'", team=match.team_home.name, type="goal", description="Erling Haaland buries low finish into bottom right corner from De Bruyne cross.", score_after="2 - 1"),
                MatchEvent(time="58'", team=match.team_away.name, type="goal", description="Vinicius Jr equals with deflected curler from edge of the box.", score_after="1 - 1"),
                MatchEvent(time="34'", team=match.team_home.name, type="goal", description="Rodri header off set piece cross.", score_after="1 - 0"),
                MatchEvent(time="19'", team=match.team_away.name, type="card", description="Camavinga receives yellow card for tactical foul on Foden.", score_after="0 - 0")
            ]
            lineup_home = [
                PlayerStatItem(name="Erling Haaland", team=match.team_home.name, primary_metric="1 Goal, 4 Shots", secondary_metric="1.37 xG • 5 Duels Won", rating=93.4),
                PlayerStatItem(name="Kevin De Bruyne", team=match.team_home.name, primary_metric="1 Assist, 4 Key Passes", secondary_metric="92% Pass Acc • 0.84 xA", rating=94.2),
                PlayerStatItem(name="Rodri", team=match.team_home.name, primary_metric="1 Goal, 88 Passes", secondary_metric="94% Acc • 8 Recoveries", rating=91.8)
            ]
            lineup_away = [
                PlayerStatItem(name="Vinicius Jr", team=match.team_away.name, primary_metric="1 Goal, 3 Dribbles", secondary_metric="34.2 km/h Top Speed", rating=89.6),
                PlayerStatItem(name="Jude Bellingham", team=match.team_away.name, primary_metric="2 Shots, 4 Tackles", secondary_metric="88% Pass Acc", rating=88.4),
                PlayerStatItem(name="Thibaut Courtois", team=match.team_away.name, primary_metric="5 Saves", secondary_metric="1.12 xG Prevented", rating=90.2)
            ]
            telemetry = {
                "possession": "Man City 64% - Real Madrid 36%",
                "xG_aggregate": "City 2.14 : Real 1.08",
                "field_tilt": "71% City attacking third",
                "pressing_ppda": "8.4 (High Intensity)",
                "sprint_distance": "9.4 km total team high-speed running"
            }
            commentary = "Haaland strike gives City the aggregate advantage with 18 minutes remaining."
        else:
            events = [
                MatchEvent(time="Heat 1", team="USA", type="checkpoint", description="Noah Lyles clocks 9.88s at 4.88 Hz cadence to qualify #1.", score_after="9.88s"),
                MatchEvent(time="Heat 2", team="JAM", type="checkpoint", description="Kishane Thompson clocks 9.84s to lead semi-final round.", score_after="9.84s")
            ]
            lineup_home = [
                PlayerStatItem(name="Noah Lyles", team="USA", primary_metric="9.79s PB", secondary_metric="43.8 km/h Top Speed", rating=98.2)
            ]
            lineup_away = [
                PlayerStatItem(name="Kishane Thompson", team="Jamaica", primary_metric="9.82s SB", secondary_metric="43.4 km/h Top Speed", rating=96.5)
            ]
            telemetry = {
                "top_cadence": "4.88 Hz",
                "ground_reaction_force": "2,840 N",
                "contact_time": "84 ms",
                "wind_reading": "+0.6 m/s legal"
            }
            commentary = "Championship final track prepared. Sub-9.80s conditions expected."

        return LiveMatchDetail(
            summary=match,
            events=events,
            lineup_home=lineup_home,
            lineup_away=lineup_away,
            telemetry_metrics=telemetry,
            commentary_headline=commentary
        )

    async def get_standings(self, sport: str = "cricket", league: Optional[str] = None) -> List[StandingsRow]:
        if sport == "football":
            return [
                StandingsRow(rank=1, team_name="Manchester City", sport="football", league="Premier League", played=32, won=24, drawn=5, lost=3, points=77, difference="+54", form=["W", "W", "W", "D", "W"]),
                StandingsRow(rank=2, team_name="Arsenal", sport="football", league="Premier League", played=32, won=23, drawn=6, lost=3, points=75, difference="+51", form=["W", "W", "L", "W", "W"]),
                StandingsRow(rank=3, team_name="Liverpool", sport="football", league="Premier League", played=32, won=22, drawn=7, lost=3, points=73, difference="+43", form=["D", "W", "W", "W", "L"]),
                StandingsRow(rank=4, team_name="Aston Villa", sport="football", league="Premier League", played=33, won=19, drawn=6, lost=8, points=63, difference="+19", form=["W", "L", "W", "D", "W"]),
                StandingsRow(rank=5, team_name="Tottenham Hotspur", sport="football", league="Premier League", played=32, won=18, drawn=6, lost=8, points=60, difference="+16", form=["L", "W", "D", "W", "L"])
            ]
        else:
            return [
                StandingsRow(rank=1, team_name="Kolkata Knight Riders", sport="cricket", league="Indian Premier League", played=14, won=10, drawn=0, lost=3, points=21, difference="+1.428", form=["W", "W", "W", "W", "D"]),
                StandingsRow(rank=2, team_name="Sunrisers Hyderabad", sport="cricket", league="Indian Premier League", played=14, won=8, drawn=0, lost=5, points=17, difference="+0.414", form=["W", "L", "W", "W", "D"]),
                StandingsRow(rank=3, team_name="Rajasthan Royals", sport="cricket", league="Indian Premier League", played=14, won=8, drawn=0, lost=5, points=17, difference="+0.273", form=["L", "L", "L", "W", "D"]),
                StandingsRow(rank=4, team_name="Royal Challengers Bengaluru", sport="cricket", league="Indian Premier League", played=14, won=7, drawn=0, lost=7, points=14, difference="+0.459", form=["W", "W", "W", "W", "W"]),
                StandingsRow(rank=5, team_name="Chennai Super Kings", sport="cricket", league="Indian Premier League", played=14, won=7, drawn=0, lost=7, points=14, difference="+0.392", form=["L", "W", "L", "W", "L"])
            ]

    async def get_status(self) -> ProviderStatus:
        return ProviderStatus(
            provider_name=self.provider_name,
            is_connected=True,
            is_live_feed=False,  # Clear truthful labeling: local calibrated feed
            response_time_ms=12,
            rate_limit_remaining=9999,
            supported_sports=self.supported_sports,
            supported_leagues=self.supported_leagues,
            message="APEX Local Calibrated Engine active with high-frequency telemetry relay."
        )

    def _generate_fixtures(self) -> List[LiveMatchSummary]:
        return [
            # 1. LIVE Cricket Match
            LiveMatchSummary(
                id="live-cric-01",
                sport="cricket",
                league="ICC World Championship Finals",
                season="2026",
                venue="Lord's Cricket Ground, London",
                status="LIVE",
                status_detail="Innings 2 • Over 18.2 (Chase)",
                match_time="Live Now",
                is_live=True,
                is_demo=True,
                provider_name=self.provider_name,
                win_probability_home=76.4,
                win_probability_away=23.6,
                current_over_or_minute="18.2 ov",
                broadcaster="APEX Live Telemetry Stream",
                team_home=LiveTeam(
                    id="ind",
                    name="India",
                    short_name="IND",
                    logo="🏏",
                    score="178/4",
                    secondary_score="Target: 192 (Needs 14 runs off 10 balls)",
                    overs="18.2 ov",
                    run_rate=9.71,
                    color="#2D6BFF"
                ),
                team_away=LiveTeam(
                    id="aus",
                    name="Australia",
                    short_name="AUS",
                    logo="🦘",
                    score="191/7",
                    secondary_score="20.0 ov completed",
                    overs="20.0 ov",
                    run_rate=9.55,
                    color="#FFD700"
                )
            ),
            # 2. LIVE Football Match
            LiveMatchSummary(
                id="live-foot-01",
                sport="football",
                league="UEFA Champions League Semifinal",
                season="2026",
                venue="Etihad Stadium, Manchester",
                status="LIVE",
                status_detail="72' 2nd Half",
                match_time="Live Now",
                is_live=True,
                is_demo=True,
                provider_name=self.provider_name,
                win_probability_home=68.2,
                win_probability_away=31.8,
                current_over_or_minute="72'",
                broadcaster="APEX Tactical Vision Stream",
                team_home=LiveTeam(
                    id="mci",
                    name="Manchester City",
                    short_name="MCI",
                    logo="⚽",
                    score="2",
                    secondary_score="xG 2.14 • 14 Shots",
                    color="#6CABDD"
                ),
                team_away=LiveTeam(
                    id="rma",
                    name="Real Madrid",
                    short_name="RMA",
                    logo="👑",
                    score="1",
                    secondary_score="xG 1.08 • 7 Shots",
                    color="#FFFFFF"
                )
            ),
            # 3. UPCOMING Cricket Match
            LiveMatchSummary(
                id="up-cric-02",
                sport="cricket",
                league="Indian Premier League",
                season="2026",
                venue="Wankhede Stadium, Mumbai",
                status="SCHEDULED",
                status_detail="Starts at 19:30 IST",
                match_time="Today • 19:30 UTC",
                is_live=False,
                is_demo=True,
                provider_name=self.provider_name,
                win_probability_home=52.0,
                win_probability_away=48.0,
                broadcaster="JioCinema / Star Sports",
                team_home=LiveTeam(
                    id="mi",
                    name="Mumbai Indians",
                    short_name="MI",
                    logo="⚡",
                    score="—",
                    color="#004BA0"
                ),
                team_away=LiveTeam(
                    id="csk",
                    name="Chennai Super Kings",
                    short_name="CSK",
                    logo="🦁",
                    score="—",
                    color="#FFFF00"
                )
            ),
            # 4. UPCOMING Football Match
            LiveMatchSummary(
                id="up-foot-02",
                sport="football",
                league="English Premier League",
                season="2026",
                venue="Emirates Stadium, London",
                status="SCHEDULED",
                status_detail="Tomorrow • 16:30 UTC",
                match_time="Tomorrow • 16:30 UTC",
                is_live=False,
                is_demo=True,
                provider_name=self.provider_name,
                win_probability_home=54.5,
                win_probability_away=45.5,
                broadcaster="Sky Sports Premier League",
                team_home=LiveTeam(
                    id="ars",
                    name="Arsenal",
                    short_name="ARS",
                    logo="🔴",
                    score="—",
                    color="#EF0107"
                ),
                team_away=LiveTeam(
                    id="che",
                    name="Chelsea",
                    short_name="CHE",
                    logo="🦁",
                    score="—",
                    color="#034694"
                )
            ),
            # 5. COMPLETED Cricket Match
            LiveMatchSummary(
                id="comp-cric-03",
                sport="cricket",
                league="ICC T20 Championship",
                season="2026",
                venue="MCG, Melbourne",
                status="COMPLETED",
                status_detail="India won by 6 wickets (4 balls remaining)",
                match_time="Completed Yesterday",
                is_live=False,
                is_demo=True,
                provider_name=self.provider_name,
                win_probability_home=100.0,
                win_probability_away=0.0,
                team_home=LiveTeam(
                    id="ind",
                    name="India",
                    short_name="IND",
                    logo="🏏",
                    score="164/4 (19.2 ov)",
                    secondary_score="Won by 6 wkts",
                    color="#2D6BFF"
                ),
                team_away=LiveTeam(
                    id="eng",
                    name="England",
                    short_name="ENG",
                    logo="🦁",
                    score="160/8 (20.0 ov)",
                    secondary_score="Innings complete",
                    color="#CC0000"
                )
            ),
            # 6. COMPLETED Football Match
            LiveMatchSummary(
                id="comp-foot-03",
                sport="football",
                league="UEFA Champions League",
                season="2026",
                venue="Allianz Arena, Munich",
                status="COMPLETED",
                status_detail="Full Time (FT)",
                match_time="Completed Yesterday",
                is_live=False,
                is_demo=True,
                provider_name=self.provider_name,
                win_probability_home=100.0,
                win_probability_away=0.0,
                team_home=LiveTeam(
                    id="bay",
                    name="Bayern Munich",
                    short_name="BAY",
                    logo="🔴",
                    score="3",
                    secondary_score="xG 2.45",
                    color="#DC052D"
                ),
                team_away=LiveTeam(
                    id="psg",
                    name="Paris Saint-Germain",
                    short_name="PSG",
                    logo="🗼",
                    score="1",
                    secondary_score="xG 0.94",
                    color="#004170"
                )
            )
        ]


# 2. External Provider: TheSportsDB
class TheSportsDBProvider(BaseSportsProvider):
    def __init__(self, api_key: str = "3"):
        self.api_key = api_key
        self.base_url = f"https://www.thesportsdb.com/api/v1/json/{api_key}"
        self.provider_name = "TheSportsDB Live API"
        self.fallback = LocalRelayProvider()

    async def get_matches(self, sport: str = "cricket", status: str = "live", league: Optional[str] = None) -> List[LiveMatchSummary]:
        cache_key = f"tsdb_matches_{sport}_{status}_{league}"
        cached = cache.get(cache_key)
        if cached:
            return cached

        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                # Query past/upcoming events for target league (e.g., EPL id: 4328)
                league_id = "4328" if sport == "football" else "4335"
                endpoint = f"{self.base_url}/eventspast.php?id={league_id}" if status == "completed" else f"{self.base_url}/eventsnext.php?id={league_id}"
                
                resp = await client.get(endpoint)
                if resp.status_code == 200:
                    data = resp.json()
                    events = data.get("events") or []
                    if events:
                        results = []
                        for ev in events[:6]:
                            results.append(LiveMatchSummary(
                                id=f"tsdb-{ev.get('idEvent')}",
                                sport=sport,
                                league=ev.get("strLeague", "League"),
                                season=ev.get("strSeason", "2026"),
                                venue=ev.get("strVenue", "Stadium"),
                                status="COMPLETED" if status == "completed" else "SCHEDULED",
                                status_detail=f"{ev.get('intHomeScore', '0')} - {ev.get('intAwayScore', '0')}" if status == "completed" else ev.get("strTime", "Upcoming"),
                                match_time=ev.get("dateEvent", "Today"),
                                is_live=False,
                                is_demo=False,
                                provider_name=self.provider_name,
                                team_home=LiveTeam(
                                    id=f"tsdb-th-{ev.get('idHomeTeam')}",
                                    name=ev.get("strHomeTeam", "Home"),
                                    short_name=ev.get("strHomeTeam", "Home")[:3].upper(),
                                    score=str(ev.get("intHomeScore", "0"))
                                ),
                                team_away=LiveTeam(
                                    id=f"tsdb-ta-{ev.get('idAwayTeam')}",
                                    name=ev.get("strAwayTeam", "Away"),
                                    short_name=ev.get("strAwayTeam", "Away")[:3].upper(),
                                    score=str(ev.get("intAwayScore", "0"))
                                )
                            ))
                        cache.set(cache_key, results, ttl_seconds=30)
                        return results
        except Exception:
            pass

        # Fallback to local calibrated relay if external API is unreachable or rate limited
        return await self.fallback.get_matches(sport, status, league)

    async def get_match_detail(self, match_id: str) -> Optional[LiveMatchDetail]:
        return await self.fallback.get_match_detail(match_id)

    async def get_standings(self, sport: str = "cricket", league: Optional[str] = None) -> List[StandingsRow]:
        return await self.fallback.get_standings(sport, league)

    async def get_status(self) -> ProviderStatus:
        try:
            start = time.time()
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/lookupleague.php?id=4328")
                elapsed_ms = int((time.time() - start) * 1000)
                if res.status_code == 200:
                    return ProviderStatus(
                        provider_name=self.provider_name,
                        is_connected=True,
                        is_live_feed=True,
                        response_time_ms=elapsed_ms,
                        rate_limit_remaining=100,
                        supported_sports=["football", "cricket"],
                        supported_leagues=["English Premier League", "ICC World Championship"],
                        message="Connected to TheSportsDB Live Feed."
                    )
        except Exception:
            pass

        return await self.fallback.get_status()


# Provider Factory
def get_sports_provider() -> BaseSportsProvider:
    provider_type = os.getenv("SPORTS_PROVIDER", "local").lower()
    api_key = os.getenv("SPORTS_API_KEY", "")

    if provider_type == "thesportsdb" or api_key:
        return TheSportsDBProvider(api_key=api_key or "3")
    
    return LocalRelayProvider()
