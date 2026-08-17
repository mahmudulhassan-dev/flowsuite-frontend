'use client';

import React, { useState } from 'react';
import { DollarSign, Gift, Users, Share2, Copy, Check, ArrowRight } from 'lucide-react';

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://suite.amanasuite.com/register?ref=agency_main_001";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              FlowSuite Affiliate Partner Portal
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                30% RECURRING COMMISSION
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Earn 30% Monthly Lifetime Recurring Revenue by Referring Agencies & Businesses to FlowSuite
            </p>
          </div>
        </div>
      </div>

      {/* Unique Link & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" /> Your Unique Referral Link
          </h2>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center font-mono text-sm">
            <span className="text-emerald-300 truncate">{referralLink}</span>
            <button
              onClick={copyLink}
              className="ml-4 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Link!' : 'Copy Referral Link'}
            </button>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <span className="text-slate-400 text-xs font-semibold uppercase">Total Earnings This Month</span>
          <p className="text-3xl font-bold text-emerald-400">$1,450.00</p>
          <span className="text-xs text-slate-400">Paid out via bKash / Nagad / Bank Wire</span>
        </div>
      </div>
    </div>
  );
}
