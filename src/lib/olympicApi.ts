const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface OlympicOverview {
  olympiad: string;
  total_athletes: number;
  total_nations: number;
  total_disciplines: number;
  total_coaches: number;
  total_teams: number;
  total_medals: number;
  total_gold: number;
  overall_female_percent: number;
  overall_male_percent: number;
  top_nation_by_gold: string;
  top_nation_by_total: string;
  most_efficient_nation: string;
  most_female_discipline: string;
  most_participated_discipline: string;
}

export interface OlympicMedalItem {
  rank: number;
  noc: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  rank_by_total: number;
  gold_ratio: number;
  weighted_score: number;
}

export interface OlympicAthleteItem {
  id: number;
  name: string;
  noc: string;
  discipline: string;
}

export interface OlympicGenderItem {
  id: number;
  discipline: string;
  female: number;
  male: number;
  total: number;
  female_ratio: number;
  male_ratio: number;
  gender_parity_gap: number;
  parity_category: string;
}

export interface OlympicGenderResponse {
  total_female: number;
  total_male: number;
  overall_total: number;
  overall_female_percent: number;
  overall_male_percent: number;
  parity_index: number;
  balanced_disciplines_count: number;
  female_dominated_count: number;
  male_dominated_count: number;
  disciplines: OlympicGenderItem[];
}

export interface OlympicNLQResult {
  status: string;
  query: string;
  detected_intent: string;
  confidence: number;
  answer_markdown: string;
  data_summary: Record<string, any>;
  chart?: {
    chart_type: string;
    title: string;
    x_axis_key?: string;
    data_keys: string[];
    data: any[];
  };
  sources: string[];
  execution_time_ms: number;
}

export async function fetchOlympicOverview(): Promise<OlympicOverview> {
  const res = await fetch(`${API_BASE}/api/v1/olympics/overview`);
  if (!res.ok) throw new Error("Failed to fetch Olympic overview");
  return res.json();
}

export async function fetchOlympicMedals(sortBy: string = 'gold', query: string = '', limit: number = 20): Promise<{ items: OlympicMedalItem[], total_nations: number }> {
  const url = new URL(`${API_BASE}/api/v1/olympics/medals`);
  url.searchParams.set('sort_by', sortBy);
  url.searchParams.set('limit', limit.toString());
  if (query) url.searchParams.set('q', query);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch medals table");
  return res.json();
}

export async function fetchOlympicAthletes(q: string = '', noc: string = '', discipline: string = '', page: number = 1, limit: number = 20) {
  const url = new URL(`${API_BASE}/api/v1/olympics/athletes`);
  if (q) url.searchParams.set('q', q);
  if (noc) url.searchParams.set('noc', noc);
  if (discipline) url.searchParams.set('discipline', discipline);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch athletes");
  return res.json();
}

export async function fetchOlympicGender(): Promise<OlympicGenderResponse> {
  const res = await fetch(`${API_BASE}/api/v1/olympics/gender`);
  if (!res.ok) throw new Error("Failed to fetch gender parity analytics");
  return res.json();
}

export async function submitOlympicNLQ(query: string): Promise<OlympicNLQResult> {
  const res = await fetch(`${API_BASE}/api/v1/olympics/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, include_chart: true })
  });
  if (!res.ok) throw new Error("Failed to process Olympic inquiry");
  return res.json();
}
