'use client';

import React from 'react';
import { LayoutDashboard, Calendar, MessageSquare, Bot, Users, Send, Wallet, FolderOpen, Settings, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UserPanelOverviewPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              User Application Control Panel
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                PRO AGENCY ACTIVE
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Social Media Automation, AI Agents, Omnichannel Inbox &amp; Lead Management
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launch Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/panel/publisher" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-purple-500/50 transition-all group">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl w-fit">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Social Publisher</h3>
          <p className="text-xs text-slate-400">Schedule &amp; publish posts across 9 social media channels.</p>
          <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">Open Publisher &rarr;</span>
        </Link>

        <Link href="/panel/inbox" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-blue-500/50 transition-all group">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Omnichannel Unified Inbox</h3>
          <p className="text-xs text-slate-400">Reply to FB, WA, IG &amp; Live Web Chat Widget in real-time.</p>
          <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">Open Unified Inbox &rarr;</span>
        </Link>

        <Link href="/panel/ai-studio" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-amber-500/50 transition-all group">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl w-fit">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">AI Agent Studio</h3>
          <p className="text-xs text-slate-400">Deploy AI Copywriters, Fashion Models &amp; Gemini Voice Agents.</p>
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">Open AI Studio &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
