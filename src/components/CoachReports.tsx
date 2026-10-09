"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function CoachReports() {
  const [selectedSport, setSelectedSport] = useState<'cricket' | 'football' | 'olympics'>('cricket');

  const reportData = {
    cricket: {
      title: "Tactical Performance Dossier: Virat Kohli",
      event: "Apex Global Championship Series Finals (India vs Australia)",
      summary: "Player registered a decisive 74 runs (41 balls, SR 180.4) with peak boundary efficiency concentrated in the Mid-Wicket zone (48 runs, 24.2%). Death overs entry delivered +28 runs above average match expectation.",
      strengths: [
        "Unrivaled wrist manipulation against 140+ km/h pace bowling off good length.",
        "Zero dot balls faced during powerplay over-rate acceleration.",
        "Optimal physical conditioning: average running between wickets speed at 24.8 km/h."
      ],
      areasForImprovement: [
        "Slight dip in control percentage (64%) against back-of-a-length deliveries on the 6th stump.",
        "First-5-ball boundary conversion rate: 12% lower than season mean."
      ],
      recommendedDrills: [
        "High-velocity bowling machine sets at 148 km/h simulating 7.8m - 8.4m back-of-a-length release.",
        "Short-stride trigger movement practice against reverse swing."
      ],
      complianceNotice: "Metrics generated from Cricsheet ball-by-ball events and APEX Computer Vision tracking."
    },
    football: {
      title: "Tactical Performance Dossier: Erling Haaland",
      event: "UEFA Champions League Semifinal (Man City vs Real Madrid)",
      summary: "Haaland accumulated 1.37 individual xG, scoring 2 decisive goals from 4 shot attempts. Exceptional movement off the ball generated 4 defensive line disruptions in the penalty box.",
      strengths: [
        "Elite spatial anticipation: 100% of attempts taken inside the 12-yard danger zone.",
        "Significant aerial dominance winning 5 out of 7 contested duels.",
        "High-pressure off-ball sprint frequency sustained at 32.4 km/h."
      ],
      areasForImprovement: [
        "Link-up passing accuracy in mid-third under high press (68%).",
        "Overload fatigue indicator: ACWR ratio reached 1.48 (elevated acute exposure)."
      ],
      recommendedDrills: [
        "One-touch combination play under tight pressure in central channel.",
        "Deload recovery cycle: 20% reduction in high-speed sprint volume prior to next fixture."
      ],
      complianceNotice: "Metrics generated from StatsBomb Open Data standards and APEX Pitch Tracking."
    },
    olympics: {
      title: "Biomechanical Kinematics Dossier: Noah Lyles",
      event: "Olympic 100m Final Benchmark",
      summary: "Achieved world-class acceleration reaching 43.8 km/h top velocity at 64m. Ground contact times averaged 84ms with horizontal impulse of 328 N·s.",
      strengths: [
        "World-leading vertical stiffness and elastic energy return off ground strike.",
        "Torso alignment and hip-shoulder posture preserved through max-velocity phase.",
        "Bilateral symmetry balance measured at 96.4%."
      ],
      areasForImprovement: [
        "Drive phase torso angle elevated 2.8° prematurely at step 7.",
        "Left foot initial contact brake force was 4% higher than right side."
      ],
      recommendedDrills: [
        "Heavy sled resistance sprints (35% body mass) focusing on horizontal projection.",
        "Unilateral pogo jumps on dual force-plates to balance ankle stiffness."
      ],
      complianceNotice: "Data derived from high-speed kinematic video motion analysis and force-plate sensors."
    }
  };

  const active = reportData[selectedSport];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Report Controls Bar */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#2D6BFF]/10 text-[#2D6BFF] border border-[#2D6BFF]/30 mb-2">
            <FileText className="w-3.5 h-3.5" />
            OFFICIAL COACHING & SCOUTING DOSSIER
          </div>
          <h2 className="text-2xl font-black font-display text-white">Executive Performance Intelligence Report</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Sport Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#05070D] border border-[#1C2745]">
            <button
              onClick={() => setSelectedSport('cricket')}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${selectedSport === 'cricket' ? 'bg-[#B6FF3B] text-black' : 'text-[#8F9CAE]'}`}
            >
              Cricket
            </button>
            <button
              onClick={() => setSelectedSport('football')}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${selectedSport === 'football' ? 'bg-[#2D6BFF] text-white' : 'text-[#8F9CAE]'}`}
            >
              Football
            </button>
            <button
              onClick={() => setSelectedSport('olympics')}
              className={`px-3 py-1.5 rounded text-xs font-semibold ${selectedSport === 'olympics' ? 'bg-[#FF6B2C] text-white' : 'text-[#8F9CAE]'}`}
            >
              Olympics
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#2D6BFF] hover:bg-[#2558d6] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#2D6BFF]/20"
          >
            <Download className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#090E1D] border border-[#1C2745] max-w-4xl mx-auto shadow-2xl relative text-[#F5F7FF]">
        {/* Document Header */}
        <div className="border-b border-[#1C2745] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-[#B6FF3B] tracking-widest uppercase block mb-1">
              APEX INTELLIGENCE SYSTEM • CERTIFIED COACH DOSSIER
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">{active.title}</h1>
            <p className="text-xs text-[#8F9CAE] mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Generated: October 2026 • Event: {active.event}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#05070D] border border-[#1C2745] flex flex-col items-center justify-center p-2 text-center">
            <span className="text-[10px] font-mono text-[#8F9CAE]">STATUS</span>
            <span className="text-xs font-bold text-[#B6FF3B]">VERIFIED</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h3 className="text-xs font-mono text-[#2D6BFF] tracking-wider uppercase mb-2">1. Executive Summary</h3>
          <p className="text-sm text-[#F5F7FF] leading-relaxed p-4 rounded-xl bg-[#05070D] border border-[#1C2745]">
            {active.summary}
          </p>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
            <h3 className="text-xs font-mono text-[#B6FF3B] tracking-wider uppercase mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 2. Core Strengths
            </h3>
            <ul className="space-y-2 text-xs text-[#8F9CAE]">
              {active.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B6FF3B] mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-[#05070D] border border-[#1C2745]">
            <h3 className="text-xs font-mono text-yellow-400 tracking-wider uppercase mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 3. Technique Vulnerabilities
            </h3>
            <ul className="space-y-2 text-xs text-[#8F9CAE]">
              {active.areasForImprovement.map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Training Drills */}
        <div className="mb-8">
          <h3 className="text-xs font-mono text-[#FF6B2C] tracking-wider uppercase mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" /> 4. Actionable Coaching Protocol
          </h3>
          <div className="space-y-2.5">
            {active.recommendedDrills.map((drill, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs text-[#F5F7FF] flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FF6B2C]/20 text-[#FF6B2C] border border-[#FF6B2C]/40 font-mono font-bold flex items-center justify-center text-[10px]">
                  0{idx + 1}
                </span>
                <span>{drill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Medical Boundary Disclaimer */}
        <div className="pt-6 border-t border-[#1C2745] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#8F9CAE] gap-2">
          <span>{active.complianceNotice}</span>
          <span className="text-[#4F5D73]">APEX Athletic Intelligence Confidential</span>
        </div>
      </div>
    </div>
  );
}
