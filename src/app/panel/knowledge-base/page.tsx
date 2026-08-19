'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Folder, FileText, Search, RefreshCw, Trash2, 
  Edit3, Eye, Check, X, Tag, Globe, SlidersHorizontal, AlertCircle
} from 'lucide-react';
import { api } from '../../../lib/api';

interface KbCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { articles: number };
}

interface KbArticle {
  id: string;
  categoryId: string | null;
  category?: KbCategory | null;
  title: string;
  slug: string;
  content: string;
  views: number;
  helpful: number;
  notHelpful: number;
  isPublic: boolean;
  createdAt: string;
}

export default function KnowledgeBasePage() {
  const [categories, setCategories] = useState<KbCategory[]>([]);
  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modals
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');

  const [showArticleModal, setShowArticleModal] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const [artSlug, setArtSlug] = useState('');
  const [artCat, setArtCat] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artIsPublic, setArtIsPublic] = useState(true);

  // View Article
  const [viewingArticle, setViewingArticle] = useState<KbArticle | null>(null);

  const loadKbData = async () => {
    try {
      setLoading(true);
      const [cats, arts] = await Promise.all([
        api.get<KbCategory[]>('/api/v1/knowledge/categories'),
        api.get<KbArticle[]>('/api/v1/knowledge/articles'),
      ]);
      setCategories(cats || []);
      setArticles(arts || []);
    } catch (err) {
      console.error('Failed to load KB data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKbData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catSlug.trim()) return;
    try {
      await api.post('/api/v1/knowledge/categories', {
        name: catName,
        slug: catSlug.toLowerCase().replace(/\s+/g, '-')
      });
      setCatName('');
      setCatSlug('');
      setShowCatModal(false);
      loadKbData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artContent.trim()) return;
    try {
      await api.post('/api/v1/knowledge/articles', {
        title: artTitle,
        slug: artSlug.toLowerCase().replace(/\s+/g, '-') || artTitle.toLowerCase().replace(/\s+/g, '-'),
        categoryId: artCat || undefined,
        content: artContent,
        isPublic: artIsPublic
      });
      setArtTitle('');
      setArtSlug('');
      setArtCat('');
      setArtContent('');
      setArtIsPublic(true);
      setShowArticleModal(false);
      loadKbData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/api/v1/knowledge/articles/${id}`);
      loadKbData();
    } catch (err) {
      console.error(err);
    }
  };

  const getFilteredArticles = () => {
    return articles.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || art.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategoryId === 'all' || art.categoryId === activeCategoryId;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredArticles = getFilteredArticles();

  return (
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-[32px] border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Knowledge Base & Help Center
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-mono font-bold">Public Desk</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Author documentation guides, FAQs articles, and embed helpful documents into customer portals.</p>
          </div>
        </div>
        <button
          onClick={loadKbData}
          className="flex items-center gap-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Desk
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Categories */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Doc Categories</h3>
            <button
              onClick={() => setShowCatModal(true)}
              className="text-purple-400 hover:text-white flex items-center gap-0.5"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveCategoryId('all')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                activeCategoryId === 'all' 
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-850/50'
              }`}
            >
              <span className="flex items-center gap-2">📂 All Documentation</span>
              <span className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded-full font-mono font-bold">{articles.length}</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                  activeCategoryId === cat.id 
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/25' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-855/50'
                }`}
              >
                <span className="flex items-center gap-2">📁 {cat.name}</span>
                <span className="text-[10px] bg-slate-950 text-slate-500 px-2 py-0.5 rounded-full font-mono font-bold">
                  {articles.filter(a => a.categoryId === cat.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Articles explorer */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text" placeholder="Search knowledge articles..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
            
            <button
              onClick={() => setShowArticleModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Author Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full py-10 flex justify-center"><RefreshCw className="w-7 h-7 text-purple-500 animate-spin" /></div>
            ) : filteredArticles.length === 0 ? (
              <div className="col-span-full border border-slate-850 bg-slate-900/10 rounded-2xl py-12 text-center text-slate-500 text-xs">
                No articles found in this documentation category.
              </div>
            ) : (
              filteredArticles.map((art) => (
                <div key={art.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-3xl space-y-3 flex flex-col justify-between hover:border-slate-800 transition">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded border border-slate-850 font-mono">
                        {art.category?.name || 'Uncategorized'}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {art.isPublic ? 'Public' : 'Internal'}</span>
                    </div>
                    <h3 className="font-extrabold text-white text-sm leading-snug">{art.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">{art.content.replace(/<[^>]*>/g, '')}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-850 pt-3 mt-1.5">
                    <span className="text-[10px] text-slate-500 font-bold font-mono">👀 {art.views} views</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setViewingArticle(art)}
                        className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 px-2.5 py-1 rounded text-[10px] font-bold"
                      >
                        Read
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* CREATE CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Add Doc Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Category Name *</label>
                <input
                  type="text" required placeholder="e.g. Getting Started" value={catName} onChange={e => { setCatName(e.target.value); setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                  className="w-full mt-1.5 bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block">URL Slug</label>
                <input
                  type="text" required placeholder="getting-started" value={catSlug} onChange={e => setCatSlug(e.target.value)}
                  className="w-full mt-1.5 bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowCatModal(false)} className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUTHOR ARTICLE MODAL */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-3xl max-h-[92vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-extrabold text-white">Author Knowledge Base Article</h3>
            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Article Title *</label>
                  <input
                    type="text" required placeholder="e.g. How to pair WhatsApp via QR code" value={artTitle} 
                    onChange={e => { setArtTitle(e.target.value); setArtSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                    className="w-full bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Article URL Slug</label>
                  <input
                    type="text" required placeholder="how-to-pair-whatsapp" value={artSlug} onChange={e => setArtSlug(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Documentation Category</label>
                  <select
                    value={artCat} onChange={e => setArtCat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="">Select Category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Visibility Status</label>
                  <select
                    value={artIsPublic ? 'public' : 'private'} onChange={e => setArtIsPublic(e.target.value === 'public')}
                    className="w-full bg-slate-955 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="public">🌐 Public helpdesk access</option>
                    <option value="private">🔒 Internal staff access only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase block">Article Body Content (Markdown supported)</label>
                <textarea
                  rows={8} required placeholder="Write helpdesk details here..." value={artContent} onChange={e => setArtContent(e.target.value)}
                  className="w-full mt-1.5 bg-slate-955 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowArticleModal(false)} className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-650 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEWING MODAL */}
      {viewingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-855 pb-2">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2.5 py-0.5 rounded font-mono font-bold">
                {viewingArticle.category?.name || 'Uncategorized'}
              </span>
              <button onClick={() => setViewingArticle(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <h2 className="text-lg font-black text-white leading-snug">{viewingArticle.title}</h2>
            <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans pt-2 border-t border-slate-850">
              {viewingArticle.content}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-850">
              <button onClick={() => setViewingArticle(null)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
