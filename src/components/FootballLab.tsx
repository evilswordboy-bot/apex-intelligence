"use client";

import React, { useState } from 'react';
import { FOOTBALL_DEMO_DATA } from '@/data/sportsData';
import { Activity, Crosshair, Users, ShieldAlert, Award } from 'lucide-react';

export default function FootballLab() {
  const [activeShot, setActiveShot] = useState<typeof FOOTBALL_DEMO_DATA.shotMap[0] | null>(null);

  return (
    <div className="space-y-6">
      {/* Fixture Overview */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Real AI-Generated Football Match Visual Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/football/football_striker_match.jpg"
            alt="Football Match Tactical Intensity"
            className="w-full h-full object-cover object-right opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/90 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#2D6BFF]/10 text-[#2D6BFF] border border-[#2D6BFF]/30 mb-2">
            <Activity className="w-3.5 h-3.5" />
            FOOTBALL TACTICAL LAB • STATSBOMB METRIC MODEL
          </div>
          <h2 className="text-2xl font-black font-display text-white">{FOOTBALL_DEMO_DATA.fixture}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-lg font-bold text-[#2D6BFF]">{FOOTBALL_DEMO_DATA.teams.home}</span>
            <span className="text-2xl font-black font-mono text-white px-3 py-0.5 rounded bg-[#05070D] border border-[#1C2745]">
              {FOOTBALL_DEMO_DATA.score.home} - {FOOTBALL_DEMO_DATA.score.away}
            </span>
            <span className="text-lg font-bold text-white">{FOOTBALL_DEMO_DATA.teams.away}</span>
          </div>
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-auto">
          <div className="p-3 rounded-xl bg-[#05070D] border border-[#1C2745] text-center">
            <span className="text-[10px] font-mono text-[#8F9CAE] block">xG (EXP GOALS)</span>
            <span className="text-lg font-bold font-display text-[#2D6BFF]">{FOOTBALL_DEMO_DATA.xG.home} : {FOOTBALL_DEMO_DATA.xG.away}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#05070D] border border-[#1C2745] text-center">
            <span className="text-[10px] font-mono text-[#8F9CAE] block">POSSESSION</span>
            <span className="text-lg font-bold font-display text-white">{FOOTBALL_DEMO_DATA.possession.home}% : {FOOTBALL_DEMO_DATA.possession.away}%</span>
          </div>
          <div className="p-3 rounded-xl bg-[#05070D] border border-[#1C2745] text-center">
            <span className="text-[10px] font-mono text-[#8F9CAE] block">PPDA PRESS</span>
            <span className="text-lg font-bold font-display text-[#B6FF3B]">{FOOTBALL_DEMO_DATA.pressingIntensityPPDA.home}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#05070D] border border-[#1C2745] text-center">
            <span className="text-[10px] font-mono text-[#8F9CAE] block">FIELD TILT</span>
            <span className="text-lg font-bold font-display text-white">{FOOTBALL_DEMO_DATA.fieldTilt.home}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Pitch: Shot Map & Passing Network */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-[#2D6BFF] uppercase">SPATIAL SHOT MAP & xG VALUE</span>
              <h3 className="text-xl font-bold font-display text-white">High Danger Zone Visualizer</h3>
            </div>
            <div className="text-xs font-mono text-[#8F9CAE]">Circle Size = xG Danger</div>
          </div>

          {/* Tactical Pitch Map Canvas */}
          <div className="h-80 rounded-xl bg-[#06170d] border border-[#1C2745] relative overflow-hidden flex items-center justify-center p-4">
            {/* Field lines */}
            <div className="absolute inset-4 border border-white/20 rounded-md pointer-events-none">
              {/* Half-way line */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/20" />
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-white/20" />
              {/* Penalty box right */}
              <div className="absolute top-1/4 bottom-1/4 right-0 w-24 border-l border-y border-white/20" />
              {/* Penalty box left */}
              <div className="absolute top-1/4 bottom-1/4 left-0 w-24 border-r border-y border-white/20" />
            </div>

            {/* Shots on Pitch */}
            {FOOTBALL_DEMO_DATA.shotMap.map((shot) => {
              const size = Math.max(16, Math.min(34, shot.xG * 40));
              const isSelected = activeShot?.id === shot.id;

              return (
                <button
                  key={shot.id}
                  onClick={() => setActiveShot(shot)}
                  style={{
                    left: `${shot.x}%`,
                    top: `${shot.y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all ${
                    shot.outcome === 'Goal'
                      ? 'bg-[#B6FF3B] text-black font-black shadow-lg shadow-[#B6FF3B]/50'
                      : shot.team === 'home'
                      ? 'bg-[#2D6BFF] text-white'
                      : 'bg-[#FF6B2C] text-white'
                  } ${isSelected ? 'ring-4 ring-white scale-125 z-30' : 'hover:scale-110 z-10'}`}
                >
                  <span className="text-[9px]">{shot.minute}&apos;</span>
                </button>
              );
            })}
          </div>

          {/* Shot Details Box */}
          <div className="mt-4 p-4 rounded-xl bg-[#05070D] border border-[#1C2745] flex items-center justify-between">
            {activeShot ? (
              <div>
                <span className="text-xs font-mono text-[#2D6BFF]">Shot Inspection • Minute {activeShot.minute}&apos;</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {activeShot.player} ({activeShot.team.toUpperCase()}) — {activeShot.outcome} (xG: {activeShot.xG})
                </p>
              </div>
            ) : (
              <span className="text-xs text-[#8F9CAE]">Click any shot on the pitch above to inspect player name, xG value, and execution outcome.</span>
            )}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#B6FF3B]" /> Goal</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2D6BFF]" /> Man City</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF6B2C]" /> Real Madrid</span>
            </div>
          </div>
        </div>

        {/* Passing Network & Timeline */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
            <span className="text-xs font-mono text-[#8F9CAE] uppercase block mb-1">PASSING NETWORK KEY NODES</span>
            <h3 className="text-lg font-bold font-display text-white mb-3">Manchester City Central Axis</h3>

            <div className="space-y-2.5">
              {FOOTBALL_DEMO_DATA.passNetworkNodes.slice(0, 5).map((node) => (
                <div key={node.id} className="p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2D6BFF]/20 text-[#2D6BFF] border border-[#2D6BFF]/40 font-mono font-bold flex items-center justify-center text-[10px]">
                      {node.number}
                    </span>
                    <span className="font-semibold text-white">{node.name}</span>
                  </div>
                  <span className="font-mono text-[#8F9CAE]">{node.passes} completed passes</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
            <span className="text-xs font-mono text-[#8F9CAE] uppercase block mb-1">TACTICAL MATCH EVENTS</span>
            <h3 className="text-lg font-bold font-display text-white mb-3">Critical Momentum Shifts</h3>

            <div className="space-y-3">
              {FOOTBALL_DEMO_DATA.timeline.slice(0, 3).map((event, i) => (
                <div key={i} className="text-xs border-l-2 border-[#2D6BFF] pl-3 py-1">
                  <div className="flex items-center justify-between text-[#8F9CAE] font-mono">
                    <span>{event.minute}&apos; • {event.event}</span>
                    <span className="text-[#B6FF3B]">Danger {event.dangerLevel}%</span>
                  </div>
                  <p className="text-white font-medium mt-1">{event.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
