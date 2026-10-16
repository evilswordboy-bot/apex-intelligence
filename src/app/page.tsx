"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Activity, 
  Crosshair, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Video, 
  BarChart3, 
  Cpu, 
  Play, 
  CheckCircle2, 
  Flame, 
  ArrowUpRight, 
  Eye, 
  Sparkles, 
  TrendingUp, 
  Sliders, 
  ArrowDown, 
  Layers,
  HeartPulse,
  Radio,
  User,
  Maximize2,
  X
} from 'lucide-react';

import LiveTelemetrySandbox from '@/components/LiveTelemetrySandbox';
import PerformanceAIDiscoveryModal from '@/components/PerformanceAIDiscoveryModal';
import KineticCanvasGrid from '@/components/KineticCanvasGrid';
import NanoBananaVisualStudio from '@/components/NanoBananaVisualStudio';

export default function LandingPage() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [hoveredBento, setHoveredBento] = useState<number | null>(null);
  const [activeAnimeScene, setActiveAnimeScene] = useState<'all' | 'cricket' | 'football' | 'olympics'>('all');
  const [isFullscreenAnimeModalOpen, setIsFullscreenAnimeModalOpen] = useState(false);

  // Quick helper to scroll to bento
  const scrollToFeatures = () => {
    document.getElementById('bento-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-transparent text-[#F5F7FF] selection:bg-[#2D6BFF] selection:text-white relative overflow-hidden">
      {/* Full-Page Masterpiece Anime Background with Dynamic Scene Switching */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          key={activeAnimeScene}
          src={
            activeAnimeScene === 'cricket'
              ? '/images/cricket/apex_anime_cricket.jpg'
              : activeAnimeScene === 'football'
              ? '/images/football/apex_anime_football.jpg'
              : activeAnimeScene === 'olympics'
              ? '/images/olympics/apex_anime_olympics.jpg'
              : '/images/hero/apex_anime_sports_cinematic.jpg'
          }
          alt="APEX Masterpiece Anime Visual"
          className="w-full h-full object-cover object-center transform scale-100 transition-all duration-1000 opacity-80 sm:opacity-85"
        />
        {/* Masterpiece Anime Lighting & Subtle High-Contrast Glazes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070D]/45 via-[#05070D]/65 to-[#05070D]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#05070D_100%)] opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D6BFF]/15 via-transparent to-[#A855F7]/15" />
      </div>
      {/* Ambient Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[380px] bg-[#2D6BFF]/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-24 right-1/4 w-[550px] h-[320px] bg-[#B6FF3B]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] left-1/3 w-[500px] h-[400px] bg-[#FF6B2C]/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Top Sleek Transparent Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#1C2745]/60 bg-[#05070D]/40 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          {/* APEX AI Brand Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <img 
                src="/branding/apex-logo.svg" 
                alt="APEX AI Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-lg shadow-[#2D6BFF]/30 group-hover:shadow-[#B6FF3B]/40 transition-all shrink-0 group-hover:scale-105" 
              />
              <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#2D6BFF] via-[#A855F7] to-[#B6FF3B] opacity-0 group-hover:opacity-30 blur transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-white">
                  APEX
                </span>
                <span className="font-display font-black text-xl sm:text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] to-[#A855F7]">
                  AI
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] block font-mono text-[#9AA4BF] tracking-widest uppercase">
                SPORTS INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Transparent Nav Links: Home, Sports, Analytics, Contact */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-xs font-mono">
            <Link href="/" className="text-white hover:text-[#06B6D4] font-bold tracking-wider transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              HOME
            </Link>
            <a href="#sports" className="text-[#9AA4BF] hover:text-[#B6FF3B] font-semibold tracking-wider transition-colors">
              SPORTS
            </a>
            <Link href="/analytics" className="text-[#9AA4BF] hover:text-[#2D6BFF] font-semibold tracking-wider transition-colors">
              ANALYTICS
            </Link>
            <Link href="/predictions" className="hidden lg:inline text-[#9AA4BF] hover:text-[#A855F7] font-semibold tracking-wider transition-colors">
              PREDICTOR
            </Link>
            <a href="#studio" className="hidden xl:inline text-[#9AA4BF] hover:text-[#FF6B2C] font-semibold tracking-wider transition-colors">
              SPATIAL STUDIO
            </a>
            <Link href="/feedback" className="text-[#9AA4BF] hover:text-white font-semibold tracking-wider transition-colors">
              CONTACT
            </Link>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:flex px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-medium bg-[#121A2E]/80 hover:bg-[#1C2745] border border-[#1C2745] text-white transition-all items-center gap-1.5 backdrop-blur-md"
            >
              <User className="w-3.5 h-3.5 text-[#06B6D4]" />
              Account
            </Link>

            <Link 
              href="/dashboard"
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#2D6BFF] via-[#A855F7] to-[#06B6D4] hover:opacity-95 text-white shadow-lg shadow-[#2D6BFF]/30 transition-all flex items-center gap-1.5 sm:gap-2 group whitespace-nowrap glow-blue"
            >
              <span>Explore Sports</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Full-Screen Futuristic Anime Stadium Scene */}
      <section id="hero" className="relative pt-10 sm:pt-16 md:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Interactive Kinetic Canvas Constellation */}
        <KineticCanvasGrid />

        <div className="text-center max-w-4xl mx-auto relative z-20">
          {/* Futuristic Hologram Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1020]/80 backdrop-blur-xl border border-[#2D6BFF]/40 text-[10px] sm:text-xs font-mono text-[#06B6D4] mb-6 sm:mb-8 shadow-lg shadow-[#2D6BFF]/10 max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping shrink-0" />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#FF6B2C]">
              APEX AI CINEMATIC SUITE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-white font-medium">OLYMPICS • CRICKET • FOOTBALL</span>
          </div>

          {/* Headline: RISE ABOVE. PLAY BEYOND. */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] sm:leading-[1.02] mb-4 sm:mb-5">
            RISE ABOVE. <br className="sm:hidden" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] via-[#2D6BFF] via-[#A855F7] to-[#FF6B2C] animate-pulse">
              PLAY BEYOND.
            </span>
          </h1>

          {/* Tagline: Where Sports Meet Intelligence. */}
          <p className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-white tracking-wide mb-4">
            Where Sports Meet Intelligence.
          </p>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#9AA4BF] font-normal leading-relaxed mb-8 sm:mb-10 px-2">
            Harness sub-millimeter computer vision, tactical event kinematics, and ACWR fatigue prevention across Olympic athletics, dynamic football strikers, and powerful cricket batsmen.
          </p>

          {/* Two Buttons: Explore Sports & Discover Apex AI */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-5 mb-12 sm:mb-16 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r from-[#B6FF3B] to-[#06B6D4] text-black shadow-xl shadow-[#B6FF3B]/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
            >
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:scale-110 transition-transform" />
              <span>Explore Sports</span>
              <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => setIsAIModalOpen(true)}
              className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold bg-[#0B1020]/90 hover:bg-[#121A2E] border border-[#A855F7]/50 hover:border-[#06B6D4] text-white transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#A855F7]/15 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#A855F7] group-hover:scale-110 transition-transform" />
              <span>Discover Apex AI</span>
              <Video className="w-4 h-4 text-[#06B6D4]" />
            </button>
          </div>

          {/* Masterpiece Anime Interactive Scene Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 z-20 relative">
            <span className="text-[10px] font-mono text-[#06B6D4] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0B1020]/90 border border-[#2D6BFF]/30 font-bold">
              CINEMA THEATER 4K
            </span>
            <div className="inline-flex flex-wrap p-1 rounded-2xl bg-[#070B16]/95 border border-[#2D6BFF]/40 backdrop-blur-2xl shadow-2xl">
              {(
                [
                  { id: 'all', label: 'All Disciplines', sub: 'Triple Masterpiece', color: '#06B6D4' },
                  { id: 'cricket', label: 'Cricket', sub: 'Lightning Strike', color: '#B6FF3B' },
                  { id: 'football', label: 'Football', sub: 'Cyan Aura Volley', color: '#2D6BFF' },
                  { id: 'olympics', label: 'Olympics', sub: 'Supersonic Sprint', color: '#FF6B2C' },
                ] as const
              ).map((scene) => {
                const isActive = activeAnimeScene === scene.id;
                return (
                  <button
                    key={scene.id}
                    onClick={() => setActiveAnimeScene(scene.id)}
                    className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#121A2E] text-white shadow-lg border'
                        : 'text-[#9AA4BF] hover:text-white hover:bg-[#121A2E]/40 border border-transparent'
                    }`}
                    style={isActive ? { borderColor: `${scene.color}70`, color: scene.color, boxShadow: `0 0 15px ${scene.color}33` } : {}}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ backgroundColor: scene.color }}
                    />
                    <span>{scene.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cinematic Anime-Style Merged Scene & Holographic Telemetry HUD */}
        <div className="relative max-w-6xl mx-auto mt-4 mb-16 h-[400px] sm:h-[500px] md:h-[560px] rounded-3xl bg-gradient-to-b from-[#0B1020]/80 to-[#05070D] border border-[#2D6BFF]/40 overflow-hidden flex items-center justify-center shadow-2xl group">
          {/* Fullscreen 4K Cinema Trigger */}
          <button
            onClick={() => setIsFullscreenAnimeModalOpen(true)}
            className="absolute top-4 right-4 z-30 px-3.5 py-2 rounded-xl bg-[#05070D]/85 hover:bg-[#121A2E] border border-[#2D6BFF]/50 hover:border-[#06B6D4] text-white text-xs font-mono flex items-center gap-2 backdrop-blur-xl shadow-2xl transition-all group cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#06B6D4] group-hover:scale-125 transition-transform" />
            <span className="font-bold">Fullscreen 4K Cinema</span>
          </button>

          {/* Dynamic Anime-Style 4K Key Visual */}
          <div className="absolute inset-0 z-0">
            <img
              key={activeAnimeScene}
              src={
                activeAnimeScene === 'cricket'
                  ? '/images/cricket/apex_anime_cricket.jpg'
                  : activeAnimeScene === 'football'
                  ? '/images/football/apex_anime_football.jpg'
                  : activeAnimeScene === 'olympics'
                  ? '/images/olympics/apex_anime_olympics.jpg'
                  : '/images/hero/apex_anime_sports_cinematic.jpg'
              }
              alt="APEX AI Sports: Olympic Sprinter, Football Striker, and Cricket Batsman in Futuristic Stadium"
              className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Lighting: Electric Blue, Purple, Cyan, and Orange Glazes */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2D6BFF]/15 via-transparent to-[#A855F7]/20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#06B6D4]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6B2C]/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Futuristic AI Holographic HUD Rings & Energy Curves */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <div className="w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full border border-[#06B6D4]/30 border-dashed animate-spin [animation-duration:35s]" />
            <div className="absolute w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] rounded-full border border-[#A855F7]/30 animate-spin [animation-duration:25s] [animation-direction:reverse]" />
          </div>

          {/* Tech Grid Backdrop */}
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none z-0" />

          {/* Abstract Biomechanical Vector Silhouette Overlay */}
          <svg className="w-full h-full max-w-lg opacity-80 relative z-10" viewBox="0 0 500 300" fill="none">
            {/* Ground reaction plane */}
            <line x1="50" y1="260" x2="450" y2="260" stroke="#1C2745" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Kinetic vector curves */}
            <path d="M 120 250 Q 220 120 380 90" stroke="#2D6BFF" strokeWidth="3" fill="none" opacity="0.7" />
            <path d="M 140 255 Q 240 160 410 130" stroke="#B6FF3B" strokeWidth="2.5" fill="none" opacity="0.8" />
            <path d="M 100 240 Q 280 80 440 70" stroke="#FF6B2C" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.6" />

            {/* Joint nodes */}
            <circle cx="140" cy="250" r="6" fill="#B6FF3B" className="animate-pulse" />
            <circle cx="210" cy="180" r="5" fill="#2D6BFF" />
            <circle cx="270" cy="130" r="7" fill="#B6FF3B" />
            <circle cx="330" cy="110" r="5" fill="#FF6B2C" />
            <circle cx="410" cy="95" r="8" fill="#2D6BFF" className="animate-pulse" />

            {/* Connecting joint bones */}
            <line x1="140" y1="250" x2="210" y2="180" stroke="#B6FF3B" strokeWidth="2" />
            <line x1="210" y1="180" x2="270" y2="130" stroke="#2D6BFF" strokeWidth="2" />
            <line x1="270" y1="130" x2="330" y2="110" stroke="#FF6B2C" strokeWidth="2" />
            <line x1="330" y1="110" x2="410" y2="95" stroke="#2D6BFF" strokeWidth="2" />
          </svg>

          {/* Floating Telemetry Element 1: Heart Rate / VO2 with Animated ECG */}
          <div className="absolute top-6 left-4 sm:left-10 p-3 sm:p-4 rounded-2xl bg-[#121A2E]/90 backdrop-blur-md border border-[#1C2745] shadow-xl flex items-center gap-3 animate-bounce [animation-duration:4s] z-20 hover:border-red-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center relative overflow-hidden">
              <HeartPulse className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block">Cardio Strain</span>
                {/* Micro Animated ECG Line */}
                <svg className="w-12 h-3" viewBox="0 0 48 12" fill="none">
                  <path d="M0 6 L12 6 L16 1 L20 11 L24 4 L28 8 L32 6 L48 6" stroke="#EF4444" strokeWidth="1.5" className="animate-pulse" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-base sm:text-lg font-bold text-white">184 BPM</span>
                <span className="text-[10px] text-emerald-400 font-bold">Zone 4.8</span>
              </div>
            </div>
          </div>

          {/* Floating Telemetry Element 2: Ground Impulse Force with Equalizer bars */}
          <div className="absolute bottom-6 left-6 sm:left-16 p-3 sm:p-4 rounded-2xl bg-[#121A2E]/90 backdrop-blur-md border border-[#1C2745] shadow-xl flex items-center gap-3 z-20 hover:border-[#B6FF3B]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#B6FF3B]/10 border border-[#B6FF3B]/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#B6FF3B]" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block">Ground Force</span>
                {/* Micro Equalizer Bars */}
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-1 bg-[#B6FF3B] h-2 rounded-t animate-pulse" />
                  <span className="w-1 bg-[#B6FF3B] h-3 rounded-t" />
                  <span className="w-1 bg-[#B6FF3B] h-1.5 rounded-t animate-pulse [animation-delay:200ms]" />
                  <span className="w-1 bg-[#B6FF3B] h-2.5 rounded-t animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-base sm:text-lg font-bold text-white">3,410 N</span>
                <span className="text-[10px] text-[#B6FF3B] font-bold">+14% Vector</span>
              </div>
            </div>
          </div>

          {/* Floating Telemetry Element 3: Bowling & Sprint Speed with Rotating Radar */}
          <div className="absolute top-8 right-4 sm:right-10 p-3 sm:p-4 rounded-2xl bg-[#121A2E]/90 backdrop-blur-md border border-[#1C2745] shadow-xl flex items-center gap-3 animate-bounce [animation-duration:5s] z-20 hover:border-[#2D6BFF]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#2D6BFF]/10 border border-[#2D6BFF]/30 flex items-center justify-center relative">
              <Flame className="w-5 h-5 text-[#2D6BFF]" />
              <span className="absolute inset-0 rounded-xl border border-[#2D6BFF]/40 animate-ping [animation-duration:3s]" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block">Release Speed</span>
                <span className="w-2 h-2 rounded-full bg-[#2D6BFF] animate-ping" />
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-base sm:text-lg font-bold text-white">148.2 km/h</span>
                <span className="text-[10px] text-[#2D6BFF] font-bold">2,340 RPM</span>
              </div>
            </div>
          </div>

          {/* Floating Telemetry Element 4: xG Threat Index with animated reticle */}
          <div className="absolute bottom-8 right-6 sm:right-14 p-3 sm:p-4 rounded-2xl bg-[#121A2E]/90 backdrop-blur-md border border-[#1C2745] shadow-xl flex items-center gap-3 z-20 hover:border-[#FF6B2C]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 flex items-center justify-center relative">
              <Crosshair className="w-5 h-5 text-[#FF6B2C] animate-spin [animation-duration:12s]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#9AA4BF] uppercase block">Goal Expectancy</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-base sm:text-lg font-bold text-white">0.78 xG</span>
                <span className="text-[10px] text-[#FF6B2C] font-bold">High Threat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center">
          <button
            onClick={scrollToFeatures}
            className="flex flex-col items-center gap-2 text-[#9AA4BF] hover:text-white transition-colors group cursor-pointer"
            aria-label="Scroll down to features"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">
              EXPLORE ARCHITECTURE
            </span>
            <div className="w-8 h-8 rounded-full border border-[#1C2745] flex items-center justify-center group-hover:border-[#2D6BFF] transition-colors bg-[#0B1020]">
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Animated Sports-Stat Ticker */}
      <section id="ticker" className="border-y border-[#1C2745] bg-[#070B16] py-3.5 overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee font-mono text-xs text-[#9AA4BF]">
          <span className="inline-flex items-center gap-2 text-white font-bold">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            LIVE TELEMETRY STREAM:
          </span>
          <span className="inline-flex items-center gap-2 text-[#F5F7FF]">
            <span className="text-[#B6FF3B] font-bold">[CRICKET]</span>
            IND vs AUS: Virat Kohli 74(41) • Impact Score: 94.2 • Win Prob: 88%
          </span>
          <span className="text-[#1C2745]">•</span>
          <span className="inline-flex items-center gap-2 text-[#F5F7FF]">
            <span className="text-[#2D6BFF] font-bold">[FOOTBALL]</span>
            MCI 3 - 1 RMA: Haaland 1.37 xG • Rodri 98 Passes (92% acc) • Field Tilt: 71%
          </span>
          <span className="text-[#1C2745]">•</span>
          <span className="inline-flex items-center gap-2 text-[#F5F7FF]">
            <span className="text-[#FF6B2C] font-bold">[OLYMPICS]</span>
            100m Sprint: Noah Lyles 43.8 km/h • 4.88 Hz Cadence • Ground Contact 84ms
          </span>
          <span className="text-[#1C2745]">•</span>
          <span className="inline-flex items-center gap-2 text-[#F5F7FF]">
            <span className="text-[#B6FF3B] font-bold">[WORKLOAD SAFETY]</span>
            ACWR Index: 1.18 (Green Zone) • Hamstring Strain Protection Active
          </span>
        </div>
      </section>

      {/* Google Nano Banana AI Visual Studio Showcase */}
      <section id="studio" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <NanoBananaVisualStudio />
      </section>

      {/* Responsive Bento Grid Highlighting 4 AI Pillars */}
      <section id="sports" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#121A2E] text-[#2D6BFF] border border-[#1C2745] mb-4">
            <Layers className="w-3.5 h-3.5" />
            FOUR PILLARS OF HIGH-PERFORMANCE INTELLIGENCE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
            Architected for the Fraction of a Second That Wins.
          </h2>
          <p className="text-sm sm:text-base text-[#9AA4BF] mt-3 leading-relaxed">
            Every module delivers quantifiable competitive advantage, engineered with mathematical rigor and sub-frame precision.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Card 1: Sports Intelligence (Col 7) */}
          <div 
            onMouseEnter={() => setHoveredBento(1)}
            onMouseLeave={() => setHoveredBento(null)}
            className="lg:col-span-7 rounded-3xl bg-[#0B1020] border border-[#1C2745] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#2D6BFF]/60 transition-all shadow-xl"
          >
            {/* Visual Backdrop: Cricket Match Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/images/cricket/cricket_batter_stadium.jpg"
                alt="Cricket Analytics Visual"
                className="w-full h-full object-cover object-center opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/80 to-[#0B1020]/40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2D6BFF]/10 border border-[#2D6BFF]/30 flex items-center justify-center text-[#2D6BFF]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#121A2E]/90 backdrop-blur-sm text-white border border-[#1C2745]">
                  PILLAR 01 • PREDICTION
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white group-hover:text-[#2D6BFF] transition-colors">
                Sports Intelligence & Tactical Simulation
              </h3>
              <p className="text-sm text-[#9AA4BF] mt-2 leading-relaxed max-w-xl">
                Continuous dynamic match probability models factoring pitch degradation, bowler stamina curves, and territorial passing networks. Generates winning scenario trees in real-time.
              </p>
            </div>

            {/* Simulated mini HUD visual */}
            <div className="mt-8 p-4 rounded-2xl bg-[#05070D]/90 backdrop-blur-md border border-[#1C2745] font-mono text-xs space-y-2 relative z-10">
              <div className="flex justify-between items-center text-[#9AA4BF]">
                <span>Win Expectancy Curve:</span>
                <span className="text-[#2D6BFF] font-bold">88.4% Confidence</span>
              </div>
              <div className="w-full bg-[#121A2E] h-2 rounded-full overflow-hidden flex">
                <div className="bg-[#2D6BFF] w-[88%] h-full" />
                <div className="bg-[#B6FF3B] w-[12%] h-full" />
              </div>
              <div className="flex justify-between text-[10px] text-[#9AA4BF]">
                <span>Projected Target: 208 Runs</span>
                <span>Margin Delta: +14.2%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Computer Vision (Col 5) */}
          <div 
            onMouseEnter={() => setHoveredBento(2)}
            onMouseLeave={() => setHoveredBento(null)}
            className="lg:col-span-5 rounded-3xl bg-[#0B1020] border border-[#1C2745] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#B6FF3B]/60 transition-all shadow-xl"
          >
            {/* Visual Backdrop: Abstract Telemetry Mesh */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/images/abstract/sports_telemetry_mesh.jpg"
                alt="Computer Vision Mesh Visual"
                className="w-full h-full object-cover object-center opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/80 to-[#0B1020]/40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#B6FF3B]/10 border border-[#B6FF3B]/30 flex items-center justify-center text-[#B6FF3B]">
                  <Video className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#121A2E]/90 backdrop-blur-sm text-white border border-[#1C2745]">
                  PILLAR 02 • VISION
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white group-hover:text-[#B6FF3B] transition-colors">
                Computer Vision & Pose Tracking
              </h3>
              <p className="text-sm text-[#9AA4BF] mt-2 leading-relaxed">
                60 FPS sub-millimeter anatomical joint landmark inference right in the browser. Zero video uploads, zero cloud latency.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-[#05070D]/90 backdrop-blur-md border border-[#1C2745] flex items-center justify-between font-mono text-xs relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B6FF3B] animate-pulse" />
                <span className="text-white">33-Point Skeleton</span>
              </div>
              <span className="text-[#B6FF3B] font-bold">4.2ms Latency</span>
            </div>
          </div>

          {/* Card 3: Performance Analytics (Col 5) */}
          <div 
            onMouseEnter={() => setHoveredBento(3)}
            onMouseLeave={() => setHoveredBento(null)}
            className="lg:col-span-5 rounded-3xl bg-[#0B1020] border border-[#1C2745] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#FF6B2C]/60 transition-all shadow-xl"
          >
            {/* Visual Backdrop: Olympic Sprint Kinematics */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/images/olympics/olympic_sprint_track.jpg"
                alt="Olympic Sprint Kinematics Visual"
                className="w-full h-full object-cover object-center opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/80 to-[#0B1020]/40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 flex items-center justify-center text-[#FF6B2C]">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#121A2E]/90 backdrop-blur-sm text-white border border-[#1C2745]">
                  PILLAR 03 • TELEMETRY
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white group-hover:text-[#FF6B2C] transition-colors">
                Performance Telemetry & Kinematics
              </h3>
              <p className="text-sm text-[#9AA4BF] mt-2 leading-relaxed">
                F1-style telemetry channels tracking peak ground horizontal impulse, cadence step frequency, and rotational seam torque.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-[#05070D]/90 backdrop-blur-md border border-[#1C2745] font-mono text-xs flex justify-between items-center relative z-10">
              <span className="text-[#9AA4BF]">Top Speed / Cadence:</span>
              <span className="text-white font-bold">43.8 km/h @ 4.88 Hz</span>
            </div>
          </div>

          {/* Card 4: AI Coaching & Injury Risk (Col 7) */}
          <div 
            onMouseEnter={() => setHoveredBento(4)}
            onMouseLeave={() => setHoveredBento(null)}
            className="lg:col-span-7 rounded-3xl bg-[#0B1020] border border-[#1C2745] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#B6FF3B]/60 transition-all shadow-xl"
          >
            {/* Visual Backdrop: Football Match Movement */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/images/football/football_striker_match.jpg"
                alt="Football Tactical Movement Visual"
                className="w-full h-full object-cover object-center opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/80 to-[#0B1020]/40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#B6FF3B]/10 border border-[#B6FF3B]/30 flex items-center justify-center text-[#B6FF3B]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#121A2E]/90 backdrop-blur-sm text-white border border-[#1C2745]">
                  PILLAR 04 • WORKLOAD SAFETY
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white group-hover:text-[#B6FF3B] transition-colors">
                AI Coaching & Biomechanical Injury Risk
              </h3>
              <p className="text-sm text-[#9AA4BF] mt-2 leading-relaxed max-w-xl">
                Acute-to-Chronic Workload Ratio (ACWR) safety algorithms that forecast soft-tissue vulnerability up to 72 hours in advance, delivering automated volume adjustments.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-[#05070D]/90 backdrop-blur-md border border-[#1C2745] font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[#9AA4BF]">Modeled ACWR Index:</span>
                <span className="text-[#B6FF3B] font-bold">1.18 Sweet Spot</span>
              </div>
              <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30 text-[10px]">
                0 Soft Tissue Risk Flags
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Telemetry Sandbox Section */}
      <section id="sandbox" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <LiveTelemetrySandbox />
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1020] via-[#121A2E] to-[#0B1020] border border-[#1C2745] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-mono text-[#B6FF3B] uppercase tracking-widest block mb-3">
              READY FOR THE ELITE STANDARD
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white mb-6">
              Step Into the Cockpit of Sports Intelligence.
            </h2>
            <p className="text-sm sm:text-base text-[#9AA4BF] mb-8 leading-relaxed">
              Launch Phase 1 with comprehensive demo datasets across Cricket, Football, and Olympic track & field competitions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-[#2D6BFF] hover:bg-[#2558d6] text-white shadow-xl shadow-[#2D6BFF]/25 transition-all flex items-center justify-center gap-2"
              >
                Launch Dashboard Now
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm sm:text-base font-medium bg-[#05070D] hover:bg-[#121A2E] border border-[#1C2745] text-white transition-all"
              >
                Inspect AI Kinematics Specs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Sports-Tech Footer */}
      <footer id="contact" className="border-t border-[#1C2745] bg-[#070B16] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2D6BFF] to-[#B6FF3B] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#05070D] rounded-[9px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#B6FF3B]" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-xl text-white">APEX</span>
              <span className="text-[10px] block font-mono text-[#9AA4BF]">
                INTEGRATED SPORTS AI ENGINE v9.0
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs font-mono text-[#9AA4BF]">
            <Link href="/dashboard" className="hover:text-white transition-colors">DASHBOARD</Link>
            <Link href="/predictions" className="hover:text-purple-400 transition-colors">PREDICTIONS</Link>
            <Link href="/live" className="hover:text-red-400 transition-colors">LIVE</Link>
            <Link href="/analytics" className="hover:text-[#2D6BFF] transition-colors">ANALYTICS</Link>
            <Link href="/agent" className="hover:text-[#B6FF3B] transition-colors">AI AGENT</Link>
            <Link href="/profile" className="hover:text-emerald-400 transition-colors">PROFILE</Link>
            <Link href="/feedback" className="hover:text-cyan-400 transition-colors">FEEDBACK</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY</Link>
            <Link href="/terms" className="hover:text-white transition-colors">TERMS</Link>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[#9AA4BF]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL • FASTAPI + NEXT.JS</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-[#1C2745]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#5A6785]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 APEX Sports Intelligence Platform.</span>
            <span className="text-[#1C2745] hidden sm:inline">•</span>
            <a
              href="https://github.com/evilswordboy-bot/apex-intelligence"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9AA4BF] hover:text-[#B6FF3B] transition-colors"
            >
              GitHub Repository
            </a>
            <span className="text-[#1C2745] hidden sm:inline">•</span>
            <a
              href="https://github.com/evilswordboy-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9AA4BF] hover:text-[#2D6BFF] transition-colors"
            >
              @evilswordboy-bot
            </a>
            <span className="text-[#1C2745] hidden sm:inline">•</span>
            <a
              href="https://github.com/kowshik152008-dk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9AA4BF] hover:text-purple-400 transition-colors"
            >
              @kowshik152008-dk
            </a>
          </div>
          <span>Crafted with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, & FastAPI.</span>
        </div>
      </footer>

      {/* Performance AI Discovery Modal */}
      <PerformanceAIDiscoveryModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      {/* Fullscreen Masterpiece Anime Cinema Modal */}
      {isFullscreenAnimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-7xl h-[92vh] rounded-3xl overflow-hidden border border-[#2D6BFF]/60 shadow-[0_0_80px_rgba(45,107,255,0.3)] flex flex-col bg-[#05070D]">
            {/* Modal Top Bar */}
            <div className="h-16 bg-[#070B16]/95 border-b border-[#1C2745] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-pulse" />
                <span className="font-display font-black text-white text-sm sm:text-lg tracking-wider">
                  APEX MASTERPIECE ANIME 4K CINEMA
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#2D6BFF]/10 text-[#2D6BFF] border border-[#2D6BFF]/30 hidden sm:inline font-bold">
                  STUDIO QUALITY ULTRA-HD
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Scene Switcher inside Modal */}
                <div className="hidden md:inline-flex p-1 rounded-xl bg-[#05070D] border border-[#1C2745]">
                  {(['all', 'cricket', 'football', 'olympics'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveAnimeScene(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                        activeAnimeScene === s 
                          ? 'bg-[#121A2E] text-[#06B6D4] font-bold border border-[#06B6D4]/50 shadow-md' 
                          : 'text-[#9AA4BF] hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsFullscreenAnimeModalOpen(false)}
                  className="p-2 rounded-xl bg-[#121A2E] hover:bg-red-500/20 text-[#9AA4BF] hover:text-red-400 border border-[#1C2745] hover:border-red-500/40 transition-all cursor-pointer"
                  aria-label="Close Fullscreen Cinema"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Viewport */}
            <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-black">
              <img
                key={activeAnimeScene}
                src={
                  activeAnimeScene === 'cricket'
                    ? '/images/cricket/apex_anime_cricket.jpg'
                    : activeAnimeScene === 'football'
                    ? '/images/football/apex_anime_football.jpg'
                    : activeAnimeScene === 'olympics'
                    ? '/images/olympics/apex_anime_olympics.jpg'
                    : '/images/hero/apex_anime_sports_cinematic.jpg'
                }
                alt="Fullscreen Masterpiece Anime"
                className="w-full h-full object-cover sm:object-contain object-center transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070D]/90 via-transparent to-[#05070D]/30 pointer-events-none" />

              {/* Bottom Holographic HUD Telemetry Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#070B16]/90 border border-[#1C2745] backdrop-blur-2xl shadow-2xl">
                <div>
                  <div className="text-white font-bold font-display text-base sm:text-lg capitalize flex items-center gap-2">
                    <span>
                      {activeAnimeScene === 'all' 
                        ? 'Triple Apex Sports Titans • Cricket, Football & Olympic Athletics' 
                        : `${activeAnimeScene} Biomechanical Kinematics`}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ACTIVE SCENE
                    </span>
                  </div>
                  <div className="text-xs text-[#9AA4BF] font-mono mt-0.5">
                    Studio Ufotable & Trigger High-Energy Anime Aesthetic • Real-Time Spatial Synthesis
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsFullscreenAnimeModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B6FF3B] to-[#06B6D4] text-black font-bold text-xs font-mono transition-all shadow-lg hover:scale-105"
                  >
                    Open Live Telemetry Lab →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
