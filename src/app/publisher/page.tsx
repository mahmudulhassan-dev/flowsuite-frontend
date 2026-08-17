'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Image, Send, Clock, Sparkles, CheckCircle2, Globe, ArrowRight } from 'lucide-react';

export default function PublisherPage() {
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Social Media Publisher & Scheduler
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-mono">
                9 PLATFORMS ACTIVE
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Schedule & Publish Posts to Facebook, Instagram, TikTok, LinkedIn, YouTube, X & WhatsApp
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-600/20 text-sm">
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

      {/* Main Composer & Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Composer Box */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Multi-Platform Post Composer
          </h2>

          {/* Platform Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Select Target Channels</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'facebook', name: 'Facebook Page', color: 'bg-blue-600' },
                { id: 'instagram', name: 'Instagram Business', color: 'bg-pink-600' },
                { id: 'tiktok', name: 'TikTok Creator', color: 'bg-slate-800 border-slate-700' },
                { id: 'linkedin', name: 'LinkedIn Org', color: 'bg-sky-600' },
                { id: 'youtube', name: 'YouTube Shorts', color: 'bg-red-600' },
                { id: 'whatsapp', name: 'WhatsApp Channel', color: 'bg-emerald-600' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                    selectedPlatforms.includes(p.id)
                      ? `${p.color} text-white border-transparent shadow-md`
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {selectedPlatforms.includes(p.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Caption & Hashtags</label>
              <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Enhance with AI Copywriter
              </button>
            </div>
            <textarea
              rows={5}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write your engaging social media post caption, hashtags, and CTA here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder-slate-600"
            />
          </div>

          {/* Action Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
                <Image className="w-4 h-4 text-blue-400" /> Add Media & Video
              </button>
              <button className="flex items-center gap-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
                <Clock className="w-4 h-4 text-amber-400" /> Schedule Post Time
              </button>
            </div>
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20">
              <Send className="w-4 h-4" /> Publish Now
            </button>
          </div>
        </div>

        {/* Right: Scheduled Pipeline Preview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" /> Scheduled Pipeline
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">FB & IG</span>
                <span className="text-slate-400">Today, 6:00 PM</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">
                "🚀 Launching our new Omnichannel AI Marketing Automation Suite for agencies!"
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">LinkedIn</span>
                <span className="text-slate-400">Tomorrow, 10:00 AM</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">
                "How multi-tenant SaaS platforms scale to 10M+ active users using PostgreSQL and Redis."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
