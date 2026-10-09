"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PlatformFeedbackHub from '@/components/PlatformFeedbackHub';
import { AuthProvider } from '@/context/AuthContext';

export default function FeedbackPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#05070D] text-[#F5F7FF] flex flex-col p-4 md:p-8">
        {/* Top Header Navigation */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 mb-6 border-b border-[#1C2745]">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-[#0B1020] border border-[#1C2745] hover:border-[#B6FF3B] text-[#8F9CAE] hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4 text-[#B6FF3B]" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <img 
                src="/branding/apex-logo.svg" 
                alt="APEX Logo" 
                className="w-9 h-9 rounded-xl shadow-md shadow-[#2D6BFF]/20 shrink-0" 
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-lg text-white">APEX</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30">
                    FEEDBACK & OPERATIONS
                  </span>
                </div>
                <p className="text-xs text-[#8F9CAE] font-mono">
                  Community Feedback, Operational Telemetry & System Diagnostics
                </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8F9CAE]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FastAPI Operational Telemetry (Port 8000)</span>
          </div>
        </div>

        {/* Main Workspace Area */}
        <main className="max-w-7xl mx-auto w-full flex-1">
          <PlatformFeedbackHub />
        </main>
      </div>
    </AuthProvider>
  );
}
