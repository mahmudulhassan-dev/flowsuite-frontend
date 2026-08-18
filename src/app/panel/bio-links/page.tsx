'use client';

import React, { useState, useEffect } from 'react';
import {
  Link2,
  Plus,
  Trash2,
  Settings,
  Eye,
  CheckCircle,
  AlertCircle,
  AlignLeft,
  ImageIcon,
  Grid,
  Youtube,
  Tv,
  Music,
  Share2,
  Copy,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';

interface BiolinkBlock {
  id: string;
  type: string;
  config: any; // { url, text, icon, title, mediaId, etc. }
  sortOrder: number;
}

interface BiolinkPage {
  id: string;
  urlSlug: string;
  title: string | null;
  description: string | null;
  logoUrl: string | null;
  themeSettings: any; // { background, font, textColor, buttonStyle }
  isActive: boolean;
  viewsCount: number;
  blocks: BiolinkBlock[];
}

export default function BiolinksPage() {
  const { activeWorkspaceId } = useAuth();
  const [pages, setPages] = useState<BiolinkPage[]>([]);
  const [activePage, setActivePage] = useState<BiolinkPage | null>(null);

  // New Page Config Form
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  // Theme Config
  const [bgGradient, setBgGradient] = useState('from-indigo-900 to-slate-950');
  const [textColor, setTextColor] = useState('#ffffff');
  const [btnStyle, setBtnStyle] = useState('rounded-xl border border-white/20 bg-white/10 hover:bg-white/20');

  // Block Builder config
  const [newBlockType, setNewBlockType] = useState('LINK');
  const [blockTitle, setBlockTitle] = useState('');
  const [blockUrl, setBlockUrl] = useState('');
  const [blockEmbedId, setBlockEmbedId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedSlug, setCopiedSlug] = useState('');

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/v1/biolinks', {
        headers: {
          'x-workspace-id': activeWorkspaceId || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setPages(data.data);
        if (data.data.length > 0 && !activePage) {
          setActivePage(data.data[0]);
          loadPageStates(data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [activeWorkspaceId]);

  const loadPageStates = (page: BiolinkPage) => {
    setSlug(page.urlSlug);
    setTitle(page.title || '');
    setDescription(page.description || '');
    setLogoUrl(page.logoUrl || '');
    setBgGradient(page.themeSettings.bgGradient || 'from-indigo-900 to-slate-950');
    setTextColor(page.themeSettings.textColor || '#ffffff');
    setBtnStyle(page.themeSettings.btnStyle || 'rounded-xl border border-white/20 bg-white/10 hover:bg-white/20');
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const themeSettings = { bgGradient, textColor, btnStyle };
      const res = await fetch('/api/v1/biolinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': activeWorkspaceId || ''
        },
        body: JSON.stringify({ urlSlug: slug, title, description, logoUrl, themeSettings })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Biolink page created!');
        fetchPages();
      } else {
        setError(data.error || 'Failed to create page');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePage = async () => {
    if (!activePage) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const themeSettings = { bgGradient, textColor, btnStyle };
      const res = await fetch(`/api/v1/biolinks/${activePage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': activeWorkspaceId || ''
        },
        body: JSON.stringify({ title, description, logoUrl, themeSettings })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Page branding updated successfully!');
        fetchPages();
        // Refresh activePage state
        setActivePage({
          ...activePage,
          title,
          description,
          logoUrl,
          themeSettings
        });
      } else {
        setError(data.error || 'Failed to update page');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Biolink page?')) return;
    try {
      const res = await fetch(`/api/v1/biolinks/${id}`, {
        method: 'DELETE',
        headers: {
          'x-workspace-id': activeWorkspaceId || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setActivePage(null);
        fetchPages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePage) return;
    setLoading(true);

    try {
      const config = {
        title: blockTitle,
        url: blockUrl,
        embedId: blockEmbedId
      };
      const sortOrder = activePage.blocks.length + 1;

      const res = await fetch('/api/v1/biolinks/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': activeWorkspaceId || ''
        },
        body: JSON.stringify({
          biolinkPageId: activePage.id,
          type: newBlockType,
          config,
          sortOrder
        })
      });
      const data = await res.json();

      if (data.success) {
        setBlockTitle('');
        setBlockUrl('');
        setBlockEmbedId('');
        // Reload page blocks
        const pageRes = await fetch('/api/v1/biolinks', {
          headers: { 'x-workspace-id': activeWorkspaceId || '' }
        });
        const pageData = await pageRes.json();
        if (pageData.success) {
          const fresh = pageData.data.find((p: any) => p.id === activePage.id);
          if (fresh) setActivePage(fresh);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!activePage) return;
    try {
      const res = await fetch(`/api/v1/biolinks/blocks/${blockId}`, {
        method: 'DELETE',
        headers: {
          'x-workspace-id': activeWorkspaceId || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setActivePage({
          ...activePage,
          blocks: activePage.blocks.filter(b => b.id !== blockId)
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, slug: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(''), 2000);
  };

  const backendHost = 'https://flowsuite.amanasuite.com';

  return (
    <div className="p-6 space-y-6 text-slate-100 min-h-screen bg-slate-950">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Link2 className="w-6 h-6 text-emerald-500 animate-pulse" /> Bio Pages & Landing Builder
          </h1>
          <p className="text-xs text-slate-400">Build unlimited bio landing pages, add YouTube embeds, social redirects, and customize gradients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pages List & Page Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Page Form */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Create Biolink Landing Page
            </h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleCreatePage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Unique URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. agency-links"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Landing Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Digital Agency Team"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold p-3 rounded-xl text-xs transition"
              >
                Create Bio Page
              </button>
            </form>
          </div>

          {/* Active Page Editor (Only if page loaded) */}
          {activePage && (
            <div className="space-y-6">
              {/* Branding/Themes Config */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-xs flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-400" /> Customize Branding & Styling
                  </h3>
                  <span className="text-[10px] text-slate-500 bg-slate-950 px-3 py-1 rounded-full font-bold">
                    Views: {activePage.viewsCount}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Header Bio Text</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Welcome to our biolink page..."
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Avatar Logo URL</label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://.../avatar.jpg"
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Background Gradient</label>
                    <select
                      value={bgGradient}
                      onChange={(e) => setBgGradient(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                    >
                      <option value="from-indigo-900 to-slate-950">Indigo Space (Dark)</option>
                      <option value="from-pink-900 to-slate-950">Midnight Sunset (Dark)</option>
                      <option value="from-emerald-900 to-slate-950">Green Horizon (Dark)</option>
                      <option value="from-purple-600 via-pink-500 to-red-500">Retro Flame (Gradient)</option>
                      <option value="from-blue-100 to-indigo-200">Light Sky (Light)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleUpdatePage}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold p-3 rounded-xl text-xs transition border border-slate-700"
                >
                  Save Branding Changes
                </button>
              </div>

              {/* Blocks Manager */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-6">
                <h3 className="font-bold text-white text-xs flex items-center gap-2">
                  <Grid className="w-4 h-4 text-emerald-400" /> Biolink Block Elements
                </h3>

                {/* Add New Block Form */}
                <form onSubmit={handleAddBlock} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Block Type</label>
                    <select
                      value={newBlockType}
                      onChange={(e) => setNewBlockType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                    >
                      <option value="LINK">External Link Button</option>
                      <option value="HEADING">Section Heading Text</option>
                      <option value="YOUTUBE">YouTube Video Embed</option>
                      <option value="SPOTIFY">Spotify Player Embed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Title / Caption</label>
                    <input
                      type="text"
                      required
                      value={blockTitle}
                      onChange={(e) => setBlockTitle(e.target.value)}
                      placeholder="e.g. Visit Website / Music Player"
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                    />
                  </div>

                  {newBlockType === 'LINK' ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Destination URL</label>
                      <input
                        type="url"
                        required
                        value={blockUrl}
                        onChange={(e) => setBlockUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Embed ID (e.g. dQw4w9WgXcQ)</label>
                      <input
                        type="text"
                        required
                        value={blockEmbedId}
                        onChange={(e) => setBlockEmbedId(e.target.value)}
                        placeholder="Video or playlist code"
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="md:col-span-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold p-3 rounded-xl text-xs transition"
                  >
                    Add Block Element
                  </button>
                </form>

                {/* List of active blocks */}
                <div className="space-y-3">
                  {activePage.blocks.length === 0 ? (
                    <p className="text-center text-slate-500 text-xs py-4">No content blocks added to this Biolink page yet.</p>
                  ) : (
                    activePage.blocks.map((block) => (
                      <div key={block.id} className="flex justify-between items-center bg-slate-950/40 p-4 border border-slate-850 rounded-2xl text-xs">
                        <div className="flex items-center gap-3">
                          {block.type === 'LINK' && <Link2 className="w-4 h-4 text-blue-400" />}
                          {block.type === 'HEADING' && <AlignLeft className="w-4 h-4 text-purple-400" />}
                          {block.type === 'YOUTUBE' && <Youtube className="w-4 h-4 text-red-500" />}
                          {block.type === 'SPOTIFY' && <Music className="w-4 h-4 text-emerald-400" />}

                          <div>
                            <span className="font-extrabold text-slate-200">{block.config.title}</span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-sm">
                              {block.type === 'LINK' ? block.config.url : `Embed ID: ${block.config.embedId}`}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-2 bg-slate-800/60 hover:bg-red-500/20 text-red-400 rounded-xl transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Mobile Preview Emulator */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center">
            <h3 className="font-bold text-white text-xs self-start mb-4">Mobile Device Preview Emulator</h3>

            {/* Mobile Outer Chassis */}
            <div className="w-[280px] h-[520px] rounded-[36px] border-8 border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative flex flex-col">
              {/* Camera Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-20" />

              {/* Screen Mockup Area */}
              <div className={`flex-1 bg-gradient-to-b ${bgGradient} p-4 pt-10 flex flex-col items-center justify-start space-y-6 overflow-y-auto`}>
                {/* Logo / Avatar */}
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-white/20 overflow-hidden flex items-center justify-center">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                {/* Title & Description */}
                <div className="text-center space-y-1">
                  <h4 className="font-extrabold text-sm text-white">{title || 'FlowSuite Bio'}</h4>
                  <p className="text-[10px] text-white/70 max-w-[200px] leading-relaxed">{description || 'Biolink Page Bio Description'}</p>
                </div>

                {/* Render Custom Blocks */}
                <div className="w-full space-y-3">
                  {activePage?.blocks.map((block) => {
                    if (block.type === 'HEADING') {
                      return (
                        <h5 key={block.id} className="text-center font-bold text-xs text-white pt-2">
                          {block.config.title}
                        </h5>
                      );
                    }
                    if (block.type === 'LINK') {
                      return (
                        <a
                          key={block.id}
                          href={block.config.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-full block text-center font-semibold p-2.5 text-xs text-white transition ${btnStyle}`}
                        >
                          {block.config.title}
                        </a>
                      );
                    }
                    if (block.type === 'YOUTUBE') {
                      return (
                        <div key={block.id} className="w-full aspect-video bg-black/60 rounded-xl flex flex-col items-center justify-center border border-white/10 text-white gap-1 p-2">
                          <Youtube className="w-6 h-6 text-red-500" />
                          <span className="text-[9px] font-bold">YouTube Video Player</span>
                          <span className="text-[7px] text-slate-400 truncate max-w-[150px]">{block.config.title}</span>
                        </div>
                      );
                    }
                    if (block.type === 'SPOTIFY') {
                      return (
                        <div key={block.id} className="w-full h-12 bg-emerald-500/10 rounded-xl flex items-center justify-between border border-emerald-500/20 text-white px-4">
                          <Music className="w-4 h-4 text-emerald-400" />
                          <span className="text-[9px] font-bold truncate max-w-[120px]">{block.config.title}</span>
                          <PlayButton />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
            
            {activePage && (
              <div className="w-full pt-4 space-y-2">
                <button
                  onClick={() => copyToClipboard(`${backendHost}/b/${activePage.urlSlug}`, activePage.urlSlug)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold p-3 rounded-xl text-xs transition border border-slate-700"
                >
                  <Copy className="w-4 h-4" /> Copy Biolink URL
                </button>
                {copiedSlug === activePage.urlSlug && (
                  <p className="text-center text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-xl">Copied to Clipboard!</p>
                )}
              </div>
            )}
          </div>

          {/* Quick List switcher */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="font-bold text-white text-xs">Switch Landing Page</h3>
            </div>
            <div className="divide-y divide-slate-800">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePage(p);
                    loadPageStates(p);
                  }}
                  className={`w-full p-3 text-left flex justify-between items-center text-xs transition ${
                    activePage?.id === p.id ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span>/{p.urlSlug}</span>
                  <div className="flex gap-2">
                    <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-slate-400">Views: {p.viewsCount}</span>
                    <span onClick={(e) => { e.stopPropagation(); handleDeletePage(p.id); }} className="text-red-400 hover:text-red-300 font-bold px-1">Delete</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayButton() {
  return (
    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
      <svg className="w-2.5 h-2.5 fill-current text-slate-950" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}
