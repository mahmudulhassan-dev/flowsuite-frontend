'use client';

import React, { useState } from 'react';
import { DollarSign, Gift, Users, Share2, Copy, Check, ArrowRight, BarChart3, Wallet, Settings, Landmark, ShieldCheck, Mail, Sparkles, ArrowUpRight, Download } from 'lucide-react';
import Link from 'next/link';

const sampleReferredCustomers = [
  { id: 1, orgName: 'Horizon Media agency', date: 'Aug 14, 2026', plan: 'PRO_AGENCY', status: 'Active', commission: '$29.70' },
  { id: 2, orgName: 'Amana Mart Corp', date: 'Aug 12, 2026', plan: 'ENTERPRISE', status: 'Active', commission: '$89.70' },
  { id: 3, orgName: 'PixelCraft Studio', date: 'Aug 08, 2026', plan: 'PRO_AGENCY', status: 'Active', commission: '$29.70' },
  { id: 4, orgName: 'Siam Digital Solutions', date: 'Aug 05, 2026', plan: 'FREE_TRIAL', status: 'Trial', commission: '$0.00' },
];

const emailSwipes = [
  {
    title: 'Swipe 1: Focus on AI Automation',
    subject: 'Boost your agency social media workflow by 10x with FlowSuite! 🚀',
    body: 'Hi [Name],\n\nAre you tired of manually scheduling posts and managing client DMs on multiple channels?\n\nFlowSuite is a 100% strict TypeScript platform that puts social publishing, AI auto-replies, CRM, and bulk broadcasting into a single premium interface.\n\nCheck it out here: {{ref_link}}\n\nBest,\n[Your Name]'
  },
  {
    title: 'Swipe 2: Focus on Omnichannel Inbox',
    subject: 'Instantly reply to WhatsApp, Messenger & Web chat in one inbox 💬',
    body: 'Hello [Name],\n\nMake sure your sales reps never miss a lead. FlowSuite links Facebook, Instagram, WhatsApp, and Web Live Chat widgets into a unified inbox with AI auto-responders.\n\nTry it now: {{ref_link}}'
  }
];

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const [copiedSwipe, setCopiedSwipe] = useState<number | null>(null);
  const [customRef, setCustomRef] = useState('agency_main_001');
  const [payoutMethod, setPayoutMethod] = useState('bkash');
  const [payoutDetails, setPayoutDetails] = useState('01700000000');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'settings'>('dashboard');

  const referralLink = `https://suite.amanasuite.com/register?ref=${customRef}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySwipeText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSwipe(index);
    setTimeout(() => setCopiedSwipe(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        Earn 30% Lifetime Recurring Commissions. Payouts processed every single month!
        <Link href="/panel" className="underline font-bold hover:text-amber-200 ml-2">
          Back to Panel &rarr;
        </Link>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              FS
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                FlowSuite <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">PARTNER</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Affiliate Partner Portal</p>
            </div>
          </Link>

          <div className="flex gap-2">
            {(['dashboard', 'assets', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize border ${activeTab === tab ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
              >
                {tab === 'dashboard' ? '📊 Partner Dashboard' : tab === 'assets' ? '📧 Email & Ad Swipes' : '💳 Payout Settings'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Referral Link Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 glow-purple space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-400 animate-pulse" /> Customize & Copy Referral Link
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Edit your custom code below to personalize your partner link.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex justify-between items-center font-mono text-sm overflow-hidden">
                  <span className="text-emerald-300 truncate pr-4">{referralLink}</span>
                  <button
                    onClick={copyLink}
                    className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300 animate-bounce" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Link Copied!' : 'Copy Link'}
                  </button>
                </div>
                <div className="md:w-64 flex flex-col justify-center">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Referral Slug</label>
                  <input
                    type="text"
                    value={customRef}
                    onChange={e => setCustomRef(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Referred Signups', value: '24', change: '5 pending trials', color: 'text-white', icon: Users },
                { label: 'Conversion Rate', value: '12.4%', change: 'Industry avg is 3.5%', color: 'text-purple-400', icon: BarChart3 },
                { label: 'Total Earnings', value: '$1,450.00', change: '৳ 1,59,500 BDT Paid', color: 'text-emerald-400', icon: DollarSign },
                { label: 'Pending Payout', value: '$450.00', change: 'Next payout Sep 01', color: 'text-amber-400', icon: Wallet },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-semibold">{s.label}</span>
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-slate-500">{s.change}</p>
                  </div>
                );
              })}
            </div>

            {/* Referral Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm">Recent Referred Customers</h3>
              </div>
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Referred Date</th>
                    <th className="p-3">Plan Subscribed</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Your Commission (30% MRR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {sampleReferredCustomers.map(r => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-white">{r.orgName}</td>
                      <td className="p-3 text-slate-400">{r.date}</td>
                      <td className="p-3">
                        <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          {r.plan}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{r.commission} / mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ASSETS TAB */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" /> High-Converting Email Swipe Copies
              </h2>
              <p className="text-xs text-slate-400">Copy these templates, paste your link, and email them to your clients or lists.</p>
              <div className="space-y-4">
                {emailSwipes.map((swipe, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white">{swipe.title}</h4>
                      <button
                        onClick={() => copySwipeText(swipe.body.replace('{{ref_link}}', referralLink), i)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      >
                        {copiedSwipe === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSwipe === i ? 'Copied' : 'Copy Text'}
                      </button>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p><span className="text-slate-500">Subject:</span> <span className="font-semibold text-slate-200">{swipe.subject}</span></p>
                      <pre className="bg-slate-900 p-3 rounded-lg text-slate-400 whitespace-pre-wrap font-sans mt-2 border border-slate-800">{swipe.body.replace('{{ref_link}}', referralLink)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banners */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Brand Media Kit & Promos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">FlowSuite Dark Logo Pack</h4>
                    <p className="text-[10px] text-slate-500">SVG, PNG High resolution assets</p>
                  </div>
                  <button className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white transition"><Download className="w-4 h-4" /></button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Facebook & LinkedIn Banners</h4>
                    <p className="text-[10px] text-slate-500">Optimized promo covers</p>
                  </div>
                  <button className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white transition"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-purple-400" /> Payout Configurations
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Select how you want to receive your affiliate commission earnings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block">Payout Method</label>
                  <select
                    value={payoutMethod}
                    onChange={e => setPayoutMethod(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="bkash">bKash Personal Account</option>
                    <option value="nagad">Nagad Personal Account</option>
                    <option value="bank">Bank Transfer (Local Wire)</option>
                    <option value="paypal">PayPal (International)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block">Account Details / Wallet Number</label>
                  <input
                    type="text"
                    value={payoutDetails}
                    onChange={e => setPayoutDetails(e.target.value)}
                    placeholder="e.g. 01700000000 or IBAN details"
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Save Payout Details
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs text-slate-400 leading-relaxed">
                <h4 className="font-bold text-white">Commission Policies & Schedule</h4>
                <p>🚀 Commission payouts are processed once a month between the **1st and 5th** of the following month.</p>
                <p>💸 There is a minimum threshold of **$50.00** required to trigger payout transfers.</p>
                <p>🛡️ All referrals are subject to a **14-day hold** period to protect against chargebacks and subscription cancellations.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
