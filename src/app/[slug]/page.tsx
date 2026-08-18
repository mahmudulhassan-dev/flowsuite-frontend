'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useThemeLang } from '../../lib/theme-lang-context';
import {
  ArrowLeft,
  Download,
  Laptop,
  Smartphone,
  CheckCircle,
  FileText,
  Mail,
  Send,
  Calendar,
  Shield,
  Activity,
  AlertTriangle,
  FileCode,
  Globe,
  Printer,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DynamicInfoPage() {
  const { slug } = useParams() as { slug: string };
  const { lang, theme, t } = useThemeLang();
  
  // State for contact form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Content configuration based on slug
  const renderContent = () => {
    switch (slug) {
      case 'download':
        return (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
                <Download className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">{t('download')}</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
                {t('download_desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Desktop Downloads */}
              <div className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Desktop Application</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Experience full performance with system notifications, local SQLite backups, and hotkeys.
                </p>
                <div className="space-y-3 pt-2">
                  <a
                    href="#"
                    className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 text-white font-bold p-4 rounded-xl text-xs transition"
                  >
                    <span>{t('download_windows')}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">v2.0.4 .EXE</span>
                  </a>
                  <a
                    href="#"
                    className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-white font-bold p-4 rounded-xl text-xs transition border border-slate-700"
                  >
                    <span>{t('download_macos')}</span>
                    <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">v2.0.4 .DMG</span>
                  </a>
                </div>
              </div>

              {/* Mobile Downloads */}
              <div className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mobile Application</h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Manage your social streams and reply to chats on the go with our Android and iOS companion apps.
                </p>
                <div className="space-y-3 pt-2">
                  <a
                    href="#"
                    className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-white font-bold p-4 rounded-xl text-xs transition border border-slate-700"
                  >
                    <span>{t('download_android')}</span>
                    <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">v2.0.2 .APK</span>
                  </a>
                  <a
                    href="#"
                    className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-white font-bold p-4 rounded-xl text-xs transition border border-slate-700"
                  >
                    <span>{t('download_ios')}</span>
                    <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">iOS App</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-8 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('about')}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              FlowSuite was founded with a clear mission: to make social automation and customer communications accessible to businesses of all sizes. Built on an enterprise-grade stack, our platform handles omnichannel routing, AI copy generation, and scheduled queues seamlessly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl">
                <h3 className="font-bold text-slate-900 dark:text-white">Our Vision</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">To bridge the gap between AI automation and personal customer relationship management.</p>
              </div>
              <div className="bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl">
                <h3 className="font-bold text-slate-900 dark:text-white">Our Technology</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">100% strict TypeScript codebase running on high-performance PostgreSQL and Node.js.</p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('contact')}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Got questions or need custom SLA enterprise support? Send us a message.</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-400">Our support engineers will get back to you within 12 hours.</p>
                <button onClick={() => setSubmitted(false)} className="text-xs text-purple-400 underline font-bold mt-2">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-3xl">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-850 dark:border-slate-800 light:border-slate-200 text-xs p-3 rounded-xl focus:border-purple-500 outline-none text-slate-200 dark:text-slate-200 light:text-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-850 dark:border-slate-800 light:border-slate-200 text-xs p-3 rounded-xl focus:border-purple-500 outline-none text-slate-200 dark:text-slate-200 light:text-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Message subject"
                    className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-850 dark:border-slate-800 light:border-slate-200 text-xs p-3 rounded-xl focus:border-purple-500 outline-none text-slate-200 dark:text-slate-200 light:text-slate-950"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Message Content</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-850 dark:border-slate-800 light:border-slate-200 text-xs p-3 rounded-xl focus:border-purple-500 outline-none text-slate-200 dark:text-slate-200 light:text-slate-950"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold p-3.5 rounded-xl text-xs transition"
                >
                  <Send className="w-3.5 h-3.5" /> Send Message
                </button>
              </form>
            )}
          </div>
        );

      case 'careers':
        return (
          <div className="space-y-8 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('careers')}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We are a distributed team of engineers, designers, and social media enthusiasts building next-generation tools.
            </p>
            <div className="space-y-4 pt-4">
              <div className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Senior Full-Stack Engineer</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Remote | Node.js, TypeScript, Next.js</p>
                </div>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full font-bold">Apply Now</span>
              </div>
              <div className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">UI/UX Designer</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Remote | Figma, Tailwind CSS</p>
                </div>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full font-bold">Apply Now</span>
              </div>
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('status')}</h1>
                <p className="text-xs text-slate-500 mt-1">Real-time infrastructure health and API responsiveness metrics.</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold self-start">
                <CheckCircle className="w-4 h-4" /> All Systems Operational
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-200">Next.js Web Engine (Port 4005)</span>
                  <span className="text-emerald-400 font-semibold">99.99%</span>
                </div>
                <div className="flex gap-1 h-3">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="flex-1 bg-emerald-500 rounded-sm" title="Operational (100% response)" />
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-200">Express API Gateway (Port 4006)</span>
                  <span className="text-emerald-400 font-semibold">100.0%</span>
                </div>
                <div className="flex gap-1 h-3">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="flex-1 bg-emerald-500 rounded-sm" />
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-200">PostgreSQL Relational DB Engine</span>
                  <span className="text-emerald-400 font-semibold">99.98%</span>
                </div>
                <div className="flex gap-1 h-3">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="flex-1 bg-emerald-500 rounded-sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'changelog':
        return (
          <div className="space-y-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('changelog')}</h1>
            <p className="text-xs text-slate-500 mt-1">Track updates, features, and fixes pushed to the FlowSuite workspace.</p>

            <div className="relative border-l border-slate-800 pl-6 space-y-12">
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-purple-600 rounded-full border-4 border-slate-950" />
                <h3 className="font-extrabold text-white text-lg">v2.0.0 — FlowSuite Core Update</h3>
                <span className="text-[10px] text-purple-400 font-semibold">August 18, 2026</span>
                <ul className="text-xs text-slate-400 list-disc list-inside mt-3 space-y-2 leading-relaxed">
                  <li>Upgraded landing page layout with full theme toggles and language selects.</li>
                  <li>Integrated full 15 social network channel partner SVGs inside landing layout.</li>
                  <li>Setup modular Postgres database models to host organization profiles.</li>
                </ul>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-slate-800 rounded-full border-4 border-slate-950" />
                <h3 className="font-extrabold text-white text-lg">v1.9.0 — Performance Reductions</h3>
                <span className="text-[10px] text-slate-500 font-semibold">August 05, 2026</span>
                <ul className="text-xs text-slate-500 list-disc list-inside mt-3 space-y-2 leading-relaxed">
                  <li>Optimized Next.js bundle compression payloads to boost index performance.</li>
                  <li>Migrated client side authentication contexts to use JWT cookie verification layers.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        // Render general Legal/Compliance Page format
        const policyTitle = slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        return (
          <div className="space-y-8 max-w-4xl mx-auto bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 p-8 rounded-3xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">{policyTitle}</h1>
                  <p className="text-slate-500 text-[10px]">Last Updated: August 18, 2026 | Enterprise SLA Secure</p>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl transition border border-slate-700 self-start"
              >
                <Printer className="w-3.5 h-3.5" /> Print Policy
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">1. Service Level Standard & Security Compliance</h2>
                <p>
                  FlowSuite maintains compliance with global data processing regulations (GDPR, CCPA, HIPAA rules) utilizing secure AES-256 data encryption at rest and TLS 1.3 in transit. Access tokens for Meta and WhatsApp platforms are strictly compartmentalized and restricted to the designated tenant workspace.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">2. Acceptable Platform Engagement Rules</h2>
                <p>
                  Organizations using FlowSuite to dispatch campaigns, WhatsApp status updates, or social broadcasts must respect anti-spam directives. Any automated bot activities on Meta, Threads, or X APIs must comply with respective channel platform partner rules to protect user engagement boundaries.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">3. System Availability & Credits Wallet</h2>
                <p>
                  Free trial accounts receive 500 AI credits. Refunding balance wallets is governed under the platform billing agreement terms. System outages, status checks, and credit auditing are verified dynamically through the SuperAdmin Gateway services.
                </p>
              </section>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white pb-16">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-base shadow-md group-hover:scale-105 transition-transform">
              FS
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">FlowSuite</span>
              <span className="text-[10px] text-slate-500 block">Workspace platform</span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Dynamic Content Container */}
      <main className="max-w-7xl mx-auto px-6 pt-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
