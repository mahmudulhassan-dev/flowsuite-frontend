'use client';

import React from 'react';
import { Sparkles, Calendar, MessageSquare, Users, Bot, ArrowUpRight, Plus, Share2, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to FlowSuite Control Center
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Enterprise Omnichannel Suite & AI Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Your social publishing, AI agents, unified inbox, and local billing infrastructure are fully operational.
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition">
            Launch AI Post Assistant
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Scheduled Posts</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">128 <span className="text-xs text-emerald-400 font-semibold">+14%</span></p>
          <span className="text-[10px] text-slate-400">Across 10 Social Networks</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Conversations</span>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">342 <span className="text-xs text-emerald-400 font-semibold">+22%</span></p>
          <span className="text-[10px] text-slate-400">FB, IG, WhatsApp, TikTok, Gmail</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">CRM Total Leads</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">1,890 <span className="text-xs text-emerald-400 font-semibold">+8.5%</span></p>
          <span className="text-[10px] text-slate-400">145 Qualified Sales Leads</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">AI Agents Operations</span>
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">4,850 <span className="text-xs text-amber-400 font-semibold">Credits</span></p>
          <span className="text-[10px] text-slate-400">Fashion AI & Voice Chat Active</span>
        </div>
      </div>
    </div>
  );
}
