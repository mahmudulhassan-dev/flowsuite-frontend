'use client';

import React from 'react';
import { Search, Bell, Plus, ChevronDown, Coins } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns, posts, inbox threads, AI agents..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Coins className="w-3.5 h-3.5" />
          <span>4,850 Credits</span>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition">
          <Plus className="w-3.5 h-3.5" />
          <span>Create Post</span>
        </button>

        <button className="p-2 rounded-xl border border-slate-800 bg-slate-800/50 text-slate-400 hover:text-white transition">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
