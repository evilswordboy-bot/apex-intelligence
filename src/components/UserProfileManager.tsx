"use client";

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Clock,
  Heart,
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Globe,
  Gauge,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { deleteUserAccount } from '@/lib/authApi';
import AuthModal from '@/components/AuthModal';

export default function UserProfileManager() {
  const {
    user,
    profile,
    favorites,
    dashboardPrefs,
    isAuthenticated,
    updateProfile,
    toggleFavorite,
    updateDashboardPrefs,
    logout
  } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Form editing states
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [timeZone, setTimeZone] = useState('UTC');
  const [oddsFormat, setOddsFormat] = useState('probability');
  const [unitsSystem, setUnitsSystem] = useState('metric');
  const [highContrast, setHighContrast] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(15);
  const [defaultSport, setDefaultSport] = useState('all');

  // Widget ordering state
  const [widgets, setWidgets] = useState<string[]>([
    'live_ticker',
    'ai_predictions',
    'radar_benchmarks',
    'fatigue_guard',
    'recent_telemetry'
  ]);
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([
    'live_ticker',
    'ai_predictions',
    'radar_benchmarks',
    'fatigue_guard',
    'recent_telemetry'
  ]);

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load from profile
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || user?.display_name || '');
      setBio(profile.bio || '');
      setTimeZone(profile.time_zone || 'UTC');
      setOddsFormat(profile.odds_format || 'probability');
      setUnitsSystem(profile.units_system || 'metric');
      setHighContrast(profile.high_contrast || false);
      setAutoRefresh(profile.auto_refresh_seconds || 15);
      setDefaultSport(profile.default_sport || 'all');
    } else if (user) {
      setDisplayName(user.display_name);
    }
  }, [profile, user]);

  useEffect(() => {
    if (dashboardPrefs) {
      setWidgets(dashboardPrefs.widget_order);
      setEnabledWidgets(dashboardPrefs.enabled_widgets);
    }
  }, [dashboardPrefs]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setErrorMsg(null);
    try {
      await updateProfile({
        display_name: displayName,
        bio,
        time_zone: timeZone,
        odds_format: oddsFormat,
        units_system: unitsSystem,
        high_contrast: highContrast,
        auto_refresh_seconds: autoRefresh,
        default_sport: defaultSport
      });
      triggerToast('Profile & preferences successfully saved.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetProfile = () => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio || '');
      setTimeZone(profile.time_zone);
      setOddsFormat(profile.odds_format);
      setUnitsSystem(profile.units_system);
      setHighContrast(profile.high_contrast);
      setAutoRefresh(profile.auto_refresh_seconds);
      setDefaultSport(profile.default_sport);
      triggerToast('Changes discarded.');
    }
  };

  const handleSaveWidgets = async () => {
    setSaving(true);
    try {
      await updateDashboardPrefs({
        widget_order: widgets,
        enabled_widgets: enabledWidgets
      });
      triggerToast('Personalized dashboard layout saved.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save dashboard preferences.');
    } finally {
      setSaving(false);
    }
  };

  const toggleWidgetEnabled = (widgetKey: string) => {
    setEnabledWidgets((prev) =>
      prev.includes(widgetKey) ? prev.filter((k) => k !== widgetKey) : [...prev, widgetKey]
    );
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= widgets.length) return;
    const newOrder = [...widgets];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    setWidgets(newOrder);
  };

  const handleQuickAddFavorite = async (type: string, id: string, name: string, sport: string) => {
    await toggleFavorite({ item_type: type, item_id: id, item_name: name, sport });
    triggerToast(`Added ${name} to favorites.`);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account and all associated preferences? This action cannot be undone.')) {
      await deleteUserAccount();
      await logout();
      triggerToast('Account permanently deleted.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0B1020] border border-[#1C2745] text-center max-w-xl mx-auto space-y-5 my-8">
        <div className="w-16 h-16 rounded-2xl bg-[#121A2E] border border-[#1C2745] flex items-center justify-center mx-auto text-[#2D6BFF]">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white">
            Authentication Required
          </h2>
          <p className="text-xs sm:text-sm text-[#9AA4BF] mt-1 max-w-md mx-auto">
            Sign in or create a verified analyst account to manage personal profiles, save favorite squads, customize dashboard layouts, and persist user preferences.
          </p>
        </div>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-[#2D6BFF] hover:bg-[#2558d6] text-white font-mono text-xs font-bold shadow-lg shadow-[#2D6BFF]/25 transition-all inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#B6FF3B]" />
          Sign In or Register
        </button>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  const widgetLabels: Record<string, string> = {
    live_ticker: 'Live Match Telemetry & Scoreboards',
    ai_predictions: 'Calibrated AI Outcome Forecasts',
    radar_benchmarks: 'Multiaxial Performance Radar',
    fatigue_guard: 'ACWR Workload & Injury Guard',
    recent_telemetry: 'Real-Time Biomechanical Stream'
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#B6FF3B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Identity Hero */}
      <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2D6BFF]/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#2D6BFF] to-[#B6FF3B] flex items-center justify-center font-display font-black text-2xl text-black shadow-xl shadow-[#2D6BFF]/20 shrink-0">
              {displayName.slice(0, 2).toUpperCase() || 'AP'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display font-black text-xl sm:text-2xl text-white">
                  {displayName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30">
                  VERIFIED ANALYST
                </span>
              </div>
              <p className="text-xs font-mono text-[#9AA4BF]">{user?.email}</p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-[#9AA4BF] mt-2">
                <span>Role: <strong className="text-white uppercase">{user?.role}</strong></span>
                <span>•</span>
                <span>Session: <strong className="text-emerald-400">Authenticated (JWT)</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-[#121A2E] hover:bg-rose-500/10 border border-[#1C2745] hover:border-rose-500/40 text-xs font-mono text-[#9AA4BF] hover:text-rose-400 transition-all flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-400 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal Profile & Regional Preferences */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] space-y-5">
            <div className="flex items-center justify-between border-b border-[#1C2745] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2D6BFF]" />
                  Profile & Preferences
                </h3>
                <p className="text-xs text-[#9AA4BF] mt-0.5">
                  Update your identity details, primary sport focus, and display preferences.
                </p>
              </div>
              <span className="text-xs font-mono text-[#9AA4BF]">Auto-Persisted</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#9AA4BF] block mb-1">DISPLAY NAME</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#9AA4BF] block mb-1">ANALYST BIO / ROLE NOTES</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Lead Scouting Director specializing in T20 death overs & Premier League xG kinematics."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA4BF] block mb-1">DEFAULT SPORT FOCUS</label>
                  <select
                    value={defaultSport}
                    onChange={(e) => setDefaultSport(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                  >
                    <option value="all">All Disciplines</option>
                    <option value="cricket">Cricket Lab</option>
                    <option value="football">Football Lab</option>
                    <option value="olympics">Olympic Kinematics</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#9AA4BF] block mb-1">TIME ZONE</label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                  >
                    <option value="UTC">UTC (Universal Coordinated)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                    <option value="Europe/London">Europe/London (BST / GMT)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#9AA4BF] block mb-1">PROBABILITY / ODDS FORMAT</label>
                  <select
                    value={oddsFormat}
                    onChange={(e) => setOddsFormat(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                  >
                    <option value="probability">Calibrated Probability (%)</option>
                    <option value="decimal">Decimal Odds (2.10)</option>
                    <option value="american">American Moneyline (+110)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#9AA4BF] block mb-1">MEASUREMENT UNITS</label>
                  <select
                    value={unitsSystem}
                    onChange={(e) => setUnitsSystem(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A2E] border border-[#1C2745] text-xs font-mono text-white focus:outline-none focus:border-[#2D6BFF]"
                  >
                    <option value="metric">Metric (km/h, meters, kg)</option>
                    <option value="imperial">Imperial (mph, yards, lbs)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#121A2E] border border-[#1C2745]">
                <div>
                  <span className="text-xs font-bold text-white block">High Contrast Visual Mode</span>
                  <span className="text-[11px] font-mono text-[#9AA4BF]">Enhances WCAG AAA visibility for pitch side tablets</span>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-4 h-4 accent-[#2D6BFF] cursor-pointer"
                />
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C2745]">
              <button
                type="button"
                onClick={handleResetProfile}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#9AA4BF] hover:text-white bg-[#121A2E] border border-[#1C2745] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-black bg-[#B6FF3B] hover:bg-[#a5f02c] shadow-lg shadow-[#B6FF3B]/20 transition-all flex items-center gap-1.5"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Saved Favorites & Dashboard Widget Layout */}
        <div className="lg:col-span-5 space-y-6">
          {/* Saved Favorites Deck */}
          <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2745] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                Saved Teams & Favorites ({favorites.length})
              </h3>
            </div>

            {/* Existing Favorites List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {favorites.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#121A2E] text-center text-xs font-mono text-[#9AA4BF]">
                  No teams or athletes saved yet.
                </div>
              ) : (
                favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="p-3 rounded-xl bg-[#121A2E] border border-[#1C2745] flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="text-white font-bold block">{fav.item_name}</span>
                      <span className="text-[10px] text-[#9AA4BF] uppercase">{fav.sport} • {fav.item_type}</span>
                    </div>
                    <button
                      onClick={() => toggleFavorite({ item_type: fav.item_type, item_id: fav.item_id, item_name: fav.item_name, sport: fav.sport })}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition-all"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Suggestions */}
            <div className="pt-2 border-t border-[#1C2745]">
              <span className="text-[11px] font-mono text-[#9AA4BF] block mb-2">QUICK BOOKMARK SQUADS:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'csk', name: 'Chennai Super Kings', sport: 'cricket', type: 'team' },
                  { id: 'mci', name: 'Manchester City', sport: 'football', type: 'team' },
                  { id: 'ars', name: 'Arsenal', sport: 'football', type: 'team' },
                  { id: 'kohli', name: 'Virat Kohli', sport: 'cricket', type: 'player' }
                ].map((sug) => {
                  const alreadyFav = favorites.some((f) => f.item_id === sug.id);
                  return (
                    <button
                      key={sug.id}
                      onClick={() => handleQuickAddFavorite(sug.type, sug.id, sug.name, sug.sport)}
                      disabled={alreadyFav}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 ${
                        alreadyFav
                          ? 'bg-[#121A2E] text-[#9AA4BF] opacity-50 cursor-not-allowed'
                          : 'bg-[#121A2E] text-white hover:border-[#B6FF3B] border border-[#1C2745]'
                      }`}
                    >
                      <Plus className="w-3 h-3 text-[#B6FF3B]" />
                      {sug.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Personalized Dashboard Widget Ordering */}
          <div className="p-6 rounded-3xl bg-[#0B1020] border border-[#1C2745] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2745] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2D6BFF]" />
                Personalized Dashboard Widgets
              </h3>
              <button
                onClick={handleSaveWidgets}
                className="text-xs font-mono font-bold text-[#2D6BFF] hover:underline flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                Save Order
              </button>
            </div>

            <div className="space-y-2">
              {widgets.map((wKey, idx) => {
                const isEnabled = enabledWidgets.includes(wKey);
                return (
                  <div
                    key={wKey}
                    className="p-3 rounded-xl bg-[#121A2E] border border-[#1C2745] flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleWidgetEnabled(wKey)}
                        className="w-4 h-4 accent-[#2D6BFF] cursor-pointer"
                      />
                      <span className={isEnabled ? 'text-white font-medium' : 'text-[#9AA4BF] line-through'}>
                        {widgetLabels[wKey] || wKey}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveWidget(idx, 'up')}
                        disabled={idx === 0}
                        className="px-1.5 py-0.5 rounded bg-[#0B1020] text-[#9AA4BF] hover:text-white disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveWidget(idx, 'down')}
                        disabled={idx === widgets.length - 1}
                        className="px-1.5 py-0.5 rounded bg-[#0B1020] text-[#9AA4BF] hover:text-white disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Danger Zone */}
          <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
            <span className="text-xs font-mono text-rose-400 font-bold block">
              ACCOUNT & DATA RETENTION
            </span>
            <p className="text-[11px] text-[#9AA4BF] leading-relaxed">
              APEX complies with strict privacy policies. You can permanently erase all stored telemetry preferences and profile records at any time.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-rose-400 hover:text-white hover:bg-rose-500 border border-rose-500/30 transition-all flex items-center gap-1.5 mt-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Account & Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
