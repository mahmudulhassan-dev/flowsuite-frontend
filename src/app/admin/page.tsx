'use client';

import React from 'react';
import { ShieldCheck, Users, Server, Database, Activity, Lock, Cpu, Globe, Key, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              FlowSuite SuperAdmin Control Gateway
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono">
                SYSTEM ROOT
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Global Platform Governance, Multi-Tenant Workspaces, API Metering & Node Health
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-purple-600/20 text-sm">
            <Key className="w-4 h-4" /> Issue Master License Key
          </button>
        </div>
      </div>

      {/* Global Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>Active Workspaces</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">1,482</p>
          <span className="text-xs text-emerald-400 font-medium">+14% new agencies this month</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>Node Clusters Health</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">99.98%</p>
          <span className="text-xs text-blue-400 font-medium">10/10 Microservices Operational</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>PostgreSQL & Redis Load</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">18.4%</p>
          <span className="text-xs text-emerald-400 font-medium">aaPanel Database Optimal</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-sm font-medium">
            <span>AI Token Consumption</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">14.2M</p>
          <span className="text-xs text-amber-400 font-medium">OpenAI, Claude & Gemini API</span>
        </div>
      </div>

      {/* Tenant Management Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-400" /> Managed Multi-Tenant Workspaces
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-3 rounded-l-lg">Workspace Name</th>
                <th className="p-3">CNAME Domain</th>
                <th className="p-3">Plan</th>
                <th className="p-3">AI Credits Left</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-semibold text-white">Amana Media Agency</td>
                <td className="p-3 text-purple-400 font-mono">suite.amanasuite.com</td>
                <td className="p-3"><span className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-1 rounded-full border border-purple-500/30">PRO AGENCY</span></td>
                <td className="p-3 font-mono">9,850 / 10,000</td>
                <td className="p-3"><span className="text-emerald-400 flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active</span></td>
                <td className="p-3"><button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700">Manage Tenant</button></td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3 font-semibold text-white">Global Social Marketing Ltd</td>
                <td className="p-3 text-purple-400 font-mono">social.globalmktg.com</td>
                <td className="p-3"><span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full border border-amber-500/30">ENTERPRISE</span></td>
                <td className="p-3 font-mono">48,200 / 50,000</td>
                <td className="p-3"><span className="text-emerald-400 flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active</span></td>
                <td className="p-3"><button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700">Manage Tenant</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
