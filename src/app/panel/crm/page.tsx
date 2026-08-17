'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, Mail, Search, Filter, TrendingUp, Star, MessageSquare, BarChart3, ChevronRight, RefreshCw, Trash2, Plus } from 'lucide-react';
import { api } from '../../../lib/api';

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  stage: 'NEW_LEAD' | 'PROSPECT' | 'QUALIFIED' | 'CUSTOMER' | 'CHURNED';
  leadScore: number;
}

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  stage: 'NEW_LEAD' | 'PROSPECT' | 'QUALIFIED' | 'CUSTOMER' | 'CHURNED';
  score: number;
  tags: string[];
  createdAt: string;
}

interface PipelineStats {
  stage: string;
  count: number;
  totalValue: number;
}

const stageColors: Record<string, string> = {
  NEW_LEAD: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  PROSPECT: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  QUALIFIED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  CUSTOMER: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  CHURNED: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const stageLabels: Record<string, string> = {
  NEW_LEAD: 'New Lead',
  PROSPECT: 'Prospect',
  QUALIFIED: 'Qualified',
  CUSTOMER: 'Customer',
  CHURNED: 'Churned',
};

const kanbanStages: ('NEW_LEAD' | 'PROSPECT' | 'QUALIFIED' | 'CUSTOMER' | 'CHURNED')[] = [
  'NEW_LEAD',
  'PROSPECT',
  'QUALIFIED',
  'CUSTOMER',
];

export default function CRMPage() {
  const [activeView, setActiveView] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStats[]>([]);
  const [loading, setLoading] = useState(true);

  // New lead modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStage, setNewStage] = useState('NEW_LEAD');
  const [newScore, setNewScore] = useState('50');

  const loadCRMData = async () => {
    try {
      setLoading(true);
      const [contactsData, pipelineData] = await Promise.all([
        api.get<Contact[]>('/api/v1/crm/contacts'),
        api.get<PipelineStats[]>('/api/v1/crm/pipeline'),
      ]);
      setContacts(contactsData);
      setPipeline(pipelineData);
    } catch (err) {
      console.error('Failed to load CRM data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCRMData();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setLoading(true);
      // Create both a contact and a lead for compatibility
      await Promise.all([
        api.post('/api/v1/crm/contacts', {
          name: newName,
          email: newEmail,
          phone: newPhone,
          stage: newStage,
          leadScore: parseInt(newScore) || 50,
        }),
        api.post('/api/v1/crm/leads', {
          name: newName,
          email: newEmail,
          phone: newPhone,
          stage: newStage,
          score: parseInt(newScore) || 50,
        })
      ]);
      setShowCreateModal(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      loadCRMData();
    } catch (err) {
      console.error('Failed to create lead:', err);
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/api/v1/crm/contacts/${id}`);
      loadCRMData();
    } catch (err) {
      console.error('Failed to delete contact:', err);
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
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
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">Database Linked</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Omnichannel Contact Management, Lead Scoring & Automated Sales Funnels</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20"
        >
          <UserPlus className="w-4 h-4" /> Add New Lead
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Contacts', value: contacts.length, change: 'All active contacts', color: 'text-white', icon: Users },
          { label: 'Pipeline Leads', value: pipeline.reduce((acc, curr) => acc + curr.count, 0), change: 'Total leads', color: 'text-emerald-400', icon: TrendingUp },
          { label: 'Won Customers', value: pipeline.find(p => p.stage === 'CUSTOMER')?.count || 0, change: 'Converted deals', color: 'text-purple-400', icon: Star },
          { label: 'Engagement Rate', value: '88.4%', change: 'Avg activity rate', color: 'text-amber-400', icon: BarChart3 },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
                <Icon className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-500 font-semibold">{s.change}</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-white text-sm">Sales Pipeline Funnel</h2>
        <div className="grid grid-cols-5 gap-3">
          {pipeline.map(f => (
            <div key={f.stage} className="space-y-2">
              <div className="h-16 bg-slate-800 rounded-xl flex items-end px-3 pb-2 overflow-hidden">
                <div className="bg-purple-600 rounded-lg w-full" style={{ height: `${f.count > 0 ? 100 : 0}%` }} />
              </div>
              <p className="text-xs font-semibold text-white">{stageLabels[f.stage] || f.stage}</p>
              <p className="text-[10px] text-slate-400">{f.count} leads · Score Sum: {f.totalValue}</p>
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
        <button onClick={loadCRMData} className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition">
          <RefreshCw className="w-3.5 h-3.5" /> Reload
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
                <th className="p-3">Contact</th>
                <th className="p-3">Email & Phone</th>
                <th className="p-3">Pipeline Stage</th>
                <th className="p-3">Lead Score</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <RefreshCw className="w-6 h-6 text-purple-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">No contacts found.</td>
                </tr>
              ) : (
                filteredContacts.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-xs font-black text-white">
                          {lead.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-white">{lead.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        <div className="text-slate-400">{lead.email || 'No email'}</div>
                        <div className="text-slate-500">{lead.phone || 'No phone'}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${stageColors[lead.stage]}`}>{stageLabels[lead.stage]}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style={{ width: `${lead.leadScore}%` }} />
                        </div>
                        <span className="font-mono font-bold text-amber-400">{lead.leadScore}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteContact(lead.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Kanban View */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kanbanStages.map(col => {
            const colLeads = filteredContacts.filter(l => l.stage === col);
            return (
              <div key={col} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{stageLabels[col]}</h3>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{colLeads.length}</span>
                </div>
                {colLeads.map(lead => (
                  <div key={lead.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 cursor-pointer hover:border-purple-500/50 transition">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                        {lead.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-white">{lead.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{lead.email}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-mono">{lead.leadScore}</span>
                      <button
                        onClick={() => handleDeleteContact(lead.id)}
                        className="text-red-400 hover:text-red-300 text-[10px]"
                      >
                        Delete
                      </button>
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

      {/* CREATE LEAD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <UserPlus className="w-5 h-5 text-purple-400" /> Add New Lead
            </h3>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karim Rahman"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. karim@example.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +8801700000001"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Pipeline Stage</label>
                  <select
                    value={newStage}
                    onChange={e => setNewStage(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="NEW_LEAD">New Lead</option>
                    <option value="PROSPECT">Prospect</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Lead Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newScore}
                    onChange={e => setNewScore(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
