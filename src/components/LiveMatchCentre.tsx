"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Radio,
  Calendar,
  CheckCircle2,
  Trophy,
  RefreshCw,
  Search,
  Filter,
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Tv,
  X,
  ChevronRight,
  Zap,
  TrendingUp,
  BarChart3,
  Layers
} from 'lucide-react';

import {
  LiveMatchSummary,
  LiveMatchDetail,
  StandingsRow,
  ProviderStatus,
  LiveSportType,
  MatchStatusTab
} from '@/types/live';

import {
  fetchLiveMatches,
  fetchLiveMatchDetail,
  fetchStandings,
  fetchProviderStatus
} from '@/lib/liveApi';

export default function LiveMatchCentre() {
  // State
  const [activeTab, setActiveTab] = useState<MatchStatusTab>('live');
  const [sportFilter, setSportFilter] = useState<LiveSportType>('all');
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data
  const [matches, setMatches] = useState<LiveMatchSummary[]>([]);
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [selectedMatchDetail, setSelectedMatchDetail] = useState<LiveMatchDetail | null>(null);

  // Loading & Polling
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(15);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [errorState, setErrorState] = useState<string | null>(null);

  // Fetch Provider Status on mount
  useEffect(() => {
    fetchProviderStatus().then(setProviderStatus).catch(console.warn);
  }, []);

  // Main Data Fetcher
  const loadMatches = useCallback(async () => {
    try {
      setErrorState(null);
      const data = await fetchLiveMatches(
        sportFilter, 
        activeTab === 'standings' ? 'all' : activeTab, 
        leagueFilter
      );
      setMatches(data);
      setLastUpdated(new Date());
      setRefreshCountdown(15);
    } catch (err: any) {
      setErrorState('Unable to reach live sports feed. Reconnecting...');
    } finally {
      setIsLoading(false);
    }
  }, [sportFilter, activeTab, leagueFilter]);

  // Load Standings if tab is 'standings'
  const loadStandings = useCallback(async () => {
    try {
      const sport = sportFilter === 'football' ? 'football' : 'cricket';
      const data = await fetchStandings(sport, leagueFilter !== 'all' ? leagueFilter : undefined);
      setStandings(data);
    } catch (err) {
      console.warn('Standings loading error:', err);
    }
  }, [sportFilter, leagueFilter]);

  // Effect to load data on tab/filter change
  useEffect(() => {
    setIsLoading(true);
    if (activeTab === 'standings') {
      loadStandings().finally(() => setIsLoading(false));
    } else {
      loadMatches();
    }
  }, [activeTab, sportFilter, leagueFilter, loadMatches, loadStandings]);

  // Polling Interval (every 15s if autoRefresh is enabled)
  useEffect(() => {
    if (!autoRefresh || activeTab === 'standings') return;

    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          loadMatches();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, activeTab, loadMatches]);

  // Load Match Detail
  const handleOpenDetail = async (matchId: string) => {
    setIsDetailLoading(true);
    try {
      const detail = await fetchLiveMatchDetail(matchId);
      setSelectedMatchDetail(detail);
    } catch (err) {
      console.warn('Detail error:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Filtered Matches based on search
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.teamHome.name.toLowerCase().includes(q) ||
        m.teamAway.name.toLowerCase().includes(q) ||
        m.league.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q)
      );
    });
  }, [matches, searchQuery]);

  // Count Live Matches
  const liveCount = useMemo(() => {
    return matches.filter(m => m.status === 'LIVE').length;
  }, [matches]);

  return (
    <div className="space-y-6">
      {/* Top Provider Ribbon & Polling Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#05070D] border border-[#1C2745]">
            <span className={`w-2 h-2 rounded-full ${providerStatus?.isConnected ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            <span className="text-white font-bold">{providerStatus?.providerName || 'Sports Provider Relay'}</span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            providerStatus?.isLiveFeed
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {providerStatus?.isLiveFeed ? 'EXTERNAL LIVE API' : 'CALIBRATED LOCAL RELAY (DEMO)'}
          </span>

          <span className="text-[#8F9CAE] hidden lg:inline">
            Ping: {providerStatus?.responseTimeMs || 14}ms • Rate Quota: {providerStatus?.rateLimitRemaining || 9999}
          </span>
        </div>

        {/* Polling & Manual Refresh */}
        <div className="flex items-center gap-3 text-xs font-mono self-start md:self-auto">
          <label className="flex items-center gap-2 cursor-pointer text-[#8F9CAE] hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded bg-[#05070D] border-[#1C2745] text-[#2D6BFF] focus:ring-0"
            />
            <span>Auto-Poll {autoRefresh ? `(${refreshCountdown}s)` : 'Off'}</span>
          </label>

          <button
            onClick={() => {
              setIsLoading(true);
              if (activeTab === 'standings') loadStandings().finally(() => setIsLoading(false));
              else loadMatches();
            }}
            className="p-2 rounded-xl bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] text-white transition-all flex items-center gap-1.5"
            title="Manual Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2D6BFF] ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1C2745] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-red-400 tracking-wider uppercase">
                LIVE MATCH CENTRE • REAL-TIME FIXTURE & TELEMETRY STREAM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121A2E] text-white border border-[#1C2745]">
                PHASE 6 ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Global Sports Match Centre
            </h1>
            <p className="text-xs sm:text-sm text-[#9AA4BF] mt-1 max-w-2xl">
              Live scores, ball-by-ball chase probabilities, tactical lineups, and official standings across Cricket and Football.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[#05070D] border border-[#1C2745] text-center font-mono">
              <span className="text-[10px] text-[#8F9CAE] block uppercase">Live Events</span>
              <span className="text-lg font-bold text-red-400">{liveCount} In Progress</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#05070D] border border-[#1C2745] text-center font-mono">
              <span className="text-[10px] text-[#8F9CAE] block uppercase">Last Synced</span>
              <span className="text-xs font-bold text-white">{lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* State Tabs & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#05070D] border border-[#1C2745] overflow-x-auto">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'live'
                  ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745] shadow'
                  : 'text-[#8F9CAE] hover:text-white'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${activeTab === 'live' ? 'text-red-500 animate-pulse' : 'text-[#8F9CAE]'}`} />
              <span>Live Matches</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-red-500/20 text-red-400 font-bold">
                {liveCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('scheduled')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'scheduled'
                  ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745] shadow'
                  : 'text-[#8F9CAE] hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#2D6BFF]" />
              <span>Upcoming</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745] shadow'
                  : 'text-[#8F9CAE] hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Results</span>
            </button>

            <button
              onClick={() => setActiveTab('standings')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'standings'
                  ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745] shadow'
                  : 'text-[#8F9CAE] hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Standings</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Sport Dropdown */}
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
            >
              <option value="all">All Disciplines</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
            </select>

            {/* League Dropdown */}
            <select
              value={leagueFilter}
              onChange={(e) => setLeagueFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
            >
              <option value="all">All Competitions</option>
              <option value="ICC World Championship">ICC World Championship</option>
              <option value="Indian Premier League">Indian Premier League</option>
              <option value="UEFA Champions League">UEFA Champions League</option>
              <option value="Premier League">English Premier League</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none sm:w-48">
              <Search className="w-3.5 h-3.5 text-[#8F9CAE] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search team or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs font-mono text-white placeholder-[#8F9CAE] focus:outline-none focus:border-[#2D6BFF]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorState && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorState}</span>
          </div>
          <button
            onClick={loadMatches}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-4 animate-pulse">
              <div className="h-4 bg-[#121A2E] rounded w-1/3" />
              <div className="h-8 bg-[#121A2E] rounded w-3/4" />
              <div className="h-16 bg-[#05070D] rounded" />
              <div className="h-4 bg-[#121A2E] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* MATCHES VIEW (Live, Scheduled, Completed) */}
      {!isLoading && activeTab !== 'standings' && (
        <>
          {filteredMatches.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-2xl bg-[#0B1020] border border-[#1C2745] text-center space-y-4 max-w-lg mx-auto">
              <Radio className="w-10 h-10 text-[#8F9CAE] mx-auto opacity-40" />
              <h3 className="text-lg font-bold font-display text-white">No Matches Found</h3>
              <p className="text-xs font-mono text-[#8F9CAE]">
                There are currently no {activeTab} fixtures matching your selected sport or competition filter.
              </p>
              <button
                onClick={() => {
                  setSportFilter('all');
                  setLeagueFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] text-xs font-mono text-white transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Match Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((m) => {
                const isLive = m.status === 'LIVE';

                return (
                  <div
                    key={m.id}
                    className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] hover:border-[#2D6BFF]/60 transition-all flex flex-col justify-between shadow-xl group relative overflow-hidden"
                  >
                    {/* Top Meta Header */}
                    <div>
                      <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                        <span className="text-[#8F9CAE] truncate max-w-[180px]">{m.league}</span>
                        <div className="flex items-center gap-1.5">
                          {isLive ? (
                            <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 font-bold flex items-center gap-1 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              LIVE
                            </span>
                          ) : m.status === 'COMPLETED' ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#121A2E] text-emerald-400 border border-[#1C2745] font-bold">
                              FT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-[#121A2E] text-[#8F9CAE] border border-[#1C2745]">
                              {m.matchTime}
                            </span>
                          )}

                          {m.isDemo && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              DEMO
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Teams & Scores Block */}
                      <div className="space-y-3.5 my-4">
                        {/* Home Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{m.teamHome.logo}</span>
                            <div>
                              <span className="text-sm font-bold font-display text-white block">
                                {m.teamHome.name}
                              </span>
                              {m.teamHome.secondaryScore && (
                                <span className="text-[10px] font-mono text-[#8F9CAE] block">
                                  {m.teamHome.secondaryScore}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-base sm:text-lg font-black font-mono text-white">
                            {m.teamHome.score || '—'}
                          </span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{m.teamAway.logo}</span>
                            <div>
                              <span className="text-sm font-bold font-display text-white block">
                                {m.teamAway.name}
                              </span>
                              {m.teamAway.secondaryScore && (
                                <span className="text-[10px] font-mono text-[#8F9CAE] block">
                                  {m.teamAway.secondaryScore}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-base sm:text-lg font-black font-mono text-white">
                            {m.teamAway.score || '—'}
                          </span>
                        </div>
                      </div>

                      {/* Status Detail Summary */}
                      <div className="p-2.5 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs font-mono text-white/90 mb-4 flex items-center justify-between">
                        <span className="truncate">{m.statusDetail}</span>
                        {m.currentOverOrMinute && (
                          <span className="text-[#B6FF3B] font-bold shrink-0 ml-2">
                            {m.currentOverOrMinute}
                          </span>
                        )}
                      </div>

                      {/* Live Win Probability Gauge (if available) */}
                      {isLive && m.winProbabilityHome !== undefined && m.winProbabilityAway !== undefined && (
                        <div className="mb-4 space-y-1.5 font-mono text-[10px]">
                          <div className="flex justify-between text-[#8F9CAE]">
                            <span>Win Probability:</span>
                            <span className="text-white font-bold">
                              {m.teamHome.shortName} {m.winProbabilityHome}% - {m.teamAway.shortName} {m.winProbabilityAway}%
                            </span>
                          </div>
                          <div className="w-full bg-[#05070D] h-1.5 rounded-full overflow-hidden flex">
                            <div className="bg-[#2D6BFF] h-full" style={{ width: `${m.winProbabilityHome}%` }} />
                            <div className="bg-[#B6FF3B] h-full" style={{ width: `${m.winProbabilityAway}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-[#1C2745] flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-[#8F9CAE] text-[10px] truncate max-w-[150px]">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{m.venue.split(',')[0]}</span>
                      </div>

                      <button
                        onClick={() => handleOpenDetail(m.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] text-white flex items-center gap-1.5 transition-colors group-hover:border-[#2D6BFF]/40 text-xs font-semibold"
                      >
                        <span>Telemetry</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#2D6BFF] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* STANDINGS VIEW */}
      {!isLoading && activeTab === 'standings' && (
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] shadow-xl overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                OFFICIAL COMPETITION LADDER
              </span>
              <h3 className="text-xl font-bold font-display text-white">
                {sportFilter === 'football' ? 'English Premier League Table' : 'Indian Premier League Standings'}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8F9CAE]">Season 2026</span>
          </div>

          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1C2745] text-[#8F9CAE] text-[10px] uppercase">
                <th className="py-3 px-2">Pos</th>
                <th className="py-3 px-4">Club / Franchise</th>
                <th className="py-3 px-2 text-center">P</th>
                <th className="py-3 px-2 text-center">W</th>
                <th className="py-3 px-2 text-center">D</th>
                <th className="py-3 px-2 text-center">L</th>
                <th className="py-3 px-2 text-center">{sportFilter === 'football' ? 'GD' : 'NRR'}</th>
                <th className="py-3 px-3 text-center font-bold text-white">Pts</th>
                <th className="py-3 px-3 text-center">Form (Last 5)</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr 
                  key={row.rank} 
                  className="border-b border-[#1C2745]/60 hover:bg-[#121A2E]/50 transition-colors"
                >
                  <td className="py-3.5 px-2 font-bold text-white">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      row.rank <= 4 ? 'bg-[#2D6BFF]/20 text-[#2D6BFF] border border-[#2D6BFF]/40' : 'text-[#8F9CAE]'
                    }`}>
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white font-display text-sm">
                    {row.teamName}
                  </td>
                  <td className="py-3.5 px-2 text-center text-[#8F9CAE]">{row.played}</td>
                  <td className="py-3.5 px-2 text-center text-emerald-400 font-bold">{row.won}</td>
                  <td className="py-3.5 px-2 text-center text-[#8F9CAE]">{row.drawn}</td>
                  <td className="py-3.5 px-2 text-center text-red-400">{row.lost}</td>
                  <td className="py-3.5 px-2 text-center text-white">{row.difference}</td>
                  <td className="py-3.5 px-3 text-center font-black text-white text-sm bg-[#121A2E]/40">
                    {row.points}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.map((f, i) => (
                        <span 
                          key={i} 
                          className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                            f === 'W' ? 'bg-[#B6FF3B] text-black' : f === 'D' ? 'bg-amber-400 text-black' : 'bg-red-500 text-white'
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MATCH DETAIL MODAL DIALOG */}
      {selectedMatchDetail && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedMatchDetail(null)}
        >
          <div 
            className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-[#090E1D] border border-[#1C2745] p-6 shadow-2xl overflow-y-auto space-y-6 relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1C2745] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#8F9CAE] uppercase block mb-1">
                  {selectedMatchDetail.summary.league} • {selectedMatchDetail.summary.venue}
                </span>
                <h2 className="text-xl font-black font-display">
                  {selectedMatchDetail.summary.teamHome.name} vs {selectedMatchDetail.summary.teamAway.name}
                </h2>
                <p className="text-xs font-mono text-[#B6FF3B] mt-1">
                  {selectedMatchDetail.commentaryHeadline}
                </p>
              </div>

              <button
                onClick={() => setSelectedMatchDetail(null)}
                className="p-1.5 rounded-lg bg-[#121A2E] text-[#8F9CAE] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scoreboard Overview */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
              <div className="border-r border-[#1C2745] pr-2">
                <span className="text-xs font-mono text-[#8F9CAE] block">{selectedMatchDetail.summary.teamHome.name}</span>
                <span className="text-2xl font-black font-mono text-white block mt-1">
                  {selectedMatchDetail.summary.teamHome.score || '0'}
                </span>
                <span className="text-[10px] font-mono text-[#8F9CAE]">
                  {selectedMatchDetail.summary.teamHome.secondaryScore || ''}
                </span>
              </div>

              <div className="pl-2">
                <span className="text-xs font-mono text-[#8F9CAE] block">{selectedMatchDetail.summary.teamAway.name}</span>
                <span className="text-2xl font-black font-mono text-white block mt-1">
                  {selectedMatchDetail.summary.teamAway.score || '0'}
                </span>
                <span className="text-[10px] font-mono text-[#8F9CAE]">
                  {selectedMatchDetail.summary.teamAway.secondaryScore || ''}
                </span>
              </div>
            </div>

            {/* Live Telemetry Sensors */}
            <div>
              <h3 className="text-xs font-mono text-[#2D6BFF] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Live Match Telemetry Sensors
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                {Object.entries(selectedMatchDetail.telemetryMetrics).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745]">
                    <span className="text-[9px] text-[#8F9CAE] uppercase block truncate">{k.replace(/_/g, ' ')}</span>
                    <span className="text-xs font-bold text-white block mt-0.5 truncate">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Timeline Events */}
            <div>
              <h3 className="text-xs font-mono text-[#B6FF3B] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Key Match Timeline
              </h3>
              <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto pr-1">
                {selectedMatchDetail.events.map((ev, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#121A2E] text-[10px] font-bold text-white shrink-0">
                        {ev.time}
                      </span>
                      <span className="text-xs text-white leading-tight">{ev.description}</span>
                    </div>
                    {ev.scoreAfter && (
                      <span className="text-[10px] font-bold text-[#B6FF3B] shrink-0">
                        {ev.scoreAfter}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Lineups / Standout Performers */}
            <div>
              <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Standout Player Ratings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                {selectedMatchDetail.lineupHome.concat(selectedMatchDetail.lineupAway).slice(0, 4).map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#05070D] border border-[#1C2745] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-[#8F9CAE] block">{p.primaryMetric} • {p.secondaryMetric}</span>
                    </div>
                    <span className="text-xs font-black text-[#B6FF3B] px-2 py-1 rounded bg-[#121A2E]">
                      {p.rating}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedMatchDetail(null)}
                className="w-full py-2.5 rounded-xl bg-[#121A2E] hover:bg-[#1C2745] text-white font-mono text-xs font-semibold transition-colors"
              >
                Close Telemetry Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
