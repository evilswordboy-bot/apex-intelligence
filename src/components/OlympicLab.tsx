"use client";

import React, { useState, useEffect } from 'react';
import { OLYMPIC_DEMO_DATA } from '@/data/sportsData';
import { 
  Award, Flame, Gauge, CheckCircle2, AlertTriangle, Search, 
  Sparkles, Bot, Filter, BarChart3, Users, Scale, Download, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { 
  fetchOlympicOverview, 
  fetchOlympicMedals, 
  fetchOlympicAthletes, 
  fetchOlympicGender, 
  submitOlympicNLQ,
  OlympicOverview,
  OlympicMedalItem,
  OlympicAthleteItem,
  OlympicNLQResult
} from '@/lib/olympicApi';

export default function OlympicLab() {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'kinematics'>('intelligence');
  const [selectedAthlete, setSelectedAthlete] = useState(OLYMPIC_DEMO_DATA[0]);

  // Olympic Intelligence State
  const [overview, setOverview] = useState<OlympicOverview | null>(null);
  const [medals, setMedals] = useState<OlympicMedalItem[]>([]);
  const [medalSort, setMedalSort] = useState<'gold' | 'total' | 'weighted_score'>('gold');
  const [medalSearch, setMedalSearch] = useState('');
  
  // Athlete Search State
  const [athleteQuery, setAthleteQuery] = useState('');
  const [athletesList, setAthletesList] = useState<OlympicAthleteItem[]>([]);
  const [athletesTotal, setAthletesTotal] = useState(11085);
  
  // NLQ Engine State
  const [nlqInput, setNlqInput] = useState('Who won the most medals?');
  const [nlqLoading, setNlqLoading] = useState(false);
  const [nlqResult, setNlqResult] = useState<OlympicNLQResult | null>(null);

  useEffect(() => {
    // Initial data fetch
    fetchOlympicOverview()
      .then(setOverview)
      .catch(() => {});

    fetchOlympicMedals(medalSort, medalSearch)
      .then(res => setMedals(res.items))
      .catch(() => {});

    fetchOlympicAthletes('', '', '', 1, 10)
      .then(res => {
        setAthletesList(res.items);
        setAthletesTotal(res.pagination.total);
      })
      .catch(() => {});
  }, []);

  const handleMedalSort = (sortBy: 'gold' | 'total' | 'weighted_score') => {
    setMedalSort(sortBy);
    fetchOlympicMedals(sortBy, medalSearch)
      .then(res => setMedals(res.items))
      .catch(() => {});
  };

  const handleMedalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOlympicMedals(medalSort, medalSearch)
      .then(res => setMedals(res.items))
      .catch(() => {});
  };

  const handleAthleteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOlympicAthletes(athleteQuery, '', '', 1, 10)
      .then(res => {
        setAthletesList(res.items);
        setAthletesTotal(res.pagination.total);
      })
      .catch(() => {});
  };

  const handleNLQSubmit = (customQuery?: string) => {
    const q = customQuery || nlqInput;
    if (!q.trim()) return;
    setNlqLoading(true);
    if (customQuery) setNlqInput(customQuery);

    submitOlympicNLQ(q)
      .then(res => {
        setNlqResult(res);
        setNlqLoading(false);
      })
      .catch(err => {
        setNlqLoading(false);
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Mode Tabs */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Cinematic Anime Olympic Track Sprinter Visual Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/olympics/apex_anime_olympics.jpg"
            alt="Anime Olympic Track"
            className="w-full h-full object-cover object-right opacity-35 mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/30 mb-2">
            <Award className="w-3.5 h-3.5" />
            OLYMPIC INTELLIGENCE ENGINE & BIOMECHANICS
          </div>
          <h2 className="text-2xl font-black font-display text-white">Tokyo 2020 Validated Olympic Analytics</h2>
          <p className="text-sm text-[#8F9CAE] mt-1">
            Certified data models covering 11,085 athletes, 206 nations, 46 disciplines, and 1,080 official medals.
          </p>
        </div>

        {/* View Switcher */}
        <div className="relative z-10 flex items-center gap-2 p-1.5 rounded-xl bg-[#05070D] border border-[#1C2745]">
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'intelligence'
                ? 'bg-[#FF6B2C] text-white shadow-lg shadow-[#FF6B2C]/20'
                : 'text-[#8F9CAE] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Olympic Intelligence
          </button>
          <button
            onClick={() => setActiveTab('kinematics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'kinematics'
                ? 'bg-[#FF6B2C] text-white shadow-lg shadow-[#FF6B2C]/20'
                : 'text-[#8F9CAE] hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            Kinematics Lab
          </button>
        </div>
      </div>

      {activeTab === 'intelligence' ? (
        <div className="space-y-6">
          {/* Global Census KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1C2745]">
              <span className="text-xs text-[#8F9CAE] flex items-center gap-1.5 mb-1 font-mono">
                <Users className="w-3.5 h-3.5 text-[#2D6BFF]" /> ATHLETES
              </span>
              <div className="text-2xl font-black font-mono text-white">
                {overview ? overview.total_athletes.toLocaleString() : '11,085'}
              </div>
              <span className="text-[11px] text-[#8F9CAE] block mt-1">206 Global Delegations</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1C2745]">
              <span className="text-xs text-[#8F9CAE] flex items-center gap-1.5 mb-1 font-mono">
                <Award className="w-3.5 h-3.5 text-[#FFB800]" /> MEDALS
              </span>
              <div className="text-2xl font-black font-mono text-[#FFB800]">
                {overview ? overview.total_medals.toLocaleString() : '1,080'}
              </div>
              <span className="text-[11px] text-[#8F9CAE] block mt-1">340 Gold • 338 Silver</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1C2745]">
              <span className="text-xs text-[#8F9CAE] flex items-center gap-1.5 mb-1 font-mono">
                <Scale className="w-3.5 h-3.5 text-[#B6FF3B]" /> GENDER PARITY
              </span>
              <div className="text-2xl font-black font-mono text-[#B6FF3B]">
                {overview ? `${overview.overall_female_percent}%` : '48.0%'}
              </div>
              <span className="text-[11px] text-[#8F9CAE] block mt-1">Female Representation</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1C2745]">
              <span className="text-xs text-[#8F9CAE] flex items-center gap-1.5 mb-1 font-mono">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" /> DISCIPLINES
              </span>
              <div className="text-2xl font-black font-mono text-white">46</div>
              <span className="text-[11px] text-[#8F9CAE] block mt-1">743 Teams • 394 Coaches</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1C2745] col-span-2 md:col-span-1">
              <span className="text-xs text-[#8F9CAE] flex items-center gap-1.5 mb-1 font-mono">
                <Flame className="w-3.5 h-3.5 text-[#FF6B2C]" /> TOP NATION
              </span>
              <div className="text-lg font-black text-white truncate">USA (39 Gold)</div>
              <span className="text-[11px] text-[#FF6B2C] block mt-1">113 Total Medals</span>
            </div>
          </div>

          {/* Natural Language Query Console */}
          <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 flex items-center justify-center text-[#FF6B2C]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">Olympic Natural Language Analytics</h3>
                  <p className="text-xs text-[#8F9CAE]">Ask questions in plain English to query official Olympic records.</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                Deterministic Certified Data
              </span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNLQSubmit(); }} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8F9CAE]" />
                <input
                  type="text"
                  value={nlqInput}
                  onChange={(e) => setNlqInput(e.target.value)}
                  placeholder="Ask e.g. 'Compare USA and China' or 'Female ratio in Archery'..."
                  className="w-full bg-[#05070D] border border-[#1C2745] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5A6785] focus:outline-none focus:border-[#FF6B2C]"
                />
              </div>
              <button
                type="submit"
                disabled={nlqLoading}
                className="px-5 py-2.5 bg-[#FF6B2C] hover:bg-[#ff5710] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {nlqLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Analyze
              </button>
            </form>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-[#8F9CAE] py-1 font-mono">Suggested:</span>
              {[
                "Who won the most medals?",
                "Compare USA and China in the Olympics",
                "What is the female participation ratio in Archery?",
                "How many medals did India win?",
                "Tell me about Noah Lyles",
                "Which country is most efficient at winning medals?"
              ].map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleNLQSubmit(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-[#121A2E] hover:bg-[#1C2745] text-slate-300 hover:text-white border border-[#1C2745] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* NLQ Result Display */}
            {nlqResult && (
              <div className="mt-4 p-5 rounded-xl bg-[#05070D] border border-[#1C2745] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#8F9CAE] border-b border-[#1C2745] pb-2">
                  <span className="text-[#FF6B2C] font-semibold">Intent: {nlqResult.detected_intent}</span>
                  <span>Executed in {nlqResult.execution_time_ms} ms</span>
                </div>

                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                  {nlqResult.answer_markdown}
                </div>

                {nlqResult.chart && nlqResult.chart.data && (
                  <div className="mt-4 pt-4 border-t border-[#1C2745]">
                    <span className="text-xs font-mono text-slate-400 block mb-2">{nlqResult.chart.title}</span>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={nlqResult.chart.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1C2745" />
                          <XAxis dataKey={nlqResult.chart.x_axis_key || 'name'} stroke="#8F9CAE" fontSize={11} />
                          <YAxis stroke="#8F9CAE" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1C2745', borderRadius: '8px' }} />
                          {nlqResult.chart.data_keys.map((key, idx) => (
                            <Bar key={key} dataKey={key} fill={idx === 0 ? '#FF6B2C' : idx === 1 ? '#2D6BFF' : '#B6FF3B'} radius={[4, 4, 0, 0]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Official Medal Table & Athlete Directory Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Medal Table (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Official Tokyo 2020 Medal Table</h3>
                  <p className="text-xs text-[#8F9CAE]">Ranked by IOC gold priority or total medal haul.</p>
                </div>

                {/* Sort controls */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#05070D] border border-[#1C2745] text-xs font-mono">
                  <button
                    onClick={() => handleMedalSort('gold')}
                    className={`px-2.5 py-1 rounded ${medalSort === 'gold' ? 'bg-[#FF6B2C] text-white font-bold' : 'text-[#8F9CAE]'}`}
                  >
                    Gold
                  </button>
                  <button
                    onClick={() => handleMedalSort('total')}
                    className={`px-2.5 py-1 rounded ${medalSort === 'total' ? 'bg-[#FF6B2C] text-white font-bold' : 'text-[#8F9CAE]'}`}
                  >
                    Total
                  </button>
                  <button
                    onClick={() => handleMedalSort('weighted_score')}
                    className={`px-2.5 py-1 rounded ${medalSort === 'weighted_score' ? 'bg-[#FF6B2C] text-white font-bold' : 'text-[#8F9CAE]'}`}
                  >
                    Weighted
                  </button>
                </div>
              </div>

              {/* Country Filter Input */}
              <form onSubmit={handleMedalSearch} className="flex gap-2">
                <input
                  type="text"
                  value={medalSearch}
                  onChange={(e) => setMedalSearch(e.target.value)}
                  placeholder="Filter by country (e.g. 'United States', 'India', 'Japan')..."
                  className="w-full bg-[#05070D] border border-[#1C2745] rounded-xl px-3 py-2 text-xs text-white placeholder-[#5A6785]"
                />
                <button type="submit" className="px-3 py-2 bg-[#121A2E] hover:bg-[#1C2745] text-white text-xs rounded-xl border border-[#1C2745]">
                  Filter
                </button>
              </form>

              {/* Table */}
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#05070D] text-[#8F9CAE] sticky top-0 border-b border-[#1C2745]">
                    <tr>
                      <th className="py-2.5 px-3">Rank</th>
                      <th className="py-2.5 px-3 font-sans">Nation (NOC)</th>
                      <th className="py-2.5 px-3 text-center text-[#FFB800]">🥇 G</th>
                      <th className="py-2.5 px-3 text-center text-slate-300">🥈 S</th>
                      <th className="py-2.5 px-3 text-center text-amber-600">🥉 B</th>
                      <th className="py-2.5 px-3 text-center font-bold text-white">Total</th>
                      <th className="py-2.5 px-3 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C2745]/60">
                    {medals.map((m) => (
                      <tr key={m.noc} className="hover:bg-[#121A2E]/50 transition-colors">
                        <td className="py-2 px-3 text-slate-400">#{m.rank}</td>
                        <td className="py-2 px-3 font-sans font-medium text-white">{m.noc}</td>
                        <td className="py-2 px-3 text-center font-bold text-[#FFB800]">{m.gold}</td>
                        <td className="py-2 px-3 text-center text-slate-300">{m.silver}</td>
                        <td className="py-2 px-3 text-center text-amber-500">{m.bronze}</td>
                        <td className="py-2 px-3 text-center font-bold text-white">{m.total}</td>
                        <td className="py-2 px-3 text-right text-[#FF6B2C]">{m.weighted_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Athlete Census Roster Search (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Olympic Athletes Roster</h3>
                    <p className="text-xs text-[#8F9CAE]">Browse 11,085 competitors across 46 disciplines.</p>
                  </div>
                  <span className="text-xs font-mono text-[#8F9CAE]">{athletesTotal} entries</span>
                </div>

                <form onSubmit={handleAthleteSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={athleteQuery}
                    onChange={(e) => setAthleteQuery(e.target.value)}
                    placeholder="Search athlete, nation, or sport..."
                    className="w-full bg-[#05070D] border border-[#1C2745] rounded-xl px-3 py-2 text-xs text-white placeholder-[#5A6785]"
                  />
                  <button type="submit" className="px-3 py-2 bg-[#FF6B2C] text-white text-xs rounded-xl font-bold">
                    Search
                  </button>
                </form>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {athletesList.map((a) => (
                    <div key={a.id} className="p-3 rounded-xl bg-[#05070D] border border-[#1C2745] flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{a.name}</div>
                        <div className="text-xs text-[#8F9CAE]">{a.noc}</div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#121A2E] text-slate-300 border border-[#1C2745]">
                        {a.discipline}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Export Button */}
              <div className="pt-4 border-t border-[#1C2745] flex items-center justify-between">
                <span className="text-xs text-[#8F9CAE] font-mono">Download Raw Datasets:</span>
                <div className="flex gap-2">
                  <a
                    href="http://127.0.0.1:8000/api/v1/olympics/export/csv?dataset=medals"
                    target="_blank"
                    className="px-2.5 py-1.5 rounded-lg bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <Download className="w-3 h-3 text-[#FF6B2C]" />
                    Medals CSV
                  </a>
                  <a
                    href="http://127.0.0.1:8000/api/v1/olympics/export/csv?dataset=athletes"
                    target="_blank"
                    className="px-2.5 py-1.5 rounded-lg bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <Download className="w-3 h-3 text-[#B6FF3B]" />
                    Athletes CSV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Kinematics Tab (Original Sprint Motion Capture View) */
        <div className="space-y-6">
          {/* Athlete selector buttons */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0B1020] border border-[#1C2745] w-fit">
            {OLYMPIC_DEMO_DATA.map((athlete) => (
              <button
                key={athlete.athleteId}
                onClick={() => setSelectedAthlete(athlete)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedAthlete.athleteId === athlete.athleteId
                    ? 'bg-[#FF6B2C] text-white shadow-md'
                    : 'text-[#8F9CAE] hover:text-white'
                }`}
              >
                {athlete.name} ({athlete.discipline})
              </button>
            ))}
          </div>

          {/* Athlete Overview & Benchmark Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {selectedAthlete.metrics.map((metric, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0B1020] border border-[#1C2745]">
                <div className="flex items-center justify-between text-xs text-[#8F9CAE] mb-1">
                  <span>{metric.label}</span>
                  {metric.status === 'optimal' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B6FF3B]" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  )}
                </div>
                <div className="text-2xl font-black font-display text-white">{metric.value}</div>
                <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-2 border-t border-[#1C2745]">
                  <span className="text-[#8F9CAE]">Benchmark: {metric.benchmark}</span>
                  <span className={metric.status === 'optimal' ? 'text-[#B6FF3B]' : 'text-yellow-400'}>
                    {metric.variance}
                  </span>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between">
              <span className="text-xs text-[#8F9CAE]">Records & Country</span>
              <div>
                <span className="text-lg font-bold text-white block">{selectedAthlete.country}</span>
                <span className="text-xs font-mono text-[#FF6B2C]">PB: {selectedAthlete.pb} | SB: {selectedAthlete.sb}</span>
              </div>
            </div>
          </div>

          {/* Biomechanical Velocity & Force Curve Chart */}
          <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Acceleration & Kinetic Force Curve</h3>
                <p className="text-xs text-[#8F9CAE]">Telemetry tracked across standard distance intervals.</p>
              </div>
              <span className="text-xs font-mono text-[#FF6B2C] bg-[#FF6B2C]/10 px-2.5 py-1 rounded border border-[#FF6B2C]/20">
                120 FPS Sensor Sync
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedAthlete.telemetryPoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1C2745" />
                  <XAxis dataKey="distance" stroke="#8F9CAE" fontSize={12} unit="m" />
                  <YAxis yAxisId="left" stroke="#FF6B2C" fontSize={12} unit=" km/h" />
                  <YAxis yAxisId="right" orientation="right" stroke="#2D6BFF" fontSize={12} unit=" N" />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1C2745', borderRadius: '8px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#FF6B2C" strokeWidth={2.5} name="Speed (km/h)" />
                  <Line yAxisId="right" type="monotone" dataKey="force" stroke="#2D6BFF" strokeWidth={2.5} name="Ground Force (N)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
