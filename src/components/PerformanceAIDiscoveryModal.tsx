"use client";

import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Activity, 
  Eye, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  Camera
} from 'lucide-react';
import Link from 'next/link';

interface PerformanceAIDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PerformanceAIDiscoveryModal({ isOpen, onClose }: PerformanceAIDiscoveryModalProps) {
  const [activeTab, setActiveTab] = useState<'vision' | 'telemetry' | 'coaching'>('vision');
  const [jointAngle, setJointAngle] = useState(142);
  const [velocitySlider, setVelocitySlider] = useState(38.4);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B1020] border border-[#1C2745] shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-[#121A2E] text-[#9AA4BF] hover:text-white border border-[#1C2745] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="max-w-xl mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#2D6BFF]/10 text-[#2D6BFF] border border-[#2D6BFF]/30 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>APEX NEURAL KINEMATICS ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-[#F5F7FF]">
            Discover APEX Performance AI
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA4BF] mt-1">
            Browser-native pose inference, tactical physics modeling, and zero-latency biomechanical injury risk prediction.
          </p>
        </div>

        {/* Pillar Switcher */}
        <div className="flex border-b border-[#1C2745] gap-4 mb-6">
          <button
            onClick={() => setActiveTab('vision')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'vision'
                ? 'border-[#2D6BFF] text-[#2D6BFF]'
                : 'border-transparent text-[#9AA4BF] hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            Computer Vision (60 FPS)
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'telemetry'
                ? 'border-[#B6FF3B] text-[#B6FF3B]'
                : 'border-transparent text-[#9AA4BF] hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            Physics & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('coaching')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'coaching'
                ? 'border-[#FF6B2C] text-[#FF6B2C]'
                : 'border-transparent text-[#9AA4BF] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            AI Workload Guard
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'vision' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                Sub-Millimeter Skeleton Extraction
              </h3>
              <p className="text-xs sm:text-sm text-[#9AA4BF] leading-relaxed">
                APEX performs 33-point anatomical landmark estimation directly in the browser using WebGL/WebGPU hardware acceleration. No raw video ever leaves the user device, guaranteeing Olympic privacy compliance.
              </p>

              <div className="p-4 rounded-xl bg-[#121A2E] border border-[#1C2745] space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#9AA4BF]">Simulated Knee Angle:</span>
                  <span className="text-[#2D6BFF] font-bold">{jointAngle}°</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="175"
                  value={jointAngle}
                  onChange={(e) => setJointAngle(Number(e.target.value))}
                  className="w-full accent-[#2D6BFF] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#9AA4BF]">
                  <span>Flexion (90°)</span>
                  <span>Extension (175°)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#B6FF3B]">
                <Sparkles className="w-4 h-4" />
                <span>Status: Optimal propulsion vector detected at {jointAngle}°</span>
              </div>
            </div>

            {/* Interactive Vector Visualizer */}
            <div className="h-64 rounded-2xl bg-[#05070D] border border-[#1C2745] p-6 relative flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#9AA4BF]">
                <span>POSE TRACKING HUD</span>
                <span className="text-[#2D6BFF] animate-pulse">● 60.2 FPS</span>
              </div>

              {/* Graphical skeleton rendering */}
              <div className="relative w-full h-36 flex items-center justify-center">
                <svg className="w-48 h-36" viewBox="0 0 200 150">
                  <line x1="100" y1="20" x2="100" y2="70" stroke="#2D6BFF" strokeWidth="3" />
                  <circle cx="100" cy="20" r="10" fill="#2D6BFF" />
                  <line x1="100" y1="70" x2={100 - (jointAngle - 100) * 0.4} y2="120" stroke="#B6FF3B" strokeWidth="3" />
                  <line x1={100 - (jointAngle - 100) * 0.4} y1="120" x2="60" y2="145" stroke="#FF6B2C" strokeWidth="3" />
                  <circle cx={100 - (jointAngle - 100) * 0.4} cy="120" r="5" fill="#B6FF3B" />
                  <circle cx="60" cy="145" r="5" fill="#FF6B2C" />
                </svg>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-[#9AA4BF] border-t border-[#1C2745] pt-2">
                <span>Joint Torque: {(jointAngle * 1.8).toFixed(1)} N·m</span>
                <span className="text-[#2D6BFF]">Ground Latency: 4.2ms</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                F1-Grade High Frequency Telemetry
              </h3>
              <p className="text-xs sm:text-sm text-[#9AA4BF] leading-relaxed">
                Continuous measurement of horizontal force vectors, rotational inertia, ball revolutions (RPM), and Expected Goals (xG) surface density in real-time.
              </p>

              <div className="p-4 rounded-xl bg-[#121A2E] border border-[#1C2745] space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#9AA4BF]">Simulated Sprint Velocity:</span>
                  <span className="text-[#B6FF3B] font-bold">{velocitySlider.toFixed(1)} km/h</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="44"
                  step="0.2"
                  value={velocitySlider}
                  onChange={(e) => setVelocitySlider(Number(e.target.value))}
                  className="w-full accent-[#B6FF3B] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#9AA4BF]">
                  <span>Jog (24 km/h)</span>
                  <span>World Record (44 km/h)</span>
                </div>
              </div>
            </div>

            <div className="h-64 rounded-2xl bg-[#05070D] border border-[#1C2745] p-6 flex flex-col justify-between">
              <div className="flex justify-between text-[10px] font-mono text-[#9AA4BF]">
                <span>AERODYNAMIC DRAG & HORIZONTAL FORCE</span>
                <span className="text-[#B6FF3B]">CALCULATED</span>
              </div>
              <div className="space-y-3 my-auto font-mono text-xs">
                <div className="flex justify-between pb-1 border-b border-[#1C2745]">
                  <span className="text-[#9AA4BF]">Kinetic Energy Output:</span>
                  <span className="text-white font-bold">{(velocitySlider * 48).toFixed(0)} Joules</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-[#1C2745]">
                  <span className="text-[#9AA4BF]">Cadence Requirement:</span>
                  <span className="text-[#B6FF3B] font-bold">{(velocitySlider / 9.2).toFixed(2)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA4BF]">Expected Sprint 100m split:</span>
                  <span className="text-white font-bold">{(100 / (velocitySlider / 3.6)).toFixed(2)}s</span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[#9AA4BF]">
                Continuous Monte Carlo kinematic extrapolation.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coaching' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                Biomechanical Acute:Chronic Workload Guard
              </h3>
              <p className="text-xs sm:text-sm text-[#9AA4BF] leading-relaxed">
                Prevents soft-tissue strains, hamstring pulls, and bowler lumbar stress fractures before they occur by maintaining athletes within the optimal 0.8–1.3 ACWR sweet spot.
              </p>
              <div className="p-4 rounded-xl bg-[#121A2E] border border-[#1C2745]">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-[#9AA4BF]">ACWR Safety Sweet Spot:</span>
                  <span className="text-[#B6FF3B] font-bold">1.18 (Optimal Zone)</span>
                </div>
                <div className="w-full bg-[#05070D] h-3 rounded-full overflow-hidden flex border border-[#1C2745]">
                  <div className="bg-amber-500/60 w-1/4 h-full" title="Under-training" />
                  <div className="bg-[#B6FF3B] w-1/2 h-full" title="Optimal Green Zone" />
                  <div className="bg-red-500/80 w-1/4 h-full" title="Injury Danger" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#9AA4BF] mt-1.5">
                  <span>0.8 Underload</span>
                  <span>1.0 - 1.3 Optimal</span>
                  <span>1.5+ Danger</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#05070D] border border-[#1C2745] space-y-3 font-mono text-xs">
              <div className="text-[10px] text-[#FF6B2C] uppercase font-bold tracking-wider">
                Automated Medical Advisory Rule
              </div>
              <p className="text-white text-xs leading-relaxed">
                &ldquo;High-speed deceleration frequency exceeding 45 G-events within 48h match window. Prescribe active pool recovery and 15% pitch session reduction.&rdquo;
              </p>
              <div className="pt-3 border-t border-[#1C2745] flex items-center justify-between text-[11px] text-[#9AA4BF]">
                <span>Risk Index: Low (18%)</span>
                <span className="text-[#B6FF3B]">Cleared for Competition</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action CTA */}
        <div className="mt-8 pt-6 border-t border-[#1C2745] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-[#9AA4BF]">
            All mathematical models run completely on-device without cloud API dependencies.
          </span>
          <Link
            href="/dashboard"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2D6BFF] hover:bg-[#2558d6] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#2D6BFF]/20"
          >
            Launch Interactive Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
