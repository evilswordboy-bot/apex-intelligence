"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Brain,
  ShieldAlert,
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Sliders,
  BarChart3,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Layers,
  Activity,
  Flame,
  Scale
} from 'lucide-react';
import {
  UpcomingMatchPredictionItem,
  MatchPredictionResponse,
  ModelEvaluationResponse,
  PredictionHistoryItem
} from '@/types/predictions';
import {
  fetchUpcomingPredictions,
  fetchCustomPrediction,
  fetchModelMetrics,
  fetchPredictionHistory
} from '@/lib/predictionsApi';

export default function PredictionsLab() {
  const [activeSportFilter, setActiveSportFilter] = useState<'all' | 'cricket' | 'football'>('all');
  const [activeTab, setActiveTab] = useState<'fixtures' | 'simulator' | 'metrics' | 'history'>('fixtures');
  
  // Data state
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatchPredictionItem[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<UpcomingMatchPredictionItem | null>(null);
  const [modelMetrics, setModelMetrics] = useState<ModelEvaluationResponse | null>(null);
  const [historyItems, setHistoryItems] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Scenario Simulator State
  const [simSport, setSimSport] = useState<'cricket' | 'football'>('cricket');
  const [simHomeTeam, setSimHomeTeam] = useState('Mumbai Indians');
  const [simAwayTeam, setSimAwayTeam] = useState('Chennai Super Kings');
  const [simVenue, setSimVenue] = useState('Wankhede Stadium, Mumbai');
  const [simAvailHome, setSimAvailHome] = useState(1.0);
  const [simAvailAway, setSimAvailAway] = useState(0.9);
  const [simTossWinner, setSimTossWinner] = useState('Mumbai Indians');
  const [simTossDecision, setSimTossDecision] = useState<'field' | 'bat'>('field');
  const [customResult, setCustomResult] = useState<MatchPredictionResponse | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  // Load initial predictions & metrics
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [matches, metrics, history] = await Promise.all([
        fetchUpcomingPredictions(activeSportFilter),
        fetchModelMetrics(),
        fetchPredictionHistory()
      ]);
      setUpcomingMatches(matches);
      if (matches.length > 0) {
        setSelectedMatch(matches[0]);
      }
      setModelMetrics(metrics);
      setHistoryItems(history);
      setLoading(false);
    }
    loadData();
  }, [activeSportFilter]);

  // Handle Scenario Simulator Run
  const handleRunSimulation = async () => {
    setSimLoading(true);
    const res = await fetchCustomPrediction({
      sport: simSport,
      team_home: simHomeTeam,
      team_away: simAwayTeam,
      venue: simVenue,
      toss_winner: simTossWinner,
      toss_decision: simTossDecision,
      player_availability_home: simAvailHome,
      player_availability_away: simAvailAway
    });
    setCustomResult(res);
    setSimLoading(false);
  };

  const filteredMatches = upcomingMatches.filter((m) =>
    activeSportFilter === 'all' ? true : m.sport === activeSportFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B6FF3B]/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#2D6BFF]/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Brain className="w-3.5 h-3.5 animate-pulse" />
                PHASE 7 ENGINE ACTIVE
              </span>
              <span className="text-xs font-mono text-[#9AA4BF] bg-[#121A2E] px-2.5 py-1 rounded-full border border-[#1C2745]">
                Calibrated Probabilities • Time-Aware Split
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide">
              AI Sports Prediction Engine
            </h1>
            <p className="text-sm text-[#9AA4BF] mt-1 max-w-2xl">
              Probabilistic outcome forecasting powered by time-aware statistical classifiers, rolling team form, and venue scoring factors across Cricket and Football.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#121A2E] border border-[#1C2745] self-start lg:self-auto">
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                activeTab === 'fixtures'
                  ? 'bg-[#2D6BFF] text-white shadow-lg shadow-[#2D6BFF]/25 font-bold'
                  : 'text-[#9AA4BF] hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Match Predictions
            </button>
            <button
              onClick={() => {
                setActiveTab('simulator');
                if (!customResult) handleRunSimulation();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                activeTab === 'simulator'
                  ? 'bg-[#B6FF3B] text-black shadow-lg shadow-[#B6FF3B]/20 font-bold'
                  : 'text-[#9AA4BF] hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Scenario Simulator
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                activeTab === 'metrics'
                  ? 'bg-purple-600 text-white shadow-lg font-bold'
                  : 'text-[#9AA4BF] hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Model Performance
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-[#1C2745] text-white shadow-lg font-bold'
                  : 'text-[#9AA4BF] hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Audit History
            </button>
          </div>
        </div>
      </div>

      {/* Ethical & Probabilistic Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-[#121A2E]/60 border border-[#1C2745] flex items-center gap-3 text-xs text-[#9AA4BF]">
        <Info className="w-4 h-4 text-[#2D6BFF] shrink-0" />
        <p>
          <strong className="text-white">Probabilistic Notice:</strong> APEX estimates outcome probabilities based on historical regularities and team metrics. Confidence is never certainty; athletic contests feature non-deterministic events, injuries, and in-game tactical variance. Not designed for gambling or financial speculation.
        </p>
      </div>

      {/* SUB-VIEW 1: MATCH PREDICTIONS */}
      {activeTab === 'fixtures' && (
        <div className="space-y-6">
          {/* Sport Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#9AA4BF]">DISCIPLINE:</span>
              {(['all', 'cricket', 'football'] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => setActiveSportFilter(sp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-all ${
                    activeSportFilter === sp
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#121A2E] text-[#9AA4BF] hover:text-white border border-[#1C2745]'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-[#9AA4BF]">
              {filteredMatches.length} UPCOMING FIXTURES ANALYZED
            </span>
          </div>

          {/* Main 2-Column Grid: Match Selector Cards (Left) & Deep Dive Prediction (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Match Fixture Selector Cards */}
            <div className="lg:col-span-5 space-y-3.5">
              {loading ? (
                <div className="p-12 text-center text-[#9AA4BF] font-mono text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2D6BFF]" />
                  Calibrating upcoming fixtures...
                </div>
              ) : filteredMatches.length === 0 ? (
                <div className="p-12 text-center text-[#9AA4BF] font-mono text-xs border border-[#1C2745] rounded-2xl bg-[#0B1020]">
                  No upcoming matches match the selected discipline filter.
                </div>
              ) : (
                filteredMatches.map((item) => {
                  const isSelected = selectedMatch?.id === item.id;
                  const isCricket = item.sport === 'cricket';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMatch(item)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                        isSelected
                          ? 'bg-[#121A2E] border-[#2D6BFF] shadow-xl shadow-[#2D6BFF]/10'
                          : 'bg-[#0B1020] border-[#1C2745] hover:border-[#2D6BFF]/50'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#2D6BFF]" />
                      )}

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#9AA4BF] mb-2.5">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCricket ? 'bg-[#B6FF3B]' : 'bg-[#2D6BFF]'
                            }`}
                          />
                          {item.league}
                        </span>
                        <span>{item.match_date}</span>
                      </div>

                      {/* Teams & Logos */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{item.team_home_logo}</span>
                            {item.team_home}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">
                            {item.probabilities.p_home}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{item.team_away_logo}</span>
                            {item.team_away}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">
                            {item.probabilities.p_away}%
                          </span>
                        </div>
                        {item.probabilities.p_draw !== null && item.probabilities.p_draw !== undefined && (
                          <div className="flex items-center justify-between text-[#9AA4BF]">
                            <span className="text-xs font-mono">Draw Probability</span>
                            <span className="font-mono text-xs">
                              {item.probabilities.p_draw}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick Prob Bar Preview */}
                      <div className="h-1.5 w-full bg-[#1C2745] rounded-full overflow-hidden flex mb-2.5">
                        <div
                          style={{ width: `${item.probabilities.p_home}%` }}
                          className={`h-full ${isCricket ? 'bg-[#B6FF3B]' : 'bg-[#2D6BFF]'}`}
                        />
                        {item.probabilities.p_draw && (
                          <div
                            style={{ width: `${item.probabilities.p_draw}%` }}
                            className="h-full bg-amber-400"
                          />
                        )}
                        <div
                          style={{ width: `${item.probabilities.p_away}%` }}
                          className="h-full bg-[#FF6B2C]"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA4BF]">
                        <span>Expected: {item.expected_score.score_range_label}</span>
                        <span className="text-white font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Deep-Dive Match Prediction Details */}
            <div className="lg:col-span-7">
              {selectedMatch ? (
                <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] space-y-6">
                  {/* Match Header */}
                  <div className="border-b border-[#1C2745] pb-5">
                    <div className="flex items-center justify-between text-xs font-mono text-[#9AA4BF] mb-2">
                      <span className="uppercase text-[#2D6BFF] font-bold">
                        {selectedMatch.league}
                      </span>
                      <span>{selectedMatch.match_date} • {selectedMatch.venue}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="text-left">
                        <h2 className="text-xl sm:text-2xl font-display font-black text-white flex items-center gap-2">
                          <span>{selectedMatch.team_home_logo}</span>
                          {selectedMatch.team_home}
                        </h2>
                        <span className="text-xs font-mono text-[#9AA4BF]">Home Ground Advantage</span>
                      </div>
                      <div className="px-3 py-1 rounded-xl bg-[#121A2E] border border-[#1C2745] text-center shrink-0">
                        <span className="text-[10px] font-mono text-[#9AA4BF] block">VS</span>
                        <span className="text-xs font-mono text-purple-400 font-bold">
                          {selectedMatch.confidence_level}
                        </span>
                      </div>
                      <div className="text-right">
                        <h2 className="text-xl sm:text-2xl font-display font-black text-white flex items-center gap-2 justify-end">
                          {selectedMatch.team_away}
                          <span>{selectedMatch.team_away_logo}</span>
                        </h2>
                        <span className="text-xs font-mono text-[#9AA4BF]">Visiting Contender</span>
                      </div>
                    </div>
                  </div>

                  {/* Calibrated Outcome Probability Bar */}
                  <div className="p-5 rounded-2xl bg-[#121A2E] border border-[#1C2745] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#9AA4BF] flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-[#B6FF3B]" />
                        CALIBRATED OUTCOME PROBABILITIES
                      </span>
                      <span className="text-xs font-mono text-white font-bold">
                        Most Likely: <span className="text-[#B6FF3B]">{selectedMatch.probabilities.most_likely_outcome}</span>
                      </span>
                    </div>

                    {/* Progress Bar Split */}
                    <div className="h-6 w-full rounded-xl bg-[#0B1020] p-1 flex gap-1 overflow-hidden border border-[#1C2745]">
                      <div
                        style={{ width: `${selectedMatch.probabilities.p_home}%` }}
                        className={`h-full rounded-lg transition-all flex items-center justify-start px-2 text-[10px] font-mono font-bold text-black ${
                          selectedMatch.sport === 'cricket' ? 'bg-[#B6FF3B]' : 'bg-[#2D6BFF] text-white'
                        }`}
                      >
                        {selectedMatch.probabilities.p_home >= 15 && `${selectedMatch.probabilities.p_home}%`}
                      </div>

                      {selectedMatch.probabilities.p_draw !== null && selectedMatch.probabilities.p_draw !== undefined && (
                        <div
                          style={{ width: `${selectedMatch.probabilities.p_draw}%` }}
                          className="h-full rounded-lg bg-amber-400 text-black transition-all flex items-center justify-center text-[10px] font-mono font-bold"
                        >
                          {selectedMatch.probabilities.p_draw >= 12 && `${selectedMatch.probabilities.p_draw}%`}
                        </div>
                      )}

                      <div
                        style={{ width: `${selectedMatch.probabilities.p_away}%` }}
                        className="h-full rounded-lg bg-[#FF6B2C] text-black transition-all flex items-center justify-end px-2 text-[10px] font-mono font-bold"
                      >
                        {selectedMatch.probabilities.p_away >= 15 && `${selectedMatch.probabilities.p_away}%`}
                      </div>
                    </div>

                    {/* Labels Legend */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-white">
                        <span className={`w-2 h-2 rounded-full ${selectedMatch.sport === 'cricket' ? 'bg-[#B6FF3B]' : 'bg-[#2D6BFF]'}`} />
                        {selectedMatch.team_home}: {selectedMatch.probabilities.p_home}%
                      </span>

                      {selectedMatch.probabilities.p_draw !== null && selectedMatch.probabilities.p_draw !== undefined && (
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          Draw: {selectedMatch.probabilities.p_draw}%
                        </span>
                      )}

                      <span className="flex items-center gap-1.5 text-[#FF6B2C]">
                        <span className="w-2 h-2 rounded-full bg-[#FF6B2C]" />
                        {selectedMatch.team_away}: {selectedMatch.probabilities.p_away}%
                      </span>
                    </div>
                  </div>

                  {/* Expected Score & Metrics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                      <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">
                        EXPECTED SCORING REGRESSION
                      </span>
                      <div className="text-xl font-bold font-display text-white">
                        {selectedMatch.expected_score.score_range_label}
                      </div>
                      <p className="text-xs text-[#9AA4BF] mt-1">
                        Based on venue historical distributions & attack/defense index.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                      <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">
                        HEAD-TO-HEAD HISTORICAL RECORD
                      </span>
                      <div className="text-xl font-bold font-display text-white">
                        {selectedMatch.h2h.home_wins}W - {selectedMatch.h2h.draws > 0 ? `${selectedMatch.h2h.draws}D - ` : ''}{selectedMatch.h2h.away_wins}L
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 font-mono text-xs text-[#9AA4BF]">
                        <span>Last 5:</span>
                        {selectedMatch.h2h.last_5_results.map((res, i) => (
                          <span
                            key={i}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              res === 'W'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : res === 'D'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Influencing Factors (Explainability) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#B6FF3B]" />
                        Key Influencing Factors & Model Attribution
                      </h3>
                      <span className="text-[11px] font-mono text-[#9AA4BF]">
                        Associations • Not Causes
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {selectedMatch.key_factors.map((factor, idx) => {
                        const isPositive = factor.direction === 'positive';
                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-[#121A2E] border border-[#1C2745] flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              {isPositive ? (
                                <ArrowUpRight className="w-4 h-4 text-[#B6FF3B] shrink-0" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-[#FF6B2C] shrink-0" />
                              )}
                              <div>
                                <span className="font-bold text-white block">
                                  {factor.name}
                                </span>
                                <span className="text-[11px] font-mono text-[#9AA4BF]">
                                  {factor.impact_label}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${
                                isPositive
                                  ? 'bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30'
                                  : 'bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/30'
                              }`}
                            >
                              {factor.impact_percent > 0 ? `+${factor.impact_percent}%` : `${factor.impact_percent}%`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Form Pill Comparisons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1C2745]">
                    <div>
                      <span className="text-xs font-mono text-[#9AA4BF] block mb-2">
                        {selectedMatch.team_home} Recent Form (Past 5):
                      </span>
                      <div className="flex items-center gap-1.5">
                        {selectedMatch.form_home.last_5.map((res, i) => (
                          <span
                            key={i}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                              res === 'W'
                                ? 'bg-[#B6FF3B]/20 text-[#B6FF3B] border border-[#B6FF3B]/40'
                                : res === 'D'
                                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                        <span className="text-xs font-mono text-white ml-2">
                          {selectedMatch.form_home.form_points} pts
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-mono text-[#9AA4BF] block mb-2">
                        {selectedMatch.team_away} Recent Form (Past 5):
                      </span>
                      <div className="flex items-center gap-1.5">
                        {selectedMatch.form_away.last_5.map((res, i) => (
                          <span
                            key={i}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                              res === 'W'
                                ? 'bg-[#B6FF3B]/20 text-[#B6FF3B] border border-[#B6FF3B]/40'
                                : res === 'D'
                                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                        <span className="text-xs font-mono text-white ml-2">
                          {selectedMatch.form_away.form_points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-[#9AA4BF] font-mono text-xs border border-[#1C2745] rounded-3xl bg-[#0B1020]">
                  Select a match on the left to inspect calibrated probabilities.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: SCENARIO SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#B6FF3B]" />
                Tactical Scenario Sandbox
              </h2>
              <p className="text-xs text-[#9AA4BF] mt-1">
                Modify team availability, venue conditions, and toss decisions to observe real-time model re-calibration.
              </p>
            </div>

            {/* Sport Selector */}
            <div>
              <label className="text-xs font-mono text-[#9AA4BF] block mb-1.5">DISCIPLINE</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSimSport('cricket');
                    setSimHomeTeam('Mumbai Indians');
                    setSimAwayTeam('Chennai Super Kings');
                    setSimVenue('Wankhede Stadium, Mumbai');
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    simSport === 'cricket'
                      ? 'bg-[#B6FF3B] text-black shadow-lg shadow-[#B6FF3B]/20'
                      : 'bg-[#121A2E] text-[#9AA4BF] border border-[#1C2745]'
                  }`}
                >
                  Cricket (T20 Chase)
                </button>
                <button
                  onClick={() => {
                    setSimSport('football');
                    setSimHomeTeam('Manchester City');
                    setSimAwayTeam('Real Madrid');
                    setSimVenue('Etihad Stadium');
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    simSport === 'football'
                      ? 'bg-[#2D6BFF] text-white shadow-lg shadow-[#2D6BFF]/20'
                      : 'bg-[#121A2E] text-[#9AA4BF] border border-[#1C2745]'
                  }`}
                >
                  Football (3-Way)
                </button>
              </div>
            </div>

            {/* Team Selection */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[#9AA4BF] block mb-1">HOME / HOST SQUAD</label>
                <input
                  type="text"
                  value={simHomeTeam}
                  onChange={(e) => setSimHomeTeam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                  placeholder="e.g. Mumbai Indians, Arsenal, etc."
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#9AA4BF] block mb-1">AWAY / VISITOR SQUAD</label>
                <input
                  type="text"
                  value={simAwayTeam}
                  onChange={(e) => setSimAwayTeam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                  placeholder="e.g. Chennai Super Kings, Liverpool, etc."
                />
              </div>
            </div>

            {/* Squad Availability Sliders */}
            <div className="space-y-4 pt-2 border-t border-[#1C2745]">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#9AA4BF]">{simHomeTeam} Squad Fitness:</span>
                  <span className="text-[#B6FF3B] font-bold">{Math.round(simAvailHome * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={simAvailHome}
                  onChange={(e) => setSimAvailHome(parseFloat(e.target.value))}
                  className="w-full accent-[#B6FF3B] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#9AA4BF]">{simAwayTeam} Squad Fitness:</span>
                  <span className="text-[#FF6B2C] font-bold">{Math.round(simAvailAway * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={simAvailAway}
                  onChange={(e) => setSimAvailAway(parseFloat(e.target.value))}
                  className="w-full accent-[#FF6B2C] cursor-pointer"
                />
              </div>
            </div>

            {/* Run Simulation CTA */}
            <button
              onClick={handleRunSimulation}
              disabled={simLoading}
              className="w-full py-3.5 rounded-xl text-xs font-mono font-bold bg-[#2D6BFF] hover:bg-[#2558d6] text-white shadow-lg shadow-[#2D6BFF]/25 transition-all flex items-center justify-center gap-2"
            >
              {simLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating Calibrated Probabilities...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Simulate Calibrated Outcome
                </>
              )}
            </button>
          </div>

          {/* Simulation Output Column */}
          <div className="lg:col-span-7">
            {customResult ? (
              <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] space-y-6">
                {/* Sufficiency Status Check */}
                {customResult.data_sufficiency === 'insufficient_data' ? (
                  <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      INSUFFICIENT HISTORICAL DATA DETECTED
                    </div>
                    <p className="text-xs leading-relaxed">
                      {customResult.sufficiency_message}
                    </p>
                    <div className="p-3 rounded-xl bg-[#0B1020]/60 border border-amber-500/20 text-[11px] font-mono">
                      APEX Model Policy: Fabricated predictions or uncalibrated guesses are strictly blocked. Please select teams from validated historical competition datasets (e.g. Mumbai Indians, Chennai Super Kings, Manchester City, Arsenal, etc.).
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-[#1C2745] pb-4">
                      <div>
                        <span className="text-xs font-mono text-[#9AA4BF] uppercase">
                          SCENARIO RESULT • {customResult.sport}
                        </span>
                        <h2 className="text-2xl font-display font-black text-white mt-1">
                          {customResult.matchup}
                        </h2>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold">
                        {customResult.confidence_level}
                      </span>
                    </div>

                    {/* Calibrated Probability Output Bar */}
                    <div className="p-5 rounded-2xl bg-[#121A2E] border border-[#1C2745] space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#9AA4BF]">PREDICTED PROBABILITIES</span>
                        <span className="text-[#B6FF3B] font-bold">
                          Favored: {customResult.probabilities.most_likely_outcome}
                        </span>
                      </div>

                      <div className="h-6 w-full rounded-xl bg-[#0B1020] p-1 flex gap-1 overflow-hidden border border-[#1C2745]">
                        <div
                          style={{ width: `${customResult.probabilities.p_home}%` }}
                          className={`h-full rounded-lg transition-all flex items-center px-2 text-[10px] font-mono font-bold text-black ${
                            customResult.sport === 'cricket' ? 'bg-[#B6FF3B]' : 'bg-[#2D6BFF] text-white'
                          }`}
                        >
                          {customResult.probabilities.p_home}%
                        </div>

                        {customResult.probabilities.p_draw !== null && customResult.probabilities.p_draw !== undefined && (
                          <div
                            style={{ width: `${customResult.probabilities.p_draw}%` }}
                            className="h-full rounded-lg bg-amber-400 text-black transition-all flex items-center justify-center text-[10px] font-mono font-bold"
                          >
                            {customResult.probabilities.p_draw}%
                          </div>
                        )}

                        <div
                          style={{ width: `${customResult.probabilities.p_away}%` }}
                          className="h-full rounded-lg bg-[#FF6B2C] text-black transition-all flex items-center justify-end px-2 text-[10px] font-mono font-bold"
                        >
                          {customResult.probabilities.p_away}%
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold">
                          Home: {customResult.probabilities.p_home}%
                        </span>
                        {customResult.probabilities.p_draw !== null && customResult.probabilities.p_draw !== undefined && (
                          <span className="text-amber-400 font-bold">
                            Draw: {customResult.probabilities.p_draw}%
                          </span>
                        )}
                        <span className="text-[#FF6B2C] font-bold">
                          Away: {customResult.probabilities.p_away}%
                        </span>
                      </div>
                    </div>

                    {/* Expected Score Range */}
                    <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                      <span className="text-xs font-mono text-[#9AA4BF] block mb-1">
                        REGRESSED SCORE PROJECTION
                      </span>
                      <div className="text-xl font-bold font-display text-white">
                        {customResult.expected_score.score_range_label}
                      </div>
                    </div>

                    {/* Influencing Attribution Chips */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono text-[#9AA4BF] uppercase">
                        SCENARIO ATTRIBUTION FACTORS
                      </h4>
                      {customResult.key_factors.map((f, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-[#121A2E] border border-[#1C2745] flex items-center justify-between text-xs"
                        >
                          <span className="text-white font-bold">{f.name}</span>
                          <span
                            className={`font-mono font-bold ${
                              f.direction === 'positive' ? 'text-[#B6FF3B]' : 'text-[#FF6B2C]'
                            }`}
                          >
                            {f.impact_label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Assumptions & Limitations Note */}
                    <div className="p-4 rounded-xl bg-[#121A2E]/40 border border-[#1C2745] text-xs text-[#9AA4BF] space-y-1.5">
                      <span className="text-white font-bold block">Model Assumptions:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        {customResult.model_assumptions.map((asm, i) => (
                          <li key={i}>{asm}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-[#9AA4BF] font-mono text-xs border border-[#1C2745] rounded-3xl bg-[#0B1020]">
                Configure parameters and click "Simulate Calibrated Outcome".
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: MODEL PERFORMANCE & CALIBRATION */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C2745] pb-5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Model Validation & Benchmark Transparency
                </h2>
                <p className="text-xs text-[#9AA4BF] mt-1">
                  Comparing naive baseline prior models against regularized calibrated ML classifiers under strict chronological time splits.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#9AA4BF]">
                <span className="px-3 py-1 rounded-xl bg-[#121A2E] border border-[#1C2745]">
                  Framework: {modelMetrics?.framework || 'scikit-learn 1.9.0'}
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#121A2E] border border-[#1C2745] text-[#B6FF3B]">
                  Platt Sigmoid Calibrated
                </span>
              </div>
            </div>

            {/* Cricket Model Metrics Card */}
            {modelMetrics?.models.cricket && (
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-[#B6FF3B] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B6FF3B]" />
                  CRICKET PREDICTION MODEL (IPL Historical Split 2021-2024 Train / 2025 Test)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                    <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">LOG LOSS (CROSS-ENTROPY)</span>
                    <div className="text-2xl font-bold font-mono text-white">
                      {modelMetrics.models.cricket.calibrated_metrics.log_loss}
                    </div>
                    <span className="text-xs font-mono text-emerald-400 mt-1 block">
                      vs Baseline {modelMetrics.models.cricket.baseline_metrics.log_loss} (-{modelMetrics.models.cricket.log_loss_reduction_percent}%)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                    <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">BRIER SCORE (CALIBRATION)</span>
                    <div className="text-2xl font-bold font-mono text-white">
                      {modelMetrics.models.cricket.calibrated_metrics.brier_score}
                    </div>
                    <span className="text-xs font-mono text-emerald-400 mt-1 block">
                      vs Baseline {modelMetrics.models.cricket.baseline_metrics.brier_score} (-{modelMetrics.models.cricket.brier_score_reduction_percent}%)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                    <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">VALIDATION ACCURACY</span>
                    <div className="text-2xl font-bold font-mono text-white">
                      {modelMetrics.models.cricket.calibrated_metrics.accuracy_percent}%
                    </div>
                    <span className="text-xs font-mono text-[#9AA4BF] mt-1 block">
                      vs Naive Prior {modelMetrics.models.cricket.baseline_metrics.accuracy_percent}%
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                    <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">CALIBRATION ERROR (ECE)</span>
                    <div className="text-2xl font-bold font-mono text-[#B6FF3B]">
                      {modelMetrics.models.cricket.calibrated_metrics.expected_calibration_error}
                    </div>
                    <span className="text-xs font-mono text-[#9AA4BF] mt-1 block">
                      Score MAE: ±{modelMetrics.models.cricket.calibrated_metrics.score_mae_runs || 11.8} runs
                    </span>
                  </div>
                </div>

                {/* Feature Importance List */}
                <div className="p-5 rounded-2xl bg-[#121A2E] border border-[#1C2745] space-y-3">
                  <span className="text-xs font-mono text-[#9AA4BF] block">
                    CRICKET MODEL FEATURE IMPORTANCES & WEIGHTS:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    {modelMetrics.models.cricket.feature_importance.map((f, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#0B1020] border border-[#1C2745] flex justify-between items-center">
                        <span className="text-[#9AA4BF]">{f.feature}</span>
                        <span className="text-white font-bold">{f.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Football Model Metrics Card */}
            {modelMetrics?.models.football && (
              <div className="space-y-4 pt-4 border-t border-[#1C2745]">
                <h3 className="text-sm font-mono text-[#2D6BFF] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2D6BFF]" />
                  FOOTBALL 3-WAY MODEL (Premier League 2021-2024 Train / 2024-25 Test)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                    <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">MULTINOMIAL LOG LOSS</span>
                    <div className="text-2xl font-bold font-mono text-white">
                      {modelMetrics.models.football.calibrated_metrics.log_loss}
                    </div>
                    <span className="text-xs font-mono text-emerald-400 mt-1 block">
                      vs Baseline {modelMetrics.models.football.baseline_metrics.log_loss} (-{modelMetrics.models.football.log_loss_reduction_percent}%)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                    <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">MULTI-CLASS BRIER SCORE</span>
                    <div className="text-2xl font-bold font-mono text-white">
                      {modelMetrics.models.football.calibrated_metrics.brier_score}
                    </div>
                    <span className="text-xs font-mono text-emerald-400 mt-1 block">
                      vs Baseline {modelMetrics.models.football.baseline_metrics.brier_score} (-{modelMetrics.models.football.brier_score_reduction_percent}%)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745]">
                    <span className="text-[11px] font-mono text-[#9AA4BF] block mb-1">3-WAY ACCURACY</span>
                    <div className="text-2xl font-bold font-mono text-white">
                      {modelMetrics.models.football.calibrated_metrics.accuracy_percent}%
                    </div>
                    <span className="text-xs font-mono text-[#9AA4BF] mt-1 block">
                      Supports Home Win, Draw, and Away Win
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PREDICTION AUDIT HISTORY */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] space-y-5">
          <div className="flex items-center justify-between border-b border-[#1C2745] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2D6BFF]" />
                Historical Prediction Audit & Verification
              </h2>
              <p className="text-xs text-[#9AA4BF] mt-1">
                Transparent verification of previous AI predictions against confirmed final match results.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              Validated On-Chain Track Record
            </span>
          </div>

          <div className="space-y-3">
            {historyItems.map((hist) => {
              const isCorrect = hist.status === 'CORRECT';
              return (
                <div
                  key={hist.id}
                  className="p-4 rounded-2xl bg-[#121A2E] border border-[#1C2745] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#9AA4BF]">{hist.date}</span>
                      <span className="text-[#2D6BFF] uppercase">• {hist.sport}</span>
                    </div>
                    <div className="text-sm font-bold text-white font-display">
                      {hist.matchup}
                    </div>
                    <div className="text-[#9AA4BF] text-[11px]">
                      Result: <span className="text-white">{hist.actual_scoreline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <span className="text-[11px] text-[#9AA4BF] block">Predicted Winner:</span>
                      <span className="text-white font-bold">{hist.predicted_winner} ({hist.predicted_probability}%)</span>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold ${
                        isCorrect
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          CORRECT
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          INCORRECT
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
