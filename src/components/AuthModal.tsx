"use client";

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { forgotPassword, resetPassword } from '@/lib/authApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'forgot';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(defaultMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [favoriteSport, setFavoriteSport] = useState('all');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status states
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'register') {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.');
        }
        await register(email, password, displayName, favoriteSport);
        onClose();
      } else if (mode === 'forgot') {
        const res = await forgotPassword(email);
        setSuccessMsg(res.message);
        if (res.reset_token) {
          setResetToken(res.reset_token);
          setMode('reset');
        }
      } else if (mode === 'reset') {
        if (newPassword.length < 8) {
          throw new Error('New password must be at least 8 characters long.');
        }
        const ok = await resetPassword(resetToken, newPassword);
        if (ok) {
          setSuccessMsg('Password successfully updated! Please sign in with your new password.');
          setMode('login');
        } else {
          throw new Error('Reset token is invalid or expired.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication operation failed.');
    } finally {
      setLoading(false);
    }
  };

  const autoFillDemo = () => {
    setEmail('scout@apex.ai');
    setPassword('ApexScout2026!');
    setDisplayName('Lead Performance Scout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl bg-[#0B1020] border border-[#1C2745] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D6BFF]/10 blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B6FF3B]/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9AA4BF] hover:text-white p-1.5 rounded-xl bg-[#121A2E] border border-[#1C2745] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2D6BFF] to-[#B6FF3B] flex items-center justify-center font-display font-black text-xl text-black mx-auto mb-3 shadow-lg shadow-[#2D6BFF]/20">
            AP
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white">
            {mode === 'login' && 'Sign In to APEX'}
            {mode === 'register' && 'Create Analyst Account'}
            {mode === 'forgot' && 'Reset APEX Password'}
            {mode === 'reset' && 'Set New Password'}
          </h2>
          <p className="text-xs text-[#9AA4BF] mt-1 font-mono">
            {mode === 'login' && 'Access personalized telemetry, saved squads & custom views'}
            {mode === 'register' && 'Join the next-generation sports performance AI network'}
            {mode === 'forgot' && 'Enter your verified email address to receive recovery token'}
            {mode === 'reset' && 'Enter verification token and choose new password'}
          </p>
        </div>

        {/* Tab Toggle for Login / Register */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex rounded-xl bg-[#121A2E] p-1 border border-[#1C2745] mb-5">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#2D6BFF] text-white shadow-md'
                  : 'text-[#9AA4BF] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-[#B6FF3B] text-black shadow-md'
                  : 'text-[#9AA4BF] hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-400 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-400 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-mono text-[#9AA4BF] block mb-1">DISPLAY NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9AA4BF] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div>
              <label className="text-xs font-mono text-[#9AA4BF] block mb-1">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9AA4BF] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono text-[#9AA4BF]">PASSWORD</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-[11px] font-mono text-[#2D6BFF] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9AA4BF] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="text-xs font-mono text-[#9AA4BF] block mb-1">PRIMARY SPORT FOCUS</label>
              <select
                value={favoriteSport}
                onChange={(e) => setFavoriteSport(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
              >
                <option value="all">All Sports (Omni-Discipline)</option>
                <option value="cricket">Cricket (IPL & T20 Chase Engine)</option>
                <option value="football">Football (xG & Possession Network)</option>
                <option value="olympics">Olympics (Kinematics & Split Times)</option>
              </select>
            </div>
          )}

          {mode === 'reset' && (
            <>
              <div>
                <label className="text-xs font-mono text-[#9AA4BF] block mb-1">RESET TOKEN</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#9AA4BF] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter security token"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#9AA4BF] block mb-1">NEW PASSWORD</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9AA4BF] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 mt-4 shadow-lg ${
              mode === 'register'
                ? 'bg-[#B6FF3B] hover:bg-[#a5f02c] text-black shadow-[#B6FF3B]/20'
                : 'bg-[#2D6BFF] hover:bg-[#2558d6] text-white shadow-[#2D6BFF]/25'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing Secure Request...
              </>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to APEX'}
                  {mode === 'register' && 'Complete Registration'}
                  {mode === 'forgot' && 'Send Recovery Token'}
                  {mode === 'reset' && 'Confirm New Password'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill & Back Controls */}
        <div className="mt-5 pt-4 border-t border-[#1C2745] flex items-center justify-between text-xs font-mono">
          {mode === 'login' && (
            <button
              type="button"
              onClick={autoFillDemo}
              className="text-[#B6FF3B] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-fill Demo Scout
            </button>
          )}

          {(mode === 'forgot' || mode === 'reset') && (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className="text-[#9AA4BF] hover:text-white"
            >
              ← Back to Sign In
            </button>
          )}

          <span className="text-[#9AA4BF] text-[11px] ml-auto">
            PBKDF2-SHA256 • JWT
          </span>
        </div>
      </div>
    </div>
  );
}
