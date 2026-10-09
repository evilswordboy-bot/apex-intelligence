"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  LayoutDashboard, 
  Activity, 
  Crosshair, 
  Award, 
  Video, 
  Bot, 
  FileText, 
  ShieldAlert, 
  Settings, 
  Search, 
  Bell, 
  Menu, 
  X,
  ChevronRight,
  TrendingUp,
  Cpu,
  Users,
  Gauge,
  Sliders,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Radio,
  User,
  BarChart3,
  Brain,
  MessageSquarePlus
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

import CricketLab from '@/components/CricketLab';
import FootballLab from '@/components/FootballLab';
import OlympicLab from '@/components/OlympicLab';
import EdgeAIDemo from '@/components/EdgeAIDemo';
import CoachReports from '@/components/CoachReports';
import WorkloadFatigue from '@/components/WorkloadFatigue';
import AthleteComparison from '@/components/AthleteComparison';
import CommandPalette from '@/components/CommandPalette';
import AIAgentWorkspace from '@/components/AIAgentWorkspace';
import SportsIntelligenceAnalytics from '@/components/SportsIntelligenceAnalytics';
import LiveMatchCentre from '@/components/LiveMatchCentre';
import PredictionsLab from '@/components/PredictionsLab';
import UserProfileManager from '@/components/UserProfileManager';
import PlatformFeedbackHub from '@/components/PlatformFeedbackHub';
import AuthModal from '@/components/AuthModal';
import { AuthProvider, useAuth } from '@/context/AuthContext';

import { 
  OVERVIEW_KPIS, 
  RECENT_TELEMETRY_ACTIVITIES, 
  PERFORMANCE_TRENDS_DATA 
} from '@/data/sportsData';

function DashboardContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'feedback' | 'predictions' | 'analytics' | 'live' | 'cricket' | 'football' | 'olympics' | 'comparison' | 'edge-ai' | 'analyst' | 'reports' | 'workload' | 'settings'>('overview');
  const [globalSport, setGlobalSport] = useState<'all' | 'cricket' | 'football' | 'olympics'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timeframe filter for performance trends chart
  const [trendTimeframe, setTrendTimeframe] = useState<'last5' | 'season' | 'live'>('last5');
  const [trendMetric, setTrendMetric] = useState<'performance' | 'workload' | 'efficiency'>('performance');

  // Check URL query parameters for initial tab or sport
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const sportParam = params.get('sport');
      if (tabParam) {
        if (tabParam === 'agent') {
          setActiveTab('analyst');
        } else if (['overview', 'profile', 'feedback', 'predictions', 'analytics', 'live', 'cricket', 'football', 'olympics', 'comparison', 'edge-ai', 'analyst', 'reports', 'workload', 'settings'].includes(tabParam)) {
          setActiveTab(tabParam as any);
        }
      }
      if (sportParam && ['all', 'cricket', 'football', 'olympics'].includes(sportParam)) {
        setGlobalSport(sportParam as any);
      }
    }
  }, []);

  // Trigger quick notification toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial responsive sidebar sizing: collapsed on tablet (<1024px), expanded on desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  // Compute sport accent color
  const getSportAccent = () => {
    switch (globalSport) {
      case 'cricket': return '#B6FF3B';
      case 'football': return '#2D6BFF';
      case 'olympics': return '#FF6B2C';
      default: return '#2D6BFF';
    }
  };

  const currentAccent = getSportAccent();
  const kpiData = OVERVIEW_KPIS[globalSport];
  const chartData = PERFORMANCE_TRENDS_DATA[trendTimeframe];

  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Personalization', icon: User, badge: 'Phase 8', color: 'text-emerald-400' },
    { id: 'feedback', label: 'Feedback & Operations', icon: MessageSquarePlus, badge: 'Phase 10', color: 'text-cyan-400' },
    { id: 'predictions', label: 'AI Match Predictor', icon: Brain, badge: 'Phase 7 ML', color: 'text-purple-400' },
    { id: 'live', label: 'Live Match Centre', icon: Radio, badge: 'LIVE', color: 'text-red-500' },
    { id: 'analytics', label: 'Sports Intelligence', icon: BarChart3, badge: 'Phase 5 AI', color: 'text-[#2D6BFF]' },
    { id: 'comparison', label: 'Athlete Comparison', icon: Users, badge: 'Benchmark', color: 'text-amber-400' },
    { id: 'cricket', label: 'Cricket Lab', icon: Activity, badge: 'IPL / Live', color: 'text-[#B6FF3B]' },
    { id: 'football', label: 'Football Lab', icon: Crosshair, badge: 'xG Engine', color: 'text-[#2D6BFF]' },
    { id: 'olympics', label: 'Olympic Lab', icon: Award, badge: 'Kinematics', color: 'text-[#FF6B2C]' },
    { id: 'workload', label: 'Workload & Fatigue', icon: ShieldAlert, badge: 'ACWR Guard' },
    { id: 'edge-ai', label: 'Edge Vision AI', icon: Video, badge: '60 FPS' },
    { id: 'analyst', label: 'AI Sports Analyst', icon: Bot, badge: 'Copilot' },
    { id: 'reports', label: 'Coach Reports', icon: FileText, badge: 'PDF' },
  ];

  const handleSportSwitch = (sport: 'all' | 'cricket' | 'football' | 'olympics') => {
    setGlobalSport(sport);
    if (sport === 'cricket') setActiveTab('cricket');
    else if (sport === 'football') setActiveTab('football');
    else if (sport === 'olympics') setActiveTab('olympics');
    triggerToast(`Global sport context calibrated to ${sport.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-[#F5F7FF] flex selection:bg-[#2D6BFF] selection:text-white relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#B6FF3B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Collapsible Sidebar */}
      <aside 
        className={`hidden md:flex shrink-0 ${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-[#070B16] border-r border-[#1C2745] transition-all duration-300 flex-col justify-between p-3.5 sticky top-0 h-screen z-40`}
      >
        <div>
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/branding/apex-logo.svg" 
                alt="APEX Logo" 
                className="w-9 h-9 rounded-xl shrink-0 shadow-md shadow-[#2D6BFF]/20" 
              />
              {sidebarOpen && (
                <div>
                  <span className="font-display font-black text-xl tracking-wider text-white">APEX</span>
                  <span className="text-[10px] block font-mono text-[#9AA4BF]">SPORTS AI</span>
                </div>
              )}
            </Link>

            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#9AA4BF] hover:text-white p-1.5 rounded-lg bg-[#0B1020] border border-[#1C2745] hover:border-[#2D6BFF]/40 transition-colors"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (item.id === 'cricket') setGlobalSport('cricket');
                    if (item.id === 'football') setGlobalSport('football');
                    if (item.id === 'olympics') setGlobalSport('olympics');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-[#121A2E] text-white shadow-md border border-[#1C2745] font-bold'
                      : 'text-[#9AA4BF] hover:text-white hover:bg-[#0B1020]'
                  }`}
                  style={isActive ? { borderLeftColor: currentAccent, borderLeftWidth: '3px' } : {}}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.color || 'text-white/80'}`} />
                  {sidebarOpen && (
                    <div className="flex-1 flex items-center justify-between text-left overflow-hidden">
                      <span className="text-xs whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#05070D] text-[#9AA4BF] border border-[#1C2745]/60 shrink-0 ml-1.5">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Account Card */}
        {sidebarOpen ? (
          <div 
            onClick={() => {
              if (isAuthenticated) {
                setActiveTab('profile');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="p-3 rounded-xl bg-[#0B1020] border border-[#1C2745] flex items-center gap-3 cursor-pointer hover:border-[#2D6BFF]/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2D6BFF] to-[#B6FF3B] flex items-center justify-center font-bold text-xs text-black shrink-0">
              {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'AP'}
            </div>
            <div className="flex-1 overflow-hidden">
              <span className="text-xs font-bold block truncate text-white group-hover:text-[#B6FF3B] transition-colors">
                {user?.full_name || 'Sign In / Register'}
              </span>
              <span className="text-[10px] font-mono text-[#9AA4BF] block truncate">
                {isAuthenticated ? (user?.role?.toUpperCase() || 'USER') + ' • CLOUD SYNC' : 'GUEST • CLICK TO LOGIN'}
              </span>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => {
              if (isAuthenticated) {
                setActiveTab('profile');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="w-8 h-8 rounded-full mx-auto bg-gradient-to-r from-[#2D6BFF] to-[#B6FF3B] flex items-center justify-center font-bold text-xs text-black hover:ring-2 hover:ring-[#B6FF3B] transition-all"
            aria-label="Profile"
          >
            {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'AP'}
          </button>
        )}
      </aside>

      {/* Mobile Drawer Navigation (390px, 768px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md flex">
          <div className="w-72 bg-[#070B16] border-r border-[#1C2745] p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center gap-2">
                  <img src="/branding/apex-logo.svg" alt="APEX Logo" className="w-7 h-7 rounded-lg" />
                  <span className="font-display font-black text-xl text-white">APEX</span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#9AA4BF] hover:text-white rounded-lg bg-[#0B1020]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium ${
                        isActive
                          ? 'bg-[#121A2E] text-white font-bold border border-[#1C2745]'
                          : 'text-[#9AA4BF] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-white" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#05070D] text-[#9AA4BF]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#1C2745]">
              <Link 
                href="/"
                className="w-full py-2.5 rounded-xl bg-[#0B1020] text-center text-xs font-mono text-[#9AA4BF] block"
              >
                Back to Landing Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-[#1C2745] bg-[#070B16]/85 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#0B1020] border border-[#1C2745] text-[#9AA4BF] hover:text-white"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Global Sport Switcher Pills - visible on tablet and desktop */}
            <div className="hidden sm:inline-flex p-1 rounded-xl bg-[#05070D] border border-[#1C2745]">
              {(['all', 'cricket', 'football', 'olympics'] as const).map((s) => {
                const isActive = globalSport === s;
                let activeColor = '#2D6BFF';
                if (s === 'cricket') activeColor = '#B6FF3B';
                if (s === 'football') activeColor = '#2D6BFF';
                if (s === 'olympics') activeColor = '#FF6B2C';

                return (
                  <button
                    key={s}
                    onClick={() => handleSportSwitch(s)}
                    className={`px-2.5 lg:px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all capitalize ${
                      isActive
                        ? 'bg-[#121A2E] text-white shadow-sm border border-[#1C2745]'
                        : 'text-[#9AA4BF] hover:text-white'
                    }`}
                    style={isActive ? { color: activeColor, borderColor: `${activeColor}55` } : {}}
                  >
                    {s === 'all' ? 'All' : s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Trigger (Ctrl+K) & User Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#05070D] border border-[#1C2745] text-xs text-[#9AA4BF] hover:text-white hover:border-[#2D6BFF]/50 transition-colors"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Search Telemetry...</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 rounded bg-[#121A2E] text-[10px] font-mono text-white border border-[#1C2745]">
                Ctrl K
              </kbd>
            </button>

            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF3B] animate-pulse" />
              ONLINE
            </div>

            <button 
              onClick={() => triggerToast('System Health: 100% telemetry streams calibrated.')}
              className="p-2 rounded-xl bg-[#0B1020] border border-[#1C2745] text-[#9AA4BF] hover:text-white transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#2D6BFF] absolute top-1.5 right-1.5" />
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0B1020] hover:bg-[#121A2E] border border-emerald-500/40 text-xs font-semibold text-emerald-400 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center font-mono text-[10px] text-emerald-300">
                  {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline">{user?.full_name?.split(' ')[0] || 'Profile'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#B6FF3B] hover:bg-[#a6ef2c] text-black text-xs font-bold transition-all shadow-md shadow-[#B6FF3B]/10"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <Link
              href="/"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0B1020] hover:bg-[#121A2E] border border-[#1C2745] text-xs font-semibold text-white transition-colors whitespace-nowrap"
            >
              Exit Home
            </Link>
          </div>
        </header>

        {/* Mobile Horizontal Sport Switcher Bar */}
        <div className="sm:hidden flex items-center gap-2 px-4 py-2.5 border-b border-[#1C2745] bg-[#070B16] overflow-x-auto">
          {(['all', 'cricket', 'football', 'olympics'] as const).map((s) => {
            const isActive = globalSport === s;
            let activeColor = '#2D6BFF';
            if (s === 'cricket') activeColor = '#B6FF3B';
            if (s === 'football') activeColor = '#2D6BFF';
            if (s === 'olympics') activeColor = '#FF6B2C';

            return (
              <button
                key={s}
                onClick={() => handleSportSwitch(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all capitalize whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-[#121A2E] text-white shadow-sm'
                    : 'bg-[#0B1020] text-[#9AA4BF] border-[#1C2745]'
                }`}
                style={isActive ? { color: activeColor, borderColor: activeColor } : {}}
              >
                {s === 'all' ? 'All Disciplines' : s}
              </button>
            );
          })}
        </div>

        {/* Dashboard Dynamic View Body */}
        <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Executive Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0B1020] via-[#121A2E] to-[#0B1020] border border-[#1C2745] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Visual Backdrop: Abstract Telemetry Mesh */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src="/images/abstract/sports_telemetry_mesh.jpg"
                    alt="Sports Telemetry Mesh"
                    className="w-full h-full object-cover object-right opacity-20 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B1020] via-[#0B1020]/90 to-transparent" />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono tracking-wider uppercase" style={{ color: currentAccent }}>
                      APEX TELEMETRY CONSOLE
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold shrink-0">
                      DEMO DATA ACTIVE
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white">
                    Sports Performance Intelligence
                  </h1>
                  <p className="text-xs sm:text-sm text-[#9AA4BF] mt-1 leading-relaxed">
                    Zero-latency biomechanical edge models, expected value simulations, and acute fatigue safety limits.
                  </p>
                </div>

                <div className="self-start sm:self-auto flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] text-xs font-mono text-white flex items-center gap-2 transition-all whitespace-nowrap"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    Athlete Comparison
                  </button>
                </div>
              </div>

              {/* 4 Executive Overview KPI Cards (DEMO DATA) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Player Performance */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between relative overflow-hidden hover:border-[#2D6BFF]/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#9AA4BF] mb-2 font-mono">
                      <span className="truncate pr-1">{kpiData.playerPerformance.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-amber-400 border border-amber-500/30 shrink-0">
                        DEMO
                      </span>
                    </div>
                    <div className="text-3xl font-black font-display text-white">
                      {kpiData.playerPerformance.score}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1C2745] flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                    <span className="text-[#B6FF3B] flex items-center gap-1 font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      {kpiData.playerPerformance.delta}
                    </span>
                    <span className="text-[#9AA4BF] text-[10px] uppercase">
                      {kpiData.playerPerformance.status}
                    </span>
                  </div>
                </div>

                {/* KPI 2: Team Efficiency */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between relative overflow-hidden hover:border-[#2D6BFF]/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#9AA4BF] mb-2 font-mono">
                      <span className="truncate pr-1">{kpiData.teamEfficiency.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-amber-400 border border-amber-500/30 shrink-0">
                        DEMO
                      </span>
                    </div>
                    <div className="text-3xl font-black font-display text-white">
                      {kpiData.teamEfficiency.percentage}%
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1C2745] flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                    <span className="text-[#2D6BFF] flex items-center gap-1 font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      {kpiData.teamEfficiency.delta}
                    </span>
                    <span className="text-[#9AA4BF] text-[10px] uppercase">
                      {kpiData.teamEfficiency.status}
                    </span>
                  </div>
                </div>

                {/* KPI 3: High-Intensity Workload */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between relative overflow-hidden hover:border-[#2D6BFF]/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#9AA4BF] mb-2 font-mono">
                      <span className="truncate pr-1">{kpiData.workload.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-amber-400 border border-amber-500/30 shrink-0">
                        DEMO
                      </span>
                    </div>
                    <div className="text-3xl font-black font-display text-white">
                      {kpiData.workload.value}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1C2745] flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      {kpiData.workload.status}
                    </span>
                    <span className="text-[#9AA4BF] text-[10px]">Optimal</span>
                  </div>
                </div>

                {/* KPI 4: Real-time Win Probability */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col justify-between relative overflow-hidden hover:border-[#2D6BFF]/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#9AA4BF] mb-2 font-mono">
                      <span className="truncate pr-1">{kpiData.winProbability.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-amber-400 border border-amber-500/30 shrink-0">
                        DEMO
                      </span>
                    </div>
                    <div className="text-3xl font-black font-display" style={{ color: currentAccent }}>
                      {kpiData.winProbability.percentage}%
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1C2745] flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                    <span className="text-white flex items-center gap-1 font-bold">
                      {kpiData.winProbability.odds}
                    </span>
                    <span className="text-[#9AA4BF] text-[10px] uppercase">Confidence</span>
                  </div>
                </div>
              </div>

              {/* Interactive Performance Trends Chart with Timeframe Filters */}
              <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#2D6BFF]" />
                      <h3 className="text-lg font-bold font-display text-white">
                        Multi-Session Performance Trends
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        DEMO DATA
                      </span>
                    </div>
                    <p className="text-xs text-[#9AA4BF] mt-0.5">
                      Tracking aggregate output, physiological workload volume, and tactical efficiency rating.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex p-1 rounded-xl bg-[#05070D] border border-[#1C2745]">
                      <button
                        onClick={() => setTrendTimeframe('last5')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          trendTimeframe === 'last5'
                            ? 'bg-[#121A2E] text-white border border-[#1C2745] font-bold'
                            : 'text-[#9AA4BF] hover:text-white'
                        }`}
                      >
                        Last 5 Matches
                      </button>
                      <button
                        onClick={() => setTrendTimeframe('season')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          trendTimeframe === 'season'
                            ? 'bg-[#121A2E] text-white border border-[#1C2745] font-bold'
                            : 'text-[#9AA4BF] hover:text-white'
                        }`}
                      >
                        Season 2026
                      </button>
                      <button
                        onClick={() => setTrendTimeframe('live')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                          trendTimeframe === 'live'
                            ? 'bg-[#121A2E] text-white border border-[#1C2745] font-bold'
                            : 'text-[#9AA4BF] hover:text-white'
                        }`}
                      >
                        Session Live
                      </button>
                    </div>
                  </div>
                </div>

                {/* Area Chart Container */}
                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="trendPerformance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2D6BFF" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2D6BFF" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="trendEfficiency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#B6FF3B" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#B6FF3B" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1C2745" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="session" stroke="#4F5D73" fontSize={11} tickLine={false} />
                      <YAxis stroke="#4F5D73" fontSize={11} tickLine={false} domain={[60, 100]} />
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
                        dataKey="performance" 
                        name="Performance Score"
                        stroke="#2D6BFF" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#trendPerformance)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="efficiency" 
                        name="Efficiency %"
                        stroke="#B6FF3B" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#trendEfficiency)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Head-to-Head Athlete Comparison Panel */}
              <AthleteComparison initialSport={globalSport === 'all' ? 'cricket' : globalSport} />

              {/* Recent Activity Feed & Sport Modules */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Telemetry Activity Stream (Col 2) */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold font-display text-white">
                        Recent Telemetry Stream & Incidents
                      </h3>
                      <p className="text-xs text-[#9AA4BF]">
                        Continuous kinematic events recorded across active sensor clusters.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121A2E] text-[#B6FF3B] border border-[#1C2745]">
                      LIVE FEED
                    </span>
                  </div>

                  <div className="space-y-3">
                    {RECENT_TELEMETRY_ACTIVITIES.map((act) => (
                      <div 
                        key={act.id} 
                        className="p-3.5 rounded-xl bg-[#121A2E] border border-[#1C2745] flex items-start justify-between gap-3 hover:border-[#2D6BFF]/40 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#2D6BFF] mt-1.5 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{act.title}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#05070D] text-[#9AA4BF] uppercase border border-[#1C2745]">
                                {act.sport}
                              </span>
                            </div>
                            <p className="text-xs text-[#9AA4BF] mt-0.5 leading-relaxed">
                              {act.detail}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-white block">
                            {act.metric}
                          </span>
                          <span className="text-[10px] font-mono text-[#9AA4BF]">
                            {act.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Navigation Cards (Col 1) */}
                <div className="space-y-4">
                  <div 
                    onClick={() => { setActiveTab('cricket'); setGlobalSport('cricket'); }}
                    className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] hover:border-[#B6FF3B]/50 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-[#B6FF3B]">CRICKET LAB</span>
                      <ChevronRight className="w-4 h-4 text-[#9AA4BF] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h4 className="text-base font-bold text-white">India vs Australia Final</h4>
                    <p className="text-xs text-[#9AA4BF] mt-1">Wagon Wheel & Batting Impact 94.2</p>
                  </div>

                  <div 
                    onClick={() => { setActiveTab('football'); setGlobalSport('football'); }}
                    className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] hover:border-[#2D6BFF]/50 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-[#2D6BFF]">FOOTBALL LAB</span>
                      <ChevronRight className="w-4 h-4 text-[#9AA4BF] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h4 className="text-base font-bold text-white">Man City vs Real Madrid</h4>
                    <p className="text-xs text-[#9AA4BF] mt-1">xG 2.84 vs 1.12 • Passing Network</p>
                  </div>

                  <div 
                    onClick={() => { setActiveTab('olympics'); setGlobalSport('olympics'); }}
                    className="p-5 rounded-2xl bg-[#0B1020] border border-[#1C2745] hover:border-[#FF6B2C]/50 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-[#FF6B2C]">OLYMPIC LAB</span>
                      <ChevronRight className="w-4 h-4 text-[#9AA4BF] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h4 className="text-base font-bold text-white">Sprint & Javelin Kinematics</h4>
                    <p className="text-xs text-[#9AA4BF] mt-1">Noah Lyles 43.8 km/h • Neeraj Chopra</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-views */}
          {activeTab === 'profile' && <UserProfileManager />}
          {activeTab === 'feedback' && <PlatformFeedbackHub />}
          {activeTab === 'predictions' && <PredictionsLab />}
          {activeTab === 'live' && <LiveMatchCentre />}
          {activeTab === 'analytics' && <SportsIntelligenceAnalytics />}
          {activeTab === 'comparison' && <AthleteComparison initialSport={globalSport === 'all' ? 'cricket' : globalSport} />}
          {activeTab === 'cricket' && <CricketLab />}
          {activeTab === 'football' && <FootballLab />}
          {activeTab === 'olympics' && <OlympicLab />}
          {activeTab === 'workload' && <WorkloadFatigue />}
          {activeTab === 'edge-ai' && <EdgeAIDemo />}
          {activeTab === 'analyst' && <AIAgentWorkspace />}
          {activeTab === 'reports' && <CoachReports />}
        </div>
      </main>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'cricket') setGlobalSport('cricket');
          if (tab === 'football') setGlobalSport('football');
          if (tab === 'olympics') setGlobalSport('olympics');
        }}
      />

      {/* Profile Dialog Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md rounded-2xl bg-[#0B1020] border border-[#1C2745] p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 text-[#9AA4BF] hover:text-white p-1 rounded-lg bg-[#121A2E]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2D6BFF] to-[#B6FF3B] flex items-center justify-center font-display font-black text-xl text-black">
                AP
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Elite Sports Analyst</h3>
                <span className="text-xs font-mono text-[#9AA4BF]">Director of High Performance</span>
              </div>
            </div>

            <div className="space-y-2.5 my-4 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#121A2E] border border-[#1C2745] flex justify-between">
                <span className="text-[#9AA4BF]">Calibration Status:</span>
                <span className="text-[#B6FF3B] font-bold">Sub-Millimeter Lock</span>
              </div>
              <div className="p-3 rounded-xl bg-[#121A2E] border border-[#1C2745] flex justify-between">
                <span className="text-[#9AA4BF]">Engine Mode:</span>
                <span className="text-white">Client WebGPU (0ms API)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#121A2E] border border-[#1C2745] flex justify-between">
                <span className="text-[#9AA4BF]">Active Dataset:</span>
                <span className="text-amber-400 font-bold">DEMO MODE (Phase 1)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsProfileOpen(false);
                triggerToast('Telemetry calibration refreshed successfully.');
              }}
              className="w-full py-2.5 rounded-xl bg-[#2D6BFF] text-white text-xs font-semibold hover:bg-[#2558d6] transition-colors"
            >
              Recalibrate Telemetry Sensors
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal (Sign In / Register / Password Reset) */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          triggerToast('Welcome to APEX Intelligence Lab');
          setActiveTab('profile');
        }}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
