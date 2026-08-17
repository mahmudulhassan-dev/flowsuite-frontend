'use client';

import React from 'react';
import { Users, UserPlus, Phone, Mail, Filter, Search } from 'lucide-react';

export default function CRMPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              CRM & Lead Pipeline Manager
            </h1>
            <p className="text-slate-400 text-sm">
              Manage Omnichannel Contacts, Lead Scores & Automated Sales Funnels
            </p>
          </div>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add New Lead
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input type="text" placeholder="Search contacts..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-3 rounded-l-lg">Contact Name</th>
                <th className="p-3">Email & Phone</th>
                <th className="p-3">Lead Stage</th>
                <th className="p-3">Score</th>
                <th className="p-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-semibold text-white">Karim Rahman</td>
                <td className="p-3 text-xs text-slate-400">karim@example.com | +8801700000000</td>
                <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30">QUALIFIED LEAD</span></td>
                <td className="p-3 font-mono font-bold text-amber-400">92/100</td>
                <td className="p-3"><button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg">View Contact</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
