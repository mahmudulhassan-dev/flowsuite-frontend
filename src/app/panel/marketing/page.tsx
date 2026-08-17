'use client';

import React, { useState, useEffect } from 'react';
import { Send, Mail, MessageSquare, Plus, BarChart3, Clock, CheckCircle2, ArrowRight, Sparkles, RefreshCw, Trash2, Shield } from 'lucide-react';
import { api } from '../../../lib/api';

interface Campaign {
  id: string;
  name: string;
  type: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED';
  subject: string | null;
  body: string;
  scheduledAt: string | null;
  sentCount: number;
  createdAt: string;
}

const channelConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  EMAIL: { label: 'Email', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: <Mail className="w-3.5 h-3.5 text-blue-400" /> },
  SMS: { label: 'Bulk SMS', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
  WHATSAPP: { label: 'WhatsApp', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> },
  PUSH: { label: 'Push Notify', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: <Send className="w-3.5 h-3.5 text-purple-400" /> },
};

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-emerald-500/20 text-emerald-300',
  SENDING: 'bg-blue-500/20 text-blue-300',
  SCHEDULED: 'bg-amber-500/20 text-amber-300',
  DRAFT: 'bg-slate-700/50 text-slate-400',
  FAILED: 'bg-red-500/20 text-red-300',
};

export default function MarketingPage() {
  const [activeChannel, setActiveChannel] = useState<'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH'>('EMAIL');
  const [showComposer, setShowComposer] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // New campaign state
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newScheduledAt, setNewScheduledAt] = useState('');

  // AI assistant state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await api.get<Campaign[]>('/api/v1/marketing/campaigns');
      setCampaigns(data);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent, sendImmediately = false) => {
    e.preventDefault();
    if (!newName.trim() || !newBody.trim()) return;

    try {
      setLoading(true);
      const camp = await api.post<Campaign>('/api/v1/marketing/campaigns', {
        name: newName,
        type: activeChannel,
        subject: newSubject,
        content: newBody,
        scheduledAt: newScheduledAt ? new Date(newScheduledAt).toISOString() : null,
      });

      if (sendImmediately) {
        await api.post(`/api/v1/marketing/campaigns/${camp.id}/send`);
      }

      setNewName('');
      setNewSubject('');
      setNewBody('');
      setNewScheduledAt('');
      setShowComposer(false);
      loadCampaigns();
    } catch (err) {
      console.error('Failed to create campaign:', err);
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/api/v1/marketing/campaigns/${id}`);
      loadCampaigns();
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      setLoading(false);
    }
  };

  const handleSendCampaign = async (id: string) => {
    try {
      setLoading(true);
      await api.post(`/api/v1/marketing/campaigns/${id}/send`);
      loadCampaigns();
    } catch (err) {
      console.error('Failed to send campaign:', err);
      setLoading(false);
    }
  };

  const handleAiCampaignContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptInput.trim()) return;

    try {
      setAiGenerating(true);
      const res = await api.post<{ output: string }>('/api/v1/ai/generate', {
        task: 'email',
        prompt: aiPromptInput,
      });
      setNewBody(res.output);
      setShowAiModal(false);
      setAiPromptInput('');
    } catch (err) {
      console.error('Failed to generate campaign content:', err);
    } finally {
      setAiGenerating(false);
    }
  };

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
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">Database Linked</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">WhatsApp Business, Email Newsletters, Bulk SMS & FB Messenger Broadcast Campaigns</p>
          </div>
        </div>
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> {showComposer ? 'Close Composer' : 'Create Campaign'}
        </button>
      </div>

      {/* Channel Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'] as const).map(ch => {
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

      {/* Campaign Composer */}
      {showComposer && (
        <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-6 space-y-5 shadow-xl shadow-purple-600/10">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Create New {channelConfig[activeChannel].label} Campaign
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Campaign Name</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Eid Mubarak — 40% Off Flash Sale"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            {activeChannel === 'EMAIL' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. Big Eid Discount Inside! 🎉"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Message Content</label>
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg hover:bg-amber-500/20 transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate with AI
              </button>
            </div>
            <textarea
              rows={5}
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              placeholder={`Type your ${channelConfig[activeChannel].label} message here...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Schedule Send Time (Optional)</label>
              <input
                type="datetime-local"
                value={newScheduledAt}
                onChange={e => setNewScheduledAt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={(e) => handleCreateCampaign(e, true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Campaign Now
              </button>
              <button
                onClick={(e) => handleCreateCampaign(e, false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2"
              >
                <Clock className="w-4 h-4" /> Save as Draft
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
              <th className="p-3">Sent Count</th>
              <th className="p-3">Status</th>
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
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-500">No campaigns created yet.</td>
              </tr>
            ) : (
              campaigns.map(c => {
                const cfg = channelConfig[c.type];
                return (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-white max-w-48 truncate">{c.name}</td>
                    <td className="p-3">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold w-fit ${cfg?.color}`}>
                        {cfg?.icon} {cfg?.label}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{c.sentCount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {c.status === 'DRAFT' && (
                          <button
                            onClick={() => handleSendCampaign(c.id)}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded-lg text-xs"
                          >
                            Send
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCampaign(c.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* AI ASSISTANT MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> Write Broadcast Copy with AI
            </h3>
            <form onSubmit={handleAiCampaignContent} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">What is the campaign about?</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Write a promotion email offering a 20% discount on custom marketing packages for returning clients..."
                  value={aiPromptInput}
                  onChange={e => setAiPromptInput(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1"
                >
                  {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
