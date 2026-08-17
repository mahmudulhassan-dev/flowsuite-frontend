'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Bot, Code, Globe, Check, Copy, Mic, Phone, Facebook, Instagram } from 'lucide-react';

const conversations = [
  { id: 1, name: 'Website Visitor #892', last: 'Hello, I need pricing info for your agency...', time: '2m ago', channel: 'livechat', unread: 3, avatar: 'WV' },
  { id: 2, name: 'Karim Rahman', last: 'Can you send the invoice for last month?', time: '14m ago', channel: 'whatsapp', unread: 1, avatar: 'KR' },
  { id: 3, name: 'Fatema Khanom', last: 'Is white-label available on starter plan?', time: '1h ago', channel: 'facebook', unread: 0, avatar: 'FK' },
  { id: 4, name: 'Sabbir Ahmed', last: 'Loved the new AI Studio feature!', time: '3h ago', channel: 'instagram', unread: 0, avatar: 'SA' },
  { id: 5, name: 'Nusrat Jahan', last: 'Can I upgrade to Agency plan today?', time: '5h ago', channel: 'whatsapp', unread: 0, avatar: 'NJ' },
];

const channelColors: Record<string, string> = {
  livechat: 'bg-purple-600 text-white',
  whatsapp: 'bg-emerald-600 text-white',
  facebook: 'bg-blue-600 text-white',
  instagram: 'bg-pink-600 text-white',
};

const channelLabels: Record<string, string> = {
  livechat: 'Live Chat',
  whatsapp: 'WhatsApp',
  facebook: 'Messenger',
  instagram: 'Instagram',
};

export default function InboxPage() {
  const [selectedConv, setSelectedConv] = useState(conversations[0]);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'widget'>('inbox');

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

  const filteredConvs = filterChannel === 'all' ? conversations : conversations.filter(c => c.channel === filterChannel);

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

        {/* Tab toggle */}
        <div className="flex gap-2">
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
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300">Widget Customization</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400">Widget Theme</span>
                  <select className="bg-slate-800 text-white rounded-lg px-2 py-1 text-xs border-none focus:outline-none">
                    <option>Dark Mode</option>
                    <option>Light Mode</option>
                    <option>Brand Color</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400">Greeting Message</span>
                  <input type="text" defaultValue="Hello! How can we help?" className="bg-slate-800 text-white rounded-lg px-2 py-1 text-xs focus:outline-none max-w-44" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400">AI Auto-Reply</span>
                  <div className="w-9 h-4.5 bg-emerald-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-white text-sm">Live Widget Preview</h2>
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 min-h-72 relative">
              <div className="absolute bottom-16 right-4 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-purple-600 px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">FS</div>
                  <div>
                    <p className="text-white text-xs font-bold">FlowSuite Live Chat</p>
                    <p className="text-purple-200 text-[10px]">We reply in minutes</p>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="bg-slate-800 text-white text-xs p-2.5 rounded-xl max-w-52">Hello! How can we help you today? 👋</div>
                </div>
                <div className="p-3 border-t border-slate-800 flex gap-2">
                  <input className="flex-1 bg-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white" placeholder="Type a message..." readOnly />
                  <button className="bg-purple-600 p-1.5 rounded-lg"><Send className="w-3 h-3 text-white" /></button>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-xl cursor-pointer">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INBOX TAB */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[600px]">
          {/* Conversation List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 overflow-hidden">
            {/* Channel filter */}
            <div className="flex gap-1 flex-wrap">
              {['all', 'whatsapp', 'facebook', 'instagram', 'livechat'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setFilterChannel(ch)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${filterChannel === ch ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  {ch === 'all' ? 'All' : channelLabels[ch]}
                </button>
              ))}
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto flex-1 space-y-1.5">
              {filteredConvs.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left p-3 rounded-xl space-y-1.5 transition-all ${selectedConv.id === conv.id ? 'bg-purple-600/20 border border-purple-500/40' : 'bg-slate-800/30 border border-slate-800/50 hover:border-slate-700'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
                        {conv.avatar}
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{conv.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {conv.unread > 0 && (
                        <span className="w-4 h-4 bg-purple-600 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{conv.unread}</span>
                      )}
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${channelColors[conv.channel]}`}>{channelLabels[conv.channel].slice(0, 2)}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[10px] truncate">{conv.last}</p>
                  <p className="text-[9px] text-slate-600">{conv.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Area */}
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-xs text-white">
                  {selectedConv.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedConv.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400">Active now · via {channelLabels[selectedConv.channel]}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">AI Auto-Reply On</span>
                <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"><Bot className="w-4 h-4" /></button>
                <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"><Phone className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">{selectedConv.avatar}</div>
                <div className="bg-slate-800 text-slate-200 text-sm p-3 rounded-2xl rounded-tl-sm max-w-sm">
                  Hello, I need pricing information for your agency subscription. Do you support white-label branding?
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-purple-600 text-white text-sm p-3 rounded-2xl rounded-tr-sm max-w-sm">
                  Hi! Yes, absolutely. FlowSuite Agency plan supports full White-Label branding, custom CNAME domains, and removes all FlowSuite branding from your client dashboards. 🚀
                </div>
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">AI</div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">{selectedConv.avatar}</div>
                <div className="bg-slate-800 text-slate-200 text-sm p-3 rounded-2xl rounded-tl-sm max-w-sm">
                  Great! What payment methods do you accept? Can I pay with bKash?
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-purple-600 text-white text-sm p-3 rounded-2xl rounded-tr-sm max-w-sm">
                  Yes! We accept bKash, Nagad, and international bank transfers. You can top up AI credits directly via bKash from your Billing page. 💳
                </div>
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">AI</div>
              </div>
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-slate-800 flex gap-3">
              <button className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a reply or let AI respond automatically..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition">
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
