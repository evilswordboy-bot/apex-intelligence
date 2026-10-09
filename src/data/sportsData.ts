export interface CricketMatchData {
  matchId: string;
  tournament: string;
  teams: {
    team1: { name: string; score: string; overs: string; runRate: number; color: string };
    team2: { name: string; score: string; overs: string; runRate: number; color: string };
  };
  winProbability: { team1: number; team2: number };
  recentBalls: string[];
  batters: {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    sr: number;
    impactScore: number;
  }[];
  bowlers: {
    name: string;
    overs: string;
    maidens: number;
    runs: number;
    wickets: number;
    econ: number;
    dotBalls: number;
  }[];
  wagonWheelZones: {
    zone: string;
    runs: number;
    percentage: number;
    count: number;
    angle: number;
  }[];
  overByOver: {
    over: number;
    runs: number;
    wickets: number;
    cumRuns: number;
    projectedScore: number;
  }[];
}

export interface FootballMatchData {
  matchId: string;
  fixture: string;
  score: { home: number; away: number };
  teams: { home: string; away: string };
  xG: { home: number; away: number };
  possession: { home: number; away: number };
  passingAccuracy: { home: number; away: number };
  pressingIntensityPPDA: { home: number; away: number };
  fieldTilt: { home: number; away: number };
  shotMap: {
    id: string;
    minute: number;
    player: string;
    team: 'home' | 'away';
    x: number; // 0 - 100
    y: number; // 0 - 100
    xG: number;
    outcome: 'Goal' | 'Saved' | 'Blocked' | 'Missed';
  }[];
  passNetworkNodes: {
    id: string;
    name: string;
    number: number;
    x: number;
    y: number;
    passes: number;
  }[];
  passNetworkLinks: {
    from: string;
    to: string;
    volume: number;
  }[];
  timeline: {
    minute: number;
    team: 'home' | 'away';
    event: string;
    detail: string;
    dangerLevel: number;
  }[];
}

export interface OlympicAthleteData {
  athleteId: string;
  name: string;
  discipline: '100m Sprint' | 'Javelin Throw' | '100m Freestyle Swimming';
  country: string;
  pb: string;
  sb: string;
  metrics: {
    label: string;
    value: string;
    benchmark: string;
    variance: string;
    status: 'optimal' | 'warning' | 'alert';
  }[];
  biomechanics: {
    frame: number;
    jointAngle: number;
    strideLengthM: number;
    cadenceSpm: number;
    groundContactTimeMs: number;
    forceProductionN: number;
  }[];
  coachingFeedback: {
    strength: string;
    weakness: string;
    recommendedDrill: string;
    videoTimestamp: string;
  }[];
}

export interface WorkloadFatigueData {
  athleteName: string;
  sport: string;
  acwr: number; // Acute:Chronic Workload Ratio
  riskCategory: 'Low / Optimal' | 'Moderate Warning' | 'Elevated Injury Risk';
  strainScore: number; // 0-100
  sleepHours: number;
  hrvMs: number;
  weeklyLoad: { day: string; acuteLoad: number; chronicLoad: number; sRPE: number }[];
  safetyNotice: string;
}

export interface AthleteComparisonItem {
  sport: 'cricket' | 'football' | 'olympics';
  categoryTitle: string;
  athleteA: {
    name: string;
    team: string;
    avatarInitials: string;
    primaryMetricLabel: string;
    primaryMetricValue: string;
    formScore: number;
    attributes: { attribute: string; value: number }[];
    telemetryStats: { label: string; value: string; diff: string; positive: boolean }[];
  };
  athleteB: {
    name: string;
    team: string;
    avatarInitials: string;
    primaryMetricLabel: string;
    primaryMetricValue: string;
    formScore: number;
    attributes: { attribute: string; value: number }[];
    telemetryStats: { label: string; value: string; diff: string; positive: boolean }[];
  };
}

export interface OverviewKPIData {
  sport: 'cricket' | 'football' | 'olympics' | 'all';
  playerPerformance: { score: number; label: string; delta: string; status: string };
  teamEfficiency: { percentage: number; label: string; delta: string; status: string };
  workload: { value: string; label: string; acwr: number; status: string };
  winProbability: { percentage: number; label: string; odds: string; status: string };
}

export interface TelemetryActivity {
  id: string;
  sport: 'cricket' | 'football' | 'olympics';
  timestamp: string;
  title: string;
  detail: string;
  severity: 'optimal' | 'high' | 'warning' | 'info';
  metric: string;
}

export const CRICKET_DEMO_DATA: CricketMatchData = {
  matchId: "CRI-2026-IND-AUS-WTC",
  tournament: "Apex Global Championship Series — Finals",
  teams: {
    team1: { name: "India", score: "198/4", overs: "18.3", runRate: 10.70, color: "#2D6BFF" },
    team2: { name: "Australia", score: "194/7", overs: "20.0", runRate: 9.70, color: "#B6FF3B" },
  },
  winProbability: { team1: 88, team2: 12 },
  recentBalls: ["1", "4", "W", "2", "6", "1"],
  batters: [
    { name: "Virat Kohli", runs: 74, balls: 41, fours: 6, sixes: 4, sr: 180.4, impactScore: 94.2 },
    { name: "Suryakumar Yadav", runs: 52, balls: 26, fours: 4, sixes: 4, sr: 200.0, impactScore: 91.8 },
    { name: "Rohit Sharma", runs: 38, balls: 22, fours: 5, sixes: 2, sr: 172.7, impactScore: 78.4 },
    { name: "Hardik Pandya", runs: 24, balls: 14, fours: 1, sixes: 2, sr: 171.4, impactScore: 82.0 },
  ],
  bowlers: [
    { name: "Mitchell Starc", overs: "4.0", maidens: 0, runs: 38, wickets: 2, econ: 9.5, dotBalls: 9 },
    { name: "Pat Cummins", overs: "3.3", maidens: 0, runs: 41, wickets: 1, econ: 11.7, dotBalls: 7 },
    { name: "Adam Zampa", overs: "4.0", maidens: 0, runs: 32, wickets: 1, econ: 8.0, dotBalls: 11 },
    { name: "Josh Hazlewood", overs: "4.0", maidens: 0, runs: 34, wickets: 0, econ: 8.5, dotBalls: 10 },
  ],
  wagonWheelZones: [
    { zone: "Fine Leg", runs: 24, percentage: 12.1, count: 6, angle: 45 },
    { zone: "Square Leg", runs: 36, percentage: 18.2, count: 9, angle: 90 },
    { zone: "Mid-Wicket", runs: 48, percentage: 24.2, count: 11, angle: 135 },
    { zone: "Long-On", runs: 32, percentage: 16.2, count: 7, angle: 180 },
    { zone: "Long-Off", runs: 20, percentage: 10.1, count: 5, angle: 225 },
    { zone: "Extra Cover", runs: 22, percentage: 11.1, count: 6, angle: 270 },
    { zone: "Point & Third Man", runs: 16, percentage: 8.1, count: 4, angle: 315 },
  ],
  overByOver: [
    { over: 2, runs: 18, wickets: 0, cumRuns: 18, projectedScore: 180 },
    { over: 4, runs: 22, wickets: 1, cumRuns: 40, projectedScore: 192 },
    { over: 6, runs: 19, wickets: 1, cumRuns: 59, projectedScore: 196 },
    { over: 8, runs: 14, wickets: 1, cumRuns: 73, projectedScore: 188 },
    { over: 10, runs: 21, wickets: 2, cumRuns: 94, projectedScore: 194 },
    { over: 12, runs: 16, wickets: 2, cumRuns: 110, projectedScore: 198 },
    { over: 14, runs: 26, wickets: 2, cumRuns: 136, projectedScore: 205 },
    { over: 16, runs: 28, wickets: 3, cumRuns: 164, projectedScore: 212 },
    { over: 18, runs: 30, wickets: 4, cumRuns: 194, projectedScore: 208 },
  ],
};

export const FOOTBALL_DEMO_DATA: FootballMatchData = {
  matchId: "FB-2026-MCI-RMA",
  fixture: "Manchester City vs Real Madrid",
  score: { home: 3, away: 1 },
  teams: { home: "Manchester City", away: "Real Madrid" },
  xG: { home: 2.84, away: 1.12 },
  possession: { home: 64, away: 36 },
  passingAccuracy: { home: 92, away: 81 },
  pressingIntensityPPDA: { home: 7.2, away: 14.8 },
  fieldTilt: { home: 71, away: 29 },
  shotMap: [
    { id: "s1", minute: 14, player: "Haaland", team: "home", x: 88, y: 48, xG: 0.62, outcome: "Goal" },
    { id: "s2", minute: 29, player: "De Bruyne", team: "home", x: 78, y: 35, xG: 0.18, outcome: "Saved" },
    { id: "s3", minute: 41, player: "Vinicius Jr", team: "away", x: 86, y: 62, xG: 0.38, outcome: "Goal" },
    { id: "s4", minute: 58, player: "Foden", team: "home", x: 82, y: 55, xG: 0.44, outcome: "Goal" },
    { id: "s5", minute: 76, player: "Rodri", team: "home", x: 74, y: 49, xG: 0.14, outcome: "Blocked" },
    { id: "s6", minute: 88, player: "Haaland", team: "home", x: 91, y: 52, xG: 0.75, outcome: "Goal" },
    { id: "s7", minute: 92, player: "Bellingham", team: "away", x: 84, y: 44, xG: 0.22, outcome: "Missed" },
  ],
  passNetworkNodes: [
    { id: "p1", name: "Dias", number: 3, x: 25, y: 40, passes: 68 },
    { id: "p2", name: "Akanji", number: 25, x: 25, y: 65, passes: 62 },
    { id: "p3", name: "Rodri", number: 16, x: 45, y: 50, passes: 98 },
    { id: "p4", name: "De Bruyne", number: 17, x: 65, y: 35, passes: 74 },
    { id: "p5", name: "Bernardo", number: 20, x: 62, y: 72, passes: 58 },
    { id: "p6", name: "Foden", number: 47, x: 72, y: 22, passes: 48 },
    { id: "p7", name: "Haaland", number: 9, x: 82, y: 50, passes: 24 },
  ],
  passNetworkLinks: [
    { from: "p1", to: "p3", volume: 28 },
    { from: "p2", to: "p3", volume: 24 },
    { from: "p3", to: "p4", volume: 34 },
    { from: "p3", to: "p5", volume: 22 },
    { from: "p4", to: "p6", volume: 18 },
    { from: "p4", to: "p7", volume: 14 },
    { from: "p5", to: "p7", volume: 12 },
  ],
  timeline: [
    { minute: 14, team: "home", event: "GOAL", detail: "Erling Haaland close-range tap after high turnover (xG: 0.62)", dangerLevel: 95 },
    { minute: 32, team: "away", event: "Counter Attack", detail: "Bellingham transition line-break pass to Vinicius", dangerLevel: 70 },
    { minute: 41, team: "away", event: "GOAL", detail: "Vinicius Jr cutting in from left wing into top corner (xG: 0.38)", dangerLevel: 85 },
    { minute: 58, team: "home", event: "GOAL", detail: "Phil Foden edge-of-box strike with 0.44 xG", dangerLevel: 90 },
    { minute: 88, team: "home", event: "GOAL", detail: "Erling Haaland header off Kevin De Bruyne cross", dangerLevel: 95 },
  ],
};

export const OLYMPIC_DEMO_DATA: OlympicAthleteData[] = [
  {
    athleteId: "OLY-SPR-01",
    name: "Noah Lyles",
    discipline: "100m Sprint",
    country: "USA",
    pb: "9.79s",
    sb: "9.81s",
    metrics: [
      { label: "Reaction Time", value: "0.138s", benchmark: "0.142s", variance: "+0.004s", status: "optimal" },
      { label: "Top Speed", value: "43.8 km/h", benchmark: "43.2 km/h", variance: "+0.6 km/h", status: "optimal" },
      { label: "Step Cadence", value: "4.88 Hz", benchmark: "4.75 Hz", variance: "+0.13 Hz", status: "optimal" },
      { label: "Ground Contact Time", value: "84 ms", benchmark: "82 ms", variance: "+2 ms", status: "warning" },
      { label: "Horizontal Impulse", value: "328 N·s", benchmark: "315 N·s", variance: "+13 N·s", status: "optimal" },
    ],
    biomechanics: [
      { frame: 10, jointAngle: 112, strideLengthM: 1.45, cadenceSpm: 270, groundContactTimeMs: 118, forceProductionN: 2450 },
      { frame: 25, jointAngle: 138, strideLengthM: 1.95, cadenceSpm: 285, groundContactTimeMs: 98, forceProductionN: 2980 },
      { frame: 45, jointAngle: 154, strideLengthM: 2.38, cadenceSpm: 298, groundContactTimeMs: 86, forceProductionN: 3340 },
      { frame: 65, jointAngle: 161, strideLengthM: 2.44, cadenceSpm: 304, groundContactTimeMs: 84, forceProductionN: 3410 },
      { frame: 85, jointAngle: 159, strideLengthM: 2.41, cadenceSpm: 296, groundContactTimeMs: 85, forceProductionN: 3260 },
    ],
    coachingFeedback: [
      {
        strength: "Exceptional upright mechanics and pelvis stability during max velocity phase (50m-80m).",
        weakness: "Drive phase transition showed 2.8° premature torso ascension at step 7.",
        recommendedDrill: "Heavy sled sprints (35% body mass) with focus on low-angle shin drive for 15 meters.",
        videoTimestamp: "00:02.4"
      },
      {
        strength: "Elastic recoil off ground contact produces world-leading horizontal force vector.",
        weakness: "Left ankle plantarflexion stiffness slight delta (-4%) vs right side.",
        recommendedDrill: "Unilateral pogo hops over micro-hurdles with dual-plate force assessment.",
        videoTimestamp: "00:05.1"
      }
    ]
  },
  {
    athleteId: "OLY-JAV-02",
    name: "Neeraj Chopra",
    discipline: "Javelin Throw",
    country: "India",
    pb: "89.94m",
    sb: "89.45m",
    metrics: [
      { label: "Release Velocity", value: "29.4 m/s", benchmark: "29.0 m/s", variance: "+0.4 m/s", status: "optimal" },
      { label: "Release Angle", value: "34.8°", benchmark: "35.0°", variance: "-0.2°", status: "optimal" },
      { label: "Attitude Angle", value: "33.2°", benchmark: "34.0°", variance: "-0.8°", status: "optimal" },
      { label: "Block Leg Stiffness", value: "4.8 kN", benchmark: "4.6 kN", variance: "+0.2 kN", status: "optimal" },
      { label: "Elbow Torque", value: "78 N·m", benchmark: "72 N·m", variance: "+6 N·m", status: "warning" },
    ],
    biomechanics: [
      { frame: 12, jointAngle: 85, strideLengthM: 1.62, cadenceSpm: 210, groundContactTimeMs: 140, forceProductionN: 1800 },
      { frame: 28, jointAngle: 124, strideLengthM: 2.10, cadenceSpm: 230, groundContactTimeMs: 120, forceProductionN: 2600 },
      { frame: 42, jointAngle: 172, strideLengthM: 2.65, cadenceSpm: 245, groundContactTimeMs: 95, forceProductionN: 4800 },
      { frame: 50, jointAngle: 142, strideLengthM: 1.80, cadenceSpm: 215, groundContactTimeMs: 110, forceProductionN: 3200 },
    ],
    coachingFeedback: [
      {
        strength: "Mastery of kinetic sequence transfer from left foot plant through hip-shoulder separation.",
        weakness: "Late shoulder rotation causing javelin tail drag in initial impulse phase.",
        recommendedDrill: "Medicine ball overhead rotational slams with resistance band brace.",
        videoTimestamp: "00:03.2"
      }
    ]
  }
];

export const WORKLOAD_FATIGUE_DATA: WorkloadFatigueData[] = [
  {
    athleteName: "Virat Kohli",
    sport: "Cricket",
    acwr: 1.18,
    riskCategory: "Low / Optimal",
    strainScore: 68,
    sleepHours: 8.2,
    hrvMs: 76,
    weeklyLoad: [
      { day: "Mon", acuteLoad: 680, chronicLoad: 640, sRPE: 7 },
      { day: "Tue", acuteLoad: 820, chronicLoad: 690, sRPE: 8 },
      { day: "Wed", acuteLoad: 350, chronicLoad: 650, sRPE: 4 },
      { day: "Thu", acuteLoad: 780, chronicLoad: 680, sRPE: 8 },
      { day: "Fri", acuteLoad: 910, chronicLoad: 720, sRPE: 9 },
      { day: "Sat", acuteLoad: 420, chronicLoad: 690, sRPE: 5 },
      { day: "Sun", acuteLoad: 200, chronicLoad: 660, sRPE: 2 },
    ],
    safetyNotice: "Workload metrics represent modeled biomechanical strain estimations and do not constitute clinical diagnosis or medical clearance."
  },
  {
    athleteName: "Erling Haaland",
    sport: "Football",
    acwr: 1.48,
    riskCategory: "Moderate Warning",
    strainScore: 84,
    sleepHours: 7.1,
    hrvMs: 54,
    weeklyLoad: [
      { day: "Mon", acuteLoad: 920, chronicLoad: 680, sRPE: 9 },
      { day: "Tue", acuteLoad: 840, chronicLoad: 700, sRPE: 8 },
      { day: "Wed", acuteLoad: 980, chronicLoad: 720, sRPE: 9 },
      { day: "Thu", acuteLoad: 310, chronicLoad: 680, sRPE: 3 },
      { day: "Fri", acuteLoad: 890, chronicLoad: 710, sRPE: 8 },
      { day: "Sat", acuteLoad: 1040, chronicLoad: 740, sRPE: 10 },
      { day: "Sun", acuteLoad: 150, chronicLoad: 700, sRPE: 2 },
    ],
    safetyNotice: "ACWR peak >1.40 indicates acceleration of soft-tissue exposure. Recommend 20% volume deload before next fixture."
  },
  {
    athleteName: "Noah Lyles",
    sport: "Track & Field",
    acwr: 1.12,
    riskCategory: "Low / Optimal",
    strainScore: 62,
    sleepHours: 8.8,
    hrvMs: 82,
    weeklyLoad: [
      { day: "Mon", acuteLoad: 540, chronicLoad: 520, sRPE: 6 },
      { day: "Tue", acuteLoad: 720, chronicLoad: 550, sRPE: 8 },
      { day: "Wed", acuteLoad: 280, chronicLoad: 520, sRPE: 3 },
      { day: "Thu", acuteLoad: 680, chronicLoad: 540, sRPE: 7 },
      { day: "Fri", acuteLoad: 790, chronicLoad: 570, sRPE: 8 },
      { day: "Sat", acuteLoad: 300, chronicLoad: 540, sRPE: 4 },
      { day: "Sun", acuteLoad: 100, chronicLoad: 510, sRPE: 1 },
    ],
    safetyNotice: "CNS recovery score index 92%. Optimal nervous system readiness for max velocity acceleration trials."
  }
];

export const ATHLETE_COMPARISONS: Record<'cricket' | 'football' | 'olympics', AthleteComparisonItem> = {
  cricket: {
    sport: 'cricket',
    categoryTitle: 'Elite Top-Order Matchup • High-Pressure Calibration',
    athleteA: {
      name: 'Virat Kohli',
      team: 'India / Royal Challengers',
      avatarInitials: 'VK',
      primaryMetricLabel: 'Tournament Strike Index',
      primaryMetricValue: '180.4 SR',
      formScore: 94.2,
      attributes: [
        { attribute: 'Power Batting', value: 91 },
        { attribute: 'Boundary Timing', value: 96 },
        { attribute: 'Clutch Chase Rate', value: 98 },
        { attribute: 'Running Speed', value: 89 },
        { attribute: 'Spin Adaptability', value: 92 },
        { attribute: 'Fatigue Resistance', value: 95 },
      ],
      telemetryStats: [
        { label: 'Control %', value: '88.4%', diff: '+4.2%', positive: true },
        { label: 'Bat Speed', value: '138 km/h', diff: '+6 km/h', positive: true },
        { label: 'False Shot %', value: '11.6%', diff: '-3.1%', positive: true },
        { label: 'Avg Exit Angle', value: '22.4°', diff: 'Optimal', positive: true },
      ]
    },
    athleteB: {
      name: 'Steve Smith',
      team: 'Australia',
      avatarInitials: 'SS',
      primaryMetricLabel: 'Tournament Strike Index',
      primaryMetricValue: '148.6 SR',
      formScore: 89.1,
      attributes: [
        { attribute: 'Power Batting', value: 84 },
        { attribute: 'Boundary Timing', value: 94 },
        { attribute: 'Clutch Chase Rate', value: 90 },
        { attribute: 'Running Speed', value: 84 },
        { attribute: 'Spin Adaptability', value: 94 },
        { attribute: 'Fatigue Resistance', value: 92 },
      ],
      telemetryStats: [
        { label: 'Control %', value: '85.2%', diff: '-3.2%', positive: false },
        { label: 'Bat Speed', value: '129 km/h', diff: '-9 km/h', positive: false },
        { label: 'False Shot %', value: '14.8%', diff: '+3.2%', positive: false },
        { label: 'Avg Exit Angle', value: '19.1°', diff: 'Low', positive: false },
      ]
    }
  },
  football: {
    sport: 'football',
    categoryTitle: 'Golden Boot Strikers • Shot Quality & Dynamic Movement',
    athleteA: {
      name: 'Erling Haaland',
      team: 'Manchester City',
      avatarInitials: 'EH',
      primaryMetricLabel: 'Non-Penalty xG / 90',
      primaryMetricValue: '1.08 xG',
      formScore: 95.8,
      attributes: [
        { attribute: 'Box Finishing', value: 99 },
        { attribute: 'Top Sprint Speed', value: 94 },
        { attribute: 'Physical Aerials', value: 93 },
        { attribute: 'Off-Ball Movement', value: 96 },
        { attribute: 'Pressing Intensity', value: 82 },
        { attribute: 'Conversion Rate', value: 98 },
      ],
      telemetryStats: [
        { label: 'Shot Velocity', value: '118 km/h', diff: '+8 km/h', positive: true },
        { label: 'Peak Sprint', value: '36.2 km/h', diff: '+0.8 km/h', positive: true },
        { label: 'xG Overperformance', value: '+5.4', diff: 'Elite', positive: true },
        { label: 'Box Touches / 90', value: '8.4', diff: '+2.1', positive: true },
      ]
    },
    athleteB: {
      name: 'Kylian Mbappé',
      team: 'Real Madrid',
      avatarInitials: 'KM',
      primaryMetricLabel: 'Non-Penalty xG / 90',
      primaryMetricValue: '0.94 xG',
      formScore: 94.6,
      attributes: [
        { attribute: 'Box Finishing', value: 94 },
        { attribute: 'Top Sprint Speed', value: 99 },
        { attribute: 'Physical Aerials', value: 78 },
        { attribute: 'Off-Ball Movement', value: 95 },
        { attribute: 'Pressing Intensity', value: 80 },
        { attribute: 'Conversion Rate', value: 92 },
      ],
      telemetryStats: [
        { label: 'Shot Velocity', value: '112 km/h', diff: '-6 km/h', positive: false },
        { label: 'Peak Sprint', value: '36.7 km/h', diff: '+0.5 km/h', positive: true },
        { label: 'xG Overperformance', value: '+3.8', diff: 'High', positive: true },
        { label: 'Box Touches / 90', value: '7.8', diff: '+1.5', positive: true },
      ]
    }
  },
  olympics: {
    sport: 'olympics',
    categoryTitle: 'World 100m Final • Biomechanical Cadence & Ground Reaction',
    athleteA: {
      name: 'Noah Lyles',
      team: 'USA Track & Field',
      avatarInitials: 'NL',
      primaryMetricLabel: 'Max Horizontal Velocity',
      primaryMetricValue: '43.8 km/h',
      formScore: 97.4,
      attributes: [
        { attribute: 'Max Velocity', value: 99 },
        { attribute: 'Contact Elasticity', value: 96 },
        { attribute: 'Drive Mechanics', value: 91 },
        { attribute: 'Cadence Frequency', value: 97 },
        { attribute: 'Deceleration Delay', value: 98 },
        { attribute: 'Impulse Power', value: 94 },
      ],
      telemetryStats: [
        { label: 'Reaction Time', value: '0.138s', diff: '+0.004s', positive: true },
        { label: 'Ground Contact', value: '84 ms', diff: '-2 ms', positive: true },
        { label: 'Cadence', value: '4.88 Hz', diff: '+0.13 Hz', positive: true },
        { label: 'Pelvis Stability', value: '98.2%', diff: 'Optimal', positive: true },
      ]
    },
    athleteB: {
      name: 'Kishane Thompson',
      team: 'Jamaica Athletics',
      avatarInitials: 'KT',
      primaryMetricLabel: 'Max Horizontal Velocity',
      primaryMetricValue: '43.4 km/h',
      formScore: 96.1,
      attributes: [
        { attribute: 'Max Velocity', value: 96 },
        { attribute: 'Contact Elasticity', value: 94 },
        { attribute: 'Drive Mechanics', value: 98 },
        { attribute: 'Cadence Frequency', value: 92 },
        { attribute: 'Deceleration Delay', value: 93 },
        { attribute: 'Impulse Power', value: 97 },
      ],
      telemetryStats: [
        { label: 'Reaction Time', value: '0.134s', diff: '-0.004s', positive: true },
        { label: 'Ground Contact', value: '86 ms', diff: '+2 ms', positive: false },
        { label: 'Cadence', value: '4.72 Hz', diff: '-0.16 Hz', positive: false },
        { label: 'Pelvis Stability', value: '96.5%', diff: 'High', positive: true },
      ]
    }
  }
};

export const OVERVIEW_KPIS: Record<'cricket' | 'football' | 'olympics' | 'all', OverviewKPIData> = {
  all: {
    sport: 'all',
    playerPerformance: { score: 94.8, label: 'Performance Index (PPI)', delta: '+6.4% vs benchmark', status: 'optimal' },
    teamEfficiency: { percentage: 88.6, label: 'Tactical Efficiency', delta: '+4.2% cohesive gain', status: 'optimal' },
    workload: { value: '1.22 ACWR', label: 'Workload Safety Index', acwr: 1.22, status: 'Optimal Green Band' },
    winProbability: { percentage: 88.0, label: 'Live Win Probability', odds: '1.14 Decimal Odds', status: 'Dominant' }
  },
  cricket: {
    sport: 'cricket',
    playerPerformance: { score: 94.2, label: 'Active Batter Impact', delta: '+8.1% vs tournament avg', status: 'optimal' },
    teamEfficiency: { percentage: 91.4, label: 'Boundary Execution Rate', delta: '10.70 Current Run Rate', status: 'optimal' },
    workload: { value: '1.18 ACWR', label: 'Fast Bowler Strain', acwr: 1.18, status: 'Low Fatigue Risk' },
    winProbability: { percentage: 88.0, label: 'Championship Win Prob', odds: 'Req RR: 4.33', status: 'High Confidence' }
  },
  football: {
    sport: 'football',
    playerPerformance: { score: 95.8, label: 'Expected Goals Differential', delta: '+1.72 xG Edge', status: 'optimal' },
    teamEfficiency: { percentage: 92.0, label: 'Passing Network Integrity', delta: '64% Territorial Possession', status: 'optimal' },
    workload: { value: '1.48 ACWR', label: 'High-Speed Distance Strain', acwr: 1.48, status: 'Moderate Load Warning' },
    winProbability: { percentage: 94.2, label: 'Fixture Victory Model', odds: '3 - 1 Scoreline Live', status: 'Dominant' }
  },
  olympics: {
    sport: 'olympics',
    playerPerformance: { score: 97.4, label: 'Kinematic Trajectory Score', delta: '43.8 km/h Peak Velocity', status: 'optimal' },
    teamEfficiency: { percentage: 96.4, label: 'Biomechanical Symmetry', delta: '84 ms Ground Contact', status: 'optimal' },
    workload: { value: '1.12 ACWR', label: 'Neuromuscular Readiness', acwr: 1.12, status: '92% CNS Freshness' },
    winProbability: { percentage: 91.5, label: 'Gold Medal Delta Odds', odds: '-0.03s Split Lead', status: 'Optimal' }
  }
};

export const RECENT_TELEMETRY_ACTIVITIES: TelemetryActivity[] = [
  {
    id: "act-01",
    sport: "cricket",
    timestamp: "2 mins ago",
    title: "High-Impact Boundary Detected",
    detail: "Virat Kohli 138 km/h cover drive with 0.94 exit velocity ratio off Mitchell Starc.",
    severity: "optimal",
    metric: "+6 Runs"
  },
  {
    id: "act-02",
    sport: "football",
    timestamp: "8 mins ago",
    title: "Tactical Line-Break Sequence",
    detail: "Kevin De Bruyne progressive pass (34 volume link) bypassed 4 Real Madrid pressers.",
    severity: "optimal",
    metric: "0.62 xG"
  },
  {
    id: "act-03",
    sport: "olympics",
    timestamp: "14 mins ago",
    title: "Kinematic Cadence Peak",
    detail: "Noah Lyles reached 4.88 Hz stride frequency with sub-85ms ground contact time.",
    severity: "optimal",
    metric: "43.8 km/h"
  },
  {
    id: "act-04",
    sport: "football",
    timestamp: "27 mins ago",
    title: "ACWR Workload Alert",
    detail: "Erling Haaland cumulative 7-day high speed sprint load crossed 1,040m acute volume.",
    severity: "warning",
    metric: "1.48 ACWR"
  },
  {
    id: "act-05",
    sport: "cricket",
    timestamp: "41 mins ago",
    title: "Win Probability Surge",
    detail: "India projected score model lifted from 192 to 208 following 16th over 28-run surge.",
    severity: "info",
    metric: "88% Win Prob"
  }
];

export const PERFORMANCE_TRENDS_DATA = {
  last5: [
    { session: "Match 1", performance: 88, workload: 620, efficiency: 84 },
    { session: "Match 2", performance: 91, workload: 740, efficiency: 87 },
    { session: "Match 3", performance: 86, workload: 590, efficiency: 82 },
    { session: "Match 4", performance: 94, workload: 830, efficiency: 89 },
    { session: "Match 5", performance: 96, workload: 880, efficiency: 93 },
  ],
  season: [
    { session: "May", performance: 82, workload: 520, efficiency: 78 },
    { session: "Jun", performance: 85, workload: 610, efficiency: 82 },
    { session: "Jul", performance: 89, workload: 730, efficiency: 86 },
    { session: "Aug", performance: 92, workload: 810, efficiency: 88 },
    { session: "Sep", performance: 95, workload: 850, efficiency: 91 },
    { session: "Oct", performance: 97, workload: 890, efficiency: 94 },
  ],
  live: [
    { session: "0-15m", performance: 85, workload: 210, efficiency: 80 },
    { session: "15-30m", performance: 89, workload: 460, efficiency: 86 },
    { session: "30-45m", performance: 93, workload: 680, efficiency: 90 },
    { session: "45-60m", performance: 91, workload: 740, efficiency: 88 },
    { session: "60-75m", performance: 95, workload: 820, efficiency: 92 },
    { session: "75-90m", performance: 98, workload: 910, efficiency: 96 },
  ]
};
