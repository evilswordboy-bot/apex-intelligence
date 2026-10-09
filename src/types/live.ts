export type LiveSportType = 'all' | 'cricket' | 'football' | 'olympics';
export type MatchStatusTab = 'live' | 'scheduled' | 'completed' | 'standings';

export interface LiveTeam {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  score?: string;
  secondaryScore?: string;
  overs?: string;
  runRate?: number;
  color?: string;
}

export interface LiveMatchSummary {
  id: string;
  sport: string;
  league: string;
  season: string;
  venue: string;
  status: 'LIVE' | 'SCHEDULED' | 'COMPLETED' | 'DELAYED' | 'POSTPONED';
  statusDetail: string;
  matchTime: string;
  teamHome: LiveTeam;
  teamAway: LiveTeam;
  isLive: boolean;
  isDemo: boolean;
  providerName: string;
  winProbabilityHome?: number;
  winProbabilityAway?: number;
  currentOverOrMinute?: string;
  broadcaster?: string;
}

export interface MatchEvent {
  time: string;
  team: string;
  type: 'wicket' | 'boundary' | 'goal' | 'card' | 'var' | 'checkpoint';
  description: string;
  scoreAfter?: string;
}

export interface PlayerStatItem {
  name: string;
  team: string;
  primaryMetric: string;
  secondaryMetric: string;
  rating: number;
}

export interface LiveMatchDetail {
  summary: LiveMatchSummary;
  events: MatchEvent[];
  lineupHome: PlayerStatItem[];
  lineupAway: PlayerStatItem[];
  telemetryMetrics: Record<string, any>;
  commentaryHeadline: string;
}

export interface StandingsRow {
  rank: number;
  teamName: string;
  sport: string;
  league: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  difference: string;
  form: ('W' | 'L' | 'D')[];
}

export interface ProviderStatus {
  providerName: string;
  isConnected: boolean;
  isLiveFeed: boolean;
  responseTimeMs: number;
  rateLimitRemaining: number;
  supportedSports: string[];
  supportedLeagues: string[];
  message: string;
}
