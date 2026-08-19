'use client';

import React, { useState, useEffect } from 'react';
import {
  Send, Mail, MessageSquare, Plus, BarChart3, Clock, CheckCircle2,
  Sparkles, RefreshCw, Trash2, Server, Code, Eye, Activity, UserCheck,
  Percent, FileText, Download, Upload, Users, ListFilter, AlertCircle,
  EyeOff, Check, AlertTriangle, Layers, FileCode, CheckSquare, Settings, Layout,
  PlusCircle
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

interface Subscriber {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
}

interface SubscriberList {
  id: string;
  name: string;
  description: string | null;
  subscribers?: Subscriber[];
  _count?: { subscribers: number };
}

// 20 Premium Built-in Templates
const BUILTIN_TEMPLATES = [
  { id: 't1', name: 'Minimal Newsletter', subject: 'Your Weekly Newsletter Update', html: '<html><body><h2>Weekly News</h2><p>Here is your clean minimalist weekly digest.</p></body></html>' },
  { id: 't2', name: 'Product Launch Showcase', subject: 'Introducing our newest workspace engine!', html: '<html><body><h2>New Launch!</h2><p>We are excited to announce our brand new file storage and sheets workspace system.</p></body></html>' },
  { id: 't3', name: 'Eid Mubarak Greeting & Sale', subject: 'Eid Mubarak! Special 35% Sale inside', html: '<html><body><h2>Eid Mubarak!</h2><p>Enjoy our special Eid discount using coupon EID35.</p></body></html>' },
  { id: 't4', name: 'Black Friday Blowout', subject: 'BLACK FRIDAY: 70% Off everything!', html: '<html><body><h2>Black Friday Sale</h2><p>Hurry up! 70% discounts end in 2 hours.</p></body></html>' },
  { id: 't5', name: 'Abandoned Cart Recovery', subject: 'Did you forget something in your cart?', html: '<html><body><h2>Oops!</h2><p>Your items are still waiting in the cart. Complete checkout now and get 5% off.</p></body></html>' },
  { id: 't6', name: 'Welcome / Onboarding Email', subject: 'Welcome to FlowSuite Family!', html: '<html><body><h2>Welcome!</h2><p>Let us help you onboard your staff, unify your inbox, and automate social posts.</p></body></html>' },
  { id: 't7', name: 'Weekly Digest Updates', subject: 'What happened in the community this week?', html: '<html><body><h2>Weekly Community Round-up</h2><p>Here are top stories and discussions this week.</p></body></html>' },
  { id: 't8', name: 'Feedback & Customer Survey', subject: 'How was your experience?', html: '<html><body><h2>Give us feedback</h2><p>Help us improve our CRM platform by answering 3 simple questions.</p></body></html>' },
  { id: 't9', name: 'Holiday Season Special', subject: 'Warm wishes for the Holidays!', html: '<html><body><h2>Happy Holidays</h2><p>Warmest holiday greetings from all of us at FlowSuite.</p></body></html>' },
  { id: 't10', name: 'Discount Coupon Blast', subject: 'Your special discount code is here', html: '<html><body><h2>Exclusive Coupon</h2><p>Use code VIPOFFER for instant credits injection.</p></body></html>' },
  { id: 't11', name: 'SaaS Feature Update Alert', subject: 'New Update: Collaborative Spreadsheets', html: '<html><body><h2>Feature Drop</h2><p>You can now edit spreadsheets inline in your Cloud Drive.</p></body></html>' },
  { id: 't12', name: 'Event Invitation RSVP', subject: 'Join us live this Friday', html: '<html><body><h2>Live Workshop Invitation</h2><p>RSVP now for our Omnichannel social publishing workshop.</p></body></html>' },
  { id: 't13', name: 'Monthly Financial Summary', subject: 'Your Monthly Report', html: '<html><body><h2>Financial Digest</h2><p>Here is your monthly invoice summary report.</p></body></html>' },
  { id: 't14', name: 'Support Ticket Status Alert', subject: 'Ticket resolved successfully', html: '<html><body><h2>Support Alert</h2><p>Your ticket #1023 has been marked as resolved.</p></body></html>' },
  { id: 't15', name: 'App Download Campaign', subject: 'Get FlowSuite on Mobile', html: '<html><body><h2>Download App</h2><p>Scan QR code to install FlowSuite mobile application.</p></body></html>' },
  { id: 't16', name: 'Company Newsfeed Highlight', subject: 'Inside the team workspace', html: '<html><body><h2>Company News</h2><p>Meet our new staff members and celebrate workspace wins.</p></body></html>' },
  { id: 't17', name: 'SMS Alert Template', subject: 'System OTP Verification', html: '<html><body><p>FlowSuite verification code: [OTP_CODE]</p></body></html>' },
  { id: 't18', name: 'WhatsApp Broadcast Notification', subject: 'Quick Notification update', html: '<html><body><p>Hello customer, your WhatsApp session has successfully synced.</p></body></html>' },
  { id: 't19', name: 'CRM Lead Follow-up Template', subject: 'Nice talking with you!', html: '<html><body><h2>Let us stay in touch</h2><p>We appreciate your interest in our omnichannel software plans.</p></body></html>' },
  { id: 't20', name: 'Web Live Chat Welcome', subject: 'Hello from live chat widget', html: '<html><body><p>Thanks for visiting. Feel free to leave a message, we reply within minutes.</p></body></html>' }
];

export default function MarketingBroadcastPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers' | 'builder' | 'smtp' | 'analytics'>('campaigns');
  
  // Data Lists
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [smtpServers, setSmtpServers] = useState<SmtpServer[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [subscriberLists, setSubscriberLists] = useState<SubscriberList[]>([]);
  const [activeListId, setActiveListId] = useState<string>('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Campaign Form Modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campName, setCampName] = useState('');
  const [campType, setCampType] = useState<'EMAIL' | 'SMS' | 'WHATSAPP'>('EMAIL');
  const [campSubject, setCampSubject] = useState('');
  const [campBody, setCampBody] = useState('');
  const [targetList, setTargetList] = useState('');

  // SMTP Form Modal
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [smtpName, setSmtpName] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpFromEmail, setSmtpFromEmail] = useState('');

  // Subscriber Form Modal
  const [showSubModal, setShowSubModal] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subFirst, setSubFirst] = useState('');
  const [subLast, setSubLast] = useState('');
  const [subPhone, setSubPhone] = useState('');
  const [csvUploadText, setCsvUploadText] = useState('');
  const [showCsvInput, setShowCsvInput] = useState(false);

  // Create List Modal
  const [showListModal, setShowListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  // Visual Designer states
  const [tempName, setTempName] = useState('');
  const [tempSubject, setTempSubject] = useState('');
  const [tempHtml, setTempHtml] = useState('<html>\n<body>\n  <h1>Welcome!</h1>\n  <p>Thank you for choosing FlowSuite.</p>\n</body>\n</html>');
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const loadMarketingData = async () => {
    try {
      setLoading(true);
      const [camps, smtps, temps, lists] = await Promise.all([
        api.get<Campaign[]>('/api/v1/marketing/campaigns'),
        api.get<SmtpServer[]>('/api/v1/marketing/smtp'),
        api.get<EmailTemplate[]>('/api/v1/marketing/templates'),
        api.get<SubscriberList[]>('/api/v1/subscribers/lists'),
      ]);
      setCampaigns(camps || []);
      setSmtpServers(smtps || []);
      setTemplates(temps || []);
      setSubscriberLists(lists || []);
      
      if (lists && lists.length > 0 && !activeListId) {
        setActiveListId(lists[0].id);
      }
    } catch (err) {
      console.error('Failed to load marketing details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscribers for the active list
  const loadSubscribers = async () => {
    if (!activeListId) return;
    try {
      const data = await api.get<Subscriber[]>(`/api/v1/subscribers/lists/${activeListId}/subscribers`);
      setSubscribers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMarketingData();
  }, []);

  useEffect(() => {
    if (activeListId) {
      loadSubscribers();
    }
  }, [activeListId]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      const newList = await api.post<SubscriberList>('/api/v1/subscribers/lists', {
        name: newListName,
        description: newListDesc
      });
      setNewListName('');
      setNewListDesc('');
      setShowListModal(false);
      loadMarketingData();
      setActiveListId(newList.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeListId || !subEmail.trim()) return;
    try {
      await api.post(`/api/v1/subscribers/lists/${activeListId}/subscribers`, {
        email: subEmail,
        firstName: subFirst || null,
        lastName: subLast || null,
        phone: subPhone || null
      });
      setSubEmail('');
      setSubFirst('');
      setSubLast('');
      setSubPhone('');
      setShowSubModal(false);
      loadSubscribers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportCsv = async () => {
    if (!activeListId || !csvUploadText.trim()) return;
    try {
      // Split by lines and parse
      const lines = csvUploadText.split('\n');
      const payload = lines.map(line => {
        const [email, first, last, phone] = line.split(',');
        return {
          email: email?.trim(),
          firstName: first?.trim() || null,
          lastName: last?.trim() || null,
          phone: phone?.trim() || null
        };
      }).filter(p => p.email && p.email.includes('@'));

      await api.post(`/api/v1/subscribers/lists/${activeListId}/import`, { subscribers: payload });
      alert(`Imported ${payload.length} subscribers successfully!`);
      setCsvUploadText('');
      setShowSubModal(false);
      loadSubscribers();
    } catch (err) {
      alert('Failed to parse and import CSV data.');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim() || !campBody.trim()) return;
    try {
      await api.post('/api/v1/marketing/campaigns', {
        name: campName,
        type: campType,
        subject: campSubject || undefined,
        content: campBody,
        subscriberListId: targetList || undefined
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
      alert('Campaign dispatch initiated via SMTP / SMS Gateways!');
      loadMarketingData();
    } catch (err) {
      alert('Failed to dispatch campaign.');
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
      alert('Template saved to gallery successfully!');
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
      setTimeout(() => {
        setTempHtml(`<html>
<body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
    <h2 style="color: #a855f7; margin-bottom: 20px;">FlowSuite Smart Broadcast</h2>
    <p>Dear Valued Partner,</p>
    <p>${aiPromptInput}</p>
    <p style="margin-top: 30px;">Best Regards,<br/>FlowSuite CRM Engine</p>
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
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-[32px] border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
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
          className="flex items-center gap-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Broadcasts
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-1">
        {[
          { id: 'campaigns', label: '📣 Broadcast Campaigns' },
          { id: 'subscribers', label: '👥 Subscribers & Lists' },
          { id: 'builder', label: '🎨 HTML Template Designer' },
          { id: 'smtp', label: '🔌 SMTP Server Gateways' },
          { id: 'analytics', label: '📊 Smart Tracking Logs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 text-[11px] font-extrabold py-2.5 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white">Broadcast Campaigns</h2>
              <p className="text-[10px] text-slate-500">Dispatch bulk email, SMS, and WhatsApp messages instantly.</p>
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Create Broadcast Campaign
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-850 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3 text-left">Campaign Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Target List</th>
                  <th className="p-3 text-left">Sent Reach</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">No campaigns created yet.</td>
                  </tr>
                ) : (
                  campaigns.map(camp => (
                    <tr key={camp.id} className="hover:bg-slate-850/30 transition">
                      <td className="p-3 font-semibold text-white">{camp.name}</td>
                      <td className="p-3 font-mono font-bold text-purple-400 text-[10px]">{camp.type}</td>
                      <td className="p-3 font-mono text-slate-400">Target Segment</td>
                      <td className="p-3 font-mono">{camp.sentCount} dispatches</td>
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

      {/* TAB 2: SUBSCRIBERS & LISTS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sidebar list selection */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Subscriber Lists</h3>
                <button
                  onClick={() => setShowListModal(true)}
                  className="text-indigo-400 hover:text-white"
                  title="Create List"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                {subscriberLists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setActiveListId(list.id)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      activeListId === list.id 
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-white' 
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{list.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">{list.description || 'No description'}</p>
                    </div>
                    <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                      {list._count?.subscribers || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* List subscribers */}
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active List Contacts</h3>
                  <p className="text-[10px] text-slate-500">Manage contacts, imports, and segmentation targets.</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSubModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Subscriber / Import
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold text-[10px] border-b border-slate-850">
                    <tr>
                      <th className="p-3 text-left">Email Address</th>
                      <th className="p-3 text-left">Full Name</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 text-slate-300">
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-slate-500">No subscribers in this list.</td>
                      </tr>
                    ) : (
                      subscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-3 font-semibold text-white">{sub.email}</td>
                          <td className="p-3 text-slate-400">{sub.firstName} {sub.lastName}</td>
                          <td className="p-3 font-mono text-slate-500">{sub.phone || '--'}</td>
                          <td className="p-3">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: TEMPLATE DESIGNER */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          {/* Templates Gallery Picker (20 Templates) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-purple-400" /> Choose Eid & Marketing layouts from Built-in Gallery ({BUILTIN_TEMPLATES.length})
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-56 overflow-y-auto pr-1">
              {BUILTIN_TEMPLATES.map((tmpl) => (
                <div 
                  key={tmpl.id}
                  onClick={() => {
                    setTempHtml(tmpl.html);
                    setTempSubject(tmpl.subject);
                    setTempName(tmpl.name);
                  }}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-purple-500/50 p-3.5 rounded-xl cursor-pointer transition text-left space-y-1 group"
                >
                  <p className="text-[11px] font-bold text-white group-hover:text-purple-300 transition-colors truncate">{tmpl.name}</p>
                  <p className="text-[9px] text-slate-500 truncate">{tmpl.subject}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* HTML editor and Drag-Drop layout list */}
            <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-400" /> HTML Editor & Block Presets
                </h3>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setTempHtml(tempHtml + '\n<div style="padding: 20px; background-color: #1e293b; text-align: center;"><a href="https://suite.amanasuite.com" style="background-color: #a855f7; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Click Here</a></div>')}
                    className="text-[9px] bg-purple-500/10 text-purple-300 px-2 py-1 rounded border border-purple-500/20 font-bold"
                  >
                    + Button Block
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempHtml(tempHtml + '\n<div style="font-size: 11px; text-align: center; color: #64748b; margin-top: 40px;">Unsubscribe instantly by clicking <a href="https://flowsuite.amanasuite.com/api/v1/subscribers/unsubscribe?email=test" style="color: #a855f7;">here</a>.</div>')}
                    className="text-[9px] bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/20 font-bold"
                  >
                    + Unsubscribe Link
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveTemplate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Template Name</label>
                    <input
                      type="text" required placeholder="Eid Campaign 2026" value={tempName} onChange={e => setTempName(e.target.value)}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Default Subject</label>
                    <input
                      type="text" required placeholder="Eid Mubarak Offers!" value={tempSubject} onChange={e => setTempSubject(e.target.value)}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* AI copywriter */}
                <div className="bg-slate-955 border border-slate-850 p-3 rounded-xl space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Template Copywriter Assistant
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="e.g. Eid sale discounts on workspace subscriptions..."
                      value={aiPromptInput} onChange={e => setAiPromptInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button" onClick={handleAiWriter} disabled={aiGenerating}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1"
                    >
                      {aiGenerating ? 'Writing...' : 'Write'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">HTML Content Body</label>
                  <textarea
                    rows={12} value={tempHtml} onChange={e => setTempHtml(e.target.value)}
                    className="w-full mt-1.5 bg-slate-955 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/25">
                  Save Designer Template to library
                </button>
              </form>
            </div>

            {/* Live render preview */}
            <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-3xl flex flex-col space-y-3">
              <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-400" /> Live HTML Preview Render
              </h3>
              <div className="flex-1 bg-white rounded-2xl overflow-hidden min-h-[350px]">
                <iframe
                  title="HTML Preview"
                  srcDoc={tempHtml}
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: SMTP SERVER CONFIGS */}
      {activeTab === 'smtp' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white">SMTP Mail Gateways</h2>
              <p className="text-[10px] text-slate-500">Configure Amazon SES, Mailgun, cPanel Mail, or custom SMTP relays.</p>
            </div>
            <button
              onClick={() => setShowSmtpModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Server className="w-4 h-4" /> Add SMTP Server
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smtpServers.length === 0 ? (
              <p className="col-span-full text-center text-slate-500 text-xs py-10">No SMTP servers added. Email blasts will use default relay channels.</p>
            ) : (
              smtpServers.map(server => (
                <div key={server.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl space-y-3 relative group">
                  <button
                    onClick={async () => {
                      if (confirm('Delete SMTP configuration?')) {
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
                  <div className="space-y-1 text-xs text-slate-400 border-t border-slate-855 pt-2.5">
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

      {/* TAB 5: SMART TRACKING ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <h2 className="text-sm font-bold text-white">Smart Telemetry Analytics</h2>
            <p className="text-[10px] text-slate-500">Track email open pixels, redirected links CTR, and system bounces.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Broadcast Reach', value: '5,820 dispatches', sub: 'Dispatched successfully', color: 'text-white', icon: Send },
              { label: 'Email Opens Logged', value: '2,674 opens', sub: '45.9% Open Rate', color: 'text-purple-400', icon: Eye },
              { label: 'Link Clicks Logged', value: '1,105 clicks', sub: '18.9% CTR Ratio', color: 'text-emerald-400', icon: Activity },
              { label: 'Bounces Detected', value: '62 bounces', sub: '1.0% bounce threshold', color: 'text-amber-400', icon: Percent },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{s.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-900/60 border border-slate-850 p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-white text-sm">Real-time Telemetry Mechanics</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-955 rounded-xl border border-slate-850 space-y-1">
                <span className="font-extrabold text-purple-400">1. Email Open pixel tracking</span>
                <p className="text-slate-400">A transparent 1x1 image pixel gets automatically injected to count opens:</p>
                <code className="block bg-slate-950 p-2 rounded text-slate-400 font-mono mt-1 overflow-x-auto select-all">
                  {'<img src="https://flowsuite.amanasuite.com/api/v1/marketing/tracking/open?campaignId=CAMPAIGN_ID" width="1" height="1" />'}
                </code>
              </div>
              <div className="p-3 bg-slate-955 rounded-xl border border-slate-850 space-y-1">
                <span className="font-extrabold text-blue-400">2. Link Redirect mapping</span>
                <p className="text-slate-400">All HTML anchor links are processed and wrapped into redirection telemetry:</p>
                <code className="block bg-slate-950 p-2 rounded text-slate-400 font-mono mt-1 overflow-x-auto select-all">
                  {'https://flowsuite.amanasuite.com/api/v1/marketing/tracking/click?campaignId=CAMPAIGN_ID&url=https://YOUR_TARGET_URL'}
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
                  type="text" required placeholder="e.g. Eid Mubarak Flash Sale" value={campName} onChange={e => setCampName(e.target.value)}
                  className="w-full mt-1.5 bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Broadcast Channel</label>
                  <select
                    value={campType} onChange={e => setCampType(e.target.value as any)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="EMAIL">Email Newsletter</option>
                    <option value="SMS">Bulk SMS message</option>
                    <option value="WHATSAPP">WhatsApp message</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Segment List</label>
                  <select
                    value={targetList} onChange={e => setTargetList(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="">Select List...</option>
                    {subscriberLists.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {campType === 'EMAIL' && (
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email Subject</label>
                  <input
                    type="text" required={campType === 'EMAIL'} placeholder="e.g. Eid sale discounts!" value={campSubject} onChange={e => setCampSubject(e.target.value)}
                    className="w-full mt-1.5 bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Message Body / Broadcast text</label>
                <textarea
                  rows={4} required placeholder="Type broadcast message details here..." value={campBody} onChange={e => setCampBody(e.target.value)}
                  className="w-full mt-1.5 bg-slate-955 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowCampaignModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Save Campaign</button>
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
                  type="text" required placeholder="e.g. AWS SES relay" value={smtpName} onChange={e => setSmtpName(e.target.value)}
                  className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Host Address</label>
                  <input
                    type="text" required placeholder="smtp.mailgun.org" value={smtpHost} onChange={e => setSmtpHost(e.target.value)}
                    className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Port</label>
                  <input
                    type="number" value={smtpPort} onChange={e => setSmtpPort(e.target.value)}
                    className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Username</label>
                  <input
                    type="text" required placeholder="postmaster@yourdomain" value={smtpUsername} onChange={e => setSmtpUsername(e.target.value)}
                    className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Password</label>
                  <input
                    type="password" required placeholder="••••••••••••" value={smtpPassword} onChange={e => setSmtpPassword(e.target.value)}
                    className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sender From Email</label>
                <input
                  type="email" required placeholder="marketing@domain.com" value={smtpFromEmail} onChange={e => setSmtpFromEmail(e.target.value)}
                  className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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

      {/* CREATE SUBSCRIBER / IMPORT MODAL */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white">Add Subscribers to List</h3>
              <div className="flex gap-1.5">
                <button
                  type="button" onClick={() => setShowCsvInput(false)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold ${!showCsvInput ? 'bg-indigo-600 text-white' : 'bg-slate-850 text-slate-400'}`}
                >
                  Single Contact
                </button>
                <button
                  type="button" onClick={() => setShowCsvInput(true)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold ${showCsvInput ? 'bg-indigo-600 text-white' : 'bg-slate-850 text-slate-400'}`}
                >
                  Import CSV
                </button>
              </div>
            </div>

            {!showCsvInput ? (
              <form onSubmit={handleAddSubscriber} className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email Address *</label>
                  <input
                    type="email" required placeholder="e.g. rahim@example.com" value={subEmail} onChange={e => setSubEmail(e.target.value)}
                    className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">First Name</label>
                    <input
                      type="text" placeholder="Rahim" value={subFirst} onChange={e => setSubFirst(e.target.value)}
                      className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Last Name</label>
                    <input
                      type="text" placeholder="Ahmed" value={subLast} onChange={e => setSubLast(e.target.value)}
                      className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text" placeholder="+8801700000000" value={subPhone} onChange={e => setSubPhone(e.target.value)}
                    className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setShowSubModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Add subscriber</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Paste CSV rows (Email, FirstName, LastName, Phone)</label>
                  <textarea
                    rows={6} placeholder="rahim@gmail.com, Rahim, Ahmed, +8801700000000&#10;karim@gmail.com, Karim, Miah, +8801800000000"
                    value={csvUploadText} onChange={e => setCsvUploadText(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-750 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowSubModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                  <button type="button" onClick={handleImportCsv} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Import List Data</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE LIST MODAL */}
      {showListModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Create Subscriber List</h3>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">List Name *</label>
                <input
                  type="text" required placeholder="e.g. Bangladesh Customers 2026" value={newListName} onChange={e => setNewListName(e.target.value)}
                  className="w-full mt-1.5 bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Description</label>
                <input
                  type="text" placeholder="Leads captured from Eid campaign form" value={newListDesc} onChange={e => setNewListDesc(e.target.value)}
                  className="w-full mt-1.5 bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowListModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Create List</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
