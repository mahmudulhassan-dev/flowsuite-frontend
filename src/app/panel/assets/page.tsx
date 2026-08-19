'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderOpen, Upload, Image as ImageIcon, FileVideo, FileText, Search, 
  Grid3X3, List, Trash2, Download, Plus, Sparkles, Folder, ArrowLeft, 
  X, Sliders, Check, Loader2, Star, Share2, Edit3, Move, Video, 
  Play, Pause, Volume2, Eye, FileSpreadsheet, PlusCircle, AlertCircle, ShoppingBag
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
  starred: boolean;
  shareSlug: string | null;
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
  const [starredOnly, setStarredOnly] = useState(false);
  
  // Navigation states
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);
  
  // Data states
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [allAvailableFoldersList, setAllAvailableFoldersList] = useState<FolderData[]>([]);
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

  // Dropdown Actions & Operations
  const [activeAssetMenu, setActiveAssetMenu] = useState<string | null>(null);
  const [renamingItem, setRenamingItem] = useState<{ id: string; name: string; isFolder: boolean } | null>(null);
  const [movingItem, setMovingItem] = useState<{ id: string; name: string; isFolder: boolean } | null>(null);
  const [shareLinkAsset, setShareLinkAsset] = useState<MediaAsset | null>(null);

  // Custom Video Player states
  const [activeVideoAsset, setActiveVideoAsset] = useState<MediaAsset | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoVolume, setVideoVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Spreadsheet Sheet Editor states
  const [activeSpreadsheetAsset, setActiveSpreadsheetAsset] = useState<MediaAsset | null>(null);
  const [spreadsheetGrid, setSpreadsheetGrid] = useState<string[][]>([]);
  const [spreadsheetSaving, setSpreadsheetSaving] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `/api/v1/assets?folderId=${currentFolderId}&starredOnly=${starredOnly}`;
      const data = await api.get<AssetsResponse>(url);
      setFolders(data.folders);
      setAssets(data.assets);
      setStorage(data.storage);

      // Fetch all folders flat for the move directory dropdown
      const foldersUrl = `/api/v1/assets?folderId=root`;
      const allFoldersRes = await api.get<AssetsResponse>(foldersUrl);
      setAllAvailableFoldersList(allFoldersRes.folders || []);
    } catch (err) {
      console.error('Failed to load assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentFolderId, starredOnly]);

  // Handle video player setup
  useEffect(() => {
    if (activeVideoAsset && videoRef.current) {
      setIsPlaying(false);
      setPlaybackSpeed(1);
    }
  }, [activeVideoAsset]);

  // Load CSV content when Spreadsheet Editor opens
  useEffect(() => {
    if (!activeSpreadsheetAsset) return;
    
    const fetchSpreadsheetContent = async () => {
      try {
        const fileUrl = `https://flowsuite.amanasuite.com${activeSpreadsheetAsset.fileUrl}`;
        const response = await fetch(fileUrl);
        const text = await response.text();
        
        // Simple CSV parser
        const rows = text.split('\n').map(row => {
          let cells: string[] = [];
          let insideQuote = false;
          let currentCell = '';
          for (let char of row) {
            if (char === '"') {
              insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
              cells.push(currentCell.trim());
              currentCell = '';
            } else {
              currentCell += char;
            }
          }
          cells.push(currentCell.trim());
          return cells;
        });

        // Pad grid size (minimum 15 rows x 10 columns)
        while (rows.length < 15) {
          rows.push(Array(10).fill(''));
        }
        const paddedRows = rows.map(r => {
          const newRow = [...r];
          while (newRow.length < 10) newRow.push('');
          return newRow;
        });
        setSpreadsheetGrid(paddedRows);
      } catch (err) {
        console.error(err);
        // Fallback default grid
        setSpreadsheetGrid(Array(15).fill(null).map(() => Array(10).fill('')));
      }
    };

    fetchSpreadsheetContent();
  }, [activeSpreadsheetAsset]);

  // Apply filters on canvas
  useEffect(() => {
    if (!editingAsset || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = `https://flowsuite.amanasuite.com${editingAsset.fileUrl}`;
    
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
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

  const handleToggleStar = async (id: string) => {
    try {
      await api.post(`/api/v1/assets/${id}/toggle-star`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareFile = async (asset: MediaAsset) => {
    try {
      const res = await api.post<{ slug: string }>(`/api/v1/assets/${asset.id}/share`);
      setShareLinkAsset({ ...asset, shareSlug: res.slug });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (id: string, name: string) => {
    try {
      await api.post(`/api/v1/assets/${id}/rename`, { name });
      setRenamingItem(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveItem = async (id: string, folderId: string) => {
    try {
      await api.post(`/api/v1/assets/${id}/move`, { folderId });
      setMovingItem(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSpreadsheet = async () => {
    if (!activeSpreadsheetAsset) return;
    setSpreadsheetSaving(true);
    try {
      // Remove trailing completely empty rows before saving
      const cleaned = spreadsheetGrid.filter(row => row.some(cell => cell && cell.trim()));
      await api.post('/api/v1/assets/edit-spreadsheet', {
        id: activeSpreadsheetAsset.id,
        csvData: cleaned.length > 0 ? cleaned : [['']]
      });
      setActiveSpreadsheetAsset(null);
      loadData();
    } catch (err) {
      alert('Failed to save spreadsheet changes.');
    } finally {
      setSpreadsheetSaving(false);
    }
  };

  // Custom Video Player Controls
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVideoVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
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
    if (starredOnly) return []; // Folders are not starred
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
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-[32px] border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Premium Drive & Workspace SaaS
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-mono">Dropbox Core</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Edit Sheets Inline, Star Files, Share Public Links, Play Videos and Monetize Limits</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
          >
            <Plus className="w-4 h-4" /> New Folder
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
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

      {/* Out of space warning / Storage Upsell banner */}
      {storagePercentage > 85 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-rose-950/40 border border-rose-900/60 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Warning: Your Cloud storage limit has reached {storagePercentage.toFixed(1)}%!</span>
          </div>
          <a 
            href="/panel/billing"
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-[10px] flex items-center gap-1 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Buy Storage Addon
          </a>
        </div>
      )}

      {/* Storage & Drive Quota stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: totalFilesCount, sub: 'Assets in current folder', color: 'text-white' },
          { label: 'Starred Items', value: assets.filter(a => a.starred).length, sub: 'Favorites bookmarks', color: 'text-amber-400' },
          { label: 'Cloud Storage Used', value: formatSize(storage.used), sub: `${storagePercentage.toFixed(1)}% of maximum drive`, color: 'text-blue-400' },
          { label: 'Drive Limit Plan', value: formatSize(storage.limit), sub: 'Upgrade anytime from Billing', color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1 relative overflow-hidden">
            <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500">{s.sub}</p>
            {(s.label === 'Cloud Storage Used' || s.label === 'Drive Limit Plan') && (
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
            placeholder="Search files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => { setStarredOnly(false); setFilter('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${!starredOnly && filter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
          >
            All Drive
          </button>
          <button
            onClick={() => { setStarredOnly(true); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition border ${starredOnly ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
          >
            <Star className="w-3.5 h-3.5" /> Starred
          </button>
          {(['image', 'video', 'doc'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setStarredOnly(false); setFilter(f); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition border ${!starredOnly && filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
            >
              {f === 'doc' ? 'Documents' : `${f}s`}
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

      {/* Navigation Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/45 px-4 py-2.5 rounded-xl border border-slate-900 w-full overflow-x-auto">
        <button 
          onClick={() => navigateToPathIndex(-1)}
          className={`hover:text-white font-semibold transition ${currentFolderId === 'root' ? 'text-white' : ''}`}
        >
          📂 Root Drive
        </button>
        {folderPath.map((item, index) => (
          <React.Fragment key={item.id}>
            <span className="text-slate-600">/</span>
            <button 
              onClick={() => navigateToPathIndex(index)}
              className={`hover:text-white font-semibold transition ${index === folderPath.length - 1 ? 'text-white' : ''}`}
            >
              {item.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Grid Explorer Sizing Layout */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-xs">Connecting to cloud storage...</p>
        </div>
      ) : (filteredFolders.length === 0 && filteredAssets.length === 0) ? (
        <div className="border border-slate-800 bg-slate-900/10 rounded-3xl py-20 text-center text-slate-500">
          <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">This directory is empty</p>
          <p className="text-xs text-slate-600 mt-1">Upload files or create subfolders to start organizing</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Folders */}
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
              
              {/* Folder Actions Menu */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAssetMenu(activeAssetMenu === folder.id ? null : folder.id);
                  }}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-300 p-1.5 rounded-lg border border-slate-700"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>

                {activeAssetMenu === folder.id && (
                  <div className="absolute right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl py-1.5 w-32 shadow-xl z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenamingItem({ id: folder.id, name: folder.name, isFolder: true });
                        setActiveAssetMenu(null);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[11px] text-slate-300 hover:bg-slate-900 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3 h-3" /> Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMovingItem({ id: folder.id, name: folder.name, isFolder: true });
                        setActiveAssetMenu(null);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[11px] text-slate-300 hover:bg-slate-900 flex items-center gap-1.5"
                    >
                      <Move className="w-3 h-3" /> Move folder
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(folder.id);
                        setActiveAssetMenu(null);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[11px] text-red-400 hover:bg-slate-900 flex items-center gap-1.5 font-bold"
                    >
                      <Trash2 className="w-3 h-3" /> Delete folder
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Files */}
          {filteredAssets.map(asset => {
            const fileExt = asset.fileName.substring(asset.fileName.lastIndexOf('.') + 1).toLowerCase();
            const isSpreadsheet = ['csv', 'xlsx', 'xls'].includes(fileExt);

            return (
              <div 
                key={asset.id} 
                className="bg-slate-900/60 border border-slate-850 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all group relative"
              >
                
                {/* Star overlay */}
                <button
                  onClick={() => handleToggleStar(asset.id)}
                  className={`absolute left-3 top-3 p-1.5 rounded-lg border backdrop-blur-sm z-10 transition ${
                    asset.starred 
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" fill={asset.starred ? 'currentColor' : 'none'} />
                </button>

                {/* Preview Click Triggers */}
                <div 
                  onClick={() => {
                    if (asset.fileType === 'image') {
                      setEditingAsset(asset);
                    } else if (asset.fileType === 'video') {
                      setActiveVideoAsset(asset);
                    } else if (isSpreadsheet) {
                      setActiveSpreadsheetAsset(asset);
                    }
                  }}
                  className="h-28 bg-slate-950 flex items-center justify-center cursor-pointer relative overflow-hidden group/preview"
                >
                  {asset.fileType === 'image' ? (
                    <img 
                      src={`https://flowsuite.amanasuite.com${asset.fileUrl}`} 
                      alt={asset.fileName}
                      className="w-full h-full object-cover transition-transform group-hover/preview:scale-105"
                    />
                  ) : isSpreadsheet ? (
                    <FileSpreadsheet className="w-9 h-9 text-emerald-400" />
                  ) : (
                    typeIcons[asset.fileType]
                  )}
                  
                  {/* Action hover overlay info */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] bg-indigo-650 text-white font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                      {asset.fileType === 'image' ? (
                        <><Sliders className="w-3.5 h-3.5" /> Edit Photo</>
                      ) : isSpreadsheet ? (
                        <><FileSpreadsheet className="w-3.5 h-3.5" /> Edit Sheet</>
                      ) : asset.fileType === 'video' ? (
                        <><Play className="w-3.5 h-3.5" /> Play Video</>
                      ) : (
                        <><Eye className="w-3.5 h-3.5" /> View File</>
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2">
                  <p className="text-xs font-bold text-white truncate" title={asset.fileName}>{asset.fileName}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${typeColors[asset.fileType]}`}>
                      {fileExt || asset.fileType}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatSize(asset.fileSize)}</span>
                  </div>

                  <div className="flex gap-1.5 pt-1 relative">
                    <a 
                      href={`https://flowsuite.amanasuite.com${asset.fileUrl}`}
                      download={asset.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 border border-slate-800 transition"
                    >
                      <Download className="w-3 h-3" /> Get
                    </a>
                    
                    {/* Public Share Trigger */}
                    <button
                      onClick={() => handleShareFile(asset)}
                      className="bg-slate-800 hover:bg-slate-750 text-indigo-400 p-1.5 rounded-lg border border-slate-800 transition"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Options Toggle Menu */}
                    <button
                      onClick={() => setActiveAssetMenu(activeAssetMenu === asset.id ? null : asset.id)}
                      className="bg-slate-850 hover:bg-slate-800 text-slate-400 p-1.5 rounded-lg border border-slate-800"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>

                    {activeAssetMenu === asset.id && (
                      <div className="absolute right-0 bottom-full mb-1 bg-slate-950 border border-slate-800 rounded-xl py-1.5 w-32 shadow-xl z-20">
                        <button
                          onClick={() => {
                            setRenamingItem({ id: asset.id, name: asset.fileName, isFolder: false });
                            setActiveAssetMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-slate-300 hover:bg-slate-900 flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3 h-3" /> Rename
                        </button>
                        <button
                          onClick={() => {
                            setMovingItem({ id: asset.id, name: asset.fileName, isFolder: false });
                            setActiveAssetMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-slate-300 hover:bg-slate-900 flex items-center gap-1.5"
                        >
                          <Move className="w-3 h-3" /> Move asset
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteItem(asset.id);
                            setActiveAssetMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-[11px] text-red-400 hover:bg-slate-900 flex items-center gap-1.5 font-bold"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Sizing layout with columns */
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-850">
              <tr>
                <th className="p-3 text-left">Item Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Starred</th>
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
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded border text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-400 border-indigo-500/10">Folder</span>
                  </td>
                  <td className="p-3 text-slate-500">--</td>
                  <td className="p-3">--</td>
                  <td className="p-3 flex gap-1">
                    <button
                      onClick={() => setRenamingItem({ id: folder.id, name: folder.name, isFolder: true })}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg text-[10px] font-bold"
                    >
                      Rename
                    </button>
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
              {filteredAssets.map(asset => {
                const fileExt = asset.fileName.substring(asset.fileName.lastIndexOf('.') + 1).toLowerCase();
                const isSpreadsheet = ['csv', 'xlsx', 'xls'].includes(fileExt);

                return (
                  <tr key={asset.id} className="hover:bg-slate-900/20 transition-colors">
                    <td 
                      onClick={() => {
                        if (asset.fileType === 'image') {
                          setEditingAsset(asset);
                        } else if (asset.fileType === 'video') {
                          setActiveVideoAsset(asset);
                        } else if (isSpreadsheet) {
                          setActiveSpreadsheetAsset(asset);
                        }
                      }}
                      className="p-3 text-white font-semibold flex items-center gap-2 cursor-pointer hover:text-indigo-400"
                    >
                      {isSpreadsheet ? <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> : typeIcons[asset.fileType]}
                      <span className="truncate max-w-xs">{asset.fileName}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase ${typeColors[asset.fileType]}`}>
                        {fileExt || asset.fileType}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{formatSize(asset.fileSize)}</td>
                    <td className="p-3">
                      <button onClick={() => handleToggleStar(asset.id)} className="text-amber-400">
                        <Star className="w-4 h-4" fill={asset.starred ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="p-3 flex gap-1.5">
                      <a 
                        href={`https://flowsuite.amanasuite.com${asset.fileUrl}`}
                        download={asset.fileName}
                        target="_blank"
                        className="bg-slate-850 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-1 border border-slate-800"
                      >
                        <Download className="w-3 h-3" /> Download
                      </a>
                      <button
                        onClick={() => handleShareFile(asset)}
                        className="bg-slate-850 hover:bg-slate-800 text-indigo-400 px-2.5 py-1.5 rounded-lg border border-slate-800"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRenamingItem({ id: asset.id, name: asset.fileName, isFolder: false })}
                        className="bg-slate-850 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px]"
                      >
                        Rename
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(asset.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                  placeholder="e.g. Ads Assets"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowFolderModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-550 text-white font-semibold px-4 py-2.5 rounded-xl text-xs">Create Folder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {renamingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Rename {renamingItem.isFolder ? 'Folder' : 'File'}</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={renamingItem.name}
                onChange={(e) => setRenamingItem({ ...renamingItem, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setRenamingItem(null)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-4 py-2 rounded-xl text-xs">Cancel</button>
                <button onClick={() => handleRename(renamingItem.id, renamingItem.name)} className="bg-indigo-600 hover:bg-indigo-550 text-white px-4 py-2 rounded-xl text-xs font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOVE DIRECTORY MODAL */}
      {movingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Move "{movingItem.name}" to directory</h3>
            <div className="space-y-3">
              <select
                onChange={(e) => handleMoveItem(movingItem.id, e.target.value)}
                defaultValue=""
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              >
                <option value="" disabled>Select Target Folder...</option>
                <option value="root">📂 Root Drive Directory</option>
                {allAvailableFoldersList.filter(f => f.id !== movingItem.id).map(f => (
                  <option key={f.id} value={f.id}>📁 {f.name}</option>
                ))}
              </select>
              <div className="flex justify-end pt-1">
                <button onClick={() => setMovingItem(null)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-4 py-2 rounded-xl text-xs">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHAREABLE DOWNLOAD LINK MODAL */}
      {shareLinkAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5"><Share2 className="w-4 h-4" /> Share Public Download Link</h3>
              <button onClick={() => setShareLinkAsset(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-400">Anyone with this link can view and download the asset from anywhere without logging in.</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center gap-2 select-all font-mono text-[10px] text-white">
              <span>https://flowsuite.amanasuite.com/api/v1/public/share/{shareLinkAsset.shareSlug}</span>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setShareLinkAsset(null)} className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM PREMIUM VIDEO PLAYBACK PLAYER */}
      {activeVideoAsset && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-850 rounded-[32px] p-5 w-full max-w-3xl overflow-hidden space-y-4">
            
            {/* Header */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-white truncate max-w-md flex items-center gap-1.5">
                <Video className="w-4 h-4 text-purple-400" /> Playback: {activeVideoAsset.fileName}
              </span>
              <button 
                onClick={() => {
                  if (videoRef.current) videoRef.current.pause();
                  setActiveVideoAsset(null);
                }} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Canvas Element */}
            <div className="bg-black aspect-video rounded-2xl overflow-hidden border border-slate-900 relative flex items-center justify-center">
              <video
                ref={videoRef}
                src={`https://flowsuite.amanasuite.com${activeVideoAsset.fileUrl}`}
                className="w-full h-full"
                controls={false}
              />
            </div>

            {/* Premium Video Playback Controllers */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-850">
              <div className="flex items-center gap-3">
                <button 
                  onClick={togglePlayPause}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <input
                    type="range" min="0" max="1" step="0.1" value={videoVolume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-indigo-500 h-1 rounded-lg bg-slate-950"
                  />
                </div>
              </div>

              {/* Speeds */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-bold mr-1.5">SPEED:</span>
                {[0.5, 1, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${
                      playbackSpeed === speed ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INLINE SPREADSHEET EDITOR MODAL */}
      {activeSpreadsheetAsset && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col space-y-4">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-850 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    Spreadsheet Editor Workspace
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">Google Sheets</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate max-w-md">{activeSpreadsheetAsset.fileName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Add Row helper
                    setSpreadsheetGrid(prev => [...prev, Array(prev[0]?.length || 10).fill('')]);
                  }}
                  className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> Add Row
                </button>
                <button
                  onClick={() => {
                    // Add Column helper
                    setSpreadsheetGrid(prev => prev.map(row => [...row, '']));
                  }}
                  className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> Add Column
                </button>
                <button 
                  onClick={() => setActiveSpreadsheetAsset(null)} 
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* spreadsheet editable table container */}
            <div className="flex-1 overflow-auto bg-slate-950 border border-slate-850 rounded-2xl max-h-[60vh] relative">
              <table className="w-full border-collapse text-xs select-none">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 sticky top-0 z-10">
                    <th className="p-2 border-r border-slate-800 bg-slate-950 text-center font-bold text-[10px] w-10">#</th>
                    {spreadsheetGrid[0]?.map((_, colIdx) => (
                      <th key={colIdx} className="p-2 border-r border-slate-800 text-center font-extrabold uppercase text-[10px] min-w-[120px]">
                        Column {String.fromCharCode(65 + (colIdx % 26))}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {spreadsheetGrid.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-900/10">
                      <td className="p-2 border-r border-slate-800 bg-slate-950/80 text-slate-500 font-bold text-center">{rowIdx + 1}</td>
                      {row.map((cell, colIdx) => (
                        <td key={colIdx} className="p-1 border-r border-slate-800">
                          <input
                            type="text"
                            value={cell || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSpreadsheetGrid(prev => {
                                const copy = prev.map(r => [...r]);
                                copy[rowIdx][colIdx] = val;
                                return copy;
                              });
                            }}
                            className="w-full bg-transparent border-0 px-2 py-1 text-white text-xs focus:outline-none focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 rounded"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-850 pt-3 flex-shrink-0">
              <button 
                onClick={() => setActiveSpreadsheetAsset(null)}
                className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Discard
              </button>
              <button 
                onClick={handleSaveSpreadsheet}
                disabled={spreadsheetSaving}
                className="bg-emerald-650 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-650/20"
              >
                {spreadsheetSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Save spreadsheet data to disk
              </button>
            </div>
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
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Brightness</span>
                      <span className="text-indigo-400">{brightness}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="200" value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Contrast</span>
                      <span className="text-indigo-400">{contrast}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="200" value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Saturation</span>
                      <span className="text-indigo-400">{saturate}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="200" value={saturate}
                      onChange={(e) => setSaturate(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Grayscale</span>
                      <span className="text-indigo-400">{grayscale}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={grayscale}
                      onChange={(e) => setGrayscale(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Sepia</span>
                      <span className="text-indigo-400">{sepia}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={sepia}
                      onChange={(e) => setSepia(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Blur</span>
                      <span className="text-indigo-400">{blurVal}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" value={blurVal}
                      onChange={(e) => setBlurVal(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-950 h-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => handleSaveEditedPhoto(false)}
                  disabled={editorSaving}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  {editorSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Overwrite Original
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEditedPhoto(true)}
                  disabled={editorSaving}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  {editorSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Save As New Copy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                    setGrayscale(0);
                    setSepia(0);
                    setBlurVal(0);
                    setSaturate(100);
                  }}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-500 py-2 rounded-xl text-[10px]"
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
