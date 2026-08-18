'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Mail,
  MessageSquare,
  Plus,
  BarChart3,
  Clock,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Trash2,
  Server,
  Code,
  Eye,
  Activity,
  UserCheck,
  Percent
} from 'lucide-react';
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

interface SmtpServer {
  id: string;
  name: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  fromEmail: string;
  fromName: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  createdAt: string;
}

export default function MarketingBroadcastPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'builder' | 'smtp' | 'analytics'>('campaigns');
  
  // Lists
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [smtpServers, setSmtpServers] = useState<SmtpServer[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Campaign Form State
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campName, setCampName] = useState('');
  const [campType, setCampType] = useState<'EMAIL' | 'SMS' | 'WHATSAPP'>('EMAIL');
  const [campSubject, setCampSubject] = useState('');
  const [campBody, setCampBody] = useState('');

  // SMTP Form State
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [smtpName, setSmtpName] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpFromEmail, setSmtpFromEmail] = useState('');

  // Builder State
  const [tempName, setTempName] = useState('');
  const [tempSubject, setTempSubject] = useState('');
  const [tempHtml, setTempHtml] = useState('<html>\n<body>\n  <h1>Welcome!</h1>\n  <p>Thank you for choosing FlowSuite.</p>\n  <a href="https://flowsuite.amansuite.com/api/v1/marketing/tracking/click?campaignId=test&url=https://suite.amanasuite.com">Click Here</a>\n</body>\n</html>');

  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const loadMarketingData = async () => {
    try {
      setLoading(true);
      const [camps, smtps, temps] = await Promise.all([
        api.get<Campaign[]>('/api/v1/marketing/campaigns'),
        api.get<SmtpServer[]>('/api/v1/marketing/smtp'),
        api.get<EmailTemplate[]>('/api/v1/marketing/templates'),
      ]);
      setCampaigns(camps);
      setSmtpServers(smtps);
      setTemplates(temps);
    } catch (err) {
      console.error('Failed to load marketing details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketingData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim() || !campBody.trim()) return;

    try {
      await api.post('/api/v1/marketing/campaigns', {
        name: campName,
        type: campType,
        subject: campSubject,
        content: campBody
      });
      setCampName('');
      setCampSubject('');
      setCampBody('');
      setShowCampaignModal(false);
      loadMarketingData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendCampaign = async (id: string) => {
    try {
      await api.post(`/api/v1/marketing/campaigns/${id}/send`);
      loadMarketingData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpName || !smtpHost || !smtpUsername || !smtpPassword || !smtpFromEmail) return;

    try {
      await api.post('/api/v1/marketing/smtp', {
        name: smtpName,
        host: smtpHost,
        port: parseInt(smtpPort),
        username: smtpUsername,
        password: smtpPassword,
        fromEmail: smtpFromEmail
      });
      setSmtpName('');
      setSmtpHost('');
      setSmtpUsername('');
      setSmtpPassword('');
      setSmtpFromEmail('');
      setShowSmtpModal(false);
      loadMarketingData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName || !tempSubject || !tempHtml) return;

    try {
      await api.post('/api/v1/marketing/templates', {
        name: tempName,
        subject: tempSubject,
        htmlBody: tempHtml
      });
      alert('Template saved successfully!');
      setTempName('');
      setTempSubject('');
      loadMarketingData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAiWriter = async () => {
    if (!aiPromptInput) return;
    try {
      setAiGenerating(true);
      // Simulating helper response locally
      setTimeout(() => {
        setTempHtml(`<html>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
    <h2 style="color: #a855f7;">FlowSuite Marketing</h2>
    <p>Dear customer,</p>
    <p>${aiPromptInput}</p>
    <p style="margin-top: 30px;">Best Regards,<br/>FlowSuite Team</p>
    <img src="https://flowsuite.amansuite.com/api/v1/marketing/tracking/open?campaignId=demo" width="1" height="1" />
  </div>
</body>
</html>`);
        setAiGenerating(false);
        setAiPromptInput('');
      }, 1000);
    } catch (err) {
      console.error(err);
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Send className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Omnichannel Bulk Marketing & Broadcast Suite
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono">SMTP Smart Track</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Bulk Newsletters, SMTP Gateways, Smart tracking pixels, and Custom HTML Email builders</p>
          </div>
        </div>
        <button
          onClick={loadMarketingData}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Broadcasts
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-1">
        {[
          { id: 'campaigns', label: '📣 Campaigns & broadcasts', color: 'hover:text-purple-300' },
          { id: 'builder', label: '🎨 Drag-Drop HTML Designer', color: 'hover:text-emerald-300' },
          { id: 'smtp', label: '🔌 SMTP Server Gateways', color: 'hover:text-blue-300' },
          { id: 'analytics', label: '📊 Tracking Logs & Analytics', color: 'hover:text-amber-300' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 text-[11px] font-extrabold py-2.5 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                : `text-slate-400 ${tab.color}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CAMPAIGNS & BROADCASTS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <h2 className="text-sm font-bold text-white">Broadcast Campaigns</h2>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-600/25"
            >
              <Plus className="w-4 h-4" /> Create Broadcast Campaign
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-850 text-slate-400 uppercase">
                <tr>
                  <th className="p-3 text-left">Campaign Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Recipient Reach</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-500">No campaigns created yet.</td>
                  </tr>
                ) : (
                  campaigns.map(camp => (
                    <tr key={camp.id} className="hover:bg-slate-850/30 transition">
                      <td className="p-3 font-semibold text-white">{camp.name}</td>
                      <td className="p-3 font-mono font-bold text-purple-400 text-[10px]">{camp.type}</td>
                      <td className="p-3 font-mono">{camp.sentCount} recipients</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          camp.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : camp.status === 'SENDING'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {camp.status === 'DRAFT' && (
                          <button
                            onClick={() => handleSendCampaign(camp.id)}
                            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-lg text-[10px] font-bold transition"
                          >
                            Send Bulk
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DRAG-DROP HTML DESIGNER */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HTML editor and tools */}
          <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-xs flex items-center gap-1.5"><Code className="w-4 h-4 text-emerald-400" /> HTML Editor</h3>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setTempHtml(tempHtml + '\n<img src="https://flowsuite.amansuite.com/api/v1/marketing/tracking/open?campaignId=123" width="1" height="1" />')}
                  className="text-[9px] bg-purple-500/10 text-purple-300 px-2 py-1 rounded border border-purple-500/30 font-bold"
                >
                  + Add Open Pixel
                </button>
                <button
                  type="button"
                  onClick={() => setTempHtml(tempHtml + '\n<a href="https://flowsuite.amansuite.com/api/v1/marketing/tracking/click?campaignId=123&url=YOUR_URL">Trackable Link</a>')}
                  className="text-[9px] bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/30 font-bold"
                >
                  + Add Click URL
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Template Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Eid Campaign 2026"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Default Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Eid Mubarak Offers!"
                    value={tempSubject}
                    onChange={e => setTempSubject(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* AI Writer Panel */}
              <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-2">
                <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Template Copywriter Assistant</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Eid sale discounts on cosmetics..."
                    value={aiPromptInput}
                    onChange={e => setAiPromptInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAiWriter}
                    disabled={aiGenerating}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1"
                  >
                    {aiGenerating ? 'Writing...' : 'Write'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">HTML Content Body</label>
                <textarea
                  rows={10}
                  value={tempHtml}
                  onChange={e => setTempHtml(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/25">
                Save Designer Template
              </button>
            </form>
          </div>

          {/* HTML visual preview */}
          <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-3xl flex flex-col space-y-3">
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5"><Eye className="w-4 h-4 text-purple-400" /> Live Render Preview</h3>
            <div className="flex-1 bg-white rounded-2xl overflow-hidden min-h-[350px]">
              <iframe
                title="HTML Preview"
                srcDoc={tempHtml}
                className="w-full h-full border-0 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SMTP SERVER CONFIGS */}
      {activeTab === 'smtp' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <h2 className="text-sm font-bold text-white">SMTP Mail Gateways</h2>
            <button
              onClick={() => setShowSmtpModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Server className="w-4 h-4" /> Add SMTP Server
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smtpServers.length === 0 ? (
              <p className="col-span-full text-center text-slate-500 text-xs py-10">No SMTP servers added. Email blasts will use the default system relay.</p>
            ) : (
              smtpServers.map(server => (
                <div key={server.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl space-y-3 relative group">
                  <button
                    onClick={async () => {
                      if (confirm('Delete SMTP server?')) {
                        await api.delete(`/api/v1/marketing/smtp/${server.id}`);
                        loadMarketingData();
                      }
                    }}
                    className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{server.name}</h3>
                    <span className="text-[10px] text-slate-500">{server.host}:{server.port}</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400 border-t border-slate-850 pt-2.5">
                    <p>📧 Sender: {server.fromName} ({server.fromEmail})</p>
                    <p>👤 Username: {server.username}</p>
                    <p>🔒 Security: {server.secure ? 'SSL/TLS' : 'TLS STARTTLS'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SMART TRACKING ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <h2 className="text-sm font-bold text-white">Smart Telemetry Tracking</h2>
          </div>

          {/* Stats metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Broadcast Reach', value: '4,520', change: 'Total dispatch count', color: 'text-white', icon: Send },
              { label: 'Email Opens Logged', value: '1,898', change: '42.0% Open Rate', color: 'text-purple-400', icon: Eye },
              { label: 'Link Clicks Logged', value: '813', change: '18.0% CTR Ratio', color: 'text-emerald-400', icon: Activity },
              { label: 'Bounces Detected', value: '45', change: '1.0% Bounce rate', color: 'text-amber-400', icon: Percent },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 space-y-2">
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

          {/* Tracking integration helper details */}
          <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-white text-sm">How smart tracking works:</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 space-y-1">
                <span className="font-extrabold text-purple-400">1. Open Tracking Pixel</span>
                <p className="text-slate-400">A 1x1 transparent tracking image is appended at the bottom of the template HTML body:</p>
                <code className="block bg-slate-950 p-2 rounded text-slate-400 font-mono mt-1 overflow-x-auto select-all">
                  {'<img src="https://flowsuite.amansuite.com/api/v1/marketing/tracking/open?campaignId=CAMPAIGN_ID" width="1" height="1" />'}
                </code>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 space-y-1">
                <span className="font-extrabold text-blue-400">2. Link Redirection Tracking</span>
                <p className="text-slate-400">URLs inside campaign templates are wrapped in tracking redirects:</p>
                <code className="block bg-slate-950 p-2 rounded text-slate-400 font-mono mt-1 overflow-x-auto select-all">
                  {'https://flowsuite.amansuite.com/api/v1/marketing/tracking/click?campaignId=CAMPAIGN_ID&url=https://YOUR_TARGET_URL'}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Create Broadcast Campaign</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Flash Sale 2026"
                  value={campName}
                  onChange={e => setCampName(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Broadcast Channel</label>
                <select
                  value={campType}
                  onChange={e => setCampType(e.target.value as any)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="EMAIL">Email Newsletter</option>
                  <option value="SMS">Bulk SMS</option>
                  <option value="WHATSAPP">WhatsApp Message</option>
                </select>
              </div>
              {campType === 'EMAIL' && (
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grab 30% Off Today!"
                    value={campSubject}
                    onChange={e => setCampSubject(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Broadcast Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type broadcast text here..."
                  value={campBody}
                  onChange={e => setCampBody(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowCampaignModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/25">Save Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SMTP MODAL */}
      {showSmtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Add SMTP Server Gateway</h3>
            <form onSubmit={handleCreateSmtp} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Profile Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon SES BD"
                  value={smtpName}
                  onChange={e => setSmtpName(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">SMTP Host Address</label>
                  <input
                    type="text"
                    required
                    placeholder="email-smtp.us-east-1.amazonaws.com"
                    value={smtpHost}
                    onChange={e => setSmtpHost(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={e => setSmtpPort(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                    value={smtpUsername}
                    onChange={e => setSmtpUsername(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••••"
                    value={smtpPassword}
                    onChange={e => setSmtpPassword(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sender From Email</label>
                <input
                  type="email"
                  required
                  placeholder="marketing@yourdomain.com"
                  value={smtpFromEmail}
                  onChange={e => setSmtpFromEmail(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowSmtpModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Test & Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
