"use client";

import React, { useState, useEffect } from 'react';
import {
  MatchListItem,
  MatchDetail,
  MatchupStats,
  PhaseAnalysisResponse,
  WagonWheelResponse,
  WinProbResponse,
  BowlerRecommendationResponse,
  PlayerRadarResponse
} from '@/types/cricket';
import {
  fetchMatches,
  fetchMatchDetail,
  fetchMatchup,
  fetchPhaseAnalysis,
  fetchWagonWheel,
  calculateWinProbability,
  recommendBowler,
  fetchPlayerRadar
} from '@/lib/cricketApi';
import { CRICKET_DEMO_DATA } from '@/data/sportsData';
import {
  Activity,
  Award,
  BarChart2,
  ChevronDown,
  Compass,
  Cpu,
  Info,
  Layers,
  RefreshCw,
  Shield,
  Sliders,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Zap,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

export default function CricketLab() {
  // State: Match Selection & Filtering
  const [matches, setMatches] = useState<MatchListItem[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('CRI-2026-IND-AUS-WTC');
  const [competitionFilter, setCompetitionFilter] = useState<string>('ALL');
  const [activeInnings, setActiveInnings] = useState<number>(2);
  const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);

  // Feature 1: Wagon Wheel
  const [wagonData, setWagonData] = useState<WagonWheelResponse | null>(null);
  const [selectedBatter, setSelectedBatter] = useState<string>('Virat Kohli');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Feature 2: Batter vs Bowler Head-to-Head
  const [selectedH2HBatter, setSelectedH2HBatter] = useState<string>('Virat Kohli');
  const [selectedH2HBowler, setSelectedH2HBowler] = useState<string>('Mitchell Starc');
  const [matchupStats, setMatchupStats] = useState<MatchupStats | null>(null);

  // Feature 3: Phase Analysis
  const [phaseData, setPhaseData] = useState<PhaseAnalysisResponse | null>(null);

  // Feature 4: Explainable Win Probability
  const [winProbData, setWinProbData] = useState<WinProbResponse | null>(null);
  const [simRuns, setSimRuns] = useState<number>(182);
  const [simWickets, setSimWickets] = useState<number>(4);
  const [simOvers, setSimOvers] = useState<number>(16.2);
  const [simTarget, setSimTarget] = useState<number>(204);

  // Feature 5: Player Radar
  const [radarPlayerA, setRadarPlayerA] = useState<string>('Virat Kohli');
  const [radarPlayerB, setRadarPlayerB] = useState<string>('Steve Smith');
  const [radarData, setRadarData] = useState<PlayerRadarResponse | null>(null);

  // Feature 6: AI Bowler Recommendation
  const [recTargetOver, setRecTargetOver] = useState<number>(18);
  const [recStriker, setRecStriker] = useState<string>('Virat Kohli');
  const [bowlerRecs, setBowlerRecs] = useState<BowlerRecommendationResponse | null>(null);

  // Global UI States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'matchup' | 'wagon' | 'phases' | 'winprob' | 'recs' | 'radar'>('matchup');

  // Load Initial Matches
  useEffect(() => {
    async function loadMatches() {
      try {
        const list = await fetchMatches();
        setMatches(list);
        if (list.length > 0 && !list.find(m => m.id === selectedMatchId)) {
          setSelectedMatchId(list[0].id);
        }
        setIsBackendConnected(true);
      } catch (err) {
        console.warn('Backend unavailable, using fallback mock list', err);
        setIsBackendConnected(false);
        setMatches([
          {
            id: 'CRI-2026-IND-AUS-WTC',
            competition: 'ICC World Championship',
            match_type: 'T20 Final',
            season: '2026',
            match_date: '2026-03-24',
            venue: 'Lord\'s Cricket Ground, London',
            team1: 'Australia',
            team2: 'India',
            is_demo: false
          },
          {
            id: 'CRI-2026-CSK-MI-IPL',
            competition: 'Indian Premier League',
            match_type: 'El Clasico',
            season: '2026',
            match_date: '2026-04-12',
            venue: 'Wankhede Stadium, Mumbai',
            team1: 'Mumbai Indians',
            team2: 'Chennai Super Kings',
            is_demo: false
          },
          {
            id: 'CRI-2026-ENG-PAK-T20',
            competition: 'Super Series',
            match_type: 'Semi Final',
            season: '2026',
            match_date: '2026-02-18',
            venue: 'Gaddafi Stadium, Lahore',
            team1: 'England',
            team2: 'Pakistan',
            is_demo: false
          }
        ]);
      }
    }
    loadMatches();
  }, []);

  // Fetch Match Details, Wagon Wheel, Phase Analysis whenever selectedMatchId or activeInnings changes
  useEffect(() => {
    if (!selectedMatchId) return;

    let isMounted = true;
    async function loadMatchDetails() {
      setIsLoading(true);
      try {
        const detail = await fetchMatchDetail(selectedMatchId);
        if (isMounted) {
          setMatchDetail(detail);
          const inn2 = detail.innings.find(i => i.innings_num === 2);
          if (inn2) {
            setSimRuns(inn2.total_runs);
            setSimWickets(inn2.total_wickets);
            setSimOvers(inn2.total_overs);
          } else if (detail.current_state) {
            setSimRuns((detail.current_state as any).runs || 198);
            setSimWickets((detail.current_state as any).wickets || 4);
            setSimOvers(detail.current_state.overs_completed || 18.5);
          }
          if (detail.current_state?.target) {
            setSimTarget(detail.current_state.target);
          }
        }
      } catch (e) {
        console.warn('Could not load match detail', e);
      }

      try {
        const wagon = await fetchWagonWheel(selectedMatchId, selectedBatter);
        if (isMounted) setWagonData(wagon);
      } catch (e) {
        console.warn('Could not load wagon wheel', e);
      }

      try {
        const phase = await fetchPhaseAnalysis(selectedMatchId, activeInnings);
        if (isMounted) setPhaseData(phase);
      } catch (e) {
        console.warn('Could not load phase analysis', e);
      }

      setIsLoading(false);
    }

    loadMatchDetails();
    return () => { isMounted = false; };
  }, [selectedMatchId, activeInnings]);

  // Update Wagon Wheel when selected batter changes
  useEffect(() => {
    if (!selectedMatchId) return;
    fetchWagonWheel(selectedMatchId, selectedBatter)
      .then(res => setWagonData(res))
      .catch(err => console.warn(err));
  }, [selectedBatter, selectedMatchId]);

  // Fetch H2H Matchup
  useEffect(() => {
    if (!selectedH2HBatter || !selectedH2HBowler) return;
    fetchMatchup(selectedH2HBatter, selectedH2HBowler)
      .then(res => setMatchupStats(res))
      .catch(err => console.warn(err));
  }, [selectedH2HBatter, selectedH2HBowler]);

  // Fetch Player Radar
  useEffect(() => {
    if (!radarPlayerA || !radarPlayerB) return;
    fetchPlayerRadar(radarPlayerA, radarPlayerB)
      .then(res => setRadarData(res))
      .catch(err => console.warn(err));
  }, [radarPlayerA, radarPlayerB]);

  // Trigger Win Probability calculation
  useEffect(() => {
    calculateWinProbability({
      match_id: selectedMatchId,
      innings: 2,
      runs_scored: simRuns,
      wickets_lost: simWickets,
      overs_completed: simOvers,
      target_runs: simTarget
    })
      .then(res => setWinProbData(res))
      .catch(err => console.warn(err));
  }, [simRuns, simWickets, simOvers, simTarget, selectedMatchId]);

  // Trigger Bowler Recommendations
  useEffect(() => {
    if (!selectedMatchId) return;
    recommendBowler({
      match_id: selectedMatchId,
      innings_num: activeInnings,
      target_over: recTargetOver,
      striker_batter: recStriker,
      runs_remaining: Math.max(1, simTarget - simRuns),
      wickets_remaining: Math.max(1, 10 - simWickets)
    })
      .then(res => setBowlerRecs(res))
      .catch(err => console.warn(err));
  }, [selectedMatchId, activeInnings, recTargetOver, recStriker, simRuns, simTarget, simWickets]);

  // Filter matches by competition
  const filteredMatches = competitionFilter === 'ALL'
    ? matches
    : matches.filter(m => m.competition.toLowerCase().includes(competitionFilter.toLowerCase()));

  // Active Innings details
  const currentInningsData = matchDetail?.innings.find(i => i.innings_num === activeInnings);
  const activeBatters = currentInningsData?.batters || [];
  const activeBowlers = currentInningsData?.bowlers || [];

  return (
    <div className="space-y-6">
      {/* Top Banner: Global Match Context & Filters */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col gap-6 relative overflow-hidden">
        {/* Real AI-Generated Cricket Stadium Visual Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/cricket/cricket_batter_stadium.jpg"
            alt="Cricket Stadium Atmosphere"
            className="w-full h-full object-cover object-right opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/90 to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1C2745] pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B6FF3B] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#B6FF3B] tracking-wider uppercase">
                CRICKET INTELLIGENCE LAB • ML BALL-BY-BALL TELEMETRY
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                isBackendConnected
                  ? 'bg-[#B6FF3B]/10 text-[#B6FF3B] border-[#B6FF3B]/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isBackendConnected ? 'FASTAPI ML ONLINE (PORT 8000)' : 'STANDALONE SYNTHETIC DEMO'}
              </span>
            </div>
            <h2 className="text-2xl font-black font-display text-white">
              {matchDetail?.match_info.team1 || 'Australia'} vs {matchDetail?.match_info.team2 || 'India'}
            </h2>
            <p className="text-xs text-[#8F9CAE] mt-0.5 font-mono">
              {matchDetail?.match_info.venue || "Lord's Cricket Ground"} • {matchDetail?.match_info.competition || 'ICC World Championship'} • {matchDetail?.match_info.match_type || 'T20 Final'}
            </p>
          </div>

          {/* Tournament & Match Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#8F9CAE] mb-1">COMPETITION</label>
              <select
                value={competitionFilter}
                onChange={e => setCompetitionFilter(e.target.value)}
                className="bg-[#05070D] border border-[#1C2745] text-white text-xs rounded-lg px-3 py-1.5 focus:border-[#B6FF3B] outline-none font-mono"
              >
                <option value="ALL">All Tournaments</option>
                <option value="ICC">ICC Tournaments</option>
                <option value="IPL">Indian Premier League</option>
                <option value="Super Series">Super Series</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8F9CAE] mb-1">SELECT FIXTURE</label>
              <select
                value={selectedMatchId}
                onChange={e => setSelectedMatchId(e.target.value)}
                className="bg-[#05070D] border border-[#1C2745] text-[#B6FF3B] text-xs rounded-lg px-3 py-1.5 focus:border-[#B6FF3B] outline-none font-mono font-bold"
              >
                {filteredMatches.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.team1} vs {m.team2} ({m.competition})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8F9CAE] mb-1">INNINGS</label>
              <div className="inline-flex rounded-lg border border-[#1C2745] bg-[#05070D] p-0.5">
                <button
                  onClick={() => setActiveInnings(1)}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                    activeInnings === 1
                      ? 'bg-[#B6FF3B] text-black font-bold shadow'
                      : 'text-[#8F9CAE] hover:text-white'
                  }`}
                >
                  Inn 1 ({matchDetail?.match_info.team1 || 'Team 1'})
                </button>
                <button
                  onClick={() => setActiveInnings(2)}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                    activeInnings === 2
                      ? 'bg-[#B6FF3B] text-black font-bold shadow'
                      : 'text-[#8F9CAE] hover:text-white'
                  }`}
                >
                  Inn 2 ({matchDetail?.match_info.team2 || 'Team 2'})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Match State Bar & Win Probability Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
            <span className="text-[11px] font-mono text-[#8F9CAE] uppercase block mb-1">
              {activeInnings === 2 ? 'CHASE STATE' : '1ST INNINGS TOTAL'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                {currentInningsData?.total_runs ?? simRuns}/{currentInningsData?.total_wickets ?? simWickets}
              </span>
              <span className="text-xs font-mono text-[#8F9CAE]">
                ({currentInningsData?.total_overs ?? simOvers} / 20 ov)
              </span>
            </div>
            <div className="mt-2 flex justify-between text-xs font-mono text-[#8F9CAE]">
              {activeInnings === 2 ? (
                <>
                  <span>Target: <strong className="text-white">{matchDetail?.current_state?.target ?? 195}</strong></span>
                  <span>
                    {(currentInningsData?.total_runs ?? simRuns) >= (matchDetail?.current_state?.target ?? 195) ? (
                      <strong className="text-[#B6FF3B]">Target Achieved</strong>
                    ) : (
                      <span>Need: <strong className="text-[#B6FF3B]">{(matchDetail?.current_state?.target ?? 195) - (currentInningsData?.total_runs ?? simRuns)} off {Math.max(0, Math.round((20 - (currentInningsData?.total_overs ?? simOvers)) * 6))}b</strong></span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span>Projected: <strong className="text-white">{Math.round(((currentInningsData?.run_rate ?? 9.5) * 20))}</strong></span>
                  <span>Overs Rem: <strong className="text-[#B6FF3B]">{(20.0 - (currentInningsData?.total_overs ?? 20.0)).toFixed(1)} ov</strong></span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
            <span className="text-[11px] font-mono text-[#8F9CAE] uppercase block mb-1">TEMPO RUN RATES</span>
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-xs text-[#8F9CAE] block">CURRENT RR</span>
                <span className="text-xl font-bold font-mono text-[#B6FF3B]">
                  {currentInningsData?.run_rate ?? (simRuns / simOvers).toFixed(2)}
                </span>
              </div>
              <div className="border-l border-[#1C2745] pl-3">
                <span className="text-xs text-[#8F9CAE] block">
                  {activeInnings === 2 ? 'REQUIRED RR' : 'PAR RATE'}
                </span>
                <span className="text-xl font-bold font-mono text-red-400">
                  {activeInnings === 2
                    ? ((currentInningsData?.total_runs ?? simRuns) >= (matchDetail?.current_state?.target ?? 195)
                        ? '0.00'
                        : (matchDetail?.current_state?.required_run_rate ?? '9.82'))
                    : '9.20'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#8F9CAE] mt-2 block">
              {activeInnings === 2
                ? ((currentInningsData?.total_runs ?? simRuns) >= (matchDetail?.current_state?.target ?? 195)
                    ? 'Target achieved in 18.5 overs'
                    : `Delta: ${( (currentInningsData?.run_rate ?? 10.7) - 9.82 ).toFixed(2)} rpo cushion`)
                : 'Pace above tournament par (8.75 rpo)'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745] md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-[#2D6BFF] font-bold">
                  {matchDetail?.match_info.team1 || 'Australia'}: {winProbData?.bowling_team_win_prob ?? 7.0}%
                </span>
                <span className="text-[#B6FF3B] font-bold">
                  {matchDetail?.match_info.team2 || 'India'}: {winProbData?.batting_team_win_prob ?? 93.0}%
                </span>
              </div>
              <div className="w-full bg-[#1C2745] h-3.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#2D6BFF] h-full transition-all duration-700"
                  style={{ width: `${winProbData?.bowling_team_win_prob ?? 7.0}%` }}
                />
                <div
                  className="bg-[#B6FF3B] h-full transition-all duration-700"
                  style={{ width: `${winProbData?.batting_team_win_prob ?? 93.0}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#8F9CAE] font-mono mt-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B6FF3B]" />
                ML Sigmoid Calibrated Logistic Model (Brier: 0.1339)
              </span>
              <span className="text-white font-semibold">
                Status: {(winProbData?.batting_team_win_prob ?? 93) > 50 ? 'Chase Favored' : 'Defending Favored'}
              </span>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1C2745]">
          {[
            { id: 'matchup', label: '1. Batter vs Bowler Matrix', icon: Target },
            { id: 'wagon', label: '2. 360° Wagon Wheel', icon: Compass },
            { id: 'phases', label: '3. Phase Analysis (PP/Mid/Death)', icon: Layers },
            { id: 'winprob', label: '4. Explainable Win Prob Simulator', icon: TrendingUp },
            { id: 'recs', label: '5. AI Bowler Recommendation', icon: Cpu },
            { id: 'radar', label: '6. Player Radar Comparison', icon: Activity },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                  isActive
                    ? 'bg-[#B6FF3B] text-black shadow-lg shadow-[#B6FF3B]/10'
                    : 'bg-[#05070D] text-[#8F9CAE] hover:text-white border border-[#1C2745] hover:border-white/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#B6FF3B]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: BATTER VS BOWLER MATCHUP MATRIX */}
      {activeTab === 'matchup' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono text-[#B6FF3B] uppercase">TACTICAL HEAD-TO-HEAD</span>
                <h3 className="text-xl font-bold font-display text-white">Batter vs Bowler Micro-Matchup</h3>
                <p className="text-xs text-[#8F9CAE]">Evaluate vulnerability, strike rates, dot percentages, and dismissal histories.</p>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#8F9CAE] mb-1">BATTER</label>
                  <select
                    value={selectedH2HBatter}
                    onChange={e => setSelectedH2HBatter(e.target.value)}
                    className="bg-[#05070D] border border-[#1C2745] text-white text-xs rounded-lg px-3 py-1.5 focus:border-[#B6FF3B] outline-none font-mono"
                  >
                    <option value="Virat Kohli">Virat Kohli</option>
                    <option value="Rohit Sharma">Rohit Sharma</option>
                    <option value="Suryakumar Yadav">Suryakumar Yadav</option>
                    <option value="Hardik Pandya">Hardik Pandya</option>
                    <option value="Travis Head">Travis Head</option>
                    <option value="David Warner">David Warner</option>
                  </select>
                </div>

                <span className="text-sm font-mono text-[#8F9CAE] mt-4">VS</span>

                <div>
                  <label className="block text-[10px] font-mono text-[#8F9CAE] mb-1">BOWLER</label>
                  <select
                    value={selectedH2HBowler}
                    onChange={e => setSelectedH2HBowler(e.target.value)}
                    className="bg-[#05070D] border border-[#1C2745] text-white text-xs rounded-lg px-3 py-1.5 focus:border-[#B6FF3B] outline-none font-mono"
                  >
                    <option value="Mitchell Starc">Mitchell Starc</option>
                    <option value="Pat Cummins">Pat Cummins</option>
                    <option value="Josh Hazlewood">Josh Hazlewood</option>
                    <option value="Adam Zampa">Adam Zampa</option>
                    <option value="Jasprit Bumrah">Jasprit Bumrah</option>
                  </select>
                </div>
              </div>
            </div>

            {matchupStats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[11px] font-mono text-[#8F9CAE]">BALLS FACED</span>
                  <p className="text-2xl font-bold font-mono text-white mt-1">{matchupStats.balls_faced}</p>
                  <span className="text-[10px] font-mono text-[#8F9CAE]">{matchupStats.sample_sufficiency}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[11px] font-mono text-[#8F9CAE]">RUNS SCORED</span>
                  <p className="text-2xl font-bold font-mono text-[#B6FF3B] mt-1">{matchupStats.runs_scored}</p>
                  <span className="text-[10px] font-mono text-[#8F9CAE]">4s: {matchupStats.fours} | 6s: {matchupStats.sixes}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[11px] font-mono text-[#8F9CAE]">STRIKE RATE</span>
                  <p className="text-2xl font-bold font-mono text-white mt-1">{matchupStats.strike_rate.toFixed(1)}</p>
                  <span className="text-[10px] font-mono text-[#8F9CAE]">Control: {matchupStats.control_percentage}%</span>
                </div>

                <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[11px] font-mono text-[#8F9CAE]">DOT BALL %</span>
                  <p className="text-2xl font-bold font-mono text-white mt-1">{matchupStats.dot_ball_percentage.toFixed(1)}%</p>
                  <span className="text-[10px] font-mono text-[#8F9CAE]">{matchupStats.dot_balls} dots</span>
                </div>

                <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[11px] font-mono text-[#8F9CAE]">DISMISSALS</span>
                  <p className={`text-2xl font-bold font-mono mt-1 ${matchupStats.dismissals > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {matchupStats.dismissals}
                  </p>
                  <span className="text-[10px] font-mono text-[#8F9CAE]">
                    {matchupStats.dismissals > 0 ? 'Wicket recorded' : 'Unconquered'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[11px] font-mono text-[#8F9CAE]">VERDICT</span>
                  <p className="text-sm font-bold font-display text-[#B6FF3B] mt-2">
                    {matchupStats.head_to_head_rating}
                  </p>
                  <span className="text-[10px] font-mono text-[#8F9CAE]">Cricsheet Seeded</span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-[#8F9CAE] font-mono text-sm bg-[#05070D] rounded-xl border border-[#1C2745]">
                Loading head-to-head metrics...
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE 360° WAGON WHEEL */}
      {activeTab === 'wagon' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-mono text-[#B6FF3B] uppercase">SPATIAL SCORING DISPERSION</span>
                <h3 className="text-xl font-bold font-display text-white">Interactive 360° Ground Radar</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#8F9CAE]">Batter:</span>
                <select
                  value={selectedBatter}
                  onChange={e => setSelectedBatter(e.target.value)}
                  className="bg-[#05070D] border border-[#1C2745] text-[#B6FF3B] text-xs rounded-lg px-2.5 py-1 focus:border-[#B6FF3B] outline-none font-mono"
                >
                  <option value="Virat Kohli">Virat Kohli</option>
                  <option value="Rohit Sharma">Rohit Sharma</option>
                  <option value="Suryakumar Yadav">Suryakumar Yadav</option>
                  <option value="Travis Head">Travis Head</option>
                  <option value="David Warner">David Warner</option>
                </select>
              </div>
            </div>

            {/* Wagon Wheel Pitch Visualizer */}
            <div className="h-80 rounded-xl bg-[#05070D] border border-[#1C2745] p-4 relative flex items-center justify-center overflow-hidden">
              {/* Ground Boundary Circle */}
              <div className="w-72 h-72 rounded-full border-2 border-dashed border-[#1C2745] flex items-center justify-center relative">
                {/* 30-Yard Circle */}
                <div className="w-48 h-48 rounded-full border border-[#1C2745]/70 flex items-center justify-center">
                  {/* Pitch Strip */}
                  <div className="w-14 h-24 bg-[#1C2745]/40 border border-[#B6FF3B]/40 rounded-sm flex flex-col items-center justify-center text-[9px] font-mono text-[#B6FF3B]">
                    PITCH
                  </div>
                </div>

                {/* Dynamic Zone Markers */}
                {wagonData?.zones.map((zone, idx) => {
                  const angles: Record<string, number> = {
                    'Fine Leg': 45,
                    'Square Leg': 90,
                    'Mid-Wicket': 135,
                    'Long-on': 180,
                    'Long-off': 225,
                    'Cover / Extra Cover': 270,
                    'Point': 315,
                    'Third Man': 360
                  };
                  const angleDeg = angles[zone.zone] ?? (idx * 45);
                  const rad = (angleDeg * Math.PI) / 180;
                  const distance = 115;
                  const x = Math.cos(rad) * distance;
                  const y = Math.sin(rad) * distance;
                  const isSelected = selectedZone === zone.zone;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedZone(isSelected ? null : zone.zone)}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      className={`absolute px-2 py-0.5 rounded text-[10px] font-mono transition-all z-10 ${
                        isSelected
                          ? 'bg-[#B6FF3B] text-black font-bold shadow-lg scale-110 border border-[#B6FF3B]'
                          : 'bg-[#0B1020]/90 text-white border border-[#1C2745] hover:border-[#B6FF3B]'
                      }`}
                    >
                      {zone.zone} ({zone.runs}r)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear Ground Legend & Labeling Distinction */}
            <div className="mt-4 p-4 rounded-xl bg-[#05070D]/80 border border-[#1C2745] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="text-[#8F9CAE]">DATA VALIDATION AUDIT:</span>
                <p className="text-white mt-0.5">
                  Recorded Cricsheet Shots: <strong className="text-[#B6FF3B]">{wagonData?.recorded_shots_count ?? 28}</strong> • Illustrative Spatial Shots: <strong className="text-amber-400">{wagonData?.illustrative_shots_count ?? 8}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/20">
                  {selectedZone ? `Zone: ${selectedZone}` : 'All 8 Sectors Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Batters in Innings Scorecard */}
          <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#8F9CAE] uppercase block mb-1">SCORECARD TELEMETRY</span>
              <h3 className="text-xl font-bold font-display text-white mb-4">
                {currentInningsData?.batting_team || 'Innings'} Batters
              </h3>

              <div className="space-y-3">
                {(activeBatters.length > 0 ? activeBatters : CRICKET_DEMO_DATA.batters).map((batter, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedBatter(batter.name);
                      setSelectedH2HBatter(batter.name);
                    }}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                      selectedBatter === batter.name
                        ? 'bg-[#15203D] border-[#B6FF3B]'
                        : 'bg-[#05070D] border-[#1C2745] hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-white">{batter.name}</span>
                      <span className="font-mono text-xs text-[#B6FF3B]">SR {batter.strike_rate || (batter as any).sr}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#8F9CAE] font-mono">
                      <span>{batter.runs} ({batter.balls}) • 4s: {batter.fours} | 6s: {batter.sixes}</span>
                      <span className={batter.is_out ? 'text-red-400' : 'text-emerald-400'}>
                        {batter.is_out ? 'Out' : 'Not Out'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#05070D] border border-[#1C2745] text-xs text-[#8F9CAE]">
              💡 <strong className="text-white">AI Coach Insight:</strong> Click any batter to switch ground distribution and micro-matchups instantly.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHASE ANALYSIS (POWERPLAY, MIDDLE, DEATH) */}
      {activeTab === 'phases' && (
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#B6FF3B] uppercase">TACTICAL INNINGS SEGMENTATION</span>
              <h3 className="text-xl font-bold font-display text-white">Powerplay vs Middle vs Death Overs</h3>
              <p className="text-xs text-[#8F9CAE]">Quantifying run production, boundary density, and wicket vulnerability by phase.</p>
            </div>
            <div className="text-xs font-mono text-[#8F9CAE] bg-[#05070D] px-3 py-1.5 rounded-lg border border-[#1C2745]">
              Target Innings: <strong className="text-white">Innings {activeInnings} ({currentInningsData?.batting_team || 'Team'})</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phaseData?.phases.map((phase, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold font-display text-white">{phase.phase_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1C2745] text-[#B6FF3B]">
                      {phase.overs_range}
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-[#1C2745]/50 pb-2">
                      <span className="text-[#8F9CAE]">Runs Scored:</span>
                      <span className="text-white font-bold">{phase.runs_scored}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#1C2745]/50 pb-2">
                      <span className="text-[#8F9CAE]">Wickets Lost:</span>
                      <span className={phase.wickets_lost > 2 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {phase.wickets_lost}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#1C2745]/50 pb-2">
                      <span className="text-[#8F9CAE]">Run Rate:</span>
                      <span className="text-[#B6FF3B] font-bold">{phase.run_rate.toFixed(2)} rpo</span>
                    </div>
                    <div className="flex justify-between border-b border-[#1C2745]/50 pb-2">
                      <span className="text-[#8F9CAE]">Boundary %:</span>
                      <span className="text-white font-bold">{phase.boundary_percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8F9CAE]">Dot Ball %:</span>
                      <span className="text-white font-bold">{phase.dot_ball_percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1C2745] text-[11px] text-[#8F9CAE]">
                  {idx === 0 && '⚡ Field restrictions utilized aggressively'}
                  {idx === 1 && '🔄 Spin consolidation & strike rotation'}
                  {idx === 2 && '🔥 High-leverage boundary acceleration'}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs font-mono flex items-center gap-3">
            <Info className="w-4 h-4 text-[#B6FF3B] shrink-0" />
            <span className="text-white">
              <strong>Key Tactical Takeaway:</strong> {phaseData?.key_takeaway || 'Middle overs strike rotation maintained required run rate cushion.'}
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: EXPLAINABLE WIN PROBABILITY SIMULATOR */}
      {activeTab === 'winprob' && (
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-6">
          <div>
            <span className="text-xs font-mono text-[#B6FF3B] uppercase">CALIBRATED MACHINE LEARNING PREDICTOR</span>
            <h3 className="text-xl font-bold font-display text-white">Explainable Win-Probability Simulation</h3>
            <p className="text-xs text-[#8F9CAE]">
              Adjust live match parameters to view real-time Bayesian odds shift and feature attributions.
            </p>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8F9CAE]">RUNS SCORED</span>
                <span className="text-[#B6FF3B] font-bold">{simRuns}</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={simRuns}
                onChange={e => setSimRuns(Number(e.target.value))}
                className="w-full accent-[#B6FF3B]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8F9CAE]">WICKETS LOST</span>
                <span className="text-[#B6FF3B] font-bold">{simWickets} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={simWickets}
                onChange={e => setSimWickets(Number(e.target.value))}
                className="w-full accent-[#B6FF3B]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8F9CAE]">OVERS COMPLETED</span>
                <span className="text-[#B6FF3B] font-bold">{simOvers.toFixed(1)} ov</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="20.0"
                step="0.1"
                value={simOvers}
                onChange={e => setSimOvers(Number(e.target.value))}
                className="w-full accent-[#B6FF3B]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#8F9CAE]">TARGET TOTAL</span>
                <span className="text-[#B6FF3B] font-bold">{simTarget}</span>
              </div>
              <input
                type="range"
                min="100"
                max="250"
                value={simTarget}
                onChange={e => setSimTarget(Number(e.target.value))}
                className="w-full accent-[#B6FF3B]"
              />
            </div>
          </div>

          {/* Model Output & Odds Distribution */}
          {winProbData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#8F9CAE]">PREDICTED VICTORY PROBABILITY</span>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-4xl font-black font-mono text-[#B6FF3B]">
                      {winProbData.batting_team_win_prob}%
                    </span>
                    <span className="text-xs font-mono text-[#8F9CAE]">Batting Team</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xl font-bold font-mono text-[#2D6BFF]">
                      {winProbData.bowling_team_win_prob}%
                    </span>
                    <span className="text-xs font-mono text-[#8F9CAE]">Bowling Team</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1C2745] space-y-1 text-xs font-mono text-[#8F9CAE]">
                  <div>Current RR: <strong className="text-white">{winProbData.current_run_rate}</strong></div>
                  <div>Required RR: <strong className="text-white">{winProbData.required_run_rate}</strong></div>
                  <div>Runs Needed: <strong className="text-white">{winProbData.runs_remaining} off {winProbData.balls_remaining} balls</strong></div>
                </div>
              </div>

              {/* Explainable Factor Attributions */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#B6FF3B] uppercase">MODEL EXPLAINABILITY (FEATURE CONTRIBUTIONS)</span>
                  <span className="text-[10px] font-mono text-[#8F9CAE]">Model: {winProbData.model_version}</span>
                </div>

                <div className="space-y-3">
                  {winProbData.explanations.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#0B1020] border border-[#1C2745] flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${exp.direction === 'positive' ? 'bg-[#B6FF3B]' : 'bg-red-400'}`} />
                        <span className="text-white font-medium">{exp.factor}</span>
                      </div>
                      <span className={exp.direction === 'positive' ? 'text-[#B6FF3B] font-bold' : 'text-red-400 font-bold'}>
                        {exp.impact}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745]/60 text-[11px] font-mono text-[#8F9CAE] flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Calibrated with Platt Scaling. Estimates represent probabilistic likelihood, not guarantees.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AI BOWLER RECOMMENDATION */}
      {activeTab === 'recs' && (
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#B6FF3B] uppercase">TACTICAL CAPTAINCY ADVISOR</span>
              <h3 className="text-xl font-bold font-display text-white">AI Bowler Recommendation Engine</h3>
              <p className="text-xs text-[#8F9CAE]">
                Optimizing bowler selection for upcoming overs factoring phase specialization, quota remaining, and batter matchups.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[#8F9CAE] mb-1">TARGET OVER</label>
                <select
                  value={recTargetOver}
                  onChange={e => setRecTargetOver(Number(e.target.value))}
                  className="bg-[#05070D] border border-[#1C2745] text-[#B6FF3B] text-xs rounded-lg px-3 py-1.5 focus:border-[#B6FF3B] outline-none font-mono font-bold"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(ov => (
                    <option key={ov} value={ov}>Over {ov} ({ov <= 6 ? 'Powerplay' : ov <= 15 ? 'Middle' : 'Death'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#8F9CAE] mb-1">ON STRIKE BATTER</label>
                <select
                  value={recStriker}
                  onChange={e => setRecStriker(e.target.value)}
                  className="bg-[#05070D] border border-[#1C2745] text-white text-xs rounded-lg px-3 py-1.5 focus:border-[#B6FF3B] outline-none font-mono"
                >
                  <option value="Virat Kohli">Virat Kohli</option>
                  <option value="Rohit Sharma">Rohit Sharma</option>
                  <option value="Suryakumar Yadav">Suryakumar Yadav</option>
                  <option value="Travis Head">Travis Head</option>
                </select>
              </div>
            </div>
          </div>

          {bowlerRecs && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bowlerRecs.ranked_bowlers.map((bowler, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border transition-all ${
                      bowler.recommended_rank === 1
                        ? 'bg-[#121A2E] border-[#B6FF3B] shadow-lg shadow-[#B6FF3B]/5'
                        : 'bg-[#05070D] border-[#1C2745]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          bowler.recommended_rank === 1 ? 'bg-[#B6FF3B] text-black font-bold' : 'bg-[#1C2745] text-[#8F9CAE]'
                        }`}>
                          Rank #{bowler.recommended_rank} Recommendation
                        </span>
                        <h4 className="text-lg font-bold font-display text-white mt-2">{bowler.bowler_name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-mono font-black text-[#B6FF3B]">{bowler.score.toFixed(0)}</span>
                        <span className="text-[10px] font-mono text-[#8F9CAE] block">/100 index</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono text-[#8F9CAE] my-3">
                      <div className="flex justify-between">
                        <span>Overs Bowled:</span>
                        <span className="text-white">{bowler.overs_bowled} / {bowler.max_overs_allowed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overs Remaining:</span>
                        <span className="text-[#B6FF3B]">{bowler.overs_remaining}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Econ:</span>
                        <span className="text-white">{bowler.current_economy.toFixed(2)} rpo</span>
                      </div>
                    </div>

                    <p className="text-xs text-white/90 bg-[#0B1020] p-2.5 rounded-lg border border-[#1C2745] font-sans">
                      {bowler.primary_reason}
                    </p>

                    <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-[#8F9CAE]">
                      <span>Confidence:</span>
                      <span className="text-emerald-400">{bowler.data_sufficiency}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs font-mono text-white flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#B6FF3B] shrink-0" />
                <span><strong>Tactical Summary:</strong> {bowlerRecs.tactical_summary}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: PLAYER RADAR COMPARISON */}
      {activeTab === 'radar' && (
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#B6FF3B] uppercase">MULTIDIMENSIONAL BENCHMARK</span>
              <h3 className="text-xl font-bold font-display text-white">Player Performance Radar</h3>
              <p className="text-xs text-[#8F9CAE]">
                Comparing normalized percentiles across power hitting, boundary timing, clutch scoring, and dot pressure.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[#8F9CAE] mb-1">PLAYER A</label>
                <select
                  value={radarPlayerA}
                  onChange={e => setRadarPlayerA(e.target.value)}
                  className="bg-[#05070D] border border-[#1C2745] text-[#B6FF3B] text-xs rounded-lg px-3 py-1.5 focus:border-[#B6FF3B] outline-none font-mono font-bold"
                >
                  <option value="Virat Kohli">Virat Kohli</option>
                  <option value="Rohit Sharma">Rohit Sharma</option>
                  <option value="Suryakumar Yadav">Suryakumar Yadav</option>
                  <option value="Jasprit Bumrah">Jasprit Bumrah</option>
                </select>
              </div>

              <span className="text-sm font-mono text-[#8F9CAE] mt-4">VS</span>

              <div>
                <label className="block text-[10px] font-mono text-[#8F9CAE] mb-1">PLAYER B</label>
                <select
                  value={radarPlayerB}
                  onChange={e => setRadarPlayerB(e.target.value)}
                  className="bg-[#05070D] border border-[#1C2745] text-[#2D6BFF] text-xs rounded-lg px-3 py-1.5 focus:border-[#2D6BFF] outline-none font-mono font-bold"
                >
                  <option value="Steve Smith">Steve Smith</option>
                  <option value="Mitchell Starc">Mitchell Starc</option>
                  <option value="Pat Cummins">Pat Cummins</option>
                  <option value="Travis Head">Travis Head</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-80 w-full flex items-center justify-center p-2 rounded-xl bg-[#05070D] border border-[#1C2745]">
            {radarData && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData.radar_data}>
                  <PolarGrid stroke="#1C2745" />
                  <PolarAngleAxis dataKey="metric" stroke="#8F9CAE" tick={{ fill: '#8F9CAE', fontSize: 11 }} />
                  <PolarRadiusAxis stroke="#1C2745" angle={30} domain={[0, 100]} />
                  <Radar
                    name={radarPlayerA}
                    dataKey={radarPlayerA}
                    stroke="#B6FF3B"
                    fill="#B6FF3B"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name={radarPlayerB}
                    dataKey={radarPlayerB}
                    stroke="#2D6BFF"
                    fill="#2D6BFF"
                    fillOpacity={0.4}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1C2745', borderRadius: '8px', color: '#fff' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Over-by-Over Worm Curve & Projected Score */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-[#2D6BFF] uppercase">PROGRESSION METRICS</span>
            <h3 className="text-xl font-bold font-display text-white">Over-by-Over Worm Curve & Projected Score</h3>
          </div>
          <span className="text-xs font-mono text-[#B6FF3B]">
            Current RR: {currentInningsData?.run_rate ?? (simRuns / simOvers).toFixed(2)}
          </span>
        </div>

        <div className="h-64 min-h-[256px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CRICKET_DEMO_DATA.overByOver} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cricketGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B6FF3B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#B6FF3B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2745" />
              <XAxis dataKey="over" stroke="#8F9CAE" unit=" ov" />
              <YAxis stroke="#8F9CAE" domain={[0, 220]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1C2745', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="cumRuns" stroke="#B6FF3B" strokeWidth={2} fillOpacity={1} fill="url(#cricketGradient)" name="Cumulative Runs" />
              <Area type="monotone" dataKey="projectedScore" stroke="#2D6BFF" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Projected Total" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
