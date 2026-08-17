'use client';

import React from 'react';
import { Send, Mail, MessageSquare, Link as LinkIcon, Plus } from 'lucide-react';

export default function MarketingSuitePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" /> Marketing Automation Suite
          </h2>
          <p className="text-xs text-slate-400">Launch Email, SMS, WhatsApp Campaigns, and Short Links.</p>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> + New Campaign
        </button>
      </div>
    </div>
  );
}
