'use client';

import React from 'react';
import { Bot, Sparkles, Image, Mic, MessageSquare, Zap, Play } from 'lucide-react';

export default function AIStudioPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              FlowSuite AI Agent Studio
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                4,850 Credits
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Generate AI Social Posts, Virtual Fashion Models, Voice Call Agents & Auto-Comment Moderation
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/50 transition-all">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl w-fit">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Social Copywriter AI</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Generate high-converting captions, hashtags & emojis for FB, Instagram, TikTok & LinkedIn.
          </p>
          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            <Play className="w-4 h-4" /> Run Assistant
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-blue-500/50 transition-all">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit">
            <Image className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Virtual Fashion Model AI</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Generate studio-grade Virtual AI Fashion Models for e-commerce products using Imagen 3.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            <Play className="w-4 h-4" /> Open Studio
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/50 transition-all">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit">
            <Mic className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Voice Call Sales Agent</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Automate phone call sales leads & customer appointment booking with real-time Gemini Voice.
          </p>
          <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            <Play className="w-4 h-4" /> Deploy Agent
          </button>
        </div>
      </div>
    </div>
  );
}
