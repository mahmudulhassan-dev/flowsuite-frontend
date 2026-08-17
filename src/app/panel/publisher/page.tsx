'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Clock, Facebook, Instagram, Youtube, Globe, CheckCircle2, Send, Image, BarChart3 } from 'lucide-react';

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/20' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/20' },
  { id: 'tiktok', label: 'TikTok', icon: Globe, color: 'text-slate-400', bg: 'bg-slate-500/20' },
  { id: 'linkedin', label: 'LinkedIn', icon: Globe, color: 'text-sky-400', bg: 'bg-sky-500/20' },
  { id: 'twitter', label: 'X (Twitter)', icon: Globe, color: 'text-slate-300', bg: 'bg-slate-500/20' },
];

const scheduledPosts = [
  { id: 1, content: 'Eid Mubarak! ৫০% ছাড়ে আমাদের সকল পণ্য পাচ্ছেন...', platforms: ['facebook', 'instagram'], time: 'Aug 18, 9:00 AM', status: 'scheduled' },
  { id: 2, content: 'New product launch 🚀 Our FlowSuite Agency Plan is now live...', platforms: ['facebook', 'twitter', 'linkedin'], time: 'Aug 19, 2:00 PM', status: 'scheduled' },
  { id: 3, content: 'Customer success story — How we helped Karim grow 10x...', platforms: ['instagram', 'youtube'], time: 'Aug 17, 10:00 AM', status: 'published' },
];

export default function PublisherPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);
  const [caption, setCaption] = useState('');
  const [activeView, setActiveView] = useState<'compose' | 'calendar' | 'queue'>('compose');

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Social Media Publisher
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">15 Platforms</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Schedule & Auto-Publish to Facebook, Instagram, TikTok, YouTube, LinkedIn & more</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(['compose', 'calendar', 'queue'] as const).map(v => (
            <button key={v} onClick={() => setActiveView(v)} className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${activeView === v ? 'bg-purple-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}>
              {v === 'compose' ? '✍️ Compose' : v === 'calendar' ? '📅 Calendar' : '📋 Queue'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Posts Published', value: '1,284', color: 'text-white' },
          { label: 'Scheduled', value: '34', color: 'text-amber-400' },
          { label: 'Total Reach', value: '2.4M', color: 'text-purple-400' },
          { label: 'Avg Engagement', value: '8.7%', color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Compose View */}
      {activeView === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-white text-sm">Create New Post</h2>

            {/* Platform Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Target Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => {
                  const Icon = p.icon;
                  const sel = selectedPlatforms.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => togglePlatform(p.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${sel ? `${p.bg} ${p.color} border-current` : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {p.label}
                      {sel && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Caption</label>
                <button className="text-xs text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition">
                  ✨ AI Write Caption
                </button>
              </div>
              <textarea
                rows={6}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="পোস্টের ক্যাপশন লিখুন বা AI দিয়ে তৈরি করুন..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
              />
              <p className="text-[10px] text-slate-500">{caption.length} / 2,200 characters</p>
            </div>

            {/* Media Upload */}
            <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-6 text-center cursor-pointer transition-all group">
              <Image className="w-8 h-8 text-slate-600 group-hover:text-purple-400 mx-auto mb-2 transition" />
              <p className="text-xs text-slate-400">Drag & Drop images/videos or click to upload</p>
              <p className="text-[10px] text-slate-600 mt-1">JPG, PNG, MP4, MOV — Max 500MB</p>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Schedule Date & Time</label>
                <input type="datetime-local" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Timezone</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                  <option>Asia/Dhaka (GMT+6)</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20">
                <Clock className="w-4 h-4" /> Schedule Post
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-3 rounded-xl text-sm transition flex items-center gap-2">
                <Send className="w-4 h-4" /> Publish Now
              </button>
            </div>
          </div>

          {/* Post Queue Preview */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-white text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-400" /> Upcoming Queue</h2>
            {scheduledPosts.map(post => (
              <div key={post.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{post.content}</p>
                <div className="flex flex-wrap gap-1">
                  {post.platforms.map(p => {
                    const cfg = PLATFORMS.find(pl => pl.id === p);
                    if (!cfg) return null;
                    const Icon = cfg.icon;
                    return (
                      <span key={p} className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-2.5 h-2.5" /> {cfg.label}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{post.time}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                    {post.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue View */}
      {activeView === 'queue' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/50 text-slate-400 uppercase">
              <tr>
                <th className="p-3 text-left">Post Content</th>
                <th className="p-3 text-left">Platforms</th>
                <th className="p-3 text-left">Scheduled</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scheduledPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 text-white max-w-xs">
                    <p className="truncate text-xs">{post.content}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {post.platforms.map(p => {
                        const cfg = PLATFORMS.find(pl => pl.id === p);
                        return cfg ? <span key={p} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span> : null;
                      })}
                    </div>
                  </td>
                  <td className="p-3 text-slate-400">{post.time}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {post.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Calendar placeholder */}
      {activeView === 'calendar' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Calendar className="w-12 h-12 text-purple-400 mx-auto" />
          <h3 className="font-bold text-white">Visual Content Calendar</h3>
          <p className="text-xs text-slate-400">Drag & drop scheduled posts on the calendar. Google Calendar sync available.</p>
          <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition mx-auto flex items-center gap-2">
            <Plus className="w-4 h-4" /> Coming Soon — Full Calendar View
          </button>
        </div>
      )}
    </div>
  );
}
