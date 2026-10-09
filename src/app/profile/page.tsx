"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, ShieldCheck } from 'lucide-react';
import UserProfileManager from '@/components/UserProfileManager';
import { AuthProvider } from '@/context/AuthContext';

export default function ProfilePage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#05070D] text-[#F5F7FF] flex flex-col p-4 md:p-8">
        {/* Top Header Navigation */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 mb-6 border-b border-[#1C2745]">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard?tab=profile"
              className="p-2 rounded-xl bg-[#0B1020] border border-[#1C2745] hover:border-emerald-500 text-[#8F9CAE] hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <img 
                src="/branding/apex-logo.svg" 
                alt="APEX Logo" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-md shadow-emerald-500/20 shrink-0" 
              />
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-display font-black text-base sm:text-lg text-white">APEX</span>
                  <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    USER PROFILE & ACCOUNTS
                  </span>
                </div>
                <p className="hidden sm:block text-xs text-[#8F9CAE] font-mono">
                  Personalized Telemetry, Saved Squads, Regional Units & Dashboard Layouts
                </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8F9CAE]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FastAPI Secure Auth Engine (Port 8000)</span>
          </div>
        </div>

        {/* Main User Profile Workspace */}
        <main className="max-w-7xl mx-auto w-full flex-1">
          <UserProfileManager />
        </main>
      </div>
    </AuthProvider>
  );
}
