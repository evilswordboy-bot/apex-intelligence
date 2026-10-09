"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#05070D] text-[#F5F7FF] flex flex-col p-4 sm:p-8">
      <div className="max-w-4xl mx-auto w-full pb-6 mb-6 border-b border-[#1C2745] flex items-center justify-between">
        <Link
          href="/"
          className="p-2 rounded-xl bg-[#0B1020] border border-[#1C2745] hover:border-[#B6FF3B] text-[#8F9CAE] hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
        >
          <ArrowLeft className="w-4 h-4 text-[#B6FF3B]" />
          <span>Return Home</span>
        </Link>
        <span className="text-xs font-mono text-[#9AA4BF]">APEX SERVICE TERMS v10.0</span>
      </div>

      <main className="max-w-4xl mx-auto w-full flex-1 space-y-8 py-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2E] text-xs font-mono text-[#2D6BFF] border border-[#2D6BFF]/30">
            <Scale className="w-3.5 h-3.5" />
            <span>OPERATIONAL TERMS & MODEL DISCLAIMER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            APEX Terms of Service & Model Disclaimers
          </h1>
          <p className="text-sm font-mono text-[#9AA4BF]">
            Last updated: October 2026 • Governing APEX Sports Intelligence Platform
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#9AA4BF] leading-relaxed font-sans">
          <section className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-3">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              1. Probabilistic Machine Learning Disclaimer
            </h2>
            <p>
              APEX provides probabilistic outcome estimates, expected scorelines, and tactical simulations based on historical match telemetry. <strong>Model predictions are statistical forecasts and do not guarantee actual sporting outcomes.</strong> APEX is not a sports wagering or gambling service.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-3">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              2. Synthetic Demonstrations & Data Labeling
            </h2>
            <p>
              To maintain 100% functionality without requiring external proprietary API keys, APEX utilizes calibrated local relays and synthetic demonstration data alongside real Cricsheet records. All demonstration datasets are clearly flagged with <code>DEMO DATA</code> badges.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-3">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#2D6BFF]" />
              3. Permitted Platform Usage
            </h2>
            <p>
              APEX is designed for athletic performance coaches, sports data scientists, scouts, and performance directors. Automated scraping, malicious denial-of-service traffic, or attempts to bypass authentication boundaries are strictly prohibited.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-[#1C2745] flex items-center justify-between text-xs font-mono text-[#5A6785]">
          <span>APEX Sports Technologies Platform</span>
          <Link href="/privacy" className="hover:text-white transition-colors">View Privacy Policy →</Link>
        </div>
      </main>
    </div>
  );
}
