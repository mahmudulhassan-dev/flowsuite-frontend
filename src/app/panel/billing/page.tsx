'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, Plus, ShieldCheck, Check, Coins, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';

interface PlanDetails {
  id: string;
  name: string;
  plan: 'FREE_TRIAL' | 'PRO_AGENCY' | 'ENTERPRISE';
  aiCredits: number;
  createdAt: string;
}

const plansList = [
  { id: 'FREE_TRIAL', name: 'Free Trial', price: 0, credits: '5,000 AI Credits', features: ['3 Social Accounts', '5,000 AI Credits', '1 WhatsApp Channel', 'Basic Analytics'], color: 'border-slate-800' },
  { id: 'PRO_AGENCY', name: 'Pro Agency', price: 99, credits: '100,000 AI Credits', features: ['15 Social Accounts', '100,000 AI Credits', '5 WhatsApp Channels', 'CRM Pipeline', 'Priority Support'], color: 'border-purple-500' },
  { id: 'ENTERPRISE', name: 'Enterprise', price: 299, credits: '500,000 AI Credits', features: ['Unlimited Accounts', '500,000 AI Credits', 'Unlimited WhatsApp', 'White-Label Branding', 'Custom CNAME', 'Dedicated Manager'], color: 'border-blue-500' },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans'>('overview');
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBillingDetails = async () => {
    try {
      setLoading(true);
      const data = await api.get<PlanDetails>('/api/v1/billing/plan');
      setPlanDetails(data);
    } catch (err) {
      console.error('Failed to load billing details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingDetails();
  }, []);

  const handleUpgradePlan = async (planId: 'FREE_TRIAL' | 'PRO_AGENCY' | 'ENTERPRISE') => {
    try {
      setLoading(true);
      await api.post('/api/v1/billing/upgrade', { plan: planId });
      loadBillingDetails();
    } catch (err) {
      console.error('Failed to upgrade plan:', err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Billing & AI Credit Wallet
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase">
                {planDetails?.plan || 'Loading...'} Active
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Subscription Management, Payment Gateways & AI Token Metering</p>
          </div>
        </div>
        <button onClick={loadBillingDetails} className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {(['overview', 'plans'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'}`}
          >
            {tab === 'overview' ? '📊 Overview' : '🚀 Subscription Plans'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Credit Balance Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Available AI Credits</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-4xl font-black text-white">
                {loading ? '...' : planDetails?.aiCredits?.toLocaleString() || '5,000'}
              </p>
              <div className="w-full h-2 bg-slate-800 rounded-full mt-2">
                <div className="w-4/5 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
              </div>
              <p className="text-xs text-slate-400">Included in your subscription plan</p>
            </div>

            {/* Current Plan Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-slate-400 font-semibold">Current Plan Tier</span>
              <p className="text-2xl font-black text-purple-400">{planDetails?.plan || 'Loading...'}</p>
              <button
                onClick={() => setActiveTab('plans')}
                className="w-full mt-4 bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold py-2 rounded-lg hover:bg-purple-600/30 transition"
              >
                Change Subscription Plan →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plansList.map(plan => {
            const isCurrent = planDetails?.plan === plan.id;
            return (
              <div key={plan.id} className={`bg-slate-900/80 border-2 ${plan.color} rounded-2xl p-6 space-y-4 relative flex flex-col justify-between`}>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-white">${plan.price}</span>
                    <span className="text-slate-400 text-sm">/month</span>
                  </div>
                  <p className="text-xs text-amber-400 font-bold">{plan.credits}</p>
                  <ul className="space-y-2 pt-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleUpgradePlan(plan.id as any)}
                  disabled={isCurrent || loading}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all mt-6 ${isCurrent ? 'bg-purple-600/25 border border-purple-500/50 text-purple-400 cursor-default' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                >
                  {isCurrent ? 'Current Plan Tier' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
