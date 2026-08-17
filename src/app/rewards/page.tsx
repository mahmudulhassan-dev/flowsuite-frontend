'use client';

import React from 'react';
import { Gift, Award, Sparkles, Star } from 'lucide-react';

export default function RewardsPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Gift className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Loyalty Points & Sign-Up Rewards Program
            </h1>
            <p className="text-slate-400 text-sm">
              Earn Free AI Credits, Bonus Social Accounts & Priority Agent Support by Inviting Team Members
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
