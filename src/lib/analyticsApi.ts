import { 
  SportType, 
  TimeframeType, 
  EntityType,
  AnalyticsKPIs, 
  TrendDataPoint, 
  PlayerAnalytics, 
  TeamAnalytics, 
  EntityComparisonResult, 
  AIInsightData,
  ActivityFeedItem 
} from '@/types/analytics';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Built-in resilient fallback dataset
export const FALLBACK_PLAYERS: Record<string, PlayerAnalytics[]> = {
  cricket: [
    {
      id: 'vkohli',
      name: 'Virat Kohli',
      team: 'India',
      role: 'Top Order Batter',
      sport: 'cricket',
      matches: 42,
      primaryMetric: '1,840 Runs',
      average: 57.5,
      strikeRate: 142.8,
      consistency: 91.2,
      rating: 94.6,
      recentForm: ['W', 'W', 'W', 'L', 'W'],
      recentScores: [74, 56, 82, 12, 94],
      radar: [
        { attribute: 'Strike Rate Acceleration', value: 92 },
        { attribute: 'Boundary Conversion', value: 96 },
        { attribute: 'Pressure Resilience', value: 98 },
        { attribute: 'Running Between Wickets', value: 94 },
        { attribute: 'Tactical Versatility', value: 88 },
        { attribute: 'Fatigue Recovery', value: 90 }
      ]
    },
    {
      id: 'rsharma',
      name: 'Rohit Sharma',
      team: 'India',
      role: 'Opening Batter',
      sport: 'cricket',
      matches: 38,
      primaryMetric: '1,520 Runs',
      average: 48.2,
      strikeRate: 156.4,
      consistency: 85.4,
      rating: 91.8,
      recentForm: ['W', 'L', 'W', 'W', 'W'],
      recentScores: [62, 15, 89, 44, 76],
      radar: [
        { attribute: 'Strike Rate Acceleration', value: 98 },
        { attribute: 'Boundary Conversion', value: 95 },
        { attribute: 'Pressure Resilience', value: 86 },
        { attribute: 'Running Between Wickets', value: 78 },
        { attribute: 'Tactical Versatility', value: 89 },
        { attribute: 'Fatigue Recovery', value: 84 }
      ]
    },
    {
      id: 'ssmith',
      name: 'Steve Smith',
      team: 'Australia',
      role: 'Top Order Anchor',
      sport: 'cricket',
      matches: 39,
      primaryMetric: '1,410 Runs',
      average: 52.8,
      strikeRate: 131.2,
      consistency: 89.6,
      rating: 90.4,
      recentForm: ['L', 'W', 'W', 'L', 'W'],
      recentScores: [48, 71, 63, 22, 85],
      radar: [
        { attribute: 'Strike Rate Acceleration', value: 81 },
        { attribute: 'Boundary Conversion', value: 84 },
        { attribute: 'Pressure Resilience', value: 96 },
        { attribute: 'Running Between Wickets', value: 88 },
        { attribute: 'Tactical Versatility', value: 94 },
        { attribute: 'Fatigue Recovery', value: 89 }
      ]
    },
    {
      id: 'jbumrah',
      name: 'Jasprit Bumrah',
      team: 'India',
      role: 'Fast Bowler',
      sport: 'cricket',
      matches: 35,
      primaryMetric: '68 Wickets',
      average: 18.2,
      strikeRate: 6.32,
      consistency: 95.8,
      rating: 97.2,
      recentForm: ['W', 'W', 'W', 'W', 'W'],
      recentScores: [85, 92, 90, 88, 96],
      radar: [
        { attribute: 'Strike Rate Acceleration', value: 97 },
        { attribute: 'Boundary Conversion', value: 96 },
        { attribute: 'Pressure Resilience', value: 99 },
        { attribute: 'Running Between Wickets', value: 85 },
        { attribute: 'Tactical Versatility', value: 94 },
        { attribute: 'Fatigue Recovery', value: 92 }
      ]
    }
  ],
  football: [
    {
      id: 'ehaaland',
      name: 'Erling Haaland',
      team: 'Manchester City',
      role: 'Center Forward',
      sport: 'football',
      matches: 36,
      primaryMetric: '38 Goals (1.24 xG/90)',
      average: 1.06,
      strikeRate: 84.2,
      consistency: 88.5,
      rating: 95.4,
      recentForm: ['W', 'W', 'D', 'W', 'W'],
      recentScores: [88, 85, 72, 95, 89],
      radar: [
        { attribute: 'Finishing & Shot Quality', value: 98 },
        { attribute: 'Aerial Dominance', value: 94 },
        { attribute: 'Box Movement & Off-Ball', value: 97 },
        { attribute: 'Sprinting Acceleration', value: 91 },
        { attribute: 'Link-Up Combinations', value: 74 },
        { attribute: 'Pressing Workrate', value: 80 }
      ]
    },
    {
      id: 'kmbappe',
      name: 'Kylian Mbappé',
      team: 'Real Madrid',
      role: 'Forward / Winger',
      sport: 'football',
      matches: 35,
      primaryMetric: '34 Goals (1.08 xG/90)',
      average: 0.97,
      strikeRate: 86.8,
      consistency: 87.0,
      rating: 94.8,
      recentForm: ['W', 'W', 'W', 'L', 'W'],
      recentScores: [85, 92, 94, 68, 88],
      radar: [
        { attribute: 'Finishing & Shot Quality', value: 95 },
        { attribute: 'Aerial Dominance', value: 72 },
        { attribute: 'Box Movement & Off-Ball', value: 93 },
        { attribute: 'Sprinting Acceleration', value: 99 },
        { attribute: 'Link-Up Combinations', value: 85 },
        { attribute: 'Pressing Workrate', value: 76 }
      ]
    },
    {
      id: 'kdebruyne',
      name: 'Kevin De Bruyne',
      team: 'Manchester City',
      role: 'Attacking Midfielder',
      sport: 'football',
      matches: 29,
      primaryMetric: '22 Assists (0.84 xA/90)',
      average: 0.76,
      strikeRate: 91.2,
      consistency: 93.4,
      rating: 94.2,
      recentForm: ['W', 'W', 'W', 'W', 'D'],
      recentScores: [92, 88, 96, 90, 84],
      radar: [
        { attribute: 'Finishing & Shot Quality', value: 88 },
        { attribute: 'Aerial Dominance', value: 68 },
        { attribute: 'Box Movement & Off-Ball', value: 86 },
        { attribute: 'Sprinting Acceleration', value: 79 },
        { attribute: 'Link-Up Combinations', value: 99 },
        { attribute: 'Pressing Workrate', value: 88 }
      ]
    }
  ],
  olympics: [
    {
      id: 'nlyles',
      name: 'Noah Lyles',
      team: 'USA',
      role: '100m / 200m Sprinter',
      sport: 'olympics',
      matches: 24,
      primaryMetric: '9.79s PB (43.8 km/h)',
      average: 9.84,
      strikeRate: 4.88,
      consistency: 96.4,
      rating: 98.2,
      recentForm: ['W', 'W', 'W', 'W', 'W'],
      recentScores: [98, 97, 99, 96, 98],
      radar: [
        { attribute: 'Top Speed Velocity', value: 99 },
        { attribute: 'Step Cadence Frequency', value: 97 },
        { attribute: 'Block Clearance Reaction', value: 86 },
        { attribute: 'Ground Reaction Impulse', value: 96 },
        { attribute: 'Deceleration Resistance', value: 98 },
        { attribute: 'Hamstring Workload Reserve', value: 91 }
      ]
    },
    {
      id: 'nchopra',
      name: 'Neeraj Chopra',
      team: 'India',
      role: 'Javelin Thrower',
      sport: 'olympics',
      matches: 18,
      primaryMetric: '89.94m PB (34.2 m/s)',
      average: 88.4,
      strikeRate: 34.2,
      consistency: 94.8,
      rating: 96.8,
      recentForm: ['W', 'W', 'W', 'L', 'W'],
      recentScores: [96, 95, 98, 92, 97],
      radar: [
        { attribute: 'Top Speed Velocity', value: 92 },
        { attribute: 'Step Cadence Frequency', value: 94 },
        { attribute: 'Block Clearance Reaction', value: 98 },
        { attribute: 'Ground Reaction Impulse', value: 97 },
        { attribute: 'Deceleration Resistance', value: 90 },
        { attribute: 'Hamstring Workload Reserve', value: 93 }
      ]
    }
  ]
};

export const FALLBACK_TEAMS: Record<string, TeamAnalytics[]> = {
  cricket: [
    { id: 'ind', name: 'India', sport: 'cricket', matches: 45, wins: 34, losses: 11, winRate: 75.6, rating: 95.2 },
    { id: 'aus', name: 'Australia', sport: 'cricket', matches: 42, wins: 30, losses: 12, winRate: 71.4, rating: 93.8 },
    { id: 'eng', name: 'England', sport: 'cricket', matches: 40, wins: 26, losses: 14, winRate: 65.0, rating: 89.4 }
  ],
  football: [
    { id: 'mci', name: 'Manchester City', sport: 'football', matches: 38, wins: 29, losses: 4, winRate: 76.3, rating: 96.1 },
    { id: 'rma', name: 'Real Madrid', sport: 'football', matches: 38, wins: 28, losses: 5, winRate: 73.7, rating: 95.0 },
    { id: 'ars', name: 'Arsenal', sport: 'football', matches: 38, wins: 26, losses: 6, winRate: 68.4, rating: 92.4 }
  ],
  olympics: [
    { id: 'usa', name: 'Team USA Track', sport: 'olympics', matches: 28, wins: 22, losses: 6, winRate: 78.6, rating: 96.5 },
    { id: 'ind_oly', name: 'Team India Athletics', sport: 'olympics', matches: 20, wins: 15, losses: 5, winRate: 75.0, rating: 93.2 }
  ]
};

export const FALLBACK_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: 'act-1',
    timestamp: '12m ago',
    sport: 'cricket',
    title: 'Kinematic Seam Release Indexed',
    description: 'Jasprit Bumrah clocked 144.8 km/h with 2,420 RPM reverse seam rotational torque.',
    metricChange: '+4.2% Seam Drift',
    badge: 'Live Sensor',
    badgeColor: '#B6FF3B'
  },
  {
    id: 'act-2',
    timestamp: '34m ago',
    sport: 'football',
    title: 'High Danger Box Incursion',
    description: 'Haaland completed 6 blind-side decoy runs, yielding 0.44 individual xG value in 15 mins.',
    metricChange: '+0.44 xG Danger',
    badge: 'Tactical Lab',
    badgeColor: '#2D6BFF'
  },
  {
    id: 'act-3',
    timestamp: '1h ago',
    sport: 'olympics',
    title: 'Ground Contact Cadence Calibrated',
    description: 'Noah Lyles ground reaction phase reached 84ms at 4.88 Hz step frequency on the back straight.',
    metricChange: '-2ms Contact Time',
    badge: 'Kinematics',
    badgeColor: '#FF6B2C'
  },
  {
    id: 'act-4',
    timestamp: '2h ago',
    sport: 'cricket',
    title: 'ACWR Fatigue Guard Verification',
    description: 'Acute-to-chronic workload index updated to 1.18 (Safe Green Zone) across bowling unit.',
    metricChange: '0.0 Strain Flags',
    badge: 'ACWR Safe',
    badgeColor: '#B6FF3B'
  }
];

// API Methods
export async function fetchAnalyticsOverview(sport: SportType = 'cricket', timeframe: TimeframeType = 'season'): Promise<{
  sport: string;
  timeframe: string;
  kpis: AnalyticsKPIs;
  trends: TrendDataPoint[];
}> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/analytics/overview?sport=${sport}&timeframe=${timeframe}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return {
        sport: data.sport,
        timeframe: data.timeframe,
        kpis: {
          totalMatches: data.kpis.total_matches,
          performanceIndex: data.kpis.performance_index,
          winPercentage: data.kpis.win_percentage,
          averageScoring: data.kpis.avg_scoring,
          deltaPct: data.kpis.delta_pct,
          healthIndex: 98.4
        },
        trends: data.trends
      };
    }
  } catch (e) {
    // Backend offline; use fallback
  }

  // Fallback KPIs
  const sportKey = sport === 'all' ? 'cricket' : sport;
  const kpiMap: Record<string, AnalyticsKPIs> = {
    cricket: { totalMatches: 68, performanceIndex: 92.4, winPercentage: 73.5, averageScoring: '184.2 runs', deltaPct: 8.7, healthIndex: 99.1 },
    football: { totalMatches: 54, performanceIndex: 89.1, winPercentage: 70.4, averageScoring: '2.35 goals/match', deltaPct: 5.4, healthIndex: 97.8 },
    olympics: { totalMatches: 42, performanceIndex: 94.8, winPercentage: 82.5, averageScoring: '9.84s / 88.5m', deltaPct: 11.2, healthIndex: 98.5 },
  };

  const trendMap: Record<string, TrendDataPoint[]> = {
    cricket: [
      { label: 'Match 1', score: 64, benchmark: 55, workload: 78 },
      { label: 'Match 2', score: 82, benchmark: 60, workload: 85 },
      { label: 'Match 3', score: 45, benchmark: 58, workload: 92 },
      { label: 'Match 4', score: 94, benchmark: 62, workload: 80 },
      { label: 'Match 5', score: 88, benchmark: 65, workload: 74 },
      { label: 'Match 6', score: 102, benchmark: 68, workload: 86 },
      { label: 'Match 7', score: 76, benchmark: 64, workload: 79 }
    ],
    football: [
      { label: 'MD 1', score: 3, benchmark: 1.8, workload: 82 },
      { label: 'MD 2', score: 2, benchmark: 1.9, workload: 88 },
      { label: 'MD 3', score: 4, benchmark: 2.0, workload: 79 },
      { label: 'MD 4', score: 1, benchmark: 1.8, workload: 91 },
      { label: 'MD 5', score: 3, benchmark: 2.1, workload: 84 },
      { label: 'MD 6', score: 5, benchmark: 2.2, workload: 80 },
      { label: 'MD 7', score: 2, benchmark: 2.0, workload: 76 }
    ],
    olympics: [
      { label: 'Heat 1', score: 9.94, benchmark: 10.02, workload: 85 },
      { label: 'Semi 1', score: 9.88, benchmark: 9.98, workload: 92 },
      { label: 'Final 1', score: 9.79, benchmark: 9.85, workload: 96 },
      { label: 'Diamond 1', score: 9.83, benchmark: 9.90, workload: 88 },
      { label: 'Diamond 2', score: 9.81, benchmark: 9.88, workload: 86 }
    ]
  };

  return {
    sport: sportKey,
    timeframe,
    kpis: kpiMap[sportKey] || kpiMap.cricket,
    trends: trendMap[sportKey] || trendMap.cricket
  };
}

export async function fetchPlayers(sport: SportType = 'cricket'): Promise<PlayerAnalytics[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/analytics/players?sport=${sport}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data.players.map((p: any) => ({
        id: p.id,
        name: p.name,
        team: p.team,
        role: p.role,
        sport,
        matches: p.matches,
        primaryMetric: p.primary_metric,
        average: p.average,
        strikeRate: p.strike_rate,
        consistency: p.consistency,
        rating: p.rating,
        recentForm: p.recent_form,
        recentScores: p.recent_scores,
        radar: p.radar
      }));
    }
  } catch (e) {
    // fallback
  }

  const sportKey = sport === 'all' ? 'cricket' : sport;
  return FALLBACK_PLAYERS[sportKey] || FALLBACK_PLAYERS.cricket;
}

export async function fetchTeams(sport: SportType = 'cricket'): Promise<TeamAnalytics[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/analytics/teams?sport=${sport}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data.teams.map((t: any) => ({
        id: t.id,
        name: t.name,
        sport,
        matches: t.matches,
        wins: t.wins,
        losses: t.losses,
        winRate: t.win_rate,
        rating: t.rating
      }));
    }
  } catch (e) {
    // fallback
  }

  const sportKey = sport === 'all' ? 'cricket' : sport;
  return FALLBACK_TEAMS[sportKey] || FALLBACK_TEAMS.cricket;
}

export async function generateAIInsights(
  sport: SportType,
  entityId: string,
  timeframe: TimeframeType = 'season'
): Promise<AIInsightData> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/analytics/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sport, entity_id: entityId, timeframe }),
      cache: 'no-store'
    });
    if (res.ok) {
      const d = await res.json();
      return {
        entityName: d.entity_name,
        sport: d.sport,
        momentum: d.momentum,
        momentumDelta: d.momentum_delta,
        performanceScore: d.performance_score,
        consistencyRating: d.consistency_rating,
        strengths: d.strengths,
        vulnerabilities: d.vulnerabilities,
        coachingRecommendations: d.coaching_recommendations,
        tacticalEdge: d.tactical_edge,
        summary: d.summary
      };
    }
  } catch (e) {
    // fallback
  }

  // Deterministic local insight generation
  const sportKey = sport === 'all' ? 'cricket' : sport;
  const players = FALLBACK_PLAYERS[sportKey] || FALLBACK_PLAYERS.cricket;
  const p = players.find(x => x.id === entityId) || players[0];

  return {
    entityName: p.name,
    sport: sportKey as SportType,
    momentum: 'accelerating',
    momentumDelta: 6.4,
    performanceScore: p.rating,
    consistencyRating: p.consistency,
    strengths: [
      `High-pressure conversion efficiency index at ${p.rating}/100.`,
      `Optimal kinetic chain impulse generating ${p.primaryMetric}.`,
      `Zero critical soft-tissue flags across the past ${p.matches} appearances.`
    ],
    vulnerabilities: [
      'Minor control variance under back-to-back high fatigue turnarounds.',
      'Slight reduction in first-phase conversion vs fresh opponent substitutes.'
    ],
    coachingRecommendations: [
      'Implement structured active-recovery protocol between intense tournament blocks.',
      'Simulate high-velocity match tension scenarios with variable speed feeds.'
    ],
    tacticalEdge: `Maintains a +6.4% expected win probability impact relative to positional league averages.`,
    summary: `${p.name} displays an accelerating performance vector (+6.4% delta) with an elite consistency rating of ${p.consistency}%. Key biomechanical markers confirm prime competition readiness.`
  };
}

export function generateCSVReport(
  sport: SportType,
  players: PlayerAnalytics[],
  kpis: AnalyticsKPIs
): string {
  const headers = ['Player ID', 'Name', 'Team', 'Role', 'Sport', 'Matches', 'Primary Metric', 'Average', 'Strike Rate', 'Consistency (%)', 'Rating (100)'];
  const rows = players.map(p => [
    p.id,
    `"${p.name}"`,
    `"${p.team}"`,
    `"${p.role}"`,
    p.sport,
    p.matches,
    `"${p.primaryMetric}"`,
    p.average,
    p.strikeRate,
    p.consistency,
    p.rating
  ]);

  const summary = [
    ['--- SUMMARY KPIS ---'],
    ['Total Matches Analyzed', kpis.totalMatches],
    ['Performance Index', kpis.performanceIndex],
    ['Win Percentage', `${kpis.winPercentage}%`],
    ['Average Scoring', `"${kpis.averageScoring}"`],
    ['Recent Delta', `+${kpis.deltaPct}%`],
    ['Timestamp', `"${new Date().toISOString()}"`],
    ['---------------------'],
    []
  ];

  const csvContent = [
    ...summary.map(e => e.join(',')),
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSVFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
