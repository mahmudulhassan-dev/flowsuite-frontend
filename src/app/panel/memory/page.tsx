'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain, Plus, RefreshCw, Trash2, Search, Link2, Globe, FileText,
  CheckCircle, AlertCircle, Eye, ArrowRight, Database, ChevronRight, X
} from 'lucide-react';
import { api } from '../../../lib/api';

interface KbArticle {
  id: string;
  categoryId: string | null;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

export default function AIWorkspaceMemoryPage() {
  const [crawledUrls, setCrawledUrls] = useState<KbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Crawling URL form state
  const [urlInput, setUrlInput] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState<string | null>(null);
  const [crawlError, setCrawlError] = useState<string | null>(null);

  // View Article
  const [viewingArticle, setViewingArticle] = useState<KbArticle | null>(null);

  const loadMemoryData = async () => {
    try {
      setLoading(true);
      const res = await api.get<KbArticle[]>('/api/v1/knowledge/articles');
      // Filter only articles that belong to Scraped Website Memory (content starts with CRAWLED FROM or contains url in brackets)
      const filtered = (res || []).filter(a => a.title.includes('(') && a.title.includes(')'));
      setCrawledUrls(filtered);
    } catch (err) {
      console.error('Failed to load AI memory databases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawlWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setCrawling(true);
    setCrawlMessage(null);
    setCrawlError(null);

    try {
      const res = await api.post<{ data: KbArticle; message: string }>('/api/v1/knowledge/crawl', {
        url: urlInput.trim()
      });
      setCrawlMessage(res.message);
      setUrlInput('');
      loadMemoryData();
    } catch (err: any) {
      setCrawlError(err.message || 'Failed to crawl target site URL. Please verify address is public and accepts GET requests.');
    } finally {
      setCrawling(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crawled memory page? This will remove it from the AI agent prompt.')) return;
    try {
      await api.delete(`/api/v1/knowledge/articles/${id}`);
      loadMemoryData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMemoryData();
  }, []);

  const filteredMemories = crawledUrls.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-[32px] border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Central Memory & Knowledge Router
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-mono font-bold">DeepSeek Context</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Scrape custom site pages, feed database context, and auto-train inbox AI reply assistants.</p>
          </div>
        </div>
        <button
          onClick={loadMemoryData}
          className="flex items-center gap-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Memory
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: URL Scraper Form & Statistics */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-4 h-4 text-purple-400" /> Scrape Site URL</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Input a web page address to fetch its plain-text and import into memory.</p>
            </div>

            <form onSubmit={handleCrawlWebsite} className="space-y-3">
              <div className="space-y-1">
                <input
                  type="url" required placeholder="https://your-company.com/faq" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  disabled={crawling}
                />
              </div>

              {crawlMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{crawlMessage}</span>
                </div>
              )}

              {crawlError && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{crawlError}</span>
                </div>
              )}

              <button
                type="submit" disabled={crawling}
                className="w-full bg-purple-650 hover:bg-purple-600 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                {crawling ? <><RefreshCw className="w-4 h-4 animate-spin" /> Scraping Page Contents...</> : <><Link2 className="w-4 h-4" /> Index Site Page</>}
              </button>
            </form>
          </div>

          {/* Stats card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><Database className="w-4 h-4 text-indigo-400" /> Memory Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <p className="text-[10px] text-slate-500 font-bold">Total Pages Indexed</p>
                <p className="text-xl font-black text-white mt-1">{crawledUrls.length}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <p className="text-[10px] text-slate-500 font-bold">AI Router Model</p>
                <p className="text-xs font-black text-purple-400 mt-2 font-mono">DeepSeek v4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Memory Explorer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text" placeholder="Search crawled memory blocks..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full py-10 flex justify-center"><RefreshCw className="w-7 h-7 text-purple-500 animate-spin" /></div>
            ) : filteredMemories.length === 0 ? (
              <div className="col-span-full border border-slate-850 bg-slate-900/10 rounded-2xl py-12 text-center text-slate-500 text-xs">
                No site crawled memory records found. Input a URL to feed the AI context.
              </div>
            ) : (
              filteredMemories.map((art) => (
                <div key={art.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-3xl space-y-3 flex flex-col justify-between hover:border-slate-800 transition">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded border border-slate-850 truncate max-w-[180px]">
                        🌐 Web Index Page
                      </span>
                      <span className="text-slate-600 font-mono text-[9px]">{new Date(art.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-extrabold text-white text-sm leading-snug line-clamp-2">{art.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-4 leading-relaxed font-sans">{art.content.replace('CRAWLED FROM:', 'Source URL:')}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-850 pt-3">
                    <span className="text-[9px] text-emerald-400 font-bold">✓ Ready in context prompt</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setViewingArticle(art)}
                        className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 px-3 py-1 rounded-xl text-[10px] font-bold"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleDeleteMemory(art.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-xl"
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

      {/* VIEWING PREVIEW MODAL */}
      {viewingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-855 pb-2">
              <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/25 px-2.5 py-0.5 rounded font-mono font-bold">
                Crawled memory database details
              </span>
              <button onClick={() => setViewingArticle(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <h2 className="text-base font-black text-white leading-snug">{viewingArticle.title}</h2>
            <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans pt-3 border-t border-slate-850 max-h-[400px] overflow-y-auto">
              {viewingArticle.content}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-850">
              <button onClick={() => setViewingArticle(null)} className="bg-purple-650 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Close Preview</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
