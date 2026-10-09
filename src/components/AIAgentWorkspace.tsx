"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Cpu,
  Layers,
  Database,
  Search,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  RefreshCw,
  PlusCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sliders,
  ExternalLink,
  Target,
  BarChart2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  ChatResponse,
  ToolCallStep,
  SourceCitation,
  StructuredResultCard
} from '@/types/agent';
import {
  sendAgentMessage,
  fetchAgentTools,
  fetchKnowledgeSources,
  fetchSuggestedPrompts
} from '@/lib/agentApi';

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolCalls?: ToolCallStep[];
  sources?: SourceCitation[];
  keyInsights?: string[];
  structuredCard?: StructuredResultCard;
  isStreaming?: boolean;
  modelProvider?: string;
}

export default function AIAgentWorkspace() {
  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: "Welcome to the **APEX AI Sports Intelligence Agent**. Calibrated on live Cricsheet telemetry, Lord's WTC Final records, and our calibrated logistic win-probability baseline (Brier: 0.1339).\n\nAsk me any tactical or data-driven query or select from the recommended prompts below.",
      timestamp: 'Just now',
      modelProvider: 'APEX Local Heuristic Intelligence',
      keyInsights: [
        'Full tool-calling visibility enabled',
        'Transparent source attributions attached to all answers',
        'Direct connection to Cricsheet & SQLite telemetry'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStepProgress, setActiveStepProgress] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [conversationList, setConversationList] = useState<Array<{ id: string; title: string; time: string }>>([
    { id: 'conv-1', title: 'WTC 2026 Chase Analysis', time: 'Active' },
    { id: 'conv-2', title: 'Kohli vs Starc Micro-Matchup', time: '10m ago' },
    { id: 'conv-3', title: 'Death Over Bowler Strategy', time: '1h ago' }
  ]);
  const [currentConvId, setCurrentConvId] = useState('conv-1');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Analyse the current match.',
    'Compare these two batters: Kohli vs Starc.',
    'Why is the chasing team likely to win?',
    'Recommend the next bowler for this over.',
    "Summarise Virat Kohli's recent performance."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeStepProgress]);

  // Copy message text to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Start a new conversation
  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    setConversationList(prev => [{ id: newId, title: 'New Tactical Session', time: 'Just now' }, ...prev]);
    setCurrentConvId(newId);
    setMessages([
      {
        id: `msg-welcome-${newId}`,
        role: 'assistant',
        content: "New coaching telemetry session initialized. How can I assist your match preparation or player evaluation?",
        timestamp: 'Just now',
        modelProvider: 'APEX Local Heuristic Intelligence'
      }
    ]);
  };

  // Submit query
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessageId = `msg-user-${Date.now()}`;
    const userMsg: UIMessage = {
      id: userMessageId,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    // Simulated progress steps for immediate visual feedback
    setActiveStepProgress('Thinking...');
    setTimeout(() => setActiveStepProgress('Selecting tool...'), 300);
    setTimeout(() => setActiveStepProgress('Retrieving telemetry...'), 600);
    setTimeout(() => setActiveStepProgress('Analysing game state...'), 900);

    try {
      const response: ChatResponse = await sendAgentMessage({
        message: query,
        conversation_id: currentConvId,
        match_context_id: 'CRI-2026-IND-AUS-WTC'
      });

      const assistantMsg: UIMessage = {
        id: `msg-agent-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls: response.tool_calls,
        sources: response.sources,
        keyInsights: response.key_insights,
        structuredCard: response.structured_card,
        modelProvider: response.model_provider
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Intelligence System Advisory**: ${err.message || 'Error processing request.'} Reconnecting to local telemetry baseline.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelProvider: 'APEX Fallback Diagnostic'
        }
      ]);
    } finally {
      setIsLoading(false);
      setActiveStepProgress(null);
    }
  };

  return (
    <div className="rounded-2xl bg-[#0B1020] border border-[#1C2745] flex flex-col lg:flex-row h-[740px] md:h-[780px] overflow-hidden shadow-2xl relative">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-30 animate-in fade-in"
        />
      )}

      {/* Responsive Conversation History Sidebar / Mobile Drawer */}
      <aside
        className={`${
          sidebarOpen 
            ? 'fixed inset-y-0 left-0 w-72 lg:static lg:w-72 z-40' 
            : 'hidden lg:flex lg:w-14'
        } bg-[#070B16] border-r border-[#1C2745] transition-all duration-300 flex flex-col justify-between p-3.5 shrink-0 h-full`}
      >
        <div className="space-y-4 overflow-hidden">
          {/* Sidebar Top: New Chat & Toggle */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1C2745]">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#B6FF3B]" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  AI SESSIONS
                </span>
              </div>
            ) : (
              <Bot className="w-4 h-4 text-[#B6FF3B] mx-auto" />
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg text-[#8F9CAE] hover:text-white hover:bg-[#121A2E] transition-all"
              title="Toggle sidebar"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* New Chat Button */}
          {sidebarOpen && (
            <button
              onClick={() => {
                handleNewChat();
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#121A2E] hover:bg-[#1C2745] border border-[#1C2745] text-xs font-mono text-white transition-all shadow"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#B6FF3B]" />
              <span>New Conversation</span>
            </button>
          )}

          {/* Conversation Sessions List */}
          {sidebarOpen && (
            <div className="space-y-1.5 overflow-y-auto max-h-[460px] pr-1">
              <span className="text-[10px] font-mono text-[#8F9CAE] uppercase block px-1 mb-1">
                RECENT SESSIONS
              </span>
              {conversationList.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setCurrentConvId(conv.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs font-mono transition-all flex items-center justify-between border ${
                    currentConvId === conv.id
                      ? 'bg-[#15203D] border-[#B6FF3B] text-white shadow'
                      : 'bg-[#05070D]/50 border-transparent text-[#8F9CAE] hover:text-white hover:bg-[#0B1020]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#2D6BFF]" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <span className="text-[9px] text-[#8F9CAE] shrink-0">{conv.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer Metadata */}
        {sidebarOpen && (
          <div className="pt-3 border-t border-[#1C2745] text-[10px] font-mono text-[#8F9CAE] space-y-1">
            <div className="flex justify-between items-center">
              <span>RAG Knowledge Index:</span>
              <span className="text-[#B6FF3B]">6 Corpus Docs</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tools Registered:</span>
              <span className="text-white">5 Active Tools</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Chat Conversation Workspace */}
      <div className="flex-1 flex flex-col justify-between bg-[#0B1020] overflow-hidden">
        {/* Workspace Top Header */}
        <header className="p-4 px-6 border-b border-[#1C2745] bg-[#070B16] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Toggle Drawer Button on Mobile/Tablet */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#121A2E] border border-[#1C2745] text-[#8F9CAE] hover:text-white transition-all flex items-center justify-center"
              aria-label="Toggle Sessions Drawer"
            >
              <MessageSquare className="w-4 h-4 text-[#B6FF3B]" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2D6BFF] to-[#B6FF3B] p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#05070D] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#B6FF3B]" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-display font-bold text-white text-sm sm:text-base truncate">
                  APEX Intelligence Copilot
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF3B] animate-pulse shrink-0" />
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#B6FF3B]/10 text-[#B6FF3B] border border-[#B6FF3B]/30 whitespace-nowrap">
                  TOOLS ACTIVE
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8F9CAE] font-mono truncate">
                Context: CRI-2026-IND-AUS-WTC (Lord&apos;s) • RAG Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNewChat()}
              className="px-2.5 py-1 rounded-lg bg-[#121A2E] border border-[#1C2745] text-[11px] font-mono text-[#8F9CAE] hover:text-white flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3 h-3 text-[#B6FF3B]" />
              <span>Reset Context</span>
            </button>
          </div>
        </header>

        {/* Messages Stream */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-4xl mx-auto`}
            >
              <div
                className={`w-full max-w-3xl rounded-2xl p-4 md:p-5 border transition-all ${
                  msg.role === 'user'
                    ? 'bg-[#15203D] border-[#2D6BFF]/40 text-white ml-auto shadow-lg'
                    : 'bg-[#070B16] border-[#1C2745] text-[#F5F7FF] shadow-xl'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1C2745]/60 text-xs font-mono text-[#8F9CAE]">
                  <div className="flex items-center gap-2">
                    {msg.role === 'user' ? (
                      <span className="font-bold text-[#2D6BFF]">COACH / ANALYST</span>
                    ) : (
                      <>
                        <Bot className="w-3.5 h-3.5 text-[#B6FF3B]" />
                        <span className="font-bold text-[#B6FF3B]">APEX INTELLIGENCE ENGINE</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#05070D] text-[#8F9CAE] border border-[#1C2745]">
                          {msg.modelProvider || 'Local Heuristic'}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]">{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-[#8F9CAE] hover:text-white transition-all"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-[#B6FF3B]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Transparent Tool Call Workflow Progress Banner */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-[#05070D] border border-[#1C2745] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8F9CAE]">
                      <span className="flex items-center gap-1.5 text-white font-bold">
                        <Cpu className="w-3.5 h-3.5 text-[#B6FF3B]" />
                        TOOL CALLING EXECUTION TRACE
                      </span>
                      <span className="text-[#B6FF3B]">Verified Telemetry</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {msg.toolCalls.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono bg-[#0B1020] border border-[#1C2745] text-white"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#B6FF3B]" />
                          <span>{step.step}</span>
                          {step.tool_name && (
                            <span className="text-[#2D6BFF] font-semibold">({step.tool_name})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Structured Result Card Render (Match, Comparison, Win Prob, Bowler) */}
                {msg.structuredCard && (
                  <div className="mb-4 p-4 rounded-xl bg-[#0B1020] border border-[#1C2745] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-[#B6FF3B] font-bold">
                        {msg.structuredCard.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C2745] text-white">
                        {msg.structuredCard.card_type}
                      </span>
                    </div>

                    {msg.structuredCard.card_type === 'match_summary' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                        <div className="p-2.5 rounded bg-[#05070D] border border-[#1C2745]">
                          <span className="text-[#8F9CAE] block text-[10px]">1ST INNINGS</span>
                          <span className="text-white font-bold text-sm">{msg.structuredCard.data.inn1?.score}</span>
                          <span className="text-[10px] text-[#8F9CAE] block">{msg.structuredCard.data.inn1?.overs} ov</span>
                        </div>
                        <div className="p-2.5 rounded bg-[#05070D] border border-[#1C2745]">
                          <span className="text-[#8F9CAE] block text-[10px]">2ND INNINGS (CHASE)</span>
                          <span className="text-[#B6FF3B] font-bold text-sm">{msg.structuredCard.data.inn2?.score}</span>
                          <span className="text-[10px] text-[#8F9CAE] block">{msg.structuredCard.data.inn2?.overs} ov</span>
                        </div>
                        <div className="p-2.5 rounded bg-[#05070D] border border-[#1C2745] col-span-2 sm:col-span-1">
                          <span className="text-[#8F9CAE] block text-[10px]">OUTCOME</span>
                          <span className="text-emerald-400 font-bold text-sm">{msg.structuredCard.data.status}</span>
                          <span className="text-[10px] text-[#8F9CAE] block">Target: {msg.structuredCard.data.target}</span>
                        </div>
                      </div>
                    )}

                    {msg.structuredCard.card_type === 'player_comparison' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                        <div className="p-2.5 rounded bg-[#05070D] border border-[#1C2745]">
                          <span className="text-[#8F9CAE] block text-[10px]">BALLS FACED</span>
                          <span className="text-white font-bold text-base">{msg.structuredCard.data.balls_faced}</span>
                        </div>
                        <div className="p-2.5 rounded bg-[#05070D] border border-[#1C2745]">
                          <span className="text-[#8F9CAE] block text-[10px]">RUNS SCORED</span>
                          <span className="text-[#B6FF3B] font-bold text-base">{msg.structuredCard.data.runs_scored}</span>
                        </div>
                        <div className="p-2.5 rounded bg-[#05070D] border border-[#1C2745]">
                          <span className="text-[#8F9CAE] block text-[10px]">STRIKE RATE</span>
                          <span className="text-white font-bold text-base">{msg.structuredCard.data.strike_rate?.toFixed(1)}</span>
                        </div>
                        <div className="p-2.5 rounded bg-[#05070D] border border-[#1C2745]">
                          <span className="text-[#8F9CAE] block text-[10px]">DISMISSALS</span>
                          <span className="text-emerald-400 font-bold text-base">{msg.structuredCard.data.dismissals}</span>
                        </div>
                      </div>
                    )}

                    {msg.structuredCard.card_type === 'win_probability' && (
                      <div className="p-3 rounded bg-[#05070D] border border-[#1C2745] space-y-2 font-mono">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#B6FF3B] font-bold">Batting Team: {msg.structuredCard.data.batting_team_win_prob}%</span>
                          <span className="text-[#2D6BFF] font-bold">Bowling Team: {msg.structuredCard.data.bowling_team_win_prob}%</span>
                        </div>
                        <div className="w-full bg-[#1C2745] h-3 rounded-full overflow-hidden flex">
                          <div className="bg-[#B6FF3B] h-full" style={{ width: `${msg.structuredCard.data.batting_team_win_prob}%` }} />
                          <div className="bg-[#2D6BFF] h-full" style={{ width: `${msg.structuredCard.data.bowling_team_win_prob}%` }} />
                        </div>
                      </div>
                    )}

                    {msg.structuredCard.card_type === 'bowler_recommendation' && (
                      <div className="p-3 rounded bg-[#05070D] border border-[#1C2745] font-mono text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-sm">
                            {msg.structuredCard.data.top_bowlers?.[0]?.bowler_name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#B6FF3B] text-black font-bold text-[10px]">
                            Score: {msg.structuredCard.data.top_bowlers?.[0]?.score}/100
                          </span>
                        </div>
                        <p className="text-[#8F9CAE] text-[11px]">
                          {msg.structuredCard.data.top_bowlers?.[0]?.primary_reason}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Message Prose */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-[#F5F7FF]/90">
                  {msg.content}
                </div>

                {/* Key Insights Chips */}
                {msg.keyInsights && msg.keyInsights.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#1C2745]/60 space-y-1.5">
                    <span className="text-[10px] font-mono text-[#B6FF3B] uppercase font-bold block">
                      KEY TACTICAL INSIGHTS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.keyInsights.map((insight, inIdx) => (
                        <span
                          key={inIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#05070D] border border-[#1C2745] text-white flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B6FF3B]" />
                          {insight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* RAG Sources Used Section */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#1C2745]/60 space-y-2">
                    <span className="text-[10px] font-mono text-[#8F9CAE] uppercase block flex items-center gap-1.5">
                      <Database className="w-3 h-3 text-[#2D6BFF]" />
                      SOURCES USED & RETRIEVAL CITATIONS
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map(src => (
                        <div
                          key={src.id}
                          className="p-2.5 rounded-lg bg-[#05070D] border border-[#1C2745] text-[11px] font-mono space-y-1"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[#2D6BFF] font-bold truncate pr-1">{src.title}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-[#1C2745] text-[#8F9CAE] shrink-0">
                              {src.document_type}
                            </span>
                          </div>
                          <p className="text-[#8F9CAE] text-[10px] line-clamp-2">{src.excerpt}</p>
                          <span className="text-[9px] text-[#B6FF3B] block">Ref: {src.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Active Loading & Tool Calling Progress Indicator */}
          {isLoading && activeStepProgress && (
            <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-[#070B16] border border-[#1C2745] flex items-center gap-3 animate-pulse">
              <Sparkles className="w-5 h-5 text-[#B6FF3B] animate-spin" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white font-bold">{activeStepProgress}</span>
                  <span className="text-[10px] font-mono text-[#8F9CAE]">Executing database query & RAG lookup</span>
                </div>
                <div className="w-full bg-[#1C2745] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#B6FF3B] h-full w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="p-3 px-4 bg-[#070B16]/90 border-t border-[#1C2745] overflow-x-auto shrink-0 flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#8F9CAE] uppercase shrink-0">PROMPTS:</span>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[#0B1020] hover:bg-[#15203D] border border-[#1C2745] hover:border-[#B6FF3B] text-[#9AA4BF] hover:text-white transition-all whitespace-nowrap disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#070B16] border-t border-[#1C2745] shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 max-w-4xl mx-auto"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask about ball-by-ball telemetry, matchups, bowler selection, or win probability..."
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-[#05070D] border border-[#1C2745] focus:border-[#B6FF3B] text-white text-xs sm:text-sm font-sans placeholder-[#8F9CAE] outline-none transition-all disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-3 rounded-xl bg-[#B6FF3B] hover:bg-[#a6ec30] text-black font-bold font-mono text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-[#B6FF3B]/10 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analyse</span>
            </button>
          </form>
          <div className="mt-2 text-center text-[10px] font-mono text-[#8F9CAE]">
            APEX AI Agent outputs traceable telemetry with verifiable citations. No ungrounded statistical hallucinations.
          </div>
        </div>
      </div>
    </div>
  );
}
