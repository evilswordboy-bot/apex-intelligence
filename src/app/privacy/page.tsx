"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
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
        <span className="text-xs font-mono text-[#9AA4BF]">APEX COMPLIANCE POLICY v10.0</span>
      </div>

      <main className="max-w-4xl mx-auto w-full flex-1 space-y-8 py-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121A2E] text-xs font-mono text-emerald-400 border border-emerald-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>PRIVACY-FIRST SPORTS ARCHITECTURE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">
            APEX Privacy Policy & Data Safeguards
          </h1>
          <p className="text-sm font-mono text-[#9AA4BF]">
            Last updated: October 2026 • Governing APEX Sports Intelligence Platform
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#9AA4BF] leading-relaxed font-sans">
          <section className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-3">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#2D6BFF]" />
              1. On-Device Computer Vision & Zero Video Storage
            </h2>
            <p>
              APEX processes optical pose landmark tracking directly inside your web browser using client-accelerated WebGPU/WebGL runtime libraries. <strong>Video feeds, camera frames, and physical recordings are never transmitted to our cloud servers, saved in persistent storage, or sold to third parties.</strong>
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-3">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#B6FF3B]" />
              2. Cryptographic Account & Password Protection
            </h2>
            <p>
              User accounts created on APEX are secured using salted <strong>PBKDF2-HMAC-SHA256</strong> hashing (100,000 iterations). Plaintext passwords are never logged or stored. Session authentication is mediated by industry-standard HS256 JWT tokens.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-3">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              3. Telemetry, Cookies & Product Analytics
            </h2>
            <p>
              APEX records aggregated, non-personally identifiable product usage events (such as page views, model predictions run, and CSV exports) to ensure high operational reliability. We do not embed commercial advertising networks or third-party behavioral trackers.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-[#0B1020] border border-[#1C2745] space-y-3">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              4. Right to Deletion & GDPR Compliance
            </h2>
            <p>
              Users hold the right to export their telemetry reports or completely delete their account at any time. When an account is deleted via the Profile settings, all associated profiles, favorites, preferences, and reset tokens are permanently purged in a single cascading database operation.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-[#1C2745] flex items-center justify-between text-xs font-mono text-[#5A6785]">
          <span>APEX Sports Technologies Platform</span>
          <Link href="/terms" className="hover:text-white transition-colors">View Terms of Service →</Link>
        </div>
      </main>
    </div>
  );
}
