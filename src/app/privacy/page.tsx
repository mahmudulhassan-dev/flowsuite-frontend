'use client';

import React from 'react';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-6 bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex justify-between items-center pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Privacy Policy & GDPR Compliance</h1>
              <p className="text-slate-400 text-xs">Last Updated: August 18, 2026 | FlowSuite Protection</p>
            </div>
          </div>
          <Link href="/" className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to App
          </Link>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Data Encryption & Storage Security</h2>
            <p>
              FlowSuite protects all customer lead data, social access tokens, and chat histories using AES-256 encryption at rest and TLS 1.3 in transit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Meta & WhatsApp Data Protection</h2>
            <p>
              We comply with Meta Official API Policies. User tokens are never shared, sold, or exposed to unauthorized third parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
