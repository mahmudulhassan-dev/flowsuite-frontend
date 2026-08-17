'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Search, Plus, Coins, ShieldCheck, ExternalLink } from 'lucide-react';

export default function PanelHeader() {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/70 backdrop-blur-xl px-5 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search posts, contacts, campaigns..."
            className="w-full pl-8 pr-4 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* AI Credits badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Coins className="w-3.5 h-3.5" />
          <span>4,850 Credits</span>
        </div>

        {/* Create Post */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition">
          <Plus className="w-3.5 h-3.5" />
          <span>New Post</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg border border-slate-800 bg-slate-800/50 text-slate-400 hover:text-white transition">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* SuperAdmin link */}
        <a
          href="https://flowsuite.amanasuite.com/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 hover:text-white bg-purple-500/10 border border-purple-500/30 hover:bg-purple-600/20 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Admin</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </header>
  );
}
