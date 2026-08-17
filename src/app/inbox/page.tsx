'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Bot, Code, Globe, ShieldCheck, Check, Copy } from 'lucide-react';

export default function OmnichannelInboxPage() {
  const [copied, setCopied] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'facebook' | 'whatsapp' | 'livechat'>('all');

  const embedScript = `<script 
  src="https://suite.amanasuite.com/widget.js" 
  data-org-id="org_main_001" 
  data-theme="dark" 
  async>
</script>`;

  const copyWidgetScript = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Omnichannel Unified Inbox & Web Live Chat
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                LIVE AGENT CONNECTED
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Manage Facebook Messenger, WhatsApp, Instagram DMs, & Embeddable Web Live Chat Widget in One Place
            </p>
          </div>
        </div>
      </div>

      {/* Widget Code Generator Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-400" /> Embeddable Web Live Chat Widget Generator
          </h2>
          <span className="text-xs text-slate-400">Copy & Paste inside any website's &lt;head&gt; tag</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center font-mono text-sm">
          <code className="text-purple-300">{embedScript}</code>
          <button
            onClick={copyWidgetScript}
            className="ml-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-lg text-xs transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Script Tag'}
          </button>
        </div>
      </div>

      {/* Inbox Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Left: Chat List */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4 flex flex-col">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Conversations</h3>
            <div className="flex gap-1 text-xs">
              <button onClick={() => setSelectedChannel('all')} className={`px-2.5 py-1 rounded-lg ${selectedChannel === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>All</button>
              <button onClick={() => setSelectedChannel('facebook')} className={`px-2.5 py-1 rounded-lg ${selectedChannel === 'facebook' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>FB</button>
              <button onClick={() => setSelectedChannel('whatsapp')} className={`px-2.5 py-1 rounded-lg ${selectedChannel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>WA</button>
              <button onClick={() => setSelectedChannel('livechat')} className={`px-2.5 py-1 rounded-lg ${selectedChannel === 'livechat' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Web</button>
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            <div className="p-3 bg-purple-600/10 border border-purple-500/30 rounded-xl space-y-1 cursor-pointer">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Website Visitor #892</span>
                <span className="text-purple-400 font-mono">Live Web Chat</span>
              </div>
              <p className="text-slate-400 text-xs truncate">Hello, I need pricing information for your agency subscription.</p>
            </div>

            <div className="p-3 bg-slate-800/30 border border-slate-800 rounded-xl space-y-1 cursor-pointer">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Karim Rahman</span>
                <span className="text-emerald-400 font-mono">WhatsApp</span>
              </div>
              <p className="text-slate-400 text-xs truncate">Can you send the invoice for last month?</p>
            </div>
          </div>
        </div>

        {/* Middle & Right: Active Chat Area */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Website Visitor #892</h3>
              <p className="text-xs text-slate-400">Connected via Live Web Chat Widget (`suite.amanasuite.com`)</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30">AI Auto-Reply Active</span>
          </div>

          <div className="space-y-4 overflow-y-auto py-4 flex-1">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">V</div>
              <div className="bg-slate-800 text-slate-200 text-sm p-3 rounded-2xl max-w-md">
                Hello! I saw your FlowSuite SaaS platform and would like to know if it supports white-label agency branding.
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="bg-purple-600 text-white text-sm p-3 rounded-2xl max-w-md">
                Yes, absolutely! FlowSuite supports custom CNAME domains and complete White-Label branding for agencies.
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">AI</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <input
              type="text"
              placeholder="Type your response or let AI reply automatically..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
