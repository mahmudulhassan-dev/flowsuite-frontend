'use client';

import React from 'react';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-6 bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex justify-between items-center pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/30">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Terms of Service & SLA</h1>
              <p className="text-slate-400 text-xs">Last Updated: August 18, 2026 | FlowSuite Enterprise</p>
            </div>
          </div>
          <Link href="/" className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to App
          </Link>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using FlowSuite (&quot;the Platform&quot;), operated by FlowSuite SaaS Platform, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. User Account & Workspace Responsibilities</h2>
            <p>
              Agencies and individual users must maintain strict security over their access credentials and API tokens. FlowSuite enforces 100% data separation across multi-tenant workspaces.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. 99.99% Uptime Guarantee (SLA)</h2>
            <p>
              FlowSuite guarantees 99.99% operational uptime across PostgreSQL database clusters, Redis queues, and Next.js frontend services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
