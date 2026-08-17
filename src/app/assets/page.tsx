'use client';

import React from 'react';
import { FolderOpen, Cloud, HardDrive, Crop, Image as ImageIcon, Search, Plus } from 'lucide-react';

export default function AssetManagerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" /> Central Media Asset Manager
          </h2>
          <p className="text-xs text-slate-400">
            Import assets from Google Drive, Dropbox, OneDrive, Adobe Express, or stock APIs (Unsplash, Pexels).
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> Upload Media
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Summer Campaign Banner.png', size: '2.4 MB', tag: 'Instagram/FB' },
          { name: 'Fashion Reel Video.mp4', size: '14.8 MB', tag: 'Reels/Shorts' },
          { name: 'Brand Logo Watermark.png', size: '512 KB', tag: 'Watermark' },
          { name: 'Product Shoot Scene #1.jpg', size: '3.1 MB', tag: 'PhotoShoot AI' },
        ].map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="h-28 rounded-lg bg-slate-800/80 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-slate-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
              <p className="text-[10px] text-slate-400">{item.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
