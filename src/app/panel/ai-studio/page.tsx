'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Zap, MessageSquare, Instagram, Cpu, Plus, Play, Pause, Settings, ChevronRight, Brain } from 'lucide-react';

const agents = [
  { id: 1, name: 'WhatsApp Sales Agent', platform: 'WhatsApp', status: 'active', replies: 1482, model: 'GPT-4o', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  { id: 2, name: 'Instagram DM Agent', platform: 'Instagram', status: 'active', replies: 934, model: 'Claude 3.5', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/30' },
  { id: 3, name: 'Caption Writer AI', platform: 'All Platforms', status: 'active', replies: 2841, model: 'GPT-4o', icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
  { id: 4, name: 'Facebook FAQ Bot', platform: 'Messenger', status: 'paused', replies: 412, model: 'Gemini Pro', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
];

export default function AIStudioPage() {
  const [activeAgent, setActiveAgent] = useState(agents[0]);

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
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" /> Create New Agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total AI Replies', value: '5,669', color: 'text-white' },
          { label: 'AI Credits Used', value: '3,150', color: 'text-amber-400' },
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
                    {agent.status === 'active' ? (
                      <Pause className="w-3 h-3 text-slate-400" />
                    ) : (
                      <Play className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{agent.replies.toLocaleString()} replies</span>
                  <span className="text-purple-400">{agent.model}</span>
                </div>
              </button>
            );
          })}

          <button className="w-full p-4 rounded-xl border-2 border-dashed border-slate-800 hover:border-purple-500/50 text-slate-500 hover:text-purple-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all">
            <Plus className="w-4 h-4" /> Create New Agent
          </button>
        </div>

        {/* Agent Configuration */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              Configure: {activeAgent.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-full font-semibold">
                {activeAgent.status === 'active' ? '🟢 LIVE' : '⏸️ PAUSED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">AI Model</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
                <option>GPT-4o (OpenAI)</option>
                <option>Claude 3.5 Sonnet (Anthropic)</option>
                <option>Gemini 1.5 Pro (Google)</option>
                <option>Grok-2 (xAI)</option>
                <option>Mistral Large</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Response Language</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
                <option>বাংলা (Bengali)</option>
                <option>English</option>
                <option>Arabic</option>
                <option>Auto-Detect</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">System Prompt</label>
              <button className="text-xs text-amber-400 font-semibold flex items-center gap-1 hover:text-amber-300">
                <Sparkles className="w-3 h-3" /> AI Enhance Prompt
              </button>
            </div>
            <textarea
              rows={5}
              defaultValue={`তুমি FlowSuite-এর AI বিক্রয় সহকারী। তোমার কাজ হলো গ্রাহকদের পণ্য সম্পর্কে সাহায্য করা, মূল্য জানানো এবং অর্ডার নেওয়া। সর্বদা বাংলায় উত্তর দেবে এবং বিনম্র থাকবে। যদি প্রশ্নের উত্তর জানা না থাকে, তাহলে মানব এজেন্টের কাছে পাঠিয়ে দেবে।`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Max Response Tokens</label>
              <input type="number" defaultValue={500} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Confidence Threshold</label>
              <input type="range" min={0} max={100} defaultValue={70} className="w-full mt-2" />
              <p className="text-[10px] text-slate-400">70% — Below this, escalate to human</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300">Quick Actions (Automated Triggers)</h3>
            <div className="space-y-2">
              {[
                { trigger: 'Customer says "price" or "দাম"', action: 'Send product catalog with pricing' },
                { trigger: 'Customer says "order" or "অর্ডার"', action: 'Create CRM lead + send order form link' },
                { trigger: 'No response for 30 minutes', action: 'Send follow-up message' },
              ].map((qa, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <Zap className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400">Trigger: <span className="text-slate-200 font-medium">{qa.trigger}</span></p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Action: <span className="text-purple-300 font-medium">{qa.action}</span></p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-black font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20">
              Save & Activate Agent
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-2.5 rounded-xl text-sm transition">
              Test Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
