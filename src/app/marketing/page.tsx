'use client';

import React, { useState } from 'react';
import { Send, Mail, MessageSquare, PhoneCall, Sparkles, Plus, Users, BarChart3, CheckCircle2 } from 'lucide-react';

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'whatsapp' | 'messenger'>('whatsapp');

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Send className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Omnichannel Bulk Marketing & Broadcast Suite
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-0.5 rounded-full font-mono">
                99.8% DELIVERABILITY
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Create & Automate High-ROI Broadcast Campaigns on Email, SMS, WhatsApp & Messenger
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm">
          <Plus className="w-4 h-4" /> Create Broadcast Campaign
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 border-b border-slate-800 pb-3">
        {[
          { id: 'whatsapp', name: 'WhatsApp Business Broadcast', icon: MessageSquare, color: 'text-emerald-400' },
          { id: 'email', name: 'Email Newsletter Builder', icon: Mail, color: 'text-blue-400' },
          { id: 'sms', name: 'Bulk SMS Marketing', icon: PhoneCall, color: 'text-amber-400' },
          { id: 'messenger', name: 'FB & IG Chat Broadcast', icon: Send, color: 'text-purple-400' },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === tab.id
                  ? 'bg-slate-900 border-purple-500 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Main Campaign Builder Content */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center justify-between">
          <span className="capitalize">{activeTab} Broadcast Campaign Studio</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Active Audience: 14,820 Verified Contacts
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Campaign Name</label>
              <input
                type="text"
                placeholder="e.g. Eid Sales Discount 50% Off Broadcast"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Broadcast Message Content</label>
              <textarea
                rows={6}
                placeholder="Type your promotional message, discount code, and website CTA link here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Estimated Delivery Time: 2 Minutes</span>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Campaign Now
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" /> Deliverability Analytics
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                <span className="text-slate-400">Open Rate</span>
                <span className="font-bold text-emerald-400">78.4%</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                <span className="text-slate-400">Click-Through Rate (CTR)</span>
                <span className="font-bold text-purple-400">24.1%</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                <span className="text-slate-400">Conversion Revenue</span>
                <span className="font-bold text-white">$4,850.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
