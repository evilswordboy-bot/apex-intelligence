export type SportType = 'cricket' | 'football' | 'olympics' | 'all';
export type TimeframeType = '7d' | '30d' | 'season' | 'all';
export type EntityType = 'player' | 'team';

export interface AnalyticsKPIs {
  totalMatches: number;
  performanceIndex: number;
  winPercentage: number;
  averageScoring: string;
  deltaPct: number;
  healthIndex?: number;
}

export interface TrendDataPoint {
  label: string;
  score: number;
  benchmark: number;
  workload: number;
}

export interface RadarAttribute {
  attribute: string;
  value: number;
}

export interface PlayerAnalytics {
  id: string;
  name: string;
  team: string;
  role: string;
  sport: SportType;
  matches: number;
  primaryMetric: string;
  average: number;
  strikeRate: number; // Or conversion %
  consistency: number;
  rating: number; // 0 - 100
  recentForm: ('W' | 'L' | 'D')[];
  recentScores: number[];
  radar: RadarAttribute[];
}

export interface TeamAnalytics {
  id: string;
  name: string;
  sport: SportType;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  rating: number;
}

export interface EntityComparisonResult {
  entityType: EntityType;
  sport: SportType;
  entityA: PlayerAnalytics | TeamAnalytics;
  entityB: PlayerAnalytics | TeamAnalytics;
  deltas: Record<string, number>;
  winnerId: string;
}

export interface AIInsightData {
  entityName: string;
  sport: SportType;
  momentum: 'accelerating' | 'stable' | 'declining';
  momentumDelta: number;
  performanceScore: number;
  consistencyRating: number;
  strengths: string[];
  vulnerabilities: string[];
  coachingRecommendations: string[];
  tacticalEdge: string;
  summary: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  sport: SportType;
  title: string;
  description: string;
  metricChange: string;
  badge: string;
  badgeColor: string;
}
