'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Phone, Mail, Search, Filter, TrendingUp, Star, MessageSquare, BarChart3, ChevronRight, ArrowUpRight } from 'lucide-react';

const leads = [
  { id: 1, name: 'Karim Rahman', email: 'karim@acmebiz.com', phone: '+8801700000001', stage: 'Qualified', score: 92, source: 'WhatsApp', avatar: 'KR', value: '৳ 15,000' },
  { id: 2, name: 'Fatema Khanom', email: 'fatema@shop.com', phone: '+8801800000002', stage: 'New Lead', score: 68, source: 'Facebook', avatar: 'FK', value: '৳ 8,500' },
  { id: 3, name: 'Sabbir Ahmed', email: 'sabbir@startup.io', phone: '+8801900000003', stage: 'Negotiation', score: 85, source: 'Live Chat', avatar: 'SA', value: '৳ 45,000' },
  { id: 4, name: 'Nusrat Jahan', email: 'nusrat@boutique.com', phone: '+8801600000004', stage: 'Won', score: 98, source: 'Instagram', avatar: 'NJ', value: '৳ 28,000' },
  { id: 5, name: 'Mehedi Hasan', email: 'mehedi@agency.co', phone: '+8801500000005', stage: 'Lost', score: 34, source: 'Email', avatar: 'MH', value: '৳ 5,000' },
];

const stageColors: Record<string, string> = {
  'New Lead': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  'Qualified': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'Negotiation': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'Won': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'Lost': 'bg-red-500/20 text-red-300 border-red-500/40',
};

const kanbanCols = ['New Lead', 'Qualified', 'Negotiation', 'Won'];

export default function CRMPage() {
  const [activeView, setActiveView] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              CRM & Lead Pipeline Manager
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">5 Active Leads</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Omnichannel Contact Management, Lead Scoring & Automated Sales Funnels</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20">
          <UserPlus className="w-4 h-4" /> Add New Lead
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Contacts', value: '1,482', change: '+24 this week', color: 'text-white', icon: Users },
          { label: 'Pipeline Value', value: '৳ 4.2M', change: '+৳ 180K this week', color: 'text-emerald-400', icon: TrendingUp },
          { label: 'Avg. Lead Score', value: '74.6', change: '+2.3 from last month', color: 'text-amber-400', icon: Star },
          { label: 'Conversion Rate', value: '28.4%', change: '+3.2% from last month', color: 'text-purple-400', icon: BarChart3 },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
                <Icon className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">{s.change}</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-white text-sm">Sales Pipeline Funnel</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { stage: 'New Lead', count: 148, value: '৳ 2.1M', width: 'w-full', color: 'bg-blue-600' },
            { stage: 'Qualified', count: 92, value: '৳ 1.4M', width: 'w-4/5', color: 'bg-emerald-600' },
            { stage: 'Negotiation', count: 34, value: '৳ 580K', width: 'w-3/5', color: 'bg-amber-600' },
            { stage: 'Won', count: 18, value: '৳ 320K', width: 'w-2/5', color: 'bg-purple-600' },
          ].map(f => (
            <div key={f.stage} className="space-y-2">
              <div className="h-16 bg-slate-800 rounded-xl flex items-end px-3 pb-2 overflow-hidden">
                <div className={`${f.color} rounded-lg w-full`} style={{ height: `${(f.count / 148) * 100}%` }} />
              </div>
              <p className="text-xs font-semibold text-white">{f.stage}</p>
              <p className="text-[10px] text-slate-400">{f.count} leads · {f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition">
          <Filter className="w-3.5 h-3.5" /> Filter
        </button>
        <div className="flex gap-1 ml-auto">
          {(['table', 'kanban'] as const).map(v => (
            <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${activeView === v ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}>{v === 'table' ? '📋 Table' : '🗂 Kanban'}</button>
          ))}
        </div>
      </div>

      {/* Table View */}
      {activeView === 'table' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase">
              <tr>
                <th className="p-3 rounded-l-lg">Contact</th>
                <th className="p-3">Email & Phone</th>
                <th className="p-3">Pipeline Stage</th>
                <th className="p-3">Lead Score</th>
                <th className="p-3">Deal Value</th>
                <th className="p-3">Source</th>
                <th className="p-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-xs font-black text-white">
                        {lead.avatar}
                      </div>
                      <span className="font-semibold text-white">{lead.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-400"><Mail className="w-3 h-3" />{lead.email}</div>
                      <div className="flex items-center gap-1 text-slate-400"><Phone className="w-3 h-3" />{lead.phone}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${stageColors[lead.stage]}`}>{lead.stage}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className="font-mono font-bold text-amber-400">{lead.score}</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{lead.value}</td>
                  <td className="p-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg">{lead.source}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition">
                        <ChevronRight className="w-3 h-3" /> View
                      </button>
                      <button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition">
                        <MessageSquare className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Kanban View */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kanbanCols.map(col => {
            const colLeads = filtered.filter(l => l.stage === col);
            return (
              <div key={col} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{col}</h3>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{colLeads.length}</span>
                </div>
                {colLeads.map(lead => (
                  <div key={lead.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 cursor-pointer hover:border-purple-500/50 transition">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                        {lead.avatar}
                      </div>
                      <span className="text-xs font-semibold text-white">{lead.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{lead.email}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400">{lead.value}</span>
                      <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-mono">{lead.score}</span>
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <div className="text-center py-6 text-[10px] text-slate-600">No leads in this stage</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
