import {
  MatchListItem,
  MatchDetail,
  MatchupStats,
  PhaseAnalysisResponse,
  WagonWheelResponse,
  WinProbRequest,
  WinProbResponse,
  BowlerRecommendationRequest,
  BowlerRecommendationResponse,
  PlayerRadarResponse
} from '@/types/cricket';

const API_BASE = '/api/cricket';

export async function fetchMatches(competition?: string): Promise<MatchListItem[]> {
  const url = competition ? `${API_BASE}/matches?competition=${encodeURIComponent(competition)}` : `${API_BASE}/matches`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch matches: ${res.statusText}`);
  return res.json();
}

export async function fetchMatchDetail(matchId: string): Promise<MatchDetail> {
  const res = await fetch(`${API_BASE}/matches/${matchId}`);
  if (!res.ok) throw new Error(`Failed to fetch match details for ${matchId}`);
  return res.json();
}

export async function fetchMatchup(batter: string, bowler: string): Promise<MatchupStats> {
  const res = await fetch(`${API_BASE}/matchup?batter=${encodeURIComponent(batter)}&bowler=${encodeURIComponent(bowler)}`);
  if (!res.ok) throw new Error(`Failed to fetch matchup: ${res.statusText}`);
  return res.json();
}

export async function fetchPhaseAnalysis(matchId: string, innings: number = 2): Promise<PhaseAnalysisResponse> {
  const res = await fetch(`${API_BASE}/phase-analysis?match_id=${encodeURIComponent(matchId)}&innings=${innings}`);
  if (!res.ok) throw new Error(`Failed to fetch phase analysis: ${res.statusText}`);
  return res.json();
}

export async function fetchWagonWheel(matchId: string, batter?: string): Promise<WagonWheelResponse> {
  const url = batter
    ? `${API_BASE}/wagon-wheel?match_id=${encodeURIComponent(matchId)}&batter=${encodeURIComponent(batter)}`
    : `${API_BASE}/wagon-wheel?match_id=${encodeURIComponent(matchId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch wagon wheel: ${res.statusText}`);
  return res.json();
}

export async function calculateWinProbability(payload: WinProbRequest): Promise<WinProbResponse> {
  const res = await fetch(`${API_BASE}/win-probability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to calculate win probability: ${res.statusText}`);
  return res.json();
}

export async function recommendBowler(payload: BowlerRecommendationRequest): Promise<BowlerRecommendationResponse> {
  const res = await fetch(`${API_BASE}/bowler-recommendation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to get bowler recommendation: ${res.statusText}`);
  return res.json();
}

export async function fetchPlayerRadar(playerA: string, playerB: string): Promise<PlayerRadarResponse> {
  const res = await fetch(`${API_BASE}/player-radar?playerA=${encodeURIComponent(playerA)}&playerB=${encodeURIComponent(playerB)}`);
  if (!res.ok) throw new Error(`Failed to fetch player radar: ${res.statusText}`);
  return res.json();
}
