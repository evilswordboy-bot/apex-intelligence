"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, Zap, Activity, Crosshair, Award, Video, ShieldAlert, ArrowRight, CornerDownLeft, BarChart3, Radio, Brain } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: any) => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectTab }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'feedback', label: 'Platform Feedback Hub (Bug Reports, Suggestions, Diagnostics)', sport: 'feedback', icon: Zap, color: '#06B6D4' },
    { id: 'profile', label: 'User Profile & Personalization (Favorites, Config, Units)', sport: 'profile', icon: Zap, color: '#10B981' },
    { id: 'predictions', label: 'AI Match Predictor (Phase 7 Calibrated ML & Time-Aware Forecasting)', sport: 'predictions', icon: Brain, color: '#A855F7' },
    { id: 'live', label: 'Live Match Centre (Real-Time Scores, Poll Relay & Standings)', sport: 'live', icon: Radio, color: '#EF4444' },
    { id: 'analytics', label: 'Sports Intelligence Analytics (Phase 5 AI & Multi-Axis Radar)', sport: 'analytics', icon: BarChart3, color: '#2D6BFF' },
    { id: 'cricket', label: 'Cricket Lab (Live Match & Wagon Wheel)', sport: 'cricket', icon: Activity, color: '#B6FF3B' },
    { id: 'football', label: 'Football Lab (xG & Pass Network)', sport: 'football', icon: Crosshair, color: '#2D6BFF' },
    { id: 'olympics', label: 'Olympic Lab (Kinematics & Split Times)', sport: 'olympics', icon: Award, color: '#FF6B2C' },
    { id: 'workload', label: 'Workload & Fatigue Protection (ACWR)', sport: 'workload', icon: ShieldAlert, color: '#B6FF3B' },
    { id: 'edge-ai', label: 'Edge Vision AI (60 FPS Pose Tracking)', sport: 'edge-ai', icon: Video, color: '#2D6BFF' },
    { id: 'overview', label: 'Executive Telemetry Overview', sport: 'overview', icon: Zap, color: '#F5F7FF' },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.id.toLowerCase().includes(query.toLowerCase())
  );

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#0B1020] border border-[#1C2745] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1C2745] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#9AA4BF] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, athlete telemetry, labs, or metrics..."
            className="w-full bg-transparent text-sm text-[#F5F7FF] placeholder-[#5A6785] focus:outline-none font-mono"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9AA4BF] hover:text-white hover:bg-[#121A2E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono text-[#9AA4BF] uppercase tracking-wider">
            Available Modules & Workspaces
          </div>

          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onSelectTab(cmd.id);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl flex items-center justify-between text-left hover:bg-[#121A2E] text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#05070D] border border-[#1C2745]"
                      style={{ color: cmd.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold block text-[#F5F7FF]">
                        {cmd.label}
                      </span>
                      <span className="text-[10px] font-mono text-[#9AA4BF]">
                        Switch dashboard perspective
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#9AA4BF] group-hover:text-white">
                    <span>Jump</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#9AA4BF] font-mono">
              No matching modules or athlete telemetry profiles found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#05070D] border-t border-[#1C2745] flex items-center justify-between text-[11px] font-mono text-[#9AA4BF]">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[#121A2E] border border-[#1C2745] text-white text-[10px]">ESC</kbd>
            <span>Close</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-[#121A2E] border border-[#1C2745] text-white text-[10px]">↵</kbd>
            <span>Select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
