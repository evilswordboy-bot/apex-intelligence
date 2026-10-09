"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Sparkles, BarChart3 } from 'lucide-react';
import SportsIntelligenceAnalytics from '@/components/SportsIntelligenceAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#05070D] text-[#F5F7FF] flex flex-col p-4 md:p-8">
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 mb-6 border-b border-[#1C2745]">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard?tab=analytics"
            className="p-2 rounded-xl bg-[#0B1020] border border-[#1C2745] hover:border-[#2D6BFF] text-[#8F9CAE] hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4 text-[#2D6BFF]" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <img 
              src="/branding/apex-logo.svg" 
              alt="APEX Logo" 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-md shadow-[#2D6BFF]/20 shrink-0" 
            />
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-display font-black text-base sm:text-lg text-white">APEX</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-[#2D6BFF]/10 text-[#2D6BFF] border border-[#2D6BFF]/30 whitespace-nowrap">
                  SPORTS INTELLIGENCE
                </span>
              </div>
              <p className="hidden sm:block text-xs text-[#8F9CAE] font-mono">
                Multimodal Biomechanics, Tactical Simulations & AI Telemetry Insights
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8F9CAE]">
          <span className="w-2 h-2 rounded-full bg-[#B6FF3B] animate-pulse" />
          <span>FastAPI Analytics Bus Online (Port 8000)</span>
        </div>
      </div>

      {/* Main Analytics Module */}
      <main className="max-w-7xl mx-auto w-full flex-1">
        <SportsIntelligenceAnalytics />
      </main>
    </div>
  );
}
