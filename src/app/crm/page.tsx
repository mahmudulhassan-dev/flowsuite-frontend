'use client';

import React from 'react';
import { Users, UserPlus } from 'lucide-react';

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> CRM Directory & Pipeline
          </h2>
          <p className="text-xs text-slate-400">Manage customer contacts, leads, and sales pipelines.</p>
        </div>
      </div>
    </div>
  );
}
