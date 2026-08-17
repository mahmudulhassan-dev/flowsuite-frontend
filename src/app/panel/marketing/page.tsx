'use client';

import React, { useState } from 'react';
import { Send, Mail, MessageSquare, PhoneCall, Plus, BarChart3, Users, Clock, CheckCircle2, ArrowRight, Sparkles, Target } from 'lucide-react';

const campaigns = [
  { id: 1, name: 'Eid Sale 50% Off Broadcast', channel: 'whatsapp', sent: 14820, opened: 11641, clicked: 3579, revenue: '৳ 4,850', status: 'Completed', date: 'Aug 15' },
  { id: 2, name: 'New Product Launch Newsletter', channel: 'email', sent: 8400, opened: 5712, clicked: 1680, revenue: '৳ 2,100', status: 'Completed', date: 'Aug 14' },
  { id: 3, name: 'Payment Reminder — Invoice #902', channel: 'sms', sent: 320, opened: 290, clicked: 145, revenue: '৳ 890', status: 'Active', date: 'Aug 17' },
  { id: 4, name: 'Flash Sale 24h — FB Messenger', channel: 'messenger', sent: 2100, opened: 1890, clicked: 756, revenue: '৳ 1,200', status: 'Scheduled', date: 'Aug 18' },
];

const channelConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  whatsapp: { label: 'WhatsApp', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> },
  email: { label: 'Email', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: <Mail className="w-3.5 h-3.5 text-blue-400" /> },
  sms: { label: 'Bulk SMS', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: <PhoneCall className="w-3.5 h-3.5 text-amber-400" /> },
  messenger: { label: 'Messenger', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: <Send className="w-3.5 h-3.5 text-purple-400" /> },
};

const statusColors: Record<string, string> = {
  'Completed': 'bg-emerald-500/20 text-emerald-300',
  'Active': 'bg-blue-500/20 text-blue-300',
  'Scheduled': 'bg-amber-500/20 text-amber-300',
};

export default function MarketingPage() {
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email' | 'sms' | 'messenger'>('whatsapp');
  const [showComposer, setShowComposer] = useState(false);

  const channelStats = {
    whatsapp: { openRate: '78.4%', ctr: '24.1%', deliverability: '99.6%' },
    email: { openRate: '42.3%', ctr: '8.9%', deliverability: '98.2%' },
    sms: { openRate: '91.2%', ctr: '12.4%', deliverability: '99.8%' },
    messenger: { openRate: '65.7%', ctr: '18.3%', deliverability: '97.9%' },
  };

  const stat = channelStats[activeChannel];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Send className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Omnichannel Bulk Marketing & Broadcast Suite
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">99.8% DELIVERABILITY</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">WhatsApp Business, Email Newsletters, Bulk SMS & FB Messenger Broadcast Campaigns</p>
          </div>
        </div>
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Channel Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['whatsapp', 'email', 'sms', 'messenger'] as const).map(ch => {
          const cfg = channelConfig[ch];
          return (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${activeChannel === ch ? 'bg-slate-900 border-purple-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              {cfg.icon}
              {cfg.label} Broadcast
            </button>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Open Rate', value: stat.openRate, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Click-Through Rate', value: stat.ctr, icon: Target, color: 'text-purple-400' },
          { label: 'Deliverability', value: stat.deliverability, icon: Send, color: 'text-blue-400' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="p-3 bg-slate-800 rounded-xl">
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Composer */}
      {showComposer && (
        <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-6 space-y-5 shadow-xl shadow-purple-600/10">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Create New {channelConfig[activeChannel].label} Campaign
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Campaign Name</label>
              <input type="text" placeholder="e.g. Eid Mubarak — 40% Off Flash Sale" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Audience</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                <option>All Contacts (14,820)</option>
                <option>Qualified Leads Only</option>
                <option>Past Customers</option>
                <option>WhatsApp Opted-In</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Message Content</label>
              <button className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg hover:bg-amber-500/20 transition">
                <Sparkles className="w-3.5 h-3.5" /> Generate with AI
              </button>
            </div>
            <textarea rows={5} placeholder={`Type your ${channelConfig[activeChannel].label} message here. Use {{name}} for personalization...`} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Schedule Send Time</label>
              <input type="datetime-local" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div className="flex items-end gap-2">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Campaign Now
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2">
                <Clock className="w-4 h-4" /> Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Campaign Performance History
          </h2>
          <span className="text-xs text-slate-400">{campaigns.length} campaigns</span>
        </div>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 uppercase">
            <tr>
              <th className="p-3">Campaign Name</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Sent</th>
              <th className="p-3">Open Rate</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {campaigns.map(c => {
              const cfg = channelConfig[c.channel];
              const openRate = ((c.opened / c.sent) * 100).toFixed(1) + '%';
              return (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-semibold text-white max-w-48 truncate">{c.name}</td>
                  <td className="p-3">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold w-fit ${cfg.color}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{c.sent.toLocaleString()}</td>
                  <td className="p-3 font-bold text-emerald-400">{openRate}</td>
                  <td className="p-3">{c.clicked.toLocaleString()}</td>
                  <td className="p-3 font-bold text-white">{c.revenue}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[c.status]}`}>{c.status}</span></td>
                  <td className="p-3">
                    <button className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300 flex items-center gap-1 transition">
                      View Report <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
