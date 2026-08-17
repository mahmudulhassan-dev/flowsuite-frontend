'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  MessageSquare,
  Calendar,
  Users,
  Send,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Globe,
  Layers,
  BarChart3,
  Lock,
  DollarSign,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function BusinessLandingPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        FlowSuite 2.0 Released — 99.99% Uptime Guarantee, Meta Official API & Local bKash/Nagad Billing!
        <Link href="/panel" className="underline font-bold hover:text-amber-200 ml-2">
          Explore User Panel &rarr;
        </Link>
      </div>

      {/* Main Header & Dropdown Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              FS
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                FlowSuite <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono">ENTERPRISE</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Omnichannel AI Social & Marketing Suite</p>
            </div>
          </Link>

          {/* Navigation Items with Dropdowns */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            {/* Products Dropdown */}
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-white py-2 transition-colors">
                Products & Tools <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-transform" />
              </button>

              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 backdrop-blur-2xl">
                  <Link href="/panel/publisher" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors">
                    <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Social Media Publisher</h4>
                      <p className="text-[11px] text-slate-400">Schedule & publish to 9 channels</p>
                    </div>
                  </Link>
                  <Link href="/panel/inbox" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors">
                    <MessageSquare className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Omnichannel Unified Inbox</h4>
                      <p className="text-[11px] text-slate-400">FB, WA, IG & Live Web Chat Widget</p>
                    </div>
                  </Link>
                  <Link href="/panel/ai-studio" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors">
                    <Bot className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Agent Studio</h4>
                      <p className="text-[11px] text-slate-400">Copywriter, AI Model & Voice Agent</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* AI Agents Dropdown */}
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveDropdown('ai')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-white py-2 transition-colors">
                AI Suite <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform" />
              </button>

              {activeDropdown === 'ai' && (
                <div className="absolute top-full left-0 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 backdrop-blur-2xl">
                  <Link href="/panel/ai-studio" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors">
                    <Sparkles className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Social Copywriter AI</h4>
                      <p className="text-[11px] text-slate-400">Auto-generate captions & hashtags</p>
                    </div>
                  </Link>
                  <Link href="/panel/ai-studio" className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors">
                    <Globe className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Virtual Fashion Model AI</h4>
                      <p className="text-[11px] text-slate-400">Studio-grade fashion generation</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/affiliate" className="hover:text-white transition-colors">
              Affiliates (30% MRR)
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & SLA
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy & GDPR
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <a
              href="https://flowsuite.amanasuite.com/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3.5 py-2 rounded-xl transition-all"
            >
              <ShieldCheck className="w-4 h-4" /> SuperAdmin Gateway
            </a>

            <Link
              href="/panel"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/25 flex items-center gap-2 hover:scale-105"
            >
              Launch App Panel <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 rounded-full text-purple-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> Next-Gen Enterprise AI Social & CRM Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Automate Social Media, AI Agents <br />
            &amp; Omnichannel Unified Live Chat
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            FlowSuite empowers agencies and growing enterprises to schedule multi-platform social posts, engage leads across WhatsApp &amp; Facebook Messenger, and deploy embeddable AI Live Chat widgets to any website.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/panel"
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:opacity-95 text-white text-base font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-purple-600/30 flex items-center gap-3 hover:scale-105"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/panel/inbox"
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-base font-semibold px-8 py-4 rounded-2xl transition-all flex items-center gap-3"
            >
              <Play className="w-4 h-4 text-purple-400" /> View Live Chat Demo
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-slate-800/80 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
              <span className="text-slate-400 text-xs font-semibold">Active Workspaces</span>
              <p className="text-2xl font-black text-white mt-1">1,482+</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
              <span className="text-slate-400 text-xs font-semibold">Uptime SLA</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">99.99%</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
              <span className="text-slate-400 text-xs font-semibold">AI Tokens Processed</span>
              <p className="text-2xl font-black text-purple-400 mt-1">14.2M+</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
              <span className="text-slate-400 text-xs font-semibold">Social Channels</span>
              <p className="text-2xl font-black text-blue-400 mt-1">9 Platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 bg-slate-900/40 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Everything You Need to Scale Omnichannel SaaS</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Unified inbox messaging, automated social scheduling, AI agent copywriters, and CRM pipelines built into one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Multi-Platform Publisher</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Schedule posts to Facebook, Instagram, TikTok, LinkedIn, YouTube Shorts, X &amp; WhatsApp Channels from a single unified calendar.
              </p>
              <Link href="/panel/publisher" className="text-purple-400 text-xs font-bold flex items-center gap-1 hover:underline">
                Explore Publisher &rarr;
              </Link>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Omnichannel Unified Inbox</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Reply to FB Messenger, WhatsApp, Instagram DMs, and embeddable Web Live Chat widgets with real-time AI auto-moderation.
              </p>
              <Link href="/panel/inbox" className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
                Explore Unified Inbox &rarr;
              </Link>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Agent Creative Studio</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Deploy Gemini Voice Sales Agents, Virtual AI Fashion Models, and high-converting copywriters tailored for your brand.
              </p>
              <Link href="/panel/ai-studio" className="text-amber-400 text-xs font-bold flex items-center gap-1 hover:underline">
                Explore AI Studio &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white">FS</div>
            <span className="font-bold text-white text-sm">FlowSuite Enterprise</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/panel" className="hover:text-white">User App Panel</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/affiliate" className="hover:text-white">Affiliate Program</Link>
            <a href="https://flowsuite.amanasuite.com/admin" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">SuperAdmin Gateway</a>
          </div>
          <p>&copy; 2026 FlowSuite Enterprise. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
