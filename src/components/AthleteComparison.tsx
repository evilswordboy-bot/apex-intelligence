"use client";

import React, { useState } from 'react';
import { ATHLETE_COMPARISONS } from '@/data/sportsData';
import { 
  Users, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from 'recharts';

interface AthleteComparisonProps {
  initialSport?: 'cricket' | 'football' | 'olympics';
}

export default function AthleteComparison({ initialSport = 'cricket' }: AthleteComparisonProps) {
  const [selectedSport, setSelectedSport] = useState<'cricket' | 'football' | 'olympics'>(initialSport);
  const data = ATHLETE_COMPARISONS[selectedSport];

  const getAccentColor = (sport: string) => {
    switch (sport) {
      case 'cricket': return '#B6FF3B';
      case 'football': return '#2D6BFF';
      case 'olympics': return '#FF6B2C';
      default: return '#2D6BFF';
    }
  };

  const accent = getAccentColor(selectedSport);

  // Radar chart data preparation
  const radarData = data.athleteA.attributes.map((attr, idx) => ({
    attribute: attr.attribute,
    [data.athleteA.name]: attr.value,
    [data.athleteB.name]: data.athleteB.attributes[idx]?.value || 0,
  }));

  return (
    <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ backgroundColor: accent }}
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#121A2E] border border-[#1C2745] text-white/90 mb-2">
            <Users className="w-3.5 h-3.5" style={{ color: accent }} />
            <span>ATHLETE TELEMETRY BENCHMARK</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              DEMO DATA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-[#F5F7FF]">
            Head-to-Head Athlete Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA4BF] mt-0.5">
            {data.categoryTitle}
          </p>
        </div>

        {/* Sport switcher pills */}
        <div className="inline-flex p-1 rounded-xl bg-[#05070D] border border-[#1C2745] self-start sm:self-auto">
          {(['cricket', 'football', 'olympics'] as const).map((sport) => {
            const isActive = selectedSport === sport;
            const sportColor = getAccentColor(sport);
            return (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all capitalize ${
                  isActive
                    ? 'bg-[#121A2E] text-white shadow-sm border border-[#1C2745]'
                    : 'text-[#9AA4BF] hover:text-white'
                }`}
                style={isActive ? { borderColor: sportColor, color: sportColor } : {}}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* Athlete Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Athlete A */}
        <div className="p-4 rounded-xl bg-[#121A2E] border border-[#1C2745] flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-black text-base shadow-md"
              style={{ backgroundColor: accent }}
            >
              {data.athleteA.avatarInitials}
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block">
                {data.athleteA.team}
              </span>
              <h3 className="text-lg font-bold font-display text-[#F5F7FF]">
                {data.athleteA.name}
              </h3>
              <span className="text-xs font-mono" style={{ color: accent }}>
                {data.athleteA.primaryMetricLabel}: {data.athleteA.primaryMetricValue}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#9AA4BF] block">Form Index</span>
            <span className="text-2xl font-black font-display text-white">
              {data.athleteA.formScore}
            </span>
          </div>
        </div>

        {/* Athlete B */}
        <div className="p-4 rounded-xl bg-[#121A2E] border border-[#1C2745] flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1C2745] border border-[#2D6BFF]/40 flex items-center justify-center font-display font-black text-white text-base shadow-md">
              {data.athleteB.avatarInitials}
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block">
                {data.athleteB.team}
              </span>
              <h3 className="text-lg font-bold font-display text-[#F5F7FF]">
                {data.athleteB.name}
              </h3>
              <span className="text-xs font-mono text-[#9AA4BF]">
                {data.athleteB.primaryMetricLabel}: {data.athleteB.primaryMetricValue}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#9AA4BF] block">Form Index</span>
            <span className="text-2xl font-black font-display text-white/90">
              {data.athleteB.formScore}
            </span>
          </div>
        </div>
      </div>

      {/* Main Comparison Section: Radar + Telemetry Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart */}
        <div className="lg:col-span-7 h-72 sm:h-80 w-full rounded-xl bg-[#05070D] border border-[#1C2745] p-2 flex flex-col justify-center">
          <span className="text-[10px] font-mono text-[#9AA4BF] px-3 pt-2 uppercase">
            Multilateral Biomechanical Radar (0-100)
          </span>
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#1C2745" />
                <PolarAngleAxis 
                  dataKey="attribute" 
                  tick={{ fill: '#9AA4BF', fontSize: 11 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[60, 100]} 
                  tick={{ fill: '#4F5D73', fontSize: 9 }} 
                />
                <Radar
                  name={data.athleteA.name}
                  dataKey={data.athleteA.name}
                  stroke={accent}
                  fill={accent}
                  fillOpacity={0.4}
                />
                <Radar
                  name={data.athleteB.name}
                  dataKey={data.athleteB.name}
                  stroke="#8F9CAE"
                  fill="#8F9CAE"
                  fillOpacity={0.25}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B1020', 
                    borderColor: '#1C2745', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '11px' 
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Telemetry Differentials Side Panel */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#9AA4BF] px-1">
            <span>KEY TELEMETRY METRIC</span>
            <span>DIFFERENTIAL DELTA</span>
          </div>

          {data.athleteA.telemetryStats.map((stat, i) => {
            const statB = data.athleteB.telemetryStats[i];
            return (
              <div 
                key={stat.label} 
                className="p-3 rounded-xl bg-[#121A2E] border border-[#1C2745] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="text-[11px] font-mono text-[#9AA4BF] block">
                    {stat.label}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-white font-mono">{stat.value}</span>
                    <span className="text-[#9AA4BF] text-[10px]">vs</span>
                    <span className="text-[#9AA4BF] font-mono">{statB?.value || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#05070D] border border-[#1C2745] font-mono text-xs">
                  {stat.positive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#B6FF3B]" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className={stat.positive ? 'text-[#B6FF3B]' : 'text-amber-400'}>
                    {stat.diff}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
