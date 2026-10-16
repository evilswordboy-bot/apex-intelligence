"use client";

import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Eye, 
  Layers, 
  Cpu, 
  Activity, 
  Crosshair, 
  Scan, 
  ShieldCheck, 
  Maximize2, 
  Zap,
  Flame,
  ChevronRight
} from 'lucide-react';

interface ShowcaseItem {
  id: string;
  discipline: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  model: string;
  resolution: string;
  fps: string;
  latency: string;
  telemetry: {
    label: string;
    value: string;
    badge: string;
    badgeColor: string;
  }[];
  visionPoints: {
    x: number; // percentage
    y: number;
    label: string;
    sub: string;
  }[];
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'olympics',
    discipline: 'OLYMPIC SPRINT & ATHLETICS',
    title: 'Sub-Millimeter Ground Force Vectorization',
    subtitle: 'Kinematic 33-point skeletal landmark tracking during explosive acceleration phase.',
    imageSrc: '/images/olympics/olympic_sprint_track.jpg',
    model: 'Google Nano Banana Pro • Spatial Vision',
    resolution: '4096 × 2160 (4K UHD)',
    fps: '120 FPS High-Speed Sync',
    latency: '3.8ms Optical Inference',
    telemetry: [
      { label: 'Ground Contact Time', value: '84 ms', badge: 'Elite', badgeColor: 'text-[#B6FF3B]' },
      { label: 'Horizontal Impulse', value: '3,840 N', badge: '+12% Peak', badgeColor: 'text-[#2D6BFF]' },
      { label: 'Stride Cadence', value: '4.88 Hz', badge: 'Optimal', badgeColor: 'text-emerald-400' },
      { label: 'Trunk Inclination', value: '42.6°', badge: 'Sprint Plane', badgeColor: 'text-[#FF6B2C]' },
    ],
    visionPoints: [
      { x: 34, y: 46, label: 'Knee Flexion: 124°', sub: 'Peak extension vector' },
      { x: 52, y: 72, label: 'Plantar Contact: 3.8kN', sub: 'Elastic energy return' },
      { x: 68, y: 28, label: 'Center of Mass', sub: 'Vel: 12.18 m/s' },
    ],
  },
  {
    id: 'cricket',
    discipline: 'CRICKET FAST BOWLING & BATTING',
    title: 'Aerodynamic Seam Drift & Batting Sweet-Spot',
    subtitle: 'Dual-camera trajectory synthesis and high-speed Magnus force drift estimation.',
    imageSrc: '/images/cricket/cricket_batter_stadium.jpg',
    model: 'Google Nano Banana 2.1 • Ball Dynamics',
    resolution: '3840 × 2160 (Cinema 4K)',
    fps: '240 FPS Hawkeye Grade',
    latency: '4.2ms Ball Tracking',
    telemetry: [
      { label: 'Release Velocity', value: '148.2 km/h', badge: 'Express Pace', badgeColor: 'text-[#2D6BFF]' },
      { label: 'Seam Wobble Angle', value: '3.4°', badge: 'Reverse Swing', badgeColor: 'text-[#B6FF3B]' },
      { label: 'Revolutions', value: '2,420 RPM', badge: 'High Friction', badgeColor: 'text-purple-400' },
      { label: 'Bat Speed at Impact', value: '116 km/h', badge: 'Middle Face', badgeColor: 'text-[#FF6B2C]' },
    ],
    visionPoints: [
      { x: 42, y: 38, label: 'Release Window: 2.14m', sub: 'Elevation angle 82°' },
      { x: 58, y: 65, label: 'Pitch Contact: Good Length', sub: 'Bounce deviation +4.2°' },
      { x: 75, y: 48, label: 'Batting Plane: 18° Upward', sub: 'xG Exit 0.88' },
    ],
  },
  {
    id: 'football',
    discipline: 'FOOTBALL SPATIAL GEOMETRY',
    title: 'Pitch Control & Defensive Disruption Fields',
    subtitle: 'Dynamic Voronoi space occupation and high-threat expected goal (xG) vectors.',
    imageSrc: '/images/football/football_striker_match.jpg',
    model: 'Google Nano Banana Pro • Tactical Spatial',
    resolution: '4096 × 2160 (Spatial Neural)',
    fps: '60 FPS Full-Pitch Relay',
    latency: '5.1ms Multi-Agent',
    telemetry: [
      { label: 'Expected Goals (xG)', value: '0.84 xG', badge: 'High Threat', badgeColor: 'text-[#FF6B2C]' },
      { label: 'Pitch Control Dominance', value: '74.2%', badge: 'Attacking 3rd', badgeColor: 'text-[#B6FF3B]' },
      { label: 'Striker Acceleration', value: '5.4 m/s²', badge: 'Zone Break', badgeColor: 'text-[#2D6BFF]' },
      { label: 'Passing Window Width', value: '1.42 m', badge: 'Penetrative', badgeColor: 'text-amber-400' },
    ],
    visionPoints: [
      { x: 45, y: 52, label: 'Offside Line: +0.12m Cleared', sub: 'Defensive gap exploited' },
      { x: 70, y: 35, label: 'Far Corner Probability: 68%', sub: 'Goalkeeper coverage low' },
      { x: 28, y: 68, label: 'Supporting Overlap Run', sub: 'Passing lane open' },
    ],
  },
  {
    id: 'mesh',
    discipline: 'BIOMECHANICAL TENSOR MESH',
    title: 'Sub-Surface Connective Tissue Strain Field',
    subtitle: 'Predictive 3D finite-element muscle stress distribution to eliminate hamstring strains.',
    imageSrc: '/images/abstract/sports_telemetry_mesh.jpg',
    model: 'Google Nano Banana Pro • Neural Tensor',
    resolution: '4096 × 4096 (Isotropic Volumetric)',
    fps: 'Real-Time Shader Matrix',
    latency: '2.4ms Tensor Flow',
    telemetry: [
      { label: 'Biceps Femoris Load', value: '62% Peak', badge: 'Safe Margin', badgeColor: 'text-emerald-400' },
      { label: 'ACWR Fatigue Ratio', value: '1.18', badge: 'Sweet Spot', badgeColor: 'text-[#B6FF3B]' },
      { label: 'Lactate Accumulation', value: '3.2 mmol/L', badge: 'Sub-Threshold', badgeColor: 'text-[#2D6BFF]' },
      { label: 'Microtrauma Index', value: '0.04 AU', badge: 'Zero Tear Risk', badgeColor: 'text-cyan-400' },
    ],
    visionPoints: [
      { x: 48, y: 35, label: 'Tensor Peak: 142 MPa', sub: 'Tendon tension nominal' },
      { x: 62, y: 60, label: 'Elastic Recoil: 91%', sub: 'Fascial spring efficiency' },
      { x: 30, y: 50, label: 'Thermal Distribution: 36.8°C', sub: 'Even muscle perfusion' },
    ],
  },
];

export default function NanoBananaVisualStudio() {
  const [activeTab, setActiveTab] = useState<string>('olympics');
  const [showVisionOverlay, setShowVisionOverlay] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeItem = SHOWCASE_ITEMS.find((item) => item.id === activeTab) || SHOWCASE_ITEMS[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="relative py-12">
      {/* Header with Google Nano Banana Visual Engine Branding */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-gradient-to-r from-[#B6FF3B]/10 via-[#2D6BFF]/10 to-[#FF6B2C]/10 border border-[#1C2745] text-white mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B6FF3B] animate-spin [animation-duration:8s]" />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B6FF3B] via-[#2D6BFF] to-[#FF6B2C]">
              GOOGLE NANO BANANA VISION 2.1
            </span>
            <span className="text-[#9AA4BF] hidden sm:inline">• 4K SPATIAL BIOMECHANICAL SYNTHESIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight">
            High-Fidelity Spatial AI Studio.
          </h2>
          <p className="text-sm sm:text-base text-[#9AA4BF] mt-2 max-w-2xl leading-relaxed">
            Directly integrating Google&apos;s state-of-the-art Nano Banana visual neural models to generate photorealistic sports kinematics, interactive joint landmarks, and spatial field telemetry.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#0B1020] p-1.5 rounded-xl border border-[#1C2745]">
          <button
            onClick={() => setShowVisionOverlay(!showVisionOverlay)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              showVisionOverlay
                ? 'bg-[#B6FF3B] text-black shadow-md shadow-[#B6FF3B]/20'
                : 'text-[#9AA4BF] hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>AI Vision Telemetry {showVisionOverlay ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        {SHOWCASE_ITEMS.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3.5 sm:p-4 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-[#121A2E] border-[#2D6BFF] shadow-lg shadow-[#2D6BFF]/15'
                  : 'bg-[#0B1020]/80 border-[#1C2745] hover:bg-[#121A2E]/50 hover:border-[#1C2745]/90'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B6FF3B] via-[#2D6BFF] to-[#FF6B2C]" />
              )}
              <div className="text-[10px] font-mono text-[#9AA4BF] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>{item.discipline.split('&')[0]}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#B6FF3B] animate-ping" />}
              </div>
              <div className="text-sm font-bold text-white group-hover:text-[#B6FF3B] transition-colors truncate">
                {item.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Studio Canvas */}
      <div className="rounded-3xl bg-[#0B1020] border border-[#1C2745] overflow-hidden shadow-2xl relative">
        {/* Top Control Bar */}
        <div className="h-12 bg-[#05070D]/90 backdrop-blur-md border-b border-[#1C2745] px-4 sm:px-6 flex items-center justify-between font-mono text-xs text-[#9AA4BF]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-white font-bold ml-2 hidden sm:inline">
              nano-banana://spatial/{activeItem.id}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#121A2E] text-[10px] text-[#B6FF3B] border border-[#1C2745]">
              {activeItem.model}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:inline text-white font-medium">{activeItem.resolution}</span>
            <span className="text-emerald-400 font-bold">{activeItem.latency}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
              60 FPS LOCKED
            </span>
          </div>
        </div>

        {/* Studio Viewport */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative h-[380px] sm:h-[480px] lg:h-[540px] w-full overflow-hidden cursor-crosshair select-none bg-black group"
        >
          {/* Main Visual Image (Google Nano Banana Generated Asset) */}
          <img
            src={activeItem.imageSrc}
            alt={activeItem.title}
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />

          {/* Vignette & Contrast Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-[#05070D]/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070D]/40 via-transparent to-[#05070D]/40 pointer-events-none" />

          {/* Interactive Vision Telemetry Overlays */}
          {showVisionOverlay && (
            <>
              {/* Dynamic Coordinate Reticles */}
              {activeItem.visionPoints.map((pt, idx) => (
                <div
                  key={idx}
                  style={{ top: `${pt.y}%`, left: `${pt.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing Target Rings */}
                    <span className="absolute w-8 h-8 rounded-full border border-[#B6FF3B]/60 animate-ping [animation-duration:3s]" />
                    <span className="w-4 h-4 rounded-full bg-[#B6FF3B]/20 border-2 border-[#B6FF3B] flex items-center justify-center shadow-lg shadow-[#B6FF3B]/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>

                    {/* Annotation Card */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#0B1020]/95 backdrop-blur-md border border-[#1C2745] px-2.5 py-1.5 rounded-xl shadow-xl font-mono text-[10px] pointer-events-auto hover:border-[#B6FF3B] transition-colors">
                      <div className="text-white font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF3B]" />
                        {pt.label}
                      </div>
                      <div className="text-[#9AA4BF] text-[9px]">{pt.sub}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dynamic Kinetic Connection Lines between points */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" fill="none">
                {activeItem.visionPoints.length >= 2 && (
                  <path
                    d={`M ${activeItem.visionPoints[0].x}% ${activeItem.visionPoints[0].y}% Q 50% 50% ${activeItem.visionPoints[1].x}% ${activeItem.visionPoints[1].y}%`}
                    stroke="#B6FF3B"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.75"
                    className="animate-pulse"
                  />
                )}
                {activeItem.visionPoints.length >= 3 && (
                  <path
                    d={`M ${activeItem.visionPoints[1].x}% ${activeItem.visionPoints[1].y}% L ${activeItem.visionPoints[2].x}% ${activeItem.visionPoints[2].y}%`}
                    stroke="#2D6BFF"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                    opacity="0.8"
                  />
                )}
              </svg>

              {/* Interactive Mouse Hover Spotlight Lens */}
              {isHovered && (
                <div
                  style={{
                    left: `${mousePos.x}%`,
                    top: `${mousePos.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-transform duration-75"
                >
                  <div className="w-32 h-32 rounded-full border border-[#B6FF3B]/50 bg-[#B6FF3B]/5 backdrop-blur-[2px] flex items-center justify-center relative shadow-[0_0_30px_rgba(182,255,59,0.25)]">
                    <Crosshair className="w-6 h-6 text-[#B6FF3B] opacity-80" />
                    {/* Live coordinates */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#05070D]/95 border border-[#1C2745] px-2 py-0.5 rounded text-[9px] font-mono text-[#B6FF3B] whitespace-nowrap">
                      X: {mousePos.x.toFixed(1)}% | Y: {mousePos.y.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bottom Floating Telemetry Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 bg-[#0B1020]/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-[#1C2745] shadow-2xl">
              {activeItem.telemetry.map((t, idx) => (
                <div key={idx} className="font-mono">
                  <div className="text-[10px] text-[#9AA4BF] uppercase flex items-center justify-between mb-0.5">
                    <span className="truncate">{t.label}</span>
                    <span className={`text-[9px] font-bold ${t.badgeColor}`}>{t.badge}</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {t.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info & Model Specs */}
        <div className="p-4 sm:p-6 bg-[#070B16] border-t border-[#1C2745] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{activeItem.title}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF3B]" />
              <span className="text-xs text-[#9AA4BF] font-normal">{activeItem.discipline}</span>
            </div>
            <div className="text-xs text-[#9AA4BF] mt-1">{activeItem.subtitle}</div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#121A2E] text-white border border-[#1C2745] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#2D6BFF]" />
              <span>Nano Banana Vision Core</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30 font-bold flex items-center gap-1">
              <span>99.4% Confidence</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
