'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, Code, Check, Copy, Mic, Phone, Plus, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';
import { io, Socket } from 'socket.io-client';

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
  channel: 'GMAIL' | 'SMS' | 'WHATSAPP' | 'WEB_CHAT';
  externalSenderId: string;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  assignedStaffId: string | null;
  status: 'OPEN' | 'PENDING' | 'RESOLVED' | 'BOT_HANDLED';
  lastMessageAt: string;
  messages?: Message[];
}

const channelColors: Record<string, string> = {
  GMAIL: 'bg-red-600 text-white',
  SMS: 'bg-blue-600 text-white',
  WHATSAPP: 'bg-emerald-600 text-white',
  WEB_CHAT: 'bg-purple-600 text-white',
};

const channelLabels: Record<string, string> = {
  GMAIL: 'Gmail',
  SMS: 'SMS',
  WHATSAPP: 'WhatsApp',
  WEB_CHAT: 'Web Chat',
};

export default function InboxPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'widget'>('inbox');
  const [copied, setCopied] = useState(false);

  // Manual thread modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newChannel, setNewChannel] = useState('WEB_CHAT');

  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const embedScript = `<script 
  src="https://suite.amanasuite.com/widget.js" 
  data-org-id="org_main_001" 
  data-theme="dark" 
  async>
</script>`;

  const copyScript = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch threads list
  const loadThreads = async () => {
    try {
      setLoading(true);
      let path = '/api/v1/inbox/threads';
      const params: string[] = [];
      if (filterChannel !== 'all') params.push(`channel=${filterChannel}`);
      if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
      if (params.length > 0) path += `?${params.join('&')}`;

      const data = await api.get<Thread[]>(path);
      setThreads(data);
      if (data.length > 0 && !selectedThread) {
        setSelectedThread(data[0]);
      }
    } catch (err) {
      console.error('Failed to load threads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, [filterChannel, searchQuery]);

  // Fetch messages for selected thread
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

  // Socket connection
  useEffect(() => {
    const token = localStorage.getItem('fs_token');
    if (!token) return;

    const socket = io('https://flowsuite.amanasuite.com', {
      auth: { token },
      path: '/socket.io',
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('inbox:message', (eventData: { threadId: string; message: Message }) => {
      // If the incoming message belongs to our selected thread, append it
      if (selectedThread && eventData.threadId === selectedThread.id) {
        setMessages(prev => {
          if (prev.some(m => m.id === eventData.message.id)) return prev;
          return [...prev, eventData.message];
        });
      }
      
      // Update thread lists
      setThreads(prev => {
        return prev.map(t => {
          if (t.id === eventData.threadId) {
            return {
              ...t,
              lastMessageAt: eventData.message.createdAt,
              messages: [eventData.message],
            };
          }
          return t;
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedThread?.id]);

  // Auto-scroll chat area
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      setReplyText(currentText); // Restore input on error
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
      setNewCustName('');
      setNewCustEmail('');
      setNewCustPhone('');
    } catch (err) {
      console.error('Failed to create manual thread:', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Omnichannel Unified Inbox
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">LIVE</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Facebook Messenger, WhatsApp, Instagram DMs & Web Live Chat Widget</p>
          </div>
        </div>

        {/* Tab & Actions toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Thread
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'inbox' ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
          >
            💬 Inbox
          </button>
          <button
            onClick={() => setActiveTab('widget')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'widget' ? 'bg-purple-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'}`}
          >
            {"</>"} Widget Generator
          </button>
        </div>
      </div>

      {/* WIDGET TAB */}
      {activeTab === 'widget' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" /> Embeddable Web Live Chat Widget
            </h2>
            <p className="text-xs text-slate-400">Copy the script below and paste it before the closing <code className="bg-slate-800 px-1.5 py-0.5 rounded text-purple-300">&lt;/body&gt;</code> tag on your website.</p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <code className="text-purple-300 text-xs font-mono whitespace-pre block">{embedScript}</code>
              <button onClick={copyScript} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all">
                {copied ? <><Check className="w-4 h-4 text-emerald-300" /> Copied to Clipboard!</> : <><Copy className="w-4 h-4" /> Copy Script Tag</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INBOX TAB */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[650px]">
          {/* Conversation List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 overflow-hidden">
            {/* Search */}
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            {/* Channel filter */}
            <div className="flex gap-1 flex-wrap">
              {['all', 'WHATSAPP', 'GMAIL', 'SMS', 'WEB_CHAT'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setFilterChannel(ch)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${filterChannel === ch ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  {ch === 'all' ? 'All' : channelLabels[ch] || ch}
                </button>
              ))}
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto flex-1 space-y-1.5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                  <p className="text-xs text-slate-500">Loading threads...</p>
                </div>
              ) : threads.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">No threads found.</div>
              ) : (
                threads.map(t => {
                  const lastMsg = t.messages && t.messages[0];
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedThread(t)}
                      className={`w-full text-left p-3 rounded-xl space-y-1.5 transition-all ${selectedThread?.id === t.id ? 'bg-purple-600/20 border border-purple-500/40' : 'bg-slate-800/30 border border-slate-800/50 hover:border-slate-700'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                            {t.customerName ? t.customerName.slice(0, 2).toUpperCase() : 'WV'}
                          </div>
                          <span className="text-xs font-semibold text-white truncate">{t.customerName || 'Unknown'}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${channelColors[t.channel]}`}>{channelLabels[t.channel]}</span>
                      </div>
                      <p className="text-slate-400 text-[10px] truncate">{lastMsg ? lastMsg.body : 'No messages yet'}</p>
                      <p className="text-[9px] text-slate-600">{new Date(t.lastMessageAt).toLocaleTimeString()}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Chat Area */}
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            {selectedThread ? (
              <>
                {/* Chat Header */}
                <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-xs text-white">
                      {selectedThread.customerName ? selectedThread.customerName.slice(0, 2).toUpperCase() : 'WV'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{selectedThread.customerName}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-[10px] text-slate-400">Via {channelLabels[selectedThread.channel]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                    </div>
                  ) : (
                    messages.map(m => {
                      const isMe = m.senderType === 'AGENT';
                      return (
                        <div key={m.id} className={`flex gap-3 ${isMe ? 'justify-end' : ''}`}>
                          {!isMe && (
                            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                              {selectedThread.customerName ? selectedThread.customerName.slice(0, 2).toUpperCase() : 'WV'}
                            </div>
                          )}
                          <div className={`text-sm p-3 rounded-2xl max-w-sm ${isMe ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                            {m.body}
                          </div>
                          {isMe && (
                            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">AI</div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Reply Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type a reply..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition">
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
                <MessageSquare className="w-10 h-10 mb-2 text-slate-700" />
                Select a thread to start messaging
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE THREAD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Create New Chat Thread</h3>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim Ahmed"
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Customer Email</label>
                <input
                  type="email"
                  placeholder="e.g. rahim@example.com"
                  value={newCustEmail}
                  onChange={e => setNewCustEmail(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Customer Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +8801700000000"
                  value={newCustPhone}
                  onChange={e => setNewCustPhone(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Source Channel</label>
                <select
                  value={newChannel}
                  onChange={e => setNewChannel(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="WEB_CHAT">Web Chat Widget</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="GMAIL">Gmail</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs"
                >
                  Create Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
