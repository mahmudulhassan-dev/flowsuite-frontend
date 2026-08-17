'use client';

import React, { useState } from 'react';
import { Settings, Globe, Key, Webhook, ShieldCheck, Bell, User, Palette, Plus, Check, Copy, Trash2, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'webhooks' | 'domains' | 'security' | 'notifications'>('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile & Brand' },
    { id: 'social', icon: Globe, label: 'Social API Keys' },
    { id: 'webhooks', icon: Webhook, label: 'Webhooks' },
    { id: 'domains', icon: Globe, label: 'Custom CNAME' },
    { id: 'security', icon: ShieldCheck, label: 'Security & 2FA' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-700/50 text-slate-300 rounded-xl border border-slate-700">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Platform Settings</h1>
            <p className="text-slate-400 text-xs mt-0.5">API Keys, White-Label Domains, Webhooks & Security</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl text-sm transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20'}`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="lg:w-52 flex-shrink-0">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 space-y-5">

          {activeTab === 'profile' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-sm flex items-center gap-2"><User className="w-4 h-4 text-purple-400" /> Workspace Profile & Branding</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Workspace / Agency Name</label>
                  <input type="text" defaultValue="Agency Pro Workspace" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Contact Email</label>
                  <input type="email" defaultValue="admin@agency.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Timezone</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                    <option>Asia/Dhaka (GMT+6)</option>
                    <option>UTC</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Language & Locale</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                    <option>English (US)</option>
                    <option>বাংলা</option>
                    <option>Arabic (RTL)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Brand Logo URL</label>
                <input type="text" placeholder="https://example.com/logo.png" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 focus:outline-none focus:border-purple-500" />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-sm flex items-center gap-2"><Key className="w-4 h-4 text-amber-400" /> Social Platform API Keys</h2>
              <div className="space-y-4">
                {[
                  { name: 'Facebook / Meta App ID', placeholder: 'Enter your Meta App ID', status: 'Connected', color: 'text-emerald-400' },
                  { name: 'Meta App Secret', placeholder: 'Enter your Meta App Secret', status: 'Connected', color: 'text-emerald-400' },
                  { name: 'WhatsApp Business API Token', placeholder: 'Enter WhatsApp Cloud API Token', status: 'Connected', color: 'text-emerald-400' },
                  { name: 'Instagram Access Token', placeholder: 'Enter Instagram Graph API Token', status: 'Not Set', color: 'text-slate-500' },
                  { name: 'TikTok API Client Key', placeholder: 'Enter TikTok Developer Client Key', status: 'Not Set', color: 'text-slate-500' },
                  { name: 'LinkedIn Client ID', placeholder: 'Enter LinkedIn App Client ID', status: 'Not Set', color: 'text-slate-500' },
                ].map(field => (
                  <div key={field.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">{field.name}</label>
                      <span className={`text-[10px] font-bold ${field.color}`}>{field.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <input type="password" placeholder={field.placeholder} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
                      <button className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-slate-400 hover:text-white transition">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white text-sm flex items-center gap-2"><Webhook className="w-4 h-4 text-blue-400" /> Webhook Endpoints</h2>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition">
                  <Plus className="w-3.5 h-3.5" /> Add Webhook
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { url: 'https://your-site.com/webhook/new-lead', event: 'New Lead Created', status: 'Active' },
                  { url: 'https://your-site.com/webhook/message', event: 'New Inbox Message', status: 'Active' },
                  { url: 'https://your-site.com/webhook/post-publish', event: 'Post Published', status: 'Disabled' },
                ].map((wh, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <p className="text-xs font-semibold text-white font-mono">{wh.url}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Event: {wh.event}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${wh.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>{wh.status}</span>
                      <button className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-sm flex items-center gap-2"><Globe className="w-4 h-4 text-indigo-400" /> Custom White-Label CNAME Domains</h2>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 leading-relaxed">
                <strong>How to setup:</strong> Add a CNAME DNS record pointing your custom domain to <code className="bg-indigo-900/40 px-1.5 py-0.5 rounded">cname.suite.amanasuite.com</code>. It may take up to 24 hours to propagate.
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Custom Panel Domain</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="panel.youragency.com" className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 rounded-xl text-sm transition">Verify DNS</button>
                </div>
              </div>
              <div className="space-y-2">
                {['panel.acme-agency.com', 'crm.topagency.io'].map(domain => (
                  <div key={domain} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono text-white">{domain}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">SSL Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-white text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Security & 2FA Authentication</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Current Password</label>
                  <input type="password" placeholder="Enter current password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">New Password</label>
                  <input type="password" placeholder="Enter strong new password" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Adds an extra layer of security to your account</p>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition">Enable 2FA</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">Active Login Sessions</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 devices currently logged in</p>
                  </div>
                  <button className="text-red-400 hover:text-red-300 text-xs font-bold border border-red-500/30 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition">Revoke All</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-blue-400" /> Notification Preferences</h2>
              {[
                { name: 'New Inbox Message', desc: 'When a customer sends a new message', enabled: true },
                { name: 'Post Published Successfully', desc: 'When a scheduled post goes live', enabled: true },
                { name: 'New Lead Added to CRM', desc: 'When a new lead is captured', enabled: true },
                { name: 'AI Credits Low (< 500)', desc: 'When your AI credits are running low', enabled: true },
                { name: 'Weekly Performance Report', desc: 'Summary of your weekly social metrics', enabled: false },
                { name: 'Payment Received', desc: 'When a billing payment is confirmed', enabled: true },
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                  <div>
                    <p className="text-xs font-semibold text-white">{item.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${item.enabled ? 'bg-purple-600' : 'bg-slate-700'} relative`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
