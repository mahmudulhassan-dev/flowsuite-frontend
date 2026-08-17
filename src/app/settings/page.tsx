'use client';

import React from 'react';
import { Settings, Globe, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" /> Platform Settings
          </h2>
          <p className="text-xs text-slate-400">Configure CNAME domains, branding, and 15 World Languages.</p>
        </div>
      </div>
    </div>
  );
}
