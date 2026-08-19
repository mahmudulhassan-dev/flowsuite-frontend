'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderOpen, Upload, Image as ImageIcon, FileVideo, FileText, Search, 
  Grid3X3, List, Trash2, Download, Plus, Sparkles, Folder, ArrowLeft, 
  X, Sliders, Check, Loader2 
} from 'lucide-react';
import { api } from '../../../lib/api';

interface MediaAsset {
  id: string;
  workspaceId: string;
  folderId: string | null;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'doc';
  fileSize: number;
  storageKey: string;
  createdAt: string;
}

interface FolderData {
  id: string;
  workspaceId: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

interface AssetsResponse {
  folders: FolderData[];
  assets: MediaAsset[];
  storage: {
    used: number;
    limit: number;
  };
}

export default function AssetsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'doc'>('all');
  
  // Navigation states
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);
  
  // Data states
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [storage, setStorage] = useState({ used: 0, limit: 5368709120 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Modal states
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);

  // Photo Editor Filter states
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blurVal, setBlurVal] = useState(0);
  const [saturate, setSaturate] = useState(100);
  const [editorSaving, setEditorSaving] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `/api/v1/assets?folderId=${currentFolderId}`;
      const data = await api.get<AssetsResponse>(url);
      setFolders(data.folders);
      setAssets(data.assets);
      setStorage(data.storage);
    } catch (err) {
      console.error('Failed to load assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentFolderId]);

  // Apply filters on canvas
  useEffect(() => {
    if (!editingAsset || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    // Use the absolute production API URL to prevent CORS errors on VPS
    img.src = `https://flowsuite.amanasuite.com${editingAsset.fileUrl}`;
    
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // Apply filters string
      ctx.filter = `
        brightness(${brightness}%) 
        contrast(${contrast}%) 
        grayscale(${grayscale}%) 
        sepia(${sepia}%) 
        blur(${blurVal}px) 
        saturate(${saturate}%)
      `.trim().replace(/\s+/g, ' ');
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [editingAsset, brightness, contrast, grayscale, sepia, blurVal, saturate]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await api.post('/api/v1/assets/folders', {
        name: newFolderName,
        parentId: currentFolderId,
      });
      setNewFolderName('');
      setShowFolderModal(false);
      loadData();
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem('fs_token');
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      if (currentFolderId && currentFolderId !== 'root') {
        formData.append('folderId', currentFolderId);
      }

      try {
        const response = await fetch('https://flowsuite.amanasuite.com/api/v1/assets/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          alert(result.error || 'Failed to upload file');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('An error occurred during upload.');
      }
    }
    
    setUploading(false);
    loadData();
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/api/v1/assets/${id}`);
      loadData();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleSaveEditedPhoto = async (saveAsNew: boolean) => {
    if (!editingAsset || !canvasRef.current) return;
    
    setEditorSaving(true);
    try {
      const base64Image = canvasRef.current.toDataURL('image/png');
      await api.post('/api/v1/assets/edit-photo', {
        id: editingAsset.id,
        base64Image,
        saveAsNew,
      });
      setEditingAsset(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save edited image');
    } finally {
      setEditorSaving(false);
    }
  };

  const navigateToFolder = (folder: FolderData) => {
    setFolderPath(prev => [...prev, { id: folder.id, name: folder.name }]);
    setCurrentFolderId(folder.id);
  };

  const navigateToPathIndex = (index: number) => {
    if (index === -1) {
      setFolderPath([]);
      setCurrentFolderId('root');
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      setCurrentFolderId(newPath[newPath.length - 1].id);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFilteredAssets = () => {
    return assets.filter(a => {
      const matchesSearch = a.fileName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || a.fileType === filter;
      return matchesSearch && matchesFilter;
    });
  };

  const getFilteredFolders = () => {
    return folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  };

  const typeIcons: Record<string, React.ReactNode> = {
    image: <ImageIcon className="w-8 h-8 text-blue-400" />,
    video: <FileVideo className="w-8 h-8 text-purple-400" />,
    doc: <FileText className="w-8 h-8 text-amber-400" />,
  };

  const typeColors: Record<string, string> = {
    image: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    video: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    doc: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };

  const filteredAssets = getFilteredAssets();
  const filteredFolders = getFilteredFolders();

  const totalFilesCount = assets.length + folders.length;
  const storagePercentage = Math.min(100, (storage.used / storage.limit) * 100);

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
            <p className="text-slate-400 text-xs mt-0.5">Cloud Media Library, Dynamic Folders & Quota Management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-sm transition"
          >
            <Plus className="w-4 h-4" /> New Folder
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            multiple 
            className="hidden" 
          />
        </div>
      </div>

      {/* Stats / Quota Limits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: totalFilesCount, sub: 'In current folder', color: 'text-white' },
          { label: 'Images', value: assets.filter(a => a.fileType === 'image').length, sub: 'PNG, JPG, SVG', color: 'text-blue-400' },
          { label: 'Videos', value: assets.filter(a => a.fileType === 'video').length, sub: 'MP4, MOV', color: 'text-purple-400' },
          { label: 'Storage Quota Limit', value: formatSize(storage.used), sub: `of ${formatSize(storage.limit)} limit`, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1 relative overflow-hidden">
            <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500">{s.sub}</p>
            {s.label === 'Storage Quota Limit' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-950">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Toolbar / Search & Filter */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto w-full md:w-auto">
          {(['all', 'image', 'video', 'doc'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
            >
              {f === 'all' ? 'All Files' : f === 'doc' ? 'Documents' : `${f}s`}
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

      {/* Breadcrumbs for Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 px-4 py-2.5 rounded-xl border border-slate-900 w-full overflow-x-auto">
        <button 
          onClick={() => navigateToPathIndex(-1)}
          className={`hover:text-white font-semibold transition ${currentFolderId === 'root' ? 'text-white' : ''}`}
        >
          📂 Root
        </button>
        {folderPath.map((item, index) => (
          <React.Fragment key={item.id}>
            <span>/</span>
            <button 
              onClick={() => navigateToPathIndex(index)}
              className={`hover:text-white font-semibold transition ${index === folderPath.length - 1 ? 'text-white' : ''}`}
            >
              {item.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* File/Folder Listing */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-xs">Loading items from cloud...</p>
        </div>
      ) : (filteredFolders.length === 0 && filteredAssets.length === 0) ? (
        <div className="border border-slate-800 bg-slate-900/10 rounded-2xl py-20 text-center text-slate-500">
          <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">This directory is empty</p>
          <p className="text-xs text-slate-600 mt-1">Upload files or create subfolders to start organizing</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Render Folders First */}
          {filteredFolders.map(folder => (
            <div 
              key={folder.id} 
              onClick={() => navigateToFolder(folder)}
              className="bg-slate-900/60 border border-slate-850 hover:border-indigo-500/50 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3 group relative"
            >
              <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/10">
                <Folder className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-xs font-bold text-white truncate">{folder.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Directory folder</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(folder.id);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Render Files */}
          {filteredAssets.map(asset => (
            <div 
              key={asset.id} 
              className="bg-slate-900/60 border border-slate-850 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all group relative"
            >
              <div 
                onClick={() => asset.fileType === 'image' && setEditingAsset(asset)}
                className="h-28 bg-slate-950 flex items-center justify-center cursor-pointer relative overflow-hidden group/preview"
              >
                {asset.fileType === 'image' ? (
                  <img 
                    src={`https://flowsuite.amanasuite.com${asset.fileUrl}`} 
                    alt={asset.fileName}
                    className="w-full h-full object-cover transition-transform group-hover/preview:scale-105"
                  />
                ) : (
                  typeIcons[asset.fileType]
                )}
                {asset.fileType === 'image' && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] bg-indigo-600 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                      <Sliders className="w-3 h-3" /> Edit Image
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3.5 space-y-2">
                <p className="text-xs font-bold text-white truncate" title={asset.fileName}>{asset.fileName}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${typeColors[asset.fileType]}`}>
                    {asset.fileName.substring(asset.fileName.lastIndexOf('.') + 1) || asset.fileType}
                  </span>
                  <span className="text-[10px] text-slate-500">{formatSize(asset.fileSize)}</span>
                </div>
                <div className="flex gap-1.5 pt-1">
                  <a 
                    href={`https://flowsuite.amanasuite.com${asset.fileUrl}`}
                    download={asset.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 border border-slate-800 transition"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                  <button 
                    onClick={() => handleDeleteItem(asset.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-850">
              <tr>
                <th className="p-3 text-left">Item Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {/* Folders */}
              {filteredFolders.map(folder => (
                <tr key={folder.id} className="hover:bg-slate-900/20 transition-colors">
                  <td 
                    onClick={() => navigateToFolder(folder)}
                    className="p-3 text-white font-bold flex items-center gap-2 cursor-pointer hover:text-indigo-400"
                  >
                    <Folder className="w-4 h-4 text-indigo-400" />
                    <span className="truncate max-w-xs">{folder.name}</span>
                  </td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded border text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-400 border-indigo-500/10">Folder</span></td>
                  <td className="p-3 text-slate-500">--</td>
                  <td className="p-3 text-slate-500">{new Date(folder.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleDeleteItem(folder.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Files */}
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-3 text-white font-semibold flex items-center gap-2">
                    {typeIcons[asset.fileType]}
                    <span className="truncate max-w-xs">{asset.fileName}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase ${typeColors[asset.fileType]}`}>
                      {asset.fileName.substring(asset.fileName.lastIndexOf('.') + 1) || asset.fileType}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{formatSize(asset.fileSize)}</td>
                  <td className="p-3 text-slate-400">{new Date(asset.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-1">
                    <a 
                      href={`https://flowsuite.amanasuite.com${asset.fileUrl}`}
                      download={asset.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-850 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1 border border-slate-800 transition"
                    >
                      <Download className="w-3 h-3" /> Download
                    </a>
                    {asset.fileType === 'image' && (
                      <button 
                        onClick={() => setEditingAsset(asset)}
                        className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/10"
                      >
                        <Sliders className="w-3 h-3" /> Edit
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteItem(asset.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NEW FOLDER DIALOG */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">📁 Create New Folder</h3>
              <button onClick={() => setShowFolderModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Folder Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Campaign Ads"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowFolderModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO EDITOR CANVAS MODAL */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-5 flex flex-col md:flex-row gap-6">
            
            {/* Left: Canvas Preview */}
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-4 min-h-[300px] border border-slate-850 relative">
              <button 
                onClick={() => setEditingAsset(null)} 
                className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 text-slate-400 hover:text-white p-2 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
              <canvas 
                ref={canvasRef} 
                className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Right: Sliders / Tweaks */}
            <div className="w-full md:w-80 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    🎨 Image Filter Studio
                  </h3>
                  <p className="text-slate-400 text-[10px] mt-0.5 truncate">{editingAsset.fileName}</p>
                </div>

                <div className="space-y-3.5 pt-2">
                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Brightness</span>
                      <span className="text-indigo-400">{brightness}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="200" value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Contrast</span>
                      <span className="text-indigo-400">{contrast}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="200" value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Saturation</span>
                      <span className="text-indigo-400">{saturate}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="200" value={saturate}
                      onChange={(e) => setSaturate(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Grayscale */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Grayscale</span>
                      <span className="text-indigo-400">{grayscale}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={grayscale}
                      onChange={(e) => setGrayscale(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Sepia */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Sepia</span>
                      <span className="text-indigo-400">{sepia}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={sepia}
                      onChange={(e) => setSepia(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Blur */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Blur</span>
                      <span className="text-indigo-400">{blurVal}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" value={blurVal}
                      onChange={(e) => setBlurVal(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => handleSaveEditedPhoto(false)}
                  disabled={editorSaving}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10"
                >
                  {editorSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Overwrite Original
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEditedPhoto(true)}
                  disabled={editorSaving}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  {editorSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Save As New Copy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Reset filters
                    setBrightness(100);
                    setContrast(100);
                    setGrayscale(0);
                    setSepia(0);
                    setBlurVal(0);
                    setSaturate(100);
                  }}
                  className="w-full bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-500 hover:text-slate-400 py-2 rounded-xl text-[10px]"
                >
                  Reset Filters
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
