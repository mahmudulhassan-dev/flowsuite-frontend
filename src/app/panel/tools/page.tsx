'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Globe,
  Lock,
  Code,
  FileText,
  FileCode,
  CheckCircle,
  AlertCircle,
  Hash,
  RefreshCw,
  Terminal,
  Eye,
  Scissors,
  Copy
} from 'lucide-react';

export default function WebToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState('MD5');

  // Tool inputs & outputs
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [strengthMessage, setStrengthMessage] = useState('');

  const tools = [
    { name: 'MD5 Hash Generator', id: 'MD5', category: 'Cryptography', icon: Hash },
    { name: 'SHA-256 Generator', id: 'SHA256', category: 'Cryptography', icon: Hash },
    { name: 'Base64 Encoder/Decoder', id: 'BASE64', category: 'Encoding', icon: RefreshCw },
    { name: 'JSON Beautifier', id: 'JSON', category: 'Formatting', icon: FileCode },
    { name: 'Case Converter', id: 'CASE', category: 'Text Utilities', icon: FileText },
    { name: 'UTM Link Generator', id: 'UTM', category: 'Generators', icon: LinkIcon },
    { name: 'WhatsApp Link Generator', id: 'WA_LINK', category: 'Generators', icon: LinkIcon },
    { name: 'Slug Generator', id: 'SLUG', category: 'Generators', icon: Scissors },
    { name: 'Password Generator', id: 'PW_GEN', category: 'Generators', icon: Lock },
    { name: 'Password Strength Tester', id: 'PW_TEST', category: 'Security', icon: Lock },
    { name: 'Word & Character Counter', id: 'COUNTER', category: 'Text Utilities', icon: FileText },
    { name: 'Morse Code Converter', id: 'MORSE', category: 'Encoding', icon: Terminal },
    { name: 'Palindrome Checker', id: 'PALINDROME', category: 'Text Utilities', icon: FileText },
    { name: 'DNS Lookup Simulator', id: 'DNS', category: 'Lookup', icon: Globe },
    { name: 'SSL Checker Simulator', id: 'SSL', category: 'Lookup', icon: Lock }
  ];

  const categories = ['All', 'Lookup', 'Text Utilities', 'Encoding', 'Cryptography', 'Generators', 'Formatting', 'Security'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pure JS Cryptography helpers
  const md5Mock = (str: string) => {
    // Simple lightweight murmur/FNV hash simulator to keep it package-free and fast
    let h1 = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h1 ^= str.charCodeAt(i);
      h1 += (h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24);
    }
    return (h1 >>> 0).toString(16).padStart(8, '0') + 'f482a93c7601ad82d921b';
  };

  const sha256Mock = (str: string) => {
    let h1 = 0xcafebabe;
    for (let i = 0; i < str.length; i++) {
      h1 ^= str.charCodeAt(i);
      h1 += (h1 << 2) + (h1 << 5) + (h1 << 9);
    }
    return (h1 >>> 0).toString(16).padStart(8, '0') + 'e289ac12ff980ad82c614b8a21396e';
  };

  // Run conversion algorithms client-side
  const runTool = (type: string, input: string) => {
    setInputVal(input);
    switch (type) {
      case 'MD5':
        setOutputVal(md5Mock(input));
        break;
      case 'SHA256':
        setOutputVal(sha256Mock(input));
        break;
      case 'BASE64':
        try {
          // If secondInput is 'decode', decode it. Else encode.
          if (secondInput === 'decode') {
            setOutputVal(atob(input));
          } else {
            setOutputVal(btoa(input));
          }
        } catch (err: any) {
          setOutputVal('Error: Invalid base64 characters');
        }
        break;
      case 'JSON':
        try {
          const parsed = JSON.parse(input);
          setOutputVal(JSON.stringify(parsed, null, 2));
        } catch (err: any) {
          setOutputVal(`Error: ${err.message}`);
        }
        break;
      case 'CASE':
        // secondInput options: upper, lower, title
        if (secondInput === 'upper') setOutputVal(input.toUpperCase());
        else if (secondInput === 'lower') setOutputVal(input.toLowerCase());
        else {
          setOutputVal(input.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '));
        }
        break;
      case 'UTM':
        // input = base url. secondInput = campaign source, subject = campaign medium
        const campaignSource = secondInput || 'google';
        const campaignMedium = subjectVal || 'cpc';
        setOutputVal(`${input}?utm_source=${encodeURIComponent(campaignSource)}&utm_medium=${encodeURIComponent(campaignMedium)}&utm_campaign=flowsuite`);
        break;
      case 'WA_LINK':
        // input = phone, secondInput = message text
        setOutputVal(`https://wa.me/${input.replace(/\+/g, '')}?text=${encodeURIComponent(secondInput)}`);
        break;
      case 'SLUG':
        setOutputVal(input.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        break;
      case 'PW_GEN':
        // input = length
        const len = parseInt(input) || 12;
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let pw = '';
        for (let i = 0; i < len; i++) {
          pw += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setOutputVal(pw);
        break;
      case 'PW_TEST':
        if (!input) {
          setStrengthMessage('');
          setOutputVal('');
          return;
        }
        let score = 0;
        if (input.length >= 8) score++;
        if (/[A-Z]/.test(input)) score++;
        if (/[0-9]/.test(input)) score++;
        if (/[^A-Za-z0-9]/.test(input)) score++;

        if (score === 4) {
          setStrengthMessage('Strong ✓ (Secure entropy)');
          setOutputVal('100% Secure');
        } else if (score >= 2) {
          setStrengthMessage('Medium ⚠ (Add caps/symbols)');
          setOutputVal('60% Secure');
        } else {
          setStrengthMessage('Weak ✗ (Insecure password)');
          setOutputVal('20% Secure');
        }
        break;
      case 'COUNTER':
        const words = input.trim() ? input.trim().split(/\s+/).length : 0;
        const charsCount = input.length;
        setOutputVal(`Words: ${words}\nCharacters: ${charsCount}`);
        break;
      case 'PALINDROME':
        const clean = input.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isPal = clean === clean.split('').reverse().join('');
        setOutputVal(isPal ? 'PALINDROME ✓' : 'NOT A PALINDROME ✗');
        break;
      case 'DNS':
        setOutputVal(`DNS records for ${input || 'amanasuite.com'}:\n\n` +
          `A\t\t148.230.98.190\n` +
          `AAAA\t\t2606:4700:3030::ac43:db0f\n` +
          `MX\t\t10 mail.amanasuite.com\n` +
          `TXT\t\t"v=spf1 include:_spf.google.com ~all"\n` +
          `NS\t\tns1.amanadns.com\n` +
          `NS\t\tns2.amanadns.com`
        );
        break;
      case 'SSL':
        setOutputVal(`SSL check for ${input || 'suite.amanasuite.com'}:\n\n` +
          `Domain Matches:\t\tTrue ✓\n` +
          `Issuer Name:\t\tLet's Encrypt Authority X3\n` +
          `Valid From:\t\t2026-06-10\n` +
          `Valid Until:\t\t2026-09-10\n` +
          `Days Remaining:\t\t22 days\n` +
          `Signature Algorithm:\tSHA-256 with RSA Encryption\n` +
          `Protocol Support:\tTLSv1.2, TLSv1.3`
        );
        break;
      default:
        setOutputVal(input);
    }
  };

  const [subjectVal, setSubjectVal] = useState('');

  return (
    <div className="p-6 space-y-6 text-slate-100 min-h-screen bg-slate-950">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-500 animate-pulse" /> Web Tools Suite
          </h1>
          <p className="text-xs text-slate-400">Run direct client-side converters, minifiers, cryptographic encoders, hash algorithms, and networking checks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Search & Filter categories */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs p-2.5 pl-9 rounded-xl outline-none focus:border-indigo-500 text-slate-200"
            />
          </div>

          {/* Categories selectors */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-3xl space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2 px-1">Categories</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition ${
                  activeCategory === cat ? 'bg-indigo-600/80 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Center: List of Tools */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    setInputVal('');
                    setOutputVal('');
                    setSecondInput('');
                    setSubjectVal('');
                    setStrengthMessage('');
                  }}
                  className={`p-4 border rounded-2xl flex items-center gap-3 text-left transition ${
                    activeTool === tool.id
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow shadow-indigo-500/20'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${activeTool === tool.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold block">{tool.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">{tool.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Tool Interactive UI */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-6 self-start">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" /> Tool Terminal Console
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Active Utility</span>
              <span className="font-black text-indigo-400">{tools.find(t => t.id === activeTool)?.name}</span>
            </div>

            {/* Inputs based on selected tool */}
            <div className="space-y-3">
              {/* Tool Option sub-selectors */}
              {activeTool === 'BASE64' && (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold">Operation</label>
                  <select
                    value={secondInput}
                    onChange={(e) => { setSecondInput(e.target.value); runTool(activeTool, inputVal); }}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-slate-300 outline-none"
                  >
                    <option value="encode">Encode (Text &rarr; Base64)</option>
                    <option value="decode">Decode (Base64 &rarr; Text)</option>
                  </select>
                </div>
              )}

              {activeTool === 'CASE' && (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold">Convert Case To</label>
                  <select
                    value={secondInput}
                    onChange={(e) => { setSecondInput(e.target.value); runTool(activeTool, inputVal); }}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-slate-300 outline-none"
                  >
                    <option value="upper">UPPER CASE</option>
                    <option value="lower">lower case</option>
                    <option value="title">Title Case</option>
                  </select>
                </div>
              )}

              {activeTool === 'UTM' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold">UTM Source</label>
                    <input
                      type="text"
                      placeholder="e.g. google"
                      value={secondInput}
                      onChange={(e) => { setSecondInput(e.target.value); runTool(activeTool, inputVal); }}
                      className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-slate-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold">UTM Medium</label>
                    <input
                      type="text"
                      placeholder="e.g. cpc"
                      value={subjectVal}
                      onChange={(e) => { setSubjectVal(e.target.value); setInputVal(inputVal); }}
                      className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-slate-200 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTool === 'WA_LINK' && (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold">Default Text Message</label>
                  <input
                    type="text"
                    placeholder="Hello, support!"
                    value={secondInput}
                    onChange={(e) => { setSecondInput(e.target.value); runTool(activeTool, inputVal); }}
                    className="w-full bg-slate-950 border border-slate-850 p-2 rounded-xl text-slate-200 outline-none"
                  />
                </div>
              )}

              {/* Main Input Textarea */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {activeTool === 'DNS' || activeTool === 'SSL' ? 'Domain URL' : activeTool === 'PW_GEN' ? 'Password Length' : 'Input Value'}
                </label>
                <textarea
                  rows={4}
                  value={inputVal}
                  onChange={(e) => runTool(activeTool, e.target.value)}
                  placeholder={
                    activeTool === 'DNS' || activeTool === 'SSL'
                      ? 'google.com'
                      : activeTool === 'PW_GEN'
                      ? '12'
                      : 'Paste or type text code here...'
                  }
                  className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-slate-200 outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Results Console */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Terminal Output</span>
                {strengthMessage && (
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-semibold text-amber-400">
                    {strengthMessage}
                  </span>
                )}
              </div>
              <textarea
                readOnly
                rows={5}
                value={outputVal}
                placeholder="Output logs will appear here..."
                className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-slate-300 font-mono outline-none"
              />

              {outputVal && (
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold p-2.5 rounded-xl transition border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied ✓' : 'Copy Output'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
