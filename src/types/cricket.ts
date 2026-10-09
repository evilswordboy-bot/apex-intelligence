export interface MatchListItem {
  id: string;
  competition: string;
  match_type: string;
  season: string;
  match_date: string;
  venue: string;
  team1: string;
  team2: string;
  winner?: string;
  win_margin?: string;
  target_runs?: number;
  is_demo: boolean;
}

export interface BatterScorecard {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  is_out: boolean;
  dismissal_info?: string;
}

export interface BowlerScorecard {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  dot_balls: number;
}

export interface InningsSummary {
  innings_num: number;
  batting_team: string;
  bowling_team: string;
  total_runs: number;
  total_wickets: number;
  total_overs: number;
  run_rate: number;
  batters: BatterScorecard[];
  bowlers: BowlerScorecard[];
  recent_deliveries: string[];
}

export interface MatchDetail {
  match_info: MatchListItem;
  innings: InningsSummary[];
  current_state: {
    batting_team: string;
    bowling_team: string;
    runs: number;
    wickets: number;
    overs: number;
    target: number;
    required_run_rate: number;
    current_run_rate: number;
    win_probability: {
      team1: number;
      team2: number;
    };
  };
}

export interface MatchupStats {
  batter: string;
  bowler: string;
  balls_faced: number;
  runs_scored: number;
  strike_rate: number;
  fours: number;
  sixes: number;
  dot_balls: number;
  dot_ball_percentage: number;
  dismissals: number;
  control_percentage: number;
  sample_sufficiency: string;
  head_to_head_rating: string;
}

export interface PhaseMetrics {
  phase_name: string;
  overs_range: string;
  runs_scored: number;
  wickets_lost: number;
  run_rate: number;
  boundary_percentage: number;
  dot_ball_percentage: number;
}

export interface PhaseAnalysisResponse {
  match_id: string;
  innings_num: number;
  team_name: string;
  phases: PhaseMetrics[];
  key_takeaway: string;
}

export interface ShotPoint {
  angle: number;
  distance: number;
  runs: number;
  zone: string;
  is_simulated: boolean;
}

export interface WagonWheelZone {
  zone: string;
  runs: number;
  percentage: number;
  count: number;
  shots: ShotPoint[];
}

export interface WagonWheelResponse {
  match_id: string;
  batter_filter?: string;
  total_runs: number;
  recorded_shots_count: number;
  illustrative_shots_count: number;
  zones: WagonWheelZone[];
}

export interface WinProbFactorExplanation {
  factor: string;
  impact: string;
  direction: 'positive' | 'negative';
}

export interface WinProbResponse {
  batting_team_win_prob: number;
  bowling_team_win_prob: number;
  current_run_rate: number;
  required_run_rate: number;
  runs_remaining: number;
  balls_remaining: number;
  wickets_remaining: number;
  model_version: string;
  is_estimate: boolean;
  explanations: WinProbFactorExplanation[];
}

export interface BowlerCandidate {
  bowler_name: string;
  overs_bowled: number;
  max_overs_allowed: number;
  overs_remaining: number;
  current_economy: number;
  matchup_strike_rate?: number;
  recommended_rank: number;
  score: number;
  primary_reason: string;
  data_sufficiency: string;
}

export interface BowlerRecommendationResponse {
  match_id: string;
  target_over: number;
  phase: string;
  striker: string;
  ranked_bowlers: BowlerCandidate[];
  tactical_summary: string;
}

export interface RadarDataPoint {
  metric: string;
  [key: string]: string | number;
}

export interface PlayerRadarResponse {
  playerA: string;
  playerB: string;
  radar_data: RadarDataPoint[];
}
