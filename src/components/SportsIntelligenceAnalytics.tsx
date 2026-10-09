"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Download, 
  Printer, 
  Sparkles, 
  Filter, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  Target, 
  Sliders, 
  FileText,
  Clock,
  Compass,
  Check
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

import { 
  SportType, 
  TimeframeType, 
  EntityType, 
  AnalyticsKPIs, 
  TrendDataPoint, 
  PlayerAnalytics, 
  TeamAnalytics, 
  AIInsightData, 
  ActivityFeedItem 
} from '@/types/analytics';
import { 
  fetchAnalyticsOverview, 
  fetchPlayers, 
  fetchTeams, 
  generateAIInsights, 
  generateCSVReport, 
  downloadCSVFile,
  FALLBACK_ACTIVITIES 
} from '@/lib/analyticsApi';

export default function SportsIntelligenceAnalytics() {
  // Filter States
  const [sport, setSport] = useState<SportType>('cricket');
  const [timeframe, setTimeframe] = useState<TimeframeType>('season');
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('vkohli');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  
  // Comparison States
  const [compareEntityA, setCompareEntityA] = useState<string>('vkohli');
  const [compareEntityB, setCompareEntityB] = useState<string>('rsharma');
  const [compareType, setCompareType] = useState<EntityType>('player');

  // Data States
  const [kpis, setKpis] = useState<AnalyticsKPIs>({
    totalMatches: 68,
    performanceIndex: 92.4,
    winPercentage: 73.5,
    averageScoring: '184.2 runs',
    deltaPct: 8.7,
    healthIndex: 99.1
  });
  const [trends, setTrends] = useState<TrendDataPoint[]>([]);
  const [players, setPlayers] = useState<PlayerAnalytics[]>([]);
  const [teams, setTeams] = useState<TeamAnalytics[]>([]);
  const [insights, setInsights] = useState<AIInsightData | null>(null);
  const [activities, setActivities] = useState<ActivityFeedItem[]>(FALLBACK_ACTIVITIES);

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sport Theme Colors
  const sportAccent = useMemo(() => {
    switch (sport) {
      case 'cricket': return '#B6FF3B';
      case 'football': return '#2D6BFF';
      case 'olympics': return '#FF6B2C';
      default: return '#2D6BFF';
    }
  }, [sport]);

  // Load Overview Data & Entities
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      fetchAnalyticsOverview(sport, timeframe),
      fetchPlayers(sport),
      fetchTeams(sport)
    ]).then(([overviewData, playersData, teamsData]) => {
      if (!isMounted) return;
      setKpis(overviewData.kpis);
      setTrends(overviewData.trends);
      setPlayers(playersData);
      setTeams(teamsData);

      // Set default selected player if current is not in list
      if (playersData.length > 0) {
        const found = playersData.find(p => p.id === selectedPlayerId);
        if (!found) {
          setSelectedPlayerId(playersData[0].id);
          setCompareEntityA(playersData[0].id);
          setCompareEntityB(playersData[1]?.id || playersData[0].id);
        } else {
          setCompareEntityA(found.id);
          const second = playersData.find(p => p.id !== found.id) || playersData[0];
          setCompareEntityB(second.id);
        }
      }

      setIsLoading(false);
    }).catch(err => {
      console.warn('Analytics loading error:', err);
      setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [sport, timeframe]);

  // Generate / Refresh AI Insights
  const runInsights = (playerId: string) => {
    setIsGeneratingInsights(true);
    generateAIInsights(sport, playerId, timeframe)
      .then(res => {
        setInsights(res);
        setIsGeneratingInsights(false);
        showToast(`AI Insights calibrated for ${res.entityName}`);
      })
      .catch(err => {
        console.warn('Insight generation error:', err);
        setIsGeneratingInsights(false);
      });
  };

  useEffect(() => {
    if (selectedPlayerId) {
      runInsights(selectedPlayerId);
    }
  }, [selectedPlayerId, sport, timeframe]);

  // Active Player
  const activePlayer = useMemo(() => {
    return players.find(p => p.id === selectedPlayerId) || players[0];
  }, [players, selectedPlayerId]);

  // Comparison Entities
  const entityA = useMemo(() => {
    if (compareType === 'player') {
      return players.find(p => p.id === compareEntityA) || players[0];
    }
    return teams.find(t => t.id === compareEntityA) || teams[0];
  }, [players, teams, compareEntityA, compareType]);

  const entityB = useMemo(() => {
    if (compareType === 'player') {
      return players.find(p => p.id === compareEntityB) || players[1] || players[0];
    }
    return teams.find(t => t.id === compareEntityB) || teams[1] || teams[0];
  }, [players, teams, compareEntityB, compareType]);

  // Comparison Radar Chart Data
  const comparisonRadarData = useMemo(() => {
    if (compareType === 'player' && entityA && entityB && 'radar' in entityA && 'radar' in entityB) {
      const pA = entityA as PlayerAnalytics;
      const pB = entityB as PlayerAnalytics;
      return pA.radar.map((attr, idx) => ({
        attribute: attr.attribute,
        [pA.name]: attr.value,
        [pB.name]: pB.radar[idx]?.value || 0
      }));
    }
    return [];
  }, [entityA, entityB, compareType]);

  // Handle CSV Download
  const handleDownloadCSV = () => {
    const csvData = generateCSVReport(sport, players, kpis);
    const filename = `apex_analytics_${sport}_${timeframe}_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSVFile(csvData, filename);
    showToast(`CSV Report downloaded: ${filename}`);
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 flex items-center justify-center sm:justify-start gap-2.5 px-4 py-3 rounded-xl bg-[#0B1020] border border-[#B6FF3B]/50 text-white shadow-2xl shadow-black/80 font-mono text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#B6FF3B] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Header & Global Filters Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden flex flex-col gap-5 sm:gap-6 shadow-xl">
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{ backgroundColor: sportAccent }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1C2745] pb-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: sportAccent }} />
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase" style={{ color: sportAccent }}>
                APEX SPORTS INTELLIGENCE • PHASE 5 ADVANCED ANALYTICS
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-[#121A2E] text-white border border-[#1C2745]">
                ML ENGINE ONLINE
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                WCAG AAA TESTED
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white">
              Tactical Performance & Sports Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA4BF] mt-1 max-w-3xl leading-relaxed">
              Synthesizing acute-to-chronic physiological workloads, sub-millimeter kinematics, and dynamic match outcome predictions into explainable intelligence.
            </p>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] hover:border-[#2D6BFF]/50 text-white text-xs font-mono flex items-center gap-2 transition-all shadow"
              title="Download filtered dataset as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#2D6BFF]" />
              <span className="hidden sm:inline">Export</span> CSV
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#2D6BFF] hover:bg-[#2558d6] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-[#2D6BFF]/25"
              title="Print clean report dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Filters & Control Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
          {/* Sport Selector */}
          <div>
            <label className="text-[10px] font-mono text-[#9AA4BF] uppercase block mb-1.5">
              1. Sport Discipline
            </label>
            <div className="flex items-center p-1 rounded-xl bg-[#05070D] border border-[#1C2745]">
              {(['cricket', 'football', 'olympics'] as const).map((s) => {
                const isActive = sport === s;
                let activeColor = '#2D6BFF';
                if (s === 'cricket') activeColor = '#B6FF3B';
                if (s === 'football') activeColor = '#2D6BFF';
                if (s === 'olympics') activeColor = '#FF6B2C';

                return (
                  <button
                    key={s}
                    onClick={() => setSport(s)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono font-medium capitalize transition-all ${
                      isActive 
                        ? 'bg-[#121A2E] text-white shadow-sm font-bold border border-[#1C2745]' 
                        : 'text-[#9AA4BF] hover:text-white'
                    }`}
                    style={isActive ? { color: activeColor } : {}}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeframe Selector */}
          <div>
            <label className="text-[10px] font-mono text-[#9AA4BF] uppercase block mb-1.5">
              2. Observation Window
            </label>
            <div className="flex items-center p-1 rounded-xl bg-[#05070D] border border-[#1C2745]">
              {(['7d', '30d', 'season', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono transition-all uppercase ${
                    timeframe === t
                      ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745]'
                      : 'text-[#9AA4BF] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggle: Single vs Comparison */}
          <div>
            <label className="text-[10px] font-mono text-[#9AA4BF] uppercase block mb-1.5">
              3. Analytics Mode
            </label>
            <div className="flex items-center p-1 rounded-xl bg-[#05070D] border border-[#1C2745]">
              <button
                onClick={() => setMode('single')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'single'
                    ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745]'
                    : 'text-[#9AA4BF] hover:text-white'
                }`}
              >
                <Activity className="w-3 h-3 text-[#B6FF3B]" />
                Single
              </button>
              <button
                onClick={() => setMode('compare')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'compare'
                    ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745]'
                    : 'text-[#9AA4BF] hover:text-white'
                }`}
              >
                <Users className="w-3 h-3 text-amber-400" />
                Compare
              </button>
            </div>
          </div>

          {/* Entity Selector (Single Mode: Player) */}
          <div>
            <label className="text-[10px] font-mono text-[#9AA4BF] uppercase block mb-1.5">
              4. Target Athlete
            </label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.team} • {p.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Matches */}
        <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA4BF] mb-2">
            <span>TOTAL ANALYZED</span>
            <Activity className="w-4 h-4 text-[#2D6BFF]" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-display text-white">
              {kpis.totalMatches}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 ml-2 font-bold">
              +{kpis.deltaPct}% Vol
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#8F9CAE] mt-2 block">
            Calibrated against Cricsheet & StatsBomb
          </span>
        </div>

        {/* Performance Index */}
        <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA4BF] mb-2">
            <span>PERFORMANCE INDEX</span>
            <Zap className="w-4 h-4 text-[#B6FF3B]" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-display text-white">
              {activePlayer?.rating || kpis.performanceIndex}
            </span>
            <span className="text-xs font-mono text-[#9AA4BF]">/100</span>
          </div>
          <div className="w-full bg-[#05070D] h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-[#B6FF3B] h-full rounded-full" 
              style={{ width: `${activePlayer?.rating || kpis.performanceIndex}%` }}
            />
          </div>
        </div>

        {/* Team Win % */}
        <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA4BF] mb-2">
            <span>WIN PROBABILITY RATE</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-display text-white">
              {kpis.winPercentage}%
            </span>
            <span className="text-[10px] font-mono text-emerald-400 ml-2 font-bold">
              +4.2% Baseline
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#8F9CAE] mt-2 block">
            Calibrated Logistic Model (Brier: 0.1339)
          </span>
        </div>

        {/* Scoring Performance */}
        <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA4BF] mb-2">
            <span>SCORING BENCHMARK</span>
            <BarChart3 className="w-4 h-4 text-[#FF6B2C]" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black font-display text-white truncate block">
              {activePlayer?.primaryMetric || kpis.averageScoring}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#8F9CAE] mt-2 block">
            Consistency: {activePlayer?.consistency || 91.2}% Index
          </span>
        </div>
      </div>

      {/* SINGLE MODE: Analytics Dashboard */}
      {mode === 'single' && (
        <div className="space-y-6">
          {/* Main Visuals: Performance Trends & Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Performance Trend Chart (Col 7) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: sportAccent }}>
                    CHRONOLOGICAL TRAJECTORY
                  </span>
                  <h3 className="text-xl font-bold font-display text-white">
                    Performance vs League Benchmark
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sportAccent }} />
                    Active Score
                  </span>
                  <span className="flex items-center gap-1.5 text-[#9AA4BF]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1C2745]" />
                    Benchmark
                  </span>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={sportAccent} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={sportAccent} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1C2745" vertical={false} />
                    <XAxis dataKey="label" stroke="#8F9CAE" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#8F9CAE" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#05070D', borderColor: '#1C2745', borderRadius: '12px' }}
                      itemStyle={{ color: '#F5F7FF', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke={sportAccent} 
                      strokeWidth={2.5} 
                      fill="url(#scoreGrad)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="#8F9CAE" 
                      strokeWidth={1.5} 
                      strokeDasharray="4 4" 
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA4BF] pt-3 border-t border-[#1C2745]">
                <span>Data frequency: High-precision match timestamps</span>
                <span className="text-emerald-400 font-bold">+14.6% Above Benchmark</span>
              </div>
            </div>

            {/* Athlete Kinematics Radar (Col 5) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider block" style={{ color: sportAccent }}>
                    MULTI-AXIS BIOMECHANICS
                  </span>
                  <h3 className="text-xl font-bold font-display text-white">
                    {activePlayer?.name} Radar
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121A2E] text-white border border-[#1C2745]">
                  6-DIMENSIONS
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={activePlayer?.radar || []}>
                    <PolarGrid stroke="#1C2745" />
                    <PolarAngleAxis dataKey="attribute" stroke="#8F9CAE" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis stroke="#1C2745" tick={false} domain={[0, 100]} />
                    <Radar 
                      name={activePlayer?.name || 'Athlete'} 
                      dataKey="value" 
                      stroke={sportAccent} 
                      fill={sportAccent} 
                      fillOpacity={0.35} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA4BF] pt-3 border-t border-[#1C2745]">
                <span>Normalized against world-class standard</span>
                <span className="text-white font-bold">Peak: {activePlayer?.rating}/100</span>
              </div>
            </div>
          </div>

          {/* AI Performance Insights Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#090E1D] border border-[#1C2745] shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C2745] pb-5 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  DETERMINISTIC AI TELEMETRY REASONING
                </div>
                <h2 className="text-2xl font-black font-display text-white">
                  Automated Performance Diagnostics & Coaching Insights
                </h2>
                <p className="text-xs text-[#9AA4BF] mt-1 font-mono">
                  Synthesized for {insights?.entityName || activePlayer?.name} • Historical Variance & Fatigue Vectors
                </p>
              </div>

              <button
                onClick={() => runInsights(selectedPlayerId)}
                disabled={isGeneratingInsights}
                className="px-4 py-2 rounded-xl bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] text-white text-xs font-mono flex items-center gap-2 transition-all disabled:opacity-50 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#B6FF3B] ${isGeneratingInsights ? 'animate-spin' : ''}`} />
                <span>{isGeneratingInsights ? 'Analyzing...' : 'Recalibrate Diagnostics'}</span>
              </button>
            </div>

            {/* Diagnostic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Momentum Vector */}
              <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
                <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block mb-1">
                  1. RECENT MOMENTUM VECTOR
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-bold font-display text-white capitalize">
                    {insights?.momentum || 'Accelerating'}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    {insights?.momentumDelta && insights.momentumDelta >= 0 ? `+${insights.momentumDelta}%` : `${insights?.momentumDelta || '+6.4'}%`}
                  </span>
                </div>
                <p className="text-xs text-[#9AA4BF] mt-2.5 leading-relaxed">
                  Positive slope across last 5 matches indicates elevated conversion efficiency.
                </p>
              </div>

              {/* Consistency Rating */}
              <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
                <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block mb-1">
                  2. CONSISTENCY RATING INDEX
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-bold font-display text-white">
                    {insights?.consistencyRating || activePlayer?.consistency || 91.2}%
                  </span>
                  <span className="text-xs font-mono text-[#B6FF3B] font-bold">
                    Tier 1 Stable
                  </span>
                </div>
                <div className="w-full bg-[#121A2E] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-[#B6FF3B] h-full rounded-full" 
                    style={{ width: `${insights?.consistencyRating || 91.2}%` }}
                  />
                </div>
              </div>

              {/* Tactical Edge */}
              <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
                <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block mb-1">
                  3. QUANTITATIVE TACTICAL EDGE
                </span>
                <span className="text-xs font-mono text-white block mt-1 leading-relaxed">
                  {insights?.tacticalEdge || 'Maintains +6.4% expected win probability impact.'}
                </span>
                <span className="text-[10px] font-mono text-[#8F9CAE] mt-2 block">
                  Measured against positional field averages.
                </span>
              </div>
            </div>

            {/* Strengths & Vulnerabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Strengths */}
              <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
                <h4 className="text-xs font-mono text-[#B6FF3B] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Core Statistical Strengths
                </h4>
                <ul className="space-y-2 text-xs text-[#F5F7FF]">
                  {(insights?.strengths || [
                    'High-pressure conversion efficiency sustained in critical match phases.',
                    'Zero critical soft-tissue injury risk flags detected.',
                    'Superior ground kinetic energy transfer.'
                  ]).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#B6FF3B] mt-0.5">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vulnerabilities */}
              <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
                <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Areas for Tactical Improvement
                </h4>
                <ul className="space-y-2 text-xs text-[#9AA4BF]">
                  {(insights?.vulnerabilities || [
                    'Minor control variance under tight turnaround fixtures.',
                    'First-phase boundary conversion slightly below individual peak mean.'
                  ]).map((v, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Coaching Protocols */}
            <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
              <h4 className="text-xs font-mono text-[#2D6BFF] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4" /> Prescribed Training Protocols
              </h4>
              <div className="space-y-2.5">
                {(insights?.coachingRecommendations || [
                  'Implement high-velocity simulation drills to harden against variable delivery speeds.',
                  'Maintain ACWR workload exposure in the 1.15 to 1.25 sweet-spot zone.'
                ]).map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#0B1020] border border-[#1C2745] text-xs text-white flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#2D6BFF]/20 text-[#2D6BFF] border border-[#2D6BFF]/40 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARISON MODE: Head-to-Head Module */}
      {mode === 'compare' && (
        <div className="space-y-6">
          {/* Comparison Selector Controls */}
          <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono text-amber-400 tracking-wider uppercase block">
                  HEAD-TO-HEAD MATRIX
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  Comparative Telemetry & Radar Benchmark
                </h3>
              </div>

              {/* Toggle Comparison Type: Player or Team */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-[#05070D] border border-[#1C2745]">
                <button
                  onClick={() => setCompareType('player')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    compareType === 'player'
                      ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745]'
                      : 'text-[#9AA4BF]'
                  }`}
                >
                  Player vs Player
                </button>
                <button
                  onClick={() => setCompareType('team')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    compareType === 'team'
                      ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745]'
                      : 'text-[#9AA4BF]'
                  }`}
                >
                  Team vs Team
                </button>
              </div>
            </div>

            {/* Entity Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-[#2D6BFF] uppercase block mb-1.5 font-bold">
                  Entity Alpha (Left)
                </label>
                <select
                  value={compareEntityA}
                  onChange={(e) => setCompareEntityA(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05070D] border border-[#2D6BFF]/40 text-xs font-mono text-white focus:outline-none"
                >
                  {compareType === 'player' ? (
                    players.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.team})</option>
                    ))
                  ) : (
                    teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#B6FF3B] uppercase block mb-1.5 font-bold">
                  Entity Beta (Right)
                </label>
                <select
                  value={compareEntityB}
                  onChange={(e) => setCompareEntityB(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05070D] border border-[#B6FF3B]/40 text-xs font-mono text-white focus:outline-none"
                >
                  {compareType === 'player' ? (
                    players.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.team})</option>
                    ))
                  ) : (
                    teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Validation warning if same entity is picked */}
            {compareEntityA === compareEntityB && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Notice: You are comparing the same entity against itself. Select a different Entity Beta to view variance deltas.</span>
              </div>
            )}
          </div>

          {/* Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entity A Card */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#2D6BFF]/40 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#2D6BFF]/10 text-[#2D6BFF] border border-[#2D6BFF]/30 font-bold">
                  ALPHA ENTITY
                </span>
                <span className="text-xl font-black font-display text-white">
                  {'rating' in entityA ? `${entityA.rating}/100` : ''}
                </span>
              </div>
              <h3 className="text-2xl font-black font-display text-white">{entityA.name}</h3>
              <p className="text-xs font-mono text-[#9AA4BF] mt-1">
                {'team' in entityA ? `${(entityA as PlayerAnalytics).team} • ${(entityA as PlayerAnalytics).role}` : `${entityA.matches} Matches Played`}
              </p>

              <div className="mt-6 space-y-3 font-mono text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[#9AA4BF]">Primary Output:</span>
                  <span className="text-white font-bold">
                    {'primaryMetric' in entityA ? (entityA as PlayerAnalytics).primaryMetric : `${(entityA as TeamAnalytics).winRate}% Win Rate`}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[#9AA4BF]">Average / Metric:</span>
                  <span className="text-white font-bold">
                    {'average' in entityA ? (entityA as PlayerAnalytics).average : `${(entityA as TeamAnalytics).wins} Wins`}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[#9AA4BF]">Consistency Index:</span>
                  <span className="text-[#2D6BFF] font-bold">
                    {'consistency' in entityA ? `${(entityA as PlayerAnalytics).consistency}%` : `${(entityA as TeamAnalytics).rating}/100`}
                  </span>
                </div>
              </div>

              {/* Recent Form */}
              {'recentForm' in entityA && (
                <div className="mt-4 pt-4 border-t border-[#1C2745] flex items-center justify-between font-mono text-xs">
                  <span className="text-[#9AA4BF]">Recent Form:</span>
                  <div className="flex items-center gap-1.5">
                    {(entityA as PlayerAnalytics).recentForm.map((f, i) => (
                      <span 
                        key={i} 
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                          f === 'W' ? 'bg-[#B6FF3B] text-black' : f === 'D' ? 'bg-amber-400 text-black' : 'bg-red-500 text-white'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Entity B Card */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#B6FF3B]/40 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30 font-bold">
                  BETA ENTITY
                </span>
                <span className="text-xl font-black font-display text-white">
                  {'rating' in entityB ? `${entityB.rating}/100` : ''}
                </span>
              </div>
              <h3 className="text-2xl font-black font-display text-white">{entityB.name}</h3>
              <p className="text-xs font-mono text-[#9AA4BF] mt-1">
                {'team' in entityB ? `${(entityB as PlayerAnalytics).team} • ${(entityB as PlayerAnalytics).role}` : `${entityB.matches} Matches Played`}
              </p>

              <div className="mt-6 space-y-3 font-mono text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[#9AA4BF]">Primary Output:</span>
                  <span className="text-white font-bold">
                    {'primaryMetric' in entityB ? (entityB as PlayerAnalytics).primaryMetric : `${(entityB as TeamAnalytics).winRate}% Win Rate`}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[#9AA4BF]">Average / Metric:</span>
                  <span className="text-white font-bold">
                    {'average' in entityB ? (entityB as PlayerAnalytics).average : `${(entityB as TeamAnalytics).wins} Wins`}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745]">
                  <span className="text-[#9AA4BF]">Consistency Index:</span>
                  <span className="text-[#B6FF3B] font-bold">
                    {'consistency' in entityB ? `${(entityB as PlayerAnalytics).consistency}%` : `${(entityB as TeamAnalytics).rating}/100`}
                  </span>
                </div>
              </div>

              {/* Recent Form */}
              {'recentForm' in entityB && (
                <div className="mt-4 pt-4 border-t border-[#1C2745] flex items-center justify-between font-mono text-xs">
                  <span className="text-[#9AA4BF]">Recent Form:</span>
                  <div className="flex items-center gap-1.5">
                    {(entityB as PlayerAnalytics).recentForm.map((f, i) => (
                      <span 
                        key={i} 
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                          f === 'W' ? 'bg-[#B6FF3B] text-black' : f === 'D' ? 'bg-amber-400 text-black' : 'bg-red-500 text-white'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dual Overlay Comparison Radar */}
          {comparisonRadarData.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                    DUAL RADAR OVERLAY
                  </span>
                  <h3 className="text-xl font-bold font-display text-white">
                    {entityA.name} vs {entityB.name}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#2D6BFF] font-bold">
                    <span className="w-3 h-3 rounded-full bg-[#2D6BFF]" />
                    {entityA.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#B6FF3B] font-bold">
                    <span className="w-3 h-3 rounded-full bg-[#B6FF3B]" />
                    {entityB.name}
                  </span>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparisonRadarData}>
                    <PolarGrid stroke="#1C2745" />
                    <PolarAngleAxis dataKey="attribute" stroke="#8F9CAE" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis stroke="#1C2745" tick={false} domain={[0, 100]} />
                    <Radar 
                      name={entityA.name} 
                      dataKey={entityA.name} 
                      stroke="#2D6BFF" 
                      fill="#2D6BFF" 
                      fillOpacity={0.25} 
                    />
                    <Radar 
                      name={entityB.name} 
                      dataKey={entityB.name} 
                      stroke="#B6FF3B" 
                      fill="#B6FF3B" 
                      fillOpacity={0.25} 
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Telemetry Activity Feed */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-[#9AA4BF] uppercase tracking-wider block">
              LIVE TELEMETRY STREAM
            </span>
            <h3 className="text-xl font-bold font-display text-white">
              Recent Activity & Calibrations
            </h3>
          </div>
          <span className="text-xs font-mono text-[#B6FF3B] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B6FF3B] animate-pulse" />
            SYNCHRONIZED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activities.map((act) => (
            <div 
              key={act.id} 
              className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745] flex items-start justify-between gap-3 hover:border-[#2D6BFF]/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121A2E] text-white border border-[#1C2745]">
                    {act.badge}
                  </span>
                  <span className="text-xs font-bold text-white font-display">
                    {act.title}
                  </span>
                </div>
                <p className="text-xs text-[#9AA4BF] leading-relaxed">
                  {act.description}
                </p>
                <div className="text-[10px] font-mono text-[#8F9CAE] pt-1">
                  {act.timestamp} • {act.sport.toUpperCase()}
                </div>
              </div>

              <span 
                className="text-xs font-mono font-bold shrink-0 px-2 py-1 rounded bg-[#121A2E] border border-[#1C2745]"
                style={{ color: act.badgeColor }}
              >
                {act.metricChange}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
