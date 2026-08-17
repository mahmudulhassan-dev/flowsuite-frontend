'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Zap, MessageSquare, Instagram, Cpu, Plus, Play, Pause, Settings, ChevronRight, Brain, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';

const agents = [
  { id: 1, name: 'WhatsApp Sales Agent', platform: 'WhatsApp', status: 'active', replies: 1482, model: 'GPT-4o', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  { id: 2, name: 'Instagram DM Agent', platform: 'Instagram', status: 'active', replies: 934, model: 'Claude 3.5', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/30' },
  { id: 3, name: 'Caption Writer AI', platform: 'All Platforms', status: 'active', replies: 2841, model: 'GPT-4o', icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  { id: 4, name: 'Facebook FAQ Bot', platform: 'Messenger', status: 'paused', replies: 412, model: 'Gemini Pro', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
];

export default function AIStudioPage() {
  const [activeAgent, setActiveAgent] = useState(agents[0]);
  const [credits, setCredits] = useState<number | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  const loadCredits = async () => {
    try {
      setLoadingCredits(true);
      const data = await api.get<{ balance: number }>('/api/v1/ai/credits');
      setCredits(data.balance);
    } catch (err) {
      console.error('Failed to load AI credits:', err);
    } finally {
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    loadCredits();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Agent Studio
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">4 Active Agents</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Multi-LLM AI Agents for WhatsApp, Instagram, Messenger & Caption Writing</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={loadCredits} className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Credits
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total AI Replies', value: '5,669', color: 'text-white' },
          { label: 'AI Credit Balance', value: loadingCredits ? 'Loading...' : credits?.toLocaleString() ?? '5,000', color: 'text-amber-400' },
          { label: 'Avg Response Time', value: '1.2s', color: 'text-emerald-400' },
          { label: 'Human Escalations', value: '4.3%', color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="space-y-3">
          <h2 className="font-bold text-white text-sm flex items-center gap-2"><Cpu className="w-4 h-4 text-purple-400" /> Your AI Agents</h2>
          {agents.map(agent => {
            const Icon = agent.icon;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${activeAgent.id === agent.id ? 'bg-purple-600/20 border-purple-500/50' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${agent.bg} ${agent.border} border`}>
                      <Icon className={`w-4 h-4 ${agent.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{agent.name}</p>
                      <p className="text-[10px] text-slate-400">{agent.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{agent.replies.toLocaleString()} replies</span>
                  <span className="text-purple-400">{agent.model}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Agent Configuration */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              Configure: {activeAgent.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">AI Model</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
                <option>GPT-4o (OpenAI)</option>
                <option>Claude 3.5 Sonnet (Anthropic)</option>
                <option>Gemini 1.5 Pro (Google)</option>
                <option>Grok-2 (xAI)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Response Language</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
                <option>বাংলা (Bengali)</option>
                <option>English</option>
                <option>Auto-Detect</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">System Prompt</label>
            </div>
            <textarea
              rows={5}
              defaultValue={`তুমি FlowSuite-এর AI বিক্রয় সহকারী। তোমার কাজ হলো গ্রাহকদের পণ্য সম্পর্কে সাহায্য করা, মূল্য জানানো এবং অর্ডার নেওয়া। সর্বদা বাংলায় উত্তর দেবে এবং বিনম্র থাকবে।`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-black font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20">
              Save & Activate Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
