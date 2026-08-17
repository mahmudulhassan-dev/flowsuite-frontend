'use client';

import React, { useState } from 'react';
import { FolderOpen, Upload, Image, FileVideo, FileText, Search, Grid3X3, List, Trash2, Download, Plus, Sparkles } from 'lucide-react';

const sampleAssets = [
  { id: 1, name: 'brand_logo_white.svg', type: 'image', size: '42 KB', date: 'Aug 17', preview: 'SVG' },
  { id: 2, name: 'eid_sale_banner.png', type: 'image', size: '1.2 MB', date: 'Aug 16', preview: 'PNG' },
  { id: 3, name: 'product_demo_reel.mp4', type: 'video', size: '48.3 MB', date: 'Aug 15', preview: 'MP4' },
  { id: 4, name: 'pricing_guide_2026.pdf', type: 'doc', size: '890 KB', date: 'Aug 14', preview: 'PDF' },
  { id: 5, name: 'ai_model_shoot_01.jpg', type: 'image', size: '3.1 MB', date: 'Aug 14', preview: 'JPG' },
  { id: 6, name: 'caption_template_pack.docx', type: 'doc', size: '210 KB', date: 'Aug 13', preview: 'DOC' },
  { id: 7, name: 'testimonial_video_karim.mp4', type: 'video', size: '22.7 MB', date: 'Aug 12', preview: 'MP4' },
  { id: 8, name: 'facebook_ad_creative_v2.png', type: 'image', size: '850 KB', date: 'Aug 11', preview: 'PNG' },
];

const typeColors: Record<string, string> = {
  image: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  video: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  doc: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const typeIcons: Record<string, React.ReactNode> = {
  image: <Image className="w-8 h-8 text-blue-400" />,
  video: <FileVideo className="w-8 h-8 text-purple-400" />,
  doc: <FileText className="w-8 h-8 text-amber-400" />,
};

export default function AssetsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'doc'>('all');

  const filtered = sampleAssets.filter(a =>
    (filter === 'all' || a.type === filter) &&
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Digital Asset Manager
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Cloud Media Library, Brand Assets & AI-Generated Graphics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 text-indigo-300 font-semibold px-4 py-2 rounded-xl text-sm transition">
            <Sparkles className="w-4 h-4" /> Generate AI Image
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20">
            <Upload className="w-4 h-4" /> Upload Files
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: '847', sub: '3.4 GB used', color: 'text-white' },
          { label: 'Images', value: '512', sub: '1.8 GB', color: 'text-blue-400' },
          { label: 'Videos', value: '89', sub: '1.4 GB', color: 'text-purple-400' },
          { label: 'Documents', value: '246', sub: '210 MB', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-1">
          {(['all', 'image', 'video', 'doc'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
            >
              {f === 'all' ? 'All Files' : f === 'doc' ? 'Documents' : `${f.charAt(0).toUpperCase() + f.slice(1)}s`}
            </button>
          ))}
        </div>

        <div className="flex gap-1 ml-auto">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg border ${view === 'grid' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg border ${view === 'list' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-900/30 hover:bg-indigo-500/5 rounded-2xl p-8 text-center transition-all cursor-pointer">
        <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-300">Drag & Drop files here to upload</p>
        <p className="text-xs text-slate-500 mt-1">Supports: JPG, PNG, MP4, PDF, SVG — Max 100 MB per file</p>
      </div>

      {/* Asset Grid/List */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map(asset => (
            <div key={asset.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all group cursor-pointer">
              <div className="h-28 bg-slate-950 flex items-center justify-center">
                {typeIcons[asset.type]}
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold text-white truncate">{asset.name}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${typeColors[asset.type]}`}>{asset.preview}</span>
                  <span className="text-[10px] text-slate-500">{asset.size}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] py-1 rounded-lg flex items-center justify-center gap-1">
                    <Download className="w-3 h-3" /> Download
                  </button>
                  <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1 rounded-lg">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-800/50 text-slate-400 uppercase">
              <tr>
                <th className="p-3 text-left rounded-l-lg">File Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(asset => (
                <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-white font-semibold flex items-center gap-2">
                    {typeIcons[asset.type]}
                    <span className="truncate max-w-xs">{asset.name}</span>
                  </td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${typeColors[asset.type]}`}>{asset.preview}</span></td>
                  <td className="p-3 text-slate-400">{asset.size}</td>
                  <td className="p-3 text-slate-400">{asset.date}</td>
                  <td className="p-3 flex gap-1">
                    <button className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300 flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
