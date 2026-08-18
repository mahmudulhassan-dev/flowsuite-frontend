'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  CheckCircle2,
  Send,
  Image as ImageIcon,
  BarChart3,
  RefreshCw,
  Trash2,
  Sparkles,
  Eye,
  FileText,
  MessageCircle,
  ThumbsUp,
  Share2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { api } from '../../../lib/api';

interface Post {
  id: string;
  content: string;
  mediaUrls: any; // JSON array
  postType: string;
  targetPlatforms: any; // JSON array
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
  scheduledAt: string | null;
  createdAt: string;
}

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/20' },
  { id: 'linkedin', label: 'LinkedIn', icon: Globe, color: 'text-sky-400', bg: 'bg-sky-500/20' },
  { id: 'twitter', label: 'X (Twitter)', icon: Globe, color: 'text-slate-300', bg: 'bg-slate-500/20' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/20' },
  { id: 'tiktok', label: 'TikTok', icon: Globe, color: 'text-slate-400', bg: 'bg-slate-500/20' },
];

export default function PublisherPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'compose' | 'calendar' | 'queue'>('compose');

  // Preview Mockup active tab
  const [previewTab, setPreviewTab] = useState<'facebook' | 'instagram' | 'linkedin' | 'twitter'>('facebook');

  // AI Prompt Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Calendar Date State
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-indexed

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
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
        targetPlatforms: selectedPlatforms.map(p => p.toUpperCase()),
        scheduledAt: scheduledAtStr,
        mediaUrls: mediaUrl ? [mediaUrl] : [],
        postType: mediaUrl ? 'SINGLE_IMAGE' : 'TEXT',
      });
      setCaption('');
      setMediaUrl('');
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
    if (!confirm('Are you sure you want to delete this post?')) return;
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
      // Fallback local simulated generator if AI API fails
      let responseText = '';
      try {
        const res = await api.post<{ output: string }>('/api/v1/ai/generate', {
          task: 'caption',
          prompt: aiPromptInput,
          tone: 'professional',
        });
        responseText = res.output;
      } catch {
        responseText = `✨ FlowSuite AI: Here is a custom scheduled post about "${aiPromptInput}". Make sure to subscribe to stay tuned! #SaaS #Growth`;
      }
      setCaption(responseText);
      setShowAiModal(false);
      setAiPromptInput('');
    } catch (err) {
      console.error('Failed to generate AI caption:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const parseJsonArray = (val: any): string[] => {
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  };

  // Monthly Calendar Generator Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
    const dayCells: React.ReactNode[] = [];

    // Fill blank cells for previous month padding
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(<div key={`empty-${i}`} className="bg-slate-900/10 min-h-[80px] border border-slate-900/40 opacity-40" />);
    }

    // Fill current month cells
    for (let day = 1; day <= daysInMonth; day++) {
      // Find posts scheduled for this day
      const dayDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayPosts = posts.filter(post => {
        if (!post.scheduledAt) return false;
        const postDate = new Date(post.scheduledAt).toISOString().split('T')[0];
        return postDate === dayDateStr;
      });

      dayCells.push(
        <div
          key={`day-${day}`}
          onClick={() => {
            setScheduledDate(dayDateStr);
            setScheduledTime('12:00');
            setActiveView('compose');
          }}
          className="bg-slate-900/40 border border-slate-900/80 p-2 min-h-[85px] hover:bg-slate-800/20 cursor-pointer transition flex flex-col justify-between"
        >
          <span className="text-[10px] font-bold text-slate-500">{day}</span>
          <div className="space-y-1 mt-1">
            {dayPosts.slice(0, 3).map(p => {
              const platforms = parseJsonArray(p.targetPlatforms);
              return (
                <div key={p.id} className="bg-purple-600/20 border border-purple-500/30 px-1.5 py-0.5 rounded text-[8px] font-semibold text-purple-300 truncate max-w-full" title={p.content}>
                  {platforms[0] || 'POST'}: {p.content}
                </div>
              );
            })}
            {dayPosts.length > 3 && (
              <span className="text-[8px] font-bold text-slate-500">+{dayPosts.length - 3} more</span>
            )}
          </div>
        </div>
      );
    }

    return dayCells;
  };

  return (
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <CalendarIcon className="w-7 h-7" />
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
          {/* Form Composer */}
          <div className="lg:col-span-3 space-y-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h2 className="font-bold text-white text-sm">Create New Post</h2>

            {/* Platform Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Target Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => {
                  const Icon = p.icon;
                  const sel = selectedPlatforms.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => togglePlatform(p.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${sel ? `${p.bg} ${p.color} border-current` : 'bg-slate-900 border-slate-855 text-slate-400 hover:text-slate-200'}`}>
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
                <label className="text-xs font-semibold text-slate-300">Caption Content</label>
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="text-xs text-purple-400 font-semibold bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg hover:bg-purple-500/20 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> AI Write Caption
                </button>
              </div>
              <textarea
                rows={4}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write caption here or let AI assist..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none text-slate-200"
              />
            </div>

            {/* Media Upload URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-400" /> Media Image Link URL (Optional)
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 text-slate-200"
              />
            </div>

            {/* Schedule picker */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Schedule Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Schedule Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Send triggers */}
            <div className="flex gap-3">
              <button
                onClick={(e) => handleCreatePost(e, false)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
              >
                <Clock className="w-4 h-4" /> Schedule Post
              </button>
              <button
                onClick={(e) => handleCreatePost(e, true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-3 rounded-xl text-xs transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Publish Now
              </button>
            </div>
          </div>

          {/* Right Column: Live platform preview mockups */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" /> Platform Feed Previews
            </h2>

            {/* Mockup Tab Header */}
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex gap-1">
              {(['facebook', 'instagram', 'linkedin', 'twitter'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setPreviewTab(tab)}
                  className={`flex-1 text-[10px] py-1.5 rounded-lg capitalize font-bold transition ${
                    previewTab === tab ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Mockup Outer Box */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl min-h-[300px]">
              {previewTab === 'facebook' && (
                <div className="space-y-4 text-xs">
                  {/* FB Mockup Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">FS</div>
                    <div>
                      <span className="font-bold text-white block">FlowSuite Brand Account</span>
                      <span className="text-[9px] text-slate-500">Sponsored · 🌐</span>
                    </div>
                  </div>
                  {/* FB text */}
                  <p className="text-slate-200 leading-relaxed break-words">{caption || 'Your Facebook post caption will appear here...'}</p>
                  
                  {/* FB Image Box */}
                  {mediaUrl && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img src={mediaUrl} alt="FB preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Likes / shares */}
                  <div className="flex justify-between text-[10px] text-slate-500 border-t border-b border-slate-800 py-2">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-blue-500" /> Like</span>
                    <span><MessageCircle className="w-3.5 h-3.5" /> Comment</span>
                    <span><Share2 className="w-3.5 h-3.5" /> Share</span>
                  </div>
                </div>
              )}

              {previewTab === 'instagram' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-[9px]">FS</div>
                    </div>
                    <span className="font-bold text-white">flowsuite_app</span>
                  </div>

                  {/* Instagram Image Area (Mandatory aspect matching) */}
                  <div className="w-full aspect-square rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
                    {mediaUrl ? (
                      <img src={mediaUrl} alt="IG preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-600">Instagram post preview requires a media URL.</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-white block">102 Likes</span>
                    <p className="text-slate-300">
                      <span className="font-bold text-white mr-1.5">flowsuite_app</span>
                      {caption || 'Caption details...'}
                    </p>
                  </div>
                </div>
              )}

              {previewTab === 'linkedin' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-sky-700 flex items-center justify-center font-bold text-white">FS</div>
                    <div>
                      <span className="font-bold text-white block">FlowSuite Enterprise</span>
                      <span className="text-[9px] text-slate-500">12,504 followers · Promoted</span>
                    </div>
                  </div>

                  <p className="text-slate-200 leading-relaxed">{caption || 'LinkedIn post preview text...'}</p>

                  {mediaUrl && (
                    <div className="w-full border border-slate-850 rounded-xl overflow-hidden">
                      <img src={mediaUrl} alt="LI preview" className="w-full aspect-video object-cover" />
                      <div className="p-3 bg-slate-900 border-t border-slate-850">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">flowsuite.amansuite.com</span>
                        <span className="font-bold text-white block mt-0.5">Automated Social Media Post</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {previewTab === 'twitter' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white">X</div>
                    <div>
                      <span className="font-bold text-white block">FlowSuite (@flowsuite_app)</span>
                      <span className="text-[9px] text-slate-500">Just now</span>
                    </div>
                  </div>

                  <p className="text-slate-100 leading-relaxed text-sm">{caption || 'Twitter tweet details...'}</p>

                  {mediaUrl && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-800">
                      <img src={mediaUrl} alt="X preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-850">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-purple-400" />
              Content Editorial Calendar: {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar grid headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>
      )}

      {/* Queue Table View */}
      {activeView === 'queue' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-850 text-slate-400 uppercase">
              <tr>
                <th className="p-3 text-left">Post Content</th>
                <th className="p-3 text-left">Target Channels</th>
                <th className="p-3 text-left">Schedule Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <RefreshCw className="w-6 h-6 text-purple-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">No posts in the publishing queue.</td>
                </tr>
              ) : (
                posts.map(post => {
                  const platforms = parseJsonArray(post.targetPlatforms);
                  return (
                    <tr key={post.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 text-white max-w-xs">
                        <p className="truncate text-xs" title={post.content}>{post.content}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {platforms.map(p => {
                            const cfg = PLATFORMS.find(pl => pl.id === p.toLowerCase());
                            return cfg ? (
                              <span key={p} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
                                {cfg.label}
                              </span>
                            ) : (
                              <span key={p} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                                {p}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3 text-slate-400">
                        {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : 'Immediate'}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : post.status === 'FAILED'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button onClick={() => handleDeletePost(post.id)} className="text-red-400 hover:text-red-350 transition font-semibold">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* AI CAPTION WRITER MODAL */}
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
                  placeholder="e.g. Launching our new mobile application on Google Play Store! Try it free..."
                  value={aiPromptInput}
                  onChange={e => setAiPromptInput(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
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
