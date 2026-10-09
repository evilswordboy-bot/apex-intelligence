"use client";

import React, { useState } from 'react';
import { OLYMPIC_DEMO_DATA } from '@/data/sportsData';
import { Award, Flame, Gauge, CheckCircle2, AlertTriangle, PlayCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function OlympicLab() {
  const [selectedAthlete, setSelectedAthlete] = useState(OLYMPIC_DEMO_DATA[0]);

  return (
    <div className="space-y-6">
      {/* Olympic Header & Athlete Switcher */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Real AI-Generated Olympic Track Visual Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/olympics/olympic_sprint_track.jpg"
            alt="Olympic Sprint Track Dynamics"
            className="w-full h-full object-cover object-right opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/90 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#FF6B2C]/10 text-[#FF6B2C] border border-[#FF6B2C]/30 mb-2">
            <Award className="w-3.5 h-3.5" />
            OLYMPIC BIOMECHANICS & SPRINT LAB
          </div>
          <h2 className="text-2xl font-black font-display text-white">Elite Kinematics & Kinetic Chain Tracking</h2>
          <p className="text-sm text-[#8F9CAE] mt-1">High-speed motion capture metrics and automated technique coaching.</p>
        </div>

        {/* Athlete selector buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#05070D] border border-[#1C2745]">
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

      {/* Force Production & Joint Angle Timeline Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-[#FF6B2C] uppercase">BIOMECHANICAL CURVE</span>
              <h3 className="text-xl font-bold font-display text-white">Dynamic Force Production vs Joint Extension</h3>
            </div>
            <span className="text-xs font-mono text-[#8F9CAE]">Sensor: Force Plate & Vision</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedAthlete.biomechanics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2745" />
                <XAxis dataKey="frame" stroke="#8F9CAE" unit="f" />
                <YAxis yAxisId="left" stroke="#FF6B2C" />
                <YAxis yAxisId="right" orientation="right" stroke="#2D6BFF" />
                <Tooltip contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1C2745', borderRadius: '8px', color: '#fff' }} />
                <Line yAxisId="left" type="monotone" dataKey="forceProductionN" stroke="#FF6B2C" strokeWidth={3} dot={{ r: 4 }} name="Force (Newtons)" />
                <Line yAxisId="right" type="monotone" dataKey="jointAngle" stroke="#2D6BFF" strokeWidth={2} dot={{ r: 3 }} name="Joint Angle (Deg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Automated Technique Feedback */}
        <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-[#8F9CAE] uppercase block mb-1">AI TECHNIQUE FEEDBACK</span>
            <h3 className="text-xl font-bold font-display text-white mb-4">Kinematic Recommendations</h3>

            <div className="space-y-4">
              {selectedAthlete.coachingFeedback.map((fb, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#05070D] border border-[#1C2745] space-y-2 text-xs">
                  <div>
                    <span className="text-[#B6FF3B] font-bold block mb-0.5">Strength:</span>
                    <p className="text-[#F5F7FF]">{fb.strength}</p>
                  </div>
                  <div>
                    <span className="text-yellow-400 font-bold block mb-0.5">Technique Limitation:</span>
                    <p className="text-[#8F9CAE]">{fb.weakness}</p>
                  </div>
                  <div className="pt-2 border-t border-[#1C2745]">
                    <span className="text-[#2D6BFF] font-bold block mb-0.5">Target Drill:</span>
                    <p className="text-[#F5F7FF] font-medium">{fb.recommendedDrill}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 text-xs text-[#FF6B2C] flex items-center gap-2">
            <Flame className="w-4 h-4 shrink-0" />
            <span>Optimal impulse transmission achieved during peak flight phases.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
