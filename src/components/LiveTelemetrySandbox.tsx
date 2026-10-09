"use client";

import React, { useState } from 'react';
import { 
  Activity, 
  Crosshair, 
  Award, 
  Zap, 
  RotateCcw, 
  TrendingUp, 
  Gauge, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function LiveTelemetrySandbox() {
  const [sport, setSport] = useState<'cricket' | 'football' | 'olympics'>('cricket');
  const [intensity, setIntensity] = useState<number>(85);
  const [reps, setReps] = useState<number>(12);

  // Dynamic telemetry metrics computed based on user controls
  const telemetryData = {
    cricket: {
      accent: '#B6FF3B',
      primaryLabel: 'Release Velocity',
      primaryValue: `${(132 + (intensity * 0.16)).toFixed(1)} km/h`,
      secondaryLabel: 'Revolutions (RPM)',
      secondaryValue: `${Math.round(2100 + (intensity * 6.5))} RPM`,
      tertiaryLabel: 'Seam Deviation',
      tertiaryValue: `${(2.1 + (intensity * 0.02)).toFixed(1)}°`,
      graphName: 'Release Trajectory Kinetic Curve',
      chart: [
        { frame: 'T-0.4s', val: 40 + intensity * 0.2 },
        { frame: 'T-0.3s', val: 65 + intensity * 0.3 },
        { frame: 'T-0.2s', val: 95 + intensity * 0.5 },
        { frame: 'T-0.1s', val: 125 + intensity * 0.7 },
        { frame: 'Impact', val: 140 + intensity * 0.9 },
        { frame: 'Pitch', val: 120 + intensity * 0.6 },
      ]
    },
    football: {
      accent: '#2D6BFF',
      primaryLabel: 'Expected Goal (xG)',
      primaryValue: `${((intensity / 100) * 0.85).toFixed(2)} xG`,
      secondaryLabel: 'Shot Velocity',
      secondaryValue: `${(90 + (intensity * 0.35)).toFixed(1)} km/h`,
      secondaryLabel2: 'Goalkeeper Reaction Delta',
      secondaryValue2: `${Math.max(0.12, (0.55 - (intensity * 0.0035))).toFixed(3)}s`,
      graphName: 'Curvature Aerodynamic Trajectory',
      chart: [
        { frame: 'Strike', val: 95 + intensity * 0.2 },
        { frame: '10m', val: 110 + intensity * 0.3 },
        { frame: '20m', val: 105 + intensity * 0.25 },
        { frame: 'Curvature', val: 90 + intensity * 0.2 },
        { frame: 'Goal Line', val: 82 + intensity * 0.15 },
        { frame: 'Net', val: 50 + intensity * 0.1 },
      ]
    },
    olympics: {
      accent: '#FF6B2C',
      primaryLabel: 'Horizontal Velocity',
      primaryValue: `${(36 + (intensity * 0.088)).toFixed(2)} km/h`,
      secondaryLabel: 'Step Cadence',
      secondaryValue: `${(4.2 + (intensity * 0.008)).toFixed(2)} Hz`,
      tertiaryLabel: 'Ground Contact Time',
      tertiaryValue: `${Math.round(110 - (intensity * 0.32))} ms`,
      graphName: 'Impulse Force Generation (Newtons)',
      chart: [
        { frame: 'Step 10', val: 2400 + intensity * 8 },
        { frame: 'Step 20', val: 2800 + intensity * 10 },
        { frame: 'Step 30', val: 3200 + intensity * 12 },
        { frame: 'Step 40', val: 3450 + intensity * 14 },
        { frame: 'Step 50', val: 3300 + intensity * 11 },
        { frame: 'Finish', val: 3050 + intensity * 9 },
      ]
    }
  }[sport];

  return (
    <div className="rounded-3xl bg-[#0B1020] border border-[#1C2745] p-6 sm:p-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-25 transition-all duration-700"
        style={{ backgroundColor: telemetryData.accent }}
      />

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#121A2E] border border-[#1C2745] text-white/90 mb-2">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: telemetryData.accent }} />
            <span>INTERACTIVE TELEMETRY SANDBOX</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ZERO-LATENCY COMPUTATION
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
            Real-Time Kinetic Computation Simulator
          </h3>
          <p className="text-xs sm:text-sm text-[#9AA4BF] mt-1 max-w-xl">
            Tweak athlete biomechanical force load and inspect how the APEX engine recalculates trajectories, expected goals, and ground reaction curves in real-time.
          </p>
        </div>

        {/* Sport switcher */}
        <div className="inline-flex p-1 rounded-xl bg-[#05070D] border border-[#1C2745] self-start lg:self-auto">
          <button
            onClick={() => setSport('cricket')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              sport === 'cricket'
                ? 'bg-[#121A2E] text-[#B6FF3B] border border-[#B6FF3B]/40 shadow-sm'
                : 'text-[#9AA4BF] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Cricket Ballistics
          </button>
          <button
            onClick={() => setSport('football')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              sport === 'football'
                ? 'bg-[#121A2E] text-[#2D6BFF] border border-[#2D6BFF]/40 shadow-sm'
                : 'text-[#9AA4BF] hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            Football xG Curve
          </button>
          <button
            onClick={() => setSport('olympics')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              sport === 'olympics'
                ? 'bg-[#121A2E] text-[#FF6B2C] border border-[#FF6B2C]/40 shadow-sm'
                : 'text-[#9AA4BF] hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Sprint Impulse
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Readouts & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#121A2E] border border-[#1C2745] space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#9AA4BF] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-white" />
                Kinetic Force Intensity:
              </span>
              <span className="font-bold text-white font-mono text-sm" style={{ color: telemetryData.accent }}>
                {intensity}%
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full cursor-pointer h-2 bg-[#05070D] rounded-lg appearance-none"
              style={{ accentColor: telemetryData.accent }}
            />

            <div className="flex justify-between text-[11px] font-mono text-[#9AA4BF]">
              <span>Standard (50%)</span>
              <span>Elite (80%)</span>
              <span>World Class (100%)</span>
            </div>
          </div>

          {/* Metric telemetry boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
              <span className="text-[10px] font-mono text-[#9AA4BF] block uppercase">
                {telemetryData.primaryLabel}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-white mt-1 block">
                {telemetryData.primaryValue}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
              <span className="text-[10px] font-mono text-[#9AA4BF] block uppercase">
                {telemetryData.secondaryLabel}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono mt-1 block" style={{ color: telemetryData.accent }}>
                {telemetryData.secondaryValue}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121A2E]/60 border border-[#1C2745] flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-xs text-[#9AA4BF] leading-relaxed">
              Calculated on client CPU using vectorized math. 0 network calls required.
            </p>
          </div>
        </div>

        {/* Telemetry Visualizer Chart Column */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#05070D] border border-[#1C2745] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block">
                TELEMETRIC TIME-SERIES CURVE
              </span>
              <h4 className="text-sm sm:text-base font-bold font-display text-white">
                {telemetryData.graphName}
              </h4>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#121A2E] text-white border border-[#1C2745]">
              Auto-Interpolated
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData.chart}>
                <defs>
                  <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={telemetryData.accent} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={telemetryData.accent} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1C2745" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="frame" stroke="#4F5D73" fontSize={11} tickLine={false} />
                <YAxis stroke="#4F5D73" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B1020', 
                    borderColor: '#1C2745', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '11px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke={telemetryData.accent} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#telemetryGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
