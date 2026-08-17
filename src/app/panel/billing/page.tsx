'use client';

import React, { useState } from 'react';
import { Wallet, CreditCard, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, Zap, Check, Coins, TrendingUp, RefreshCw } from 'lucide-react';

const plans = [
  { name: 'Starter', price: 29, features: ['3 Social Accounts', '500 AI Credits/mo', '1 WhatsApp Channel', 'Basic Analytics'], color: 'border-slate-700', badge: '' },
  { name: 'Growth', price: 79, features: ['15 Social Accounts', '3,000 AI Credits/mo', '5 WhatsApp Channels', 'CRM Pipeline', 'Priority Support'], color: 'border-purple-500', badge: 'POPULAR' },
  { name: 'Agency', price: 199, features: ['Unlimited Accounts', '15,000 AI Credits/mo', 'Unlimited WhatsApp', 'White-Label Branding', 'Custom CNAME', 'Dedicated Manager'], color: 'border-blue-500', badge: 'ENTERPRISE' },
];

const transactions = [
  { id: 'TXN-8821', type: 'credit', method: 'bKash Topup', amount: 2000, credits: 1500, date: 'Aug 17, 2026', status: 'Completed' },
  { id: 'TXN-8734', type: 'debit', method: 'AI Caption Writer', amount: 0, credits: -250, date: 'Aug 16, 2026', status: 'Used' },
  { id: 'TXN-8655', type: 'credit', method: 'Nagad Topup', amount: 5000, credits: 4000, date: 'Aug 15, 2026', status: 'Completed' },
  { id: 'TXN-8501', type: 'debit', method: 'WhatsApp Broadcast', amount: 0, credits: -180, date: 'Aug 14, 2026', status: 'Used' },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'topup' | 'history'>('overview');

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
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">GROWTH PLAN ACTIVE</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Subscription Management, bKash/Nagad Payments & AI Token Metering</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" /> Top Up AI Credits
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {(['overview', 'plans', 'topup', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'}`}
          >
            {tab === 'overview' ? '📊 Overview' : tab === 'plans' ? '🚀 Upgrade Plans' : tab === 'topup' ? '💳 Top Up' : '📜 Transaction History'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Credit Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Available AI Credits</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-4xl font-black text-white">4,850</p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> +1,500 from last topup
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full">
                <div className="w-3/5 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
              </div>
              <p className="text-xs text-slate-400">4,850 / 8,000 credits used this billing cycle</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-slate-400 font-semibold">Current Plan</span>
              <p className="text-2xl font-black text-purple-400">Growth</p>
              <p className="text-xs text-slate-400">৳ 6,900 / month</p>
              <button className="w-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold py-1.5 rounded-lg hover:bg-purple-600/30 transition">
                Upgrade to Agency →
              </button>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-slate-400 font-semibold">Next Billing Date</span>
              <p className="text-xl font-black text-white">Sep 01, 2026</p>
              <p className="text-xs text-slate-400">Auto-renewal enabled</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Payment Secured
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-400" /> Recent Transactions
            </h2>
            <div className="space-y-2">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{tx.method}</p>
                      <p className="text-[10px] text-slate-400">{tx.id} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${tx.credits > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.credits > 0 ? '+' : ''}{tx.credits} Credits
                    </p>
                    <p className="text-[10px] text-slate-400">{tx.amount > 0 ? `৳ ${tx.amount.toLocaleString()}` : tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.name} className={`bg-slate-900/80 border-2 ${plan.color} rounded-2xl p-6 space-y-4 relative`}>
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-0.5 rounded-full ${plan.badge === 'POPULAR' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {plan.badge}
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-white">${plan.price}</span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">≈ ৳ {(plan.price * 110).toLocaleString()} / month</p>
              </div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${plan.badge === 'POPULAR' ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20' : plan.badge === 'ENTERPRISE' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                {plan.badge === 'POPULAR' ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Top Up Tab */}
      {activeTab === 'topup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" /> Top Up AI Credits
            </h2>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2000, 5000, 10000, 25000].map(amt => (
                  <button key={amt} className="bg-slate-950 border border-slate-800 hover:border-purple-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
                    ৳ {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Payment Method</label>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl hover:bg-pink-500/20 transition text-left">
                  <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center text-white text-xs font-black">bK</div>
                  <div>
                    <p className="text-xs font-bold text-white">bKash Mobile Banking</p>
                    <p className="text-[10px] text-slate-400">Send to: 01XXXXXXXXX</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl hover:bg-orange-500/20 transition text-left">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-black">N</div>
                  <div>
                    <p className="text-xs font-bold text-white">Nagad Mobile Wallet</p>
                    <p className="text-[10px] text-slate-400">Send to: 01XXXXXXXXX</p>
                  </div>
                </button>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-600/20">
              Confirm Top Up Payment
            </button>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="font-bold text-white text-sm">Credit Rate Calculator</h2>
            <div className="space-y-2 text-xs">
              {[{ bdt: 500, credits: 350 }, { bdt: 1000, credits: 750 }, { bdt: 2000, credits: 1600 }, { bdt: 5000, credits: 4200 }, { bdt: 10000, credits: 9000 }].map(r => (
                <div key={r.bdt} className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">৳ {r.bdt.toLocaleString()} BDT</span>
                  <span className="font-bold text-amber-400">= {r.credits.toLocaleString()} AI Credits</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5" />
              All payments are processed manually and credits are added within 30 minutes.
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {activeTab === 'history' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-white text-sm">Complete Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/50 text-slate-400 uppercase">
                <tr>
                  <th className="p-3 rounded-l-lg">Transaction ID</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Amount (BDT)</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-purple-400">{tx.id}</td>
                    <td className="p-3">{tx.method}</td>
                    <td className={`p-3 font-bold ${tx.credits > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{tx.credits > 0 ? '+' : ''}{tx.credits}</td>
                    <td className="p-3">{tx.amount > 0 ? `৳ ${tx.amount.toLocaleString()}` : '—'}</td>
                    <td className="p-3 text-slate-400">{tx.date}</td>
                    <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
