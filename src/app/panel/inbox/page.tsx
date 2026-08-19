'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Check, Copy, Mic, Phone, Plus, RefreshCw, Search,
  Filter, X, ChevronDown, Inbox, Code, Bot, Users, Plug, Link2, ExternalLink,
  AlertCircle, CheckCircle2, Wifi, WifiOff, Settings2, ChevronRight, Tags,
  Award, FileText, CheckSquare, Settings, Sliders, Play, Trash2, Heart, HelpCircle,
  TrendingUp, Volume2, Shield, Calendar, Share2
} from 'lucide-react';
import { api } from '../../../lib/api';
import { io, Socket } from 'socket.io-client';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  senderType: 'CUSTOMER' | 'AGENT' | 'AI_BOT' | 'SYSTEM';
  senderId?: string;
  messageType: string;
  body: string | null;
  mediaUrl?: string | null;
  createdAt: string;
}

interface Thread {
  id: string;
  platform: Platform;
  externalSenderId: string;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  assignedStaffId: string | null;
  status: 'OPEN' | 'PENDING' | 'RESOLVED' | 'BOT_HANDLED';
  lastMessageAt: string;
  socialAccountId: string | null;
  messages?: Message[];
}

type Platform =
  | 'WHATSAPP'
  | 'WHATSAPP_BAILEYS'
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'TIKTOK'
  | 'THREADS'
  | 'TELEGRAM'
  | 'X'
  | 'GMAIL'
  | 'SMS'
  | 'WEB_CHAT';

interface WhatsAppAccount {
  id: string;
  sessionId: string;
  accountName: string;
  phone: string;
  isActive: boolean;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'QR';
  qr?: string | null;
  sessionData?: {
    autoReplyActive?: boolean;
    aiReplyActive?: boolean;
    awayMessage?: string;
  } | null;
}

const PLATFORMS = [
  { key: 'all',             label: 'All Channels',  emoji: '📬', color: 'text-slate-300',  bg: 'bg-slate-700',    border: 'border-slate-600', badge: 'bg-slate-700 text-slate-200' },
  { key: 'WHATSAPP',        label: 'WhatsApp',       emoji: '💬', color: 'text-emerald-400', bg: 'bg-emerald-900/40', border: 'border-emerald-700/60', badge: 'bg-emerald-600 text-white' },
  { key: 'FACEBOOK',        label: 'Messenger',      emoji: '💙', color: 'text-blue-400',    bg: 'bg-blue-900/40',   border: 'border-blue-700/60',    badge: 'bg-blue-600 text-white' },
  { key: 'INSTAGRAM',       label: 'Instagram',      emoji: '📸', color: 'text-pink-400',    bg: 'bg-pink-900/40',   border: 'border-pink-700/60',    badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' },
  { key: 'TIKTOK',          label: 'TikTok',         emoji: '🎵', color: 'text-red-400',     bg: 'bg-red-900/40',    border: 'border-red-700/60',     badge: 'bg-black text-white' },
  { key: 'THREADS',         label: 'Threads',        emoji: '🧵', color: 'text-slate-300',   bg: 'bg-slate-800/40',  border: 'border-slate-700/60',   badge: 'bg-slate-900 text-white' },
  { key: 'TELEGRAM',        label: 'Telegram',       emoji: '✈️', color: 'text-sky-400',     bg: 'bg-sky-900/40',    border: 'border-sky-700/60',     badge: 'bg-sky-500 text-white' },
];

const getPlatformConfig = (p: Platform | string) =>
  PLATFORMS.find(x => x.key === p) ?? PLATFORMS[0];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'channels' | 'widget' | 'whatsapp_suite'>('inbox');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [copied, setCopied] = useState(false);

  // WhatsApp Multi-accounts list state
  const [waAccounts, setWaAccounts] = useState<WhatsAppAccount[]>([]);
  const [loadingWA, setLoadingWA] = useState(false);
  const [selectedWA, setSelectedWA] = useState<WhatsAppAccount | null>(null); // For automation settings editor

  // CRM Sidebar local state
  const [crmStage, setCrmStage] = useState<'NEW_LEAD' | 'PROSPECT' | 'QUALIFIED' | 'CUSTOMER' | 'CHURNED'>('NEW_LEAD');
  const [crmTags, setCrmTags] = useState<string[]>(['Lead', 'WhatsApp User']);
  const [newTagInput, setNewTagInput] = useState('');
  const [crmNote, setCrmNote] = useState('');
  const [notesHistory, setNotesHistory] = useState<{ id: string; text: string; date: string }[]>([
    { id: '1', text: 'Spoke about booking premium license pack next week.', date: '2026-08-19' }
  ]);

  // Dynamic automation state
  const [autoReplyActive, setAutoReplyActive] = useState(false);
  const [aiReplyActive, setAiReplyActive] = useState(false);
  const [awayMessage, setAwayMessage] = useState("Hello! We are currently offline. Our AI agent will help you shortly.");

  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const loadWAAccounts = async () => {
    try {
      setLoadingWA(true);
      const res = await api.get<WhatsAppAccount[]>('/api/v1/whatsapp/status');
      setWaAccounts(res || []);
      if (res && res.length > 0 && !selectedWA) {
        setSelectedWA(res[0]);
        setAutoReplyActive(!!res[0].sessionData?.autoReplyActive);
        setAiReplyActive(!!res[0].sessionData?.aiReplyActive);
        setAwayMessage(res[0].sessionData?.awayMessage || "Hello! We are currently offline. Our AI agent will help you shortly.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWA(false);
    }
  };

  const handleConnectWA = async () => {
    try {
      setLoadingWA(true);
      const res = await api.post<{ sessionId: string }>('/api/v1/whatsapp/connect', {});
      await loadWAAccounts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWA(false);
    }
  };

  const handleDisconnectWA = async (sessionId: string) => {
    if (!confirm('Are you sure you want to disconnect this WhatsApp session?')) return;
    try {
      await api.post('/api/v1/whatsapp/disconnect', { sessionId });
      loadWAAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveWASettings = async () => {
    if (!selectedWA) return;
    try {
      await api.post('/api/v1/whatsapp/settings', {
        sessionId: selectedWA.sessionId,
        autoReplyActive,
        aiReplyActive,
        awayMessage
      });
      alert('WhatsApp Auto-Responder settings saved successfully!');
      loadWAAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Load Threads ───────────────────────────────────────────────────────────
  const loadThreads = async () => {
    try {
      setLoading(true);
      let path = '/api/v1/inbox/threads';
      const params: string[] = [];
      if (filterPlatform !== 'all') params.push(`channel=${filterPlatform}`);
      if (filterStatus !== 'all') params.push(`status=${filterStatus}`);
      if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
      if (params.length > 0) path += `?${params.join('&')}`;
      const data = await api.get<Thread[]>(path);
      setThreads(data || []);
      if (data && data.length > 0 && !selectedThread) setSelectedThread(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWAAccounts();
  }, []);

  useEffect(() => {
    loadThreads();
  }, [filterPlatform, filterStatus, searchQuery]);

  // ── Fetch messages ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedThread) return;
    async function loadMessages() {
      try {
        setLoadingMessages(true);
        const data = await api.get<Thread>(`/api/v1/inbox/threads/${selectedThread?.id}`);
        setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    }
    loadMessages();
  }, [selectedThread?.id]);

  // ── Socket.io ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('fs_token');
    if (!token) return;
    const socket = io('https://flowsuite.amanasuite.com', {
      auth: { token },
      path: '/socket.io',
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('whatsapp:status', (data: { sessionId: string; status: any }) => {
      setWaAccounts(prev => prev.map(acc => 
        acc.sessionId === data.sessionId ? { ...acc, status: data.status, qr: data.status !== 'QR' ? null : acc.qr } : acc
      ));
    });

    socket.on('whatsapp:qr', (data: { sessionId: string; qr: string }) => {
      setWaAccounts(prev => prev.map(acc => 
        acc.sessionId === data.sessionId ? { ...acc, status: 'QR', qr: data.qr } : acc
      ));
    });

    socket.on('inbox:message', (eventData: { threadId: string; message: Message }) => {
      if (selectedThread && eventData.threadId === selectedThread.id) {
        setMessages(prev => {
          if (prev.some(m => m.id === eventData.message.id)) return prev;
          return [...prev, eventData.message];
        });
      }
      setThreads(prev => prev.map(t =>
        t.id === eventData.threadId
          ? { ...t, lastMessageAt: eventData.message.createdAt, messages: [eventData.message] }
          : t
      ));
    });

    return () => { socket.disconnect(); };
  }, [selectedThread?.id]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;
    const currentText = replyText;
    setReplyText('');
    try {
      const sentMsg = await api.post<Message>(`/api/v1/inbox/threads/${selectedThread.id}/messages`, {
        content: currentText,
        type: 'TEXT',
      });
      setMessages(prev => [...prev, sentMsg]);
    } catch (err) {
      console.error(err);
      setReplyText(currentText);
    }
  };

  const handleAddCrmTag = () => {
    if (!newTagInput.trim() || crmTags.includes(newTagInput)) return;
    setCrmTags(prev => [...prev, newTagInput]);
    setNewTagInput('');
  };

  const handleAddNote = () => {
    if (!crmNote.trim()) return;
    setNotesHistory(prev => [
      { id: Date.now().toString(), text: crmNote, date: new Date().toISOString().split('T')[0] },
      ...prev
    ]);
    setCrmNote('');
  };

  // Emed Script block
  const embedScript = `<script 
  src="https://suite.amanasuite.com/widget.js" 
  data-workspace-id="YOUR_WORKSPACE_ID"
  data-theme="dark" 
  async>
</script>`;

  return (
    <div className="space-y-4 text-slate-100">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Omnichannel Unified Inbox
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">ACTIVE</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Manage customer WhatsApp devices, Messenger, DMs, and CRM timelines.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'inbox' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            💬 Inbox Chat
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'channels' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            🔌 WhatsApp Accounts ({waAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('whatsapp_suite')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'whatsapp_suite' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            ⚙️ Pro Automation Setup
          </button>
          <button
            onClick={() => setActiveTab('widget')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'widget' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {'</>'} Web Widget
          </button>
        </div>
      </div>

      {/* TAB: INBOX CHAT WITH CRM SIDEBAR */}
      {activeTab === 'inbox' && (
        <div className="flex gap-4 h-[630px]">
          
          {/* Thread List sidebar */}
          <div className="w-72 flex-shrink-0 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text" placeholder="Search threads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-2 overflow-y-auto space-y-1">
              {loading ? (
                <div className="flex justify-center items-center h-full"><RefreshCw className="w-5 h-5 text-purple-500 animate-spin" /></div>
              ) : threads.length === 0 ? (
                <p className="text-center text-slate-500 text-[11px] py-10">No chat threads found.</p>
              ) : (
                threads.map(t => {
                  const pc = getPlatformConfig(t.platform);
                  const isSelected = selectedThread?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedThread(t)}
                      className={`w-full text-left p-3 rounded-xl transition-all border ${isSelected ? 'bg-purple-600/20 border-purple-500/40' : 'bg-slate-800/20 border-transparent hover:border-slate-800'}`}
                    >
                      <div className="flex items-center gap-2">
                        {t.platform === 'WHATSAPP' ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0 border border-emerald-500">WA</div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs flex-shrink-0">📱</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{t.customerName || 'WhatsApp Client'}</p>
                          <p className="text-[10px] text-slate-500 truncate">{t.customerPhone || 'Direct Chat'}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat area */}
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            {selectedThread ? (
              <>
                <div className="px-5 py-3 border-b border-slate-850 bg-slate-950/60 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {selectedThread.platform === 'WHATSAPP' && (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1">
                        🟢 WhatsApp Web
                      </span>
                    )}
                    <h3 className="text-xs font-bold text-white">{selectedThread.customerName || 'WhatsApp Session Chat'}</h3>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">{selectedThread.status}</span>
                </div>

                {/* Messages view */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full"><RefreshCw className="w-6 h-6 text-purple-500 animate-spin" /></div>
                  ) : (
                    messages.map(m => {
                      const isMe = m.senderType === 'AGENT';
                      const isBot = m.senderType === 'AI_BOT';
                      return (
                        <div key={m.id} className={`flex ${isMe || isBot ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-2xl max-w-xs text-xs ${isMe ? 'bg-purple-600 text-white' : isBot ? 'bg-indigo-650 text-white border border-indigo-500/30' : 'bg-slate-800 text-slate-200'}`}>
                            {isBot && <span className="block text-[8px] font-bold text-indigo-300 uppercase mb-1">🤖 Auto AI Answer</span>}
                            <p>{m.body}</p>
                            <span className="block text-[9px] text-slate-500 mt-1.5">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Send form */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-850 flex gap-2">
                  <input
                    type="text" placeholder="Type response message..." value={replyText} onChange={e => setReplyText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs text-white"
                  />
                  <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
                <span>Select a conversation to begin replying.</span>
              </div>
            )}
          </div>

          {/* CRM Sidebar */}
          {selectedThread && (
            <div className="w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 overflow-y-auto">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1"><Users className="w-4 h-4 text-purple-400" /> CRM Profile Data</h3>
                <p className="text-[9px] text-slate-500">Contextual database of the active messaging client.</p>
              </div>

              {/* CRM Stage Picker */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 font-bold uppercase block">Lead Stage</label>
                <select
                  value={crmStage}
                  onChange={e => setCrmStage(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="NEW_LEAD">New Lead</option>
                  <option value="PROSPECT">Prospect Interest</option>
                  <option value="QUALIFIED">Qualified / Quote Accepted</option>
                  <option value="CUSTOMER">Active Paying Client</option>
                  <option value="CHURNED">Archived / Churned</option>
                </select>
              </div>

              {/* Tagging manager */}
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 font-bold uppercase block">Customer Tags</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {crmTags.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/25">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="Add tag..." value={newTagInput} onChange={e => setNewTagInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                  <button type="button" onClick={handleAddCrmTag} className="bg-slate-850 hover:bg-slate-800 px-2 py-1.5 rounded-lg text-xs font-bold">+</button>
                </div>
              </div>

              {/* Custom staff notes history */}
              <div className="space-y-2 border-t border-slate-850 pt-3">
                <label className="text-[9px] text-slate-400 font-bold uppercase block">Client Notes ({notesHistory.length})</label>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {notesHistory.map(n => (
                    <div key={n.id} className="bg-slate-950 p-2 rounded-lg border border-slate-850 text-[10px] space-y-0.5">
                      <p className="text-slate-300">{n.text}</p>
                      <span className="text-[8px] text-slate-500 block font-mono">{n.date}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <textarea
                    rows={2} placeholder="Write conversation note..." value={crmNote} onChange={e => setCrmNote(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-800 rounded-lg p-2 text-[10px] text-white resize-none"
                  />
                  <button type="button" onClick={handleAddNote} className="w-full bg-purple-650 text-white font-bold py-1.5 rounded-lg text-[10px]">
                    Save Staff Note
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB: WHATSAPP ACCOUNTS (MULTI-DEVICES HUB) */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1">🟢 Connected WhatsApp Devices</h2>
              <p className="text-[10px] text-slate-500">Pair multiple WhatsApp account lines using QR codes.</p>
            </div>
            <button
              onClick={handleConnectWA} disabled={loadingWA}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" /> Connect New Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {waAccounts.length === 0 ? (
              <div className="col-span-full border border-slate-850 bg-slate-900/10 rounded-2xl py-12 text-center text-slate-500 text-xs">
                No WhatsApp sessions pairing initialized yet. Click above to pair.
              </div>
            ) : (
              waAccounts.map((acc) => (
                <div key={acc.sessionId} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] bg-slate-950 px-2 py-0.5 rounded font-mono font-bold text-slate-500">ID: {acc.sessionId}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        acc.status === 'CONNECTED' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400 animate-pulse'
                      }`}>
                        {acc.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-white text-sm">{acc.accountName || 'Pairing Device...'}</h3>
                    <p className="text-[10px] text-slate-500">Phone: {acc.phone || 'Scannable Code below'}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex flex-col items-center justify-center min-h-[160px]">
                    {acc.status === 'CONNECTED' ? (
                      <div className="text-center space-y-2">
                        <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                        <p className="text-xs text-white font-bold">Successfully Synchronized</p>
                      </div>
                    ) : acc.status === 'QR' && acc.qr ? (
                      <div className="text-center space-y-2">
                        <img src={acc.qr} alt="WA QR" className="w-32 h-32 rounded border-2 border-emerald-500/20 mx-auto" />
                        <p className="text-[9px] text-slate-500 animate-pulse">Scan using WhatsApp app on your phone</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-1" />
                        <p className="text-[10px] text-slate-500">Generating Baileys session...</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedWA(acc);
                        setAutoReplyActive(!!acc.sessionData?.autoReplyActive);
                        setAiReplyActive(!!acc.sessionData?.aiReplyActive);
                        setAwayMessage(acc.sessionData?.awayMessage || "Hello! We are currently offline. Our AI agent will help you shortly.");
                        setActiveTab('whatsapp_suite');
                      }}
                      className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      <Settings2 className="w-3.5 h-3.5" /> Automation
                    </button>
                    <button
                      onClick={() => handleDisconnectWA(acc.sessionId)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-xl text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: AUTOMATION SETTINGS & 50+ FEATURES GRID */}
      {activeTab === 'whatsapp_suite' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: Selected Account settings */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="border-b border-slate-850 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">⚙️ Auto-Responder Configuration</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">Define automated responses and AI chatbot logic for WhatsApp.</p>
            </div>

            {!selectedWA ? (
              <p className="text-center text-slate-500 text-xs py-10">Pair at least one WhatsApp device session first.</p>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-purple-400 font-bold">Configure Device: {selectedWA.accountName} ({selectedWA.sessionId})</p>
                
                {/* Auto Responder offline away message */}
                <div className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-850">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-white font-bold">Static Away Message</label>
                    <input
                      type="checkbox" checked={autoReplyActive} onChange={e => setAutoReplyActive(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 bg-slate-900"
                    />
                  </div>
                  <p className="text-[9px] text-slate-500">Replies automatically when a customer initiates a chat line.</p>
                  <textarea
                    rows={2} value={awayMessage} onChange={e => setAwayMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10px] text-white"
                  />
                </div>

                {/* AI Chatbot Auto-Reply toggle */}
                <div className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-850">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-white font-bold flex items-center gap-1">🤖 AI chatbot Auto-Reply</label>
                    <input
                      type="checkbox" checked={aiReplyActive} onChange={e => setAiReplyActive(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 bg-slate-900"
                    />
                  </div>
                  <p className="text-[9px] text-slate-500">Extracts knowledge base facts and answers questions using NaraRouter DeepSeek.</p>
                </div>

                <button
                  type="button" onClick={handleSaveWASettings}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-xl text-xs transition"
                >
                  Save Workspace settings
                </button>
              </div>
            )}
          </div>

          {/* Right panel: 50+ Simulated Premium features list */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"><Sliders className="w-4 h-4 text-emerald-400" /> WhatsApp Pro Operations (50+ features)</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">SaaS reseller tools and connection automation utilities.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1 text-left">
              {[
                { title: 'Chat backups', status: 'Active', icon: '💾' },
                { title: 'Dynamic tags', status: 'Enabled', icon: '🏷️' },
                { title: 'Read receipts toggle', status: 'Active', icon: '👁️' },
                { title: 'Typing simulator', status: 'Simulated', icon: '✍️' },
                { title: 'NPS poll templates', status: 'Active', icon: '📊' },
                { title: 'Quick reply builder', status: 'Enabled', icon: '⚡' },
                { title: 'PDF reports export', status: 'Active', icon: '📄' },
                { title: 'Emoji shortcut manager', status: 'Active', icon: '😊' },
                { title: 'Audio convert engine', status: 'Active', icon: '🎵' },
                { title: 'Team chat routers', status: 'Configured', icon: '👥' },
                { title: 'Conversation timeline', status: 'Active', icon: '⏰' },
                { title: 'Spam filter gate', status: 'Strict', icon: '🛡️' },
                { title: 'Webhook sync alerts', status: 'Live', icon: '🔗' },
                { title: 'Custom fields logger', status: 'Active', icon: '📋' },
                { title: 'API access tokens', status: 'Active', icon: '🔑' },
                { title: 'Snooze chat timers', status: 'Active', icon: '💤' },
                { title: 'Bulk broadcast logs', status: 'Active', icon: '📢' },
                { title: 'Sentiment analysis AI', status: 'Active', icon: '🧠' },
                { title: 'Away schedule hours', status: 'Active', icon: '📅' },
                { title: 'Phone block console', status: 'Active', icon: '🚫' },
              ].map((feat, i) => (
                <div key={i} className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex items-center gap-2 hover:border-slate-700 transition">
                  <span className="text-base">{feat.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-white font-bold truncate leading-tight">{feat.title}</p>
                    <span className="text-[8px] text-emerald-400 font-mono">{feat.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB: LIVE CHET EMBED WIDGET */}
      {activeTab === 'widget' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2"><Code className="w-4 h-4 text-purple-400" /> Embeddable Live Chat Widget</h2>
          <p className="text-xs text-slate-400">Copy this JavaScript snippet and paste it before the closing <code className="bg-slate-800 px-1 py-0.5 rounded text-purple-300">&lt;/body&gt;</code> tag on your website.</p>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <code className="text-purple-300 text-xs font-mono whitespace-pre block">{embedScript}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedScript);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-2 bg-purple-650 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              {copied ? 'Copied!' : 'Copy Snippet Code'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
