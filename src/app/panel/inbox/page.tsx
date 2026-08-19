'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Check, Copy, Mic, Phone, Plus, RefreshCw, Search,
  Filter, X, ChevronDown, Inbox, Code, Bot, Users
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

// ─── Platform Config ────────────────────────────────────────────────────────────
const PLATFORMS: {
  key: Platform | 'all';
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  badge: string;
}[] = [
  { key: 'all',             label: 'All Channels',  emoji: '📬', color: 'text-slate-300',  bg: 'bg-slate-700',    border: 'border-slate-600', badge: 'bg-slate-700 text-slate-200' },
  { key: 'WHATSAPP',        label: 'WhatsApp',       emoji: '💬', color: 'text-emerald-400', bg: 'bg-emerald-900/40', border: 'border-emerald-700/60', badge: 'bg-emerald-600 text-white' },
  { key: 'WHATSAPP_BAILEYS',label: 'WA Baileys',    emoji: '🟢', color: 'text-emerald-300', bg: 'bg-emerald-900/30', border: 'border-emerald-800/60', badge: 'bg-emerald-700 text-white' },
  { key: 'FACEBOOK',        label: 'Messenger',      emoji: '💙', color: 'text-blue-400',    bg: 'bg-blue-900/40',   border: 'border-blue-700/60',    badge: 'bg-blue-600 text-white' },
  { key: 'INSTAGRAM',       label: 'Instagram',      emoji: '📸', color: 'text-pink-400',    bg: 'bg-pink-900/40',   border: 'border-pink-700/60',    badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' },
  { key: 'TIKTOK',          label: 'TikTok',         emoji: '🎵', color: 'text-red-400',     bg: 'bg-red-900/40',    border: 'border-red-700/60',     badge: 'bg-black text-white' },
  { key: 'THREADS',         label: 'Threads',        emoji: '🧵', color: 'text-slate-300',   bg: 'bg-slate-800/40',  border: 'border-slate-700/60',   badge: 'bg-slate-900 text-white' },
  { key: 'TELEGRAM',        label: 'Telegram',       emoji: '✈️', color: 'text-sky-400',     bg: 'bg-sky-900/40',    border: 'border-sky-700/60',     badge: 'bg-sky-500 text-white' },
  { key: 'X',               label: 'X (Twitter)',    emoji: '🐦', color: 'text-slate-200',   bg: 'bg-slate-900/40',  border: 'border-slate-600/60',   badge: 'bg-slate-950 text-white border border-slate-700' },
  { key: 'GMAIL',           label: 'Gmail',          emoji: '📧', color: 'text-red-400',     bg: 'bg-red-900/40',    border: 'border-red-700/60',     badge: 'bg-red-600 text-white' },
  { key: 'SMS',             label: 'SMS',            emoji: '📱', color: 'text-blue-300',    bg: 'bg-blue-900/30',   border: 'border-blue-800/60',    badge: 'bg-blue-700 text-white' },
  { key: 'WEB_CHAT',        label: 'Web Chat',       emoji: '🌐', color: 'text-purple-400',  bg: 'bg-purple-900/40', border: 'border-purple-700/60',  badge: 'bg-purple-600 text-white' },
];

const getPlatformConfig = (p: Platform | string) =>
  PLATFORMS.find(x => x.key === p) ?? PLATFORMS[0];

// ─── Component ──────────────────────────────────────────────────────────────────
export default function InboxPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'widget'>('inbox');
  const [copied, setCopied] = useState(false);

  // Create thread modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newChannel, setNewChannel] = useState('WEB_CHAT');

  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // WhatsApp QR modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [waStatus, setWaStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'QR'>('DISCONNECTED');
  const [waQr, setWaQr] = useState<string | null>(null);
  const [waLoading, setWaLoading] = useState(false);

  const checkWhatsAppStatus = async () => {
    try {
      const res = await api.get<{ status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'QR'; qr?: string }>('/api/v1/whatsapp/status');
      setWaStatus(res.status);
      if (res.qr) setWaQr(res.qr);
    } catch (err) {
      console.error('Failed to get WhatsApp status:', err);
    }
  };

  const handleConnectWhatsApp = async () => {
    try {
      setWaLoading(true);
      await api.post('/api/v1/whatsapp/connect');
      setWaStatus('CONNECTING');
      setWaQr(null);
    } catch (err) {
      console.error('Failed to start WhatsApp pairing:', err);
    } finally {
      setWaLoading(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    try {
      setWaLoading(true);
      await api.post('/api/v1/whatsapp/disconnect');
      setWaStatus('DISCONNECTED');
      setWaQr(null);
    } catch (err) {
      console.error('Failed to disconnect WhatsApp:', err);
    } finally {
      setWaLoading(false);
    }
  };

  useEffect(() => { checkWhatsAppStatus(); }, []);

  const embedScript = `<script 
  src="https://suite.amanasuite.com/widget.js" 
  data-workspace-id="YOUR_WORKSPACE_ID"
  data-theme="dark" 
  async>
</script>`;

  const copyScript = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Fetch threads ───────────────────────────────────────────────────────────
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
      setThreads(data);
      if (data.length > 0 && !selectedThread) setSelectedThread(data[0]);
    } catch (err) {
      console.error('Failed to load threads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadThreads(); }, [filterPlatform, filterStatus, searchQuery]);

  // ── Fetch messages ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedThread) return;
    async function loadMessages() {
      try {
        setLoadingMessages(true);
        const data = await api.get<Thread>(`/api/v1/inbox/threads/${selectedThread?.id}`);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
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
    socket.on('whatsapp:status', (data: { status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'QR' }) => {
      setWaStatus(data.status);
      if (data.status !== 'QR') setWaQr(null);
    });
    socket.on('whatsapp:qr', (data: { qr: string }) => {
      setWaStatus('QR');
      setWaQr(data.qr);
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

  // ── Handlers ────────────────────────────────────────────────────────────────
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
      console.error('Failed to send message:', err);
      setReplyText(currentText);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    try {
      const newThread = await api.post<Thread>('/api/v1/inbox/threads', {
        customerName: newCustName,
        customerEmail: newCustEmail,
        customerPhone: newCustPhone,
        channel: newChannel,
      });
      setThreads(prev => [newThread, ...prev]);
      setSelectedThread(newThread);
      setShowCreateModal(false);
      setNewCustName(''); setNewCustEmail(''); setNewCustPhone('');
    } catch (err) {
      console.error('Failed to create manual thread:', err);
    }
  };

  // ── Derived stats ────────────────────────────────────────────────────────────
  const openCount = threads.filter(t => t.status === 'OPEN').length;
  const pendingCount = threads.filter(t => t.status === 'PENDING').length;
  const resolvedCount = threads.filter(t => t.status === 'RESOLVED').length;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* ── Top Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Unified Omnichannel Inbox
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">LIVE</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">WhatsApp · Messenger · Instagram · TikTok · Threads · Telegram · X · Gmail · SMS · Web Chat</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { checkWhatsAppStatus(); setShowQrModal(true); }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            🟢 WhatsApp QR
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Thread
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'inbox' ? 'bg-blue-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'}`}
          >
            💬 Inbox
          </button>
          <button
            onClick={() => setActiveTab('widget')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'widget' ? 'bg-purple-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'}`}
          >
            {'</>'}  Widget
          </button>
        </div>
      </div>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Open', count: openCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
          { label: 'Pending', count: pendingCount, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
          { label: 'Resolved', count: resolvedCount, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border rounded-xl p-3 text-center cursor-pointer hover:opacity-80 transition-all`} onClick={() => setFilterStatus(s.label.toUpperCase())}>
            <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
            <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Widget Tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'widget' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2"><Code className="w-4 h-4 text-purple-400" /> Embeddable Live Chat Widget</h2>
          <p className="text-xs text-slate-400">Paste this snippet before the <code className="bg-slate-800 px-1 py-0.5 rounded text-purple-300">&lt;/body&gt;</code> tag on your website.</p>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <code className="text-purple-300 text-xs font-mono whitespace-pre block">{embedScript}</code>
            <button onClick={copyScript} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all">
              {copied ? <><Check className="w-4 h-4 text-emerald-300" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Script</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Inbox Tab ───────────────────────────────────────────────────────── */}
      {activeTab === 'inbox' && (
        <div className="flex gap-4 h-[640px]">
          {/* Left sidebar: Platform filters + Thread list */}
          <div className="w-72 flex-shrink-0 flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Platform filter scrollable */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-2 flex flex-col gap-0.5 overflow-y-auto max-h-56">
              {PLATFORMS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setFilterPlatform(p.key)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${filterPlatform === p.key ? `${p.bg} ${p.border} border ${p.color}` : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                  <span className="text-sm">{p.emoji}</span>
                  <span className="truncate">{p.label}</span>
                  {filterPlatform === p.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />}
                </button>
              ))}
            </div>

            {/* Thread List */}
            <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-2 overflow-y-auto space-y-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-500 animate-spin" />
                  <p className="text-xs text-slate-500">Loading...</p>
                </div>
              ) : threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
                  <MessageSquare className="w-8 h-8" />
                  <p className="text-xs text-center">No threads yet.<br />Messages from connected channels will appear here.</p>
                </div>
              ) : (
                threads.map(t => {
                  const pc = getPlatformConfig(t.platform);
                  const lastMsg = t.messages?.[0];
                  const isSelected = selectedThread?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedThread(t)}
                      className={`w-full text-left p-3 rounded-xl space-y-1.5 transition-all border ${isSelected ? 'bg-purple-600/20 border-purple-500/40' : 'bg-slate-800/20 border-transparent hover:border-slate-700 hover:bg-slate-800/40'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${pc.bg} border ${pc.border}`}>
                          {pc.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{t.customerName || 'Unknown Contact'}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pc.badge}`}>{pc.label}</span>
                        </div>
                      </div>
                      <p className="text-slate-400 text-[10px] truncate pl-10">{lastMsg ? lastMsg.body : 'No messages yet'}</p>
                      <p className="text-[9px] text-slate-600 pl-10">{new Date(t.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Chat area */}
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            {selectedThread ? (() => {
              const pc = getPlatformConfig(selectedThread.platform);
              return (
                <>
                  {/* Chat Header */}
                  <div className={`px-5 py-3 border-b border-slate-800 flex items-center justify-between ${pc.bg}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border ${pc.border} ${pc.bg}`}>
                        {pc.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{selectedThread.customerName}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          <span className={`text-[10px] ${pc.color}`}>Via {pc.label}</span>
                          {selectedThread.customerPhone && (
                            <span className="text-[10px] text-slate-500">· {selectedThread.customerPhone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${selectedThread.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' : selectedThread.status === 'RESOLVED' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {selectedThread.status}
                      </span>
                      <Bot className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {loadingMessages ? (
                      <div className="flex justify-center items-center h-full">
                        <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
                        <MessageSquare className="w-10 h-10" />
                        <p className="text-xs">No messages in this thread yet.</p>
                      </div>
                    ) : (
                      messages.map(m => {
                        const isMe = m.senderType === 'AGENT';
                        const isBot = m.senderType === 'AI_BOT';
                        return (
                          <div key={m.id} className={`flex gap-3 ${isMe || isBot ? 'justify-end' : ''}`}>
                            {!isMe && !isBot && (
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${pc.bg} border ${pc.border}`}>
                                {pc.emoji}
                              </div>
                            )}
                            <div className={`text-sm p-3 rounded-2xl max-w-sm leading-relaxed ${isMe ? 'bg-purple-600 text-white rounded-tr-sm' : isBot ? 'bg-slate-700/80 text-slate-200 rounded-tr-sm border border-slate-600' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                              {isBot && <p className="text-[9px] text-slate-400 font-bold mb-1 flex items-center gap-1"><Bot className="w-2.5 h-2.5" /> AI Auto-reply</p>}
                              {m.body}
                              <p className="text-[9px] mt-1 opacity-50">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            {(isMe || isBot) && (
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${isBot ? 'bg-slate-600' : 'bg-purple-600'}`}>
                                {isBot ? '🤖' : 'ME'}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Reply Bar */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder={`Reply via ${pc.label}...`}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 placeholder-slate-600"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition"
                    >
                      <Send className="w-4 h-4" /> Send
                    </button>
                  </form>
                </>
              );
            })() : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-3">
                <div className="text-4xl">📬</div>
                <p className="text-sm font-semibold text-slate-500">Select a conversation</p>
                <p className="text-xs text-slate-600">Messages from WhatsApp, Messenger, Instagram, TikTok,<br />Threads, Telegram, and more will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Create Thread Modal ─────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create New Chat Thread</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateThread} className="space-y-4">
              {[
                { label: 'Customer Name *', type: 'text', value: newCustName, onChange: setNewCustName, placeholder: 'e.g. Rahim Ahmed', required: true },
                { label: 'Email', type: 'email', value: newCustEmail, onChange: setNewCustEmail, placeholder: 'e.g. rahim@example.com', required: false },
                { label: 'Phone', type: 'text', value: newCustPhone, onChange: setNewCustPhone, placeholder: '+8801700000000', required: false },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-slate-400 font-semibold block mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={e => f.onChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Source Channel</label>
                <select
                  value={newChannel}
                  onChange={e => setNewChannel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {PLATFORMS.filter(p => p.key !== 'all').map(p => (
                    <option key={p.key} value={p.key}>{p.emoji} {p.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs">Create Thread</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── WhatsApp QR Modal ───────────────────────────────────────────────── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm space-y-5 text-center">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">🟢 WhatsApp QR Pairing</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-slate-400 text-xs">Scan the QR code with your WhatsApp to link your number to the inbox.</p>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px]">
              {waStatus === 'CONNECTED' ? (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Check className="w-8 h-8" />
                  </div>
                  <p className="text-white font-bold text-sm">WhatsApp Linked ✓</p>
                  <p className="text-slate-500 text-xs">Your inbox is syncing with WhatsApp in real-time.</p>
                </div>
              ) : waStatus === 'QR' && waQr ? (
                <div className="space-y-3">
                  <img src={waQr} alt="WhatsApp QR Code" className="w-48 h-48 rounded-xl border-2 border-emerald-500/30 mx-auto" />
                  <p className="text-slate-400 text-xs animate-pulse">Waiting for scan...</p>
                </div>
              ) : waStatus === 'CONNECTING' ? (
                <div className="space-y-3 text-center">
                  <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                  <p className="text-slate-400 text-xs">Generating QR code...</p>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <Phone className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-xs">No active session. Click below to start pairing.</p>
                  <button onClick={handleConnectWhatsApp} disabled={waLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-5 rounded-xl transition-all">
                    {waLoading ? 'Starting...' : '📲 Pair WhatsApp Account'}
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              {waStatus === 'CONNECTED' && (
                <button onClick={handleDisconnectWhatsApp} disabled={waLoading} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl text-xs">
                  Disconnect
                </button>
              )}
              {(waStatus === 'QR' || waStatus === 'CONNECTING') && (
                <button onClick={handleConnectWhatsApp} disabled={waLoading} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1">
                  <RefreshCw className={`w-3.5 h-3.5 ${waLoading ? 'animate-spin' : ''}`} /> Refresh QR
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
