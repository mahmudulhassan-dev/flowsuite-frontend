'use client';

import React from 'react';
import { Send, Sparkles, Mail, MessageSquare } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Send className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Omnichannel Marketing Suite
            </h1>
            <p className="text-slate-400 text-sm">
              Create Broadcast Campaigns on WhatsApp, SMS, Email & Messenger
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
