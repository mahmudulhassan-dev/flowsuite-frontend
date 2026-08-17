'use client';

import React from 'react';
import { Wallet, CreditCard, ShieldCheck } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Billing & AI Credit Wallet
            </h1>
            <p className="text-slate-400 text-sm">
              Subscription Management, Local bKash / Nagad Payment Gateways & AI Token Metering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
