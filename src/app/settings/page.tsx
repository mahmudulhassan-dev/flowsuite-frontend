'use client';

import React from 'react';
import { Settings, Globe, ShieldCheck, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Platform Settings & CNAME Custom Domains
            </h1>
            <p className="text-slate-400 text-sm">
              Configure White-Label Agency Domains, Webhooks & Social App Keys
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
