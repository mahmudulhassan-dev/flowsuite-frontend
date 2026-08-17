'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Facebook, Instagram, Youtube, Globe, CheckCircle2, Send, Image as ImageIcon, BarChart3, RefreshCw, Trash2, Sparkles } from 'lucide-react';
import { api } from '../../../lib/api';

interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  postType: string;
  targetPlatforms: string[];
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
  scheduledAt: string | null;
  createdAt: string;
}

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/20' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/20' },
  { id: 'tiktok', label: 'TikTok', icon: Globe, color: 'text-slate-400', bg: 'bg-slate-500/20' },
  { id: 'linkedin', label: 'LinkedIn', icon: Globe, color: 'text-sky-400', bg: 'bg-sky-500/20' },
  { id: 'twitter', label: 'X (Twitter)', icon: Globe, color: 'text-slate-300', bg: 'bg-slate-500/20' },
];

export default function PublisherPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'compose' | 'calendar' | 'queue'>('compose');

  // AI Prompt Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.get<Post[]>('/api/v1/publisher/posts');
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent, publishImmediately = false) => {
    e.preventDefault();
    if (!caption.trim() || selectedPlatforms.length === 0) return;

    let scheduledAtStr: string | null = null;
    if (!publishImmediately && scheduledDate && scheduledTime) {
      scheduledAtStr = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    }

    try {
      setLoading(true);
      await api.post('/api/v1/publisher/posts', {
        content: caption,
        platform: selectedPlatforms[0], // primary
        scheduledAt: scheduledAtStr,
        mediaUrls: [],
        postType: 'TEXT',
      });
      setCaption('');
      setScheduledDate('');
      setScheduledTime('');
      loadPosts();
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setLoading(true);
      await api.delete(`/api/v1/publisher/posts/${postId}`);
      loadPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAiWriteCaption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptInput.trim()) return;

    try {
      setAiGenerating(true);
      const res = await api.post<{ output: string }>('/api/v1/ai/generate', {
        task: 'caption',
        prompt: aiPromptInput,
        tone: 'professional',
      });
      setCaption(res.output);
      setShowAiModal(false);
      setAiPromptInput('');
    } catch (err) {
      console.error('Failed to generate AI caption:', err);
    } finally {
      setAiGenerating(false);
    }
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
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">Database Linked</span>
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
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="text-xs text-purple-400 font-semibold bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg hover:bg-purple-500/20 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> AI Write Caption
                </button>
              </div>
              <textarea
                rows={6}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write caption here or let AI assist..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Schedule Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Schedule Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => handleCreatePost(e, false)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
              >
                <Clock className="w-4 h-4" /> Schedule Post
              </button>
              <button
                onClick={(e) => handleCreatePost(e, true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-3 rounded-xl text-sm transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Publish Now
              </button>
            </div>
          </div>

          {/* Post Queue Preview */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-white text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-400" /> Upcoming Queue</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">No posts scheduled.</div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 relative group">
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 rounded-lg text-slate-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{post.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {post.targetPlatforms.map(p => {
                      const cfg = PLATFORMS.find(pl => pl.id === p.toLowerCase());
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
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : 'Immediate'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))
            )}
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
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 text-white max-w-xs">
                    <p className="truncate text-xs">{post.content}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {post.targetPlatforms.map(p => {
                        const cfg = PLATFORMS.find(pl => pl.id === p.toLowerCase());
                        return cfg ? <span key={p} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{cfg.label}</span> : null;
                      })}
                    </div>
                  </td>
                  <td className="p-3 text-slate-400">
                    {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : 'Immediate'}
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-400 hover:text-red-300">Delete</button>
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
        </div>
      )}

      {/* AI CAPTION MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> Write Caption with AI
            </h3>
            <form onSubmit={handleAiWriteCaption} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">What is your post about?</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Eid-ul-Fitr discounts on all fashion items, valid until next Friday..."
                  value={aiPromptInput}
                  onChange={e => setAiPromptInput(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1"
                >
                  {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate Caption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
