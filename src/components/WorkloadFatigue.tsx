"use client";

import React, { useState } from 'react';
import { WORKLOAD_FATIGUE_DATA } from '@/data/sportsData';
import { ShieldAlert, Heart, BatteryCharging, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function WorkloadFatigue() {
  const [selectedAthlete, setSelectedAthlete] = useState(WORKLOAD_FATIGUE_DATA[1]); // Erling Haaland by default

  return (
    <div className="space-y-6">
      {/* Header and Compliance Disclosure */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              NON-DIAGNOSTIC SPORTS SCIENCE LOAD ENGINE
            </div>
            <h2 className="text-2xl font-black font-display text-white">Workload, Strain & Fatigue Management</h2>
            <p className="text-sm text-[#8F9CAE] mt-1">
              Acute-to-Chronic Workload Ratio (ACWR) and session-RPE biometric exposure tracking.
            </p>
          </div>

          {/* Athlete Selector */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#05070D] border border-[#1C2745]">
            {WORKLOAD_FATIGUE_DATA.map((athlete, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAthlete(athlete)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedAthlete.athleteName === athlete.athleteName
                    ? 'bg-[#2D6BFF] text-white shadow-md'
                    : 'text-[#8F9CAE] hover:text-white'
                }`}
              >
                {athlete.athleteName} ({athlete.sport})
              </button>
            ))}
          </div>
        </div>

        {/* Ethical Medical Safety Banner */}
        <div className="mt-4 p-3 rounded-xl bg-[#1C2745]/30 border border-[#1C2745] flex items-center gap-3 text-xs text-[#8F9CAE]">
          <Info className="w-4 h-4 text-[#2D6BFF] shrink-0" />
          <span>{selectedAthlete.safetyNotice}</span>
        </div>
      </div>

      {/* Primary Strain Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
          <span className="text-xs font-mono text-[#8F9CAE] block mb-1">ACWR RATIO</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black font-display ${
              selectedAthlete.acwr > 1.4 ? 'text-red-400' : 'text-[#B6FF3B]'
            }`}>
              {selectedAthlete.acwr}
            </span>
            <span className="text-xs text-[#8F9CAE]">Optimal: 0.8 - 1.3</span>
          </div>
          <span className={`inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
            selectedAthlete.acwr > 1.4 ? 'bg-red-500/20 text-red-300' : 'bg-[#B6FF3B]/20 text-[#B6FF3B]'
          }`}>
            {selectedAthlete.riskCategory}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
          <span className="text-xs font-mono text-[#8F9CAE] block mb-1">ACCUMULATED STRAIN</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-white">{selectedAthlete.strainScore}</span>
            <span className="text-xs text-[#8F9CAE]">/ 100 max</span>
          </div>
          <div className="w-full bg-[#1C2745] h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full ${selectedAthlete.strainScore > 80 ? 'bg-red-400' : 'bg-[#2D6BFF]'}`}
              style={{ width: `${selectedAthlete.strainScore}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
          <span className="text-xs font-mono text-[#8F9CAE] block mb-1">HEART RATE VARIABILITY (HRV)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-[#B6FF3B]">{selectedAthlete.hrvMs}</span>
            <span className="text-xs text-[#8F9CAE]">ms (rMSSD)</span>
          </div>
          <span className="text-[11px] text-[#8F9CAE] mt-2 block">Parasympathetic recovery stable</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
          <span className="text-xs font-mono text-[#8F9CAE] block mb-1">RECOVERY SLEEP</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-[#2D6BFF]">{selectedAthlete.sleepHours}</span>
            <span className="text-xs text-[#8F9CAE]">hours</span>
          </div>
          <span className="text-[11px] text-[#8F9CAE] mt-2 block">Stage 3 Deep Sleep: 2.1h</span>
        </div>
      </div>

      {/* Weekly Load Profile Chart */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-[#2D6BFF] uppercase">ACUTE VS CHRONIC LOAD PROFILE</span>
            <h3 className="text-xl font-bold font-display text-white">Daily Training Exposure (7-Day Microcycle)</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#2D6BFF] rounded" /> Acute Load (7-Day)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#1C2745] rounded" /> Chronic Load (28-Day)</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={selectedAthlete.weeklyLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2745" />
              <XAxis dataKey="day" stroke="#8F9CAE" />
              <YAxis stroke="#8F9CAE" />
              <Tooltip contentStyle={{ backgroundColor: '#0B1020', borderColor: '#1C2745', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="acuteLoad" fill="#2D6BFF" radius={[4, 4, 0, 0]} name="Acute Load (AU)" />
              <Bar dataKey="chronicLoad" fill="#1C2745" radius={[4, 4, 0, 0]} name="Chronic Load (AU)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
