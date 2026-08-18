'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  MessageSquare,
  Calendar,
  Users,
  Send,
  ArrowRight,
  Globe,
  Play,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  FileText,
  Lock,
  DollarSign,
  Gift,
  Link2,
  QrCode,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { useThemeLang, Language } from '../lib/theme-lang-context';
import { motion, AnimatePresence } from 'framer-motion';

// Custom high-fidelity SVGs for top-level social platforms
const socialIcons = [
  {
    name: 'Facebook',
    color: 'from-blue-600 to-blue-800',
    glow: 'group-hover:shadow-blue-500/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    color: 'from-pink-500 via-red-500 to-yellow-500',
    glow: 'group-hover:shadow-pink-500/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    )
  },
  {
    name: 'WhatsApp',
    color: 'from-green-500 to-emerald-600',
    glow: 'group-hover:shadow-green-500/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.298 1.448 5.355 1.449 5.543 0 10.059-4.51 10.063-10.05.002-2.685-1.047-5.208-2.952-7.114S14.7 3.49 12.019 3.49C6.473 3.49 1.96 8 1.957 13.544c-.001 2.105.556 4.124 1.611 5.955L2.517 22l4.13-1.082z"/>
      </svg>
    )
  },
  {
    name: 'TikTok',
    color: 'from-black via-slate-900 to-cyan-500',
    glow: 'group-hover:shadow-cyan-500/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.59c.02 3.12-1.37 6.17-4.13 7.63-2.44 1.34-5.59 1.32-8.01-.06-2.58-1.45-3.99-4.47-3.66-7.42.3-2.62 2.14-5.06 4.74-5.79 1.34-.38 2.79-.27 4.07.31v4.09c-.89-.5-1.97-.66-2.96-.4-1.22.31-2.22 1.32-2.51 2.56-.41 1.71.55 3.63 2.18 4.21 1.52.56 3.41.05 4.33-1.25.32-.45.45-.98.45-1.53V.02z"/>
      </svg>
    )
  },
  {
    name: 'Twitter / X',
    color: 'from-slate-900 to-black',
    glow: 'group-hover:shadow-white/20',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    color: 'from-blue-700 to-blue-900',
    glow: 'group-hover:shadow-blue-600/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    name: 'YouTube',
    color: 'from-red-600 to-red-800',
    glow: 'group-hover:shadow-red-600/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.482 20.454 12 20.454 12 20.454s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    name: 'Telegram',
    color: 'from-sky-400 to-sky-600',
    glow: 'group-hover:shadow-sky-500/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 5.32 3.468 9.83 8.286 11.43.14.024.26-.01.32-.08.08-.09.08-.22.06-.35l-.47-3.19 5.89-3.97c1.37.93 3.12 1.48 4.96 1.48 5.34 0 9.68-4.34 9.68-9.68S18.736 2.27 13.4 2.27c-3.14 0-5.96 1.5-7.78 3.86a.2.2 0 0 0-.01.21.19.19 0 0 0 .18.1l2.42-.32c.7-.09 1.4.15 1.92.65l5.04 4.88c.34-.33.8-.52 1.3-.52a1.86 1.86 0 1 1-1.3 3.18l-5.06-4.9c-.31-.3-.72-.45-1.14-.45l-2.48.33C4.84 10.74 3.79 12.87 3.79 15.2c0 .28.02.56.05.83L6 22.95c.21.72.85 1.23 1.6 1.23a1.9 1.9 0 0 0 .36-.04c5.08-1.07 8.94-5.38 9.38-10.6.02-.19-.06-.38-.21-.49l-5.19-3.92V9.13z"/>
      </svg>
    )
  },
  {
    name: 'Reddit',
    color: 'from-orange-500 to-red-500',
    glow: 'group-hover:shadow-orange-500/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-5.99-1.72l1.24-3.91 3.99.85C17.9 5.8 18.7 6.5 19.5 6.5c1.1 0 2-1.1 2-2.5s-.9-2.5-2-2.5c-.76 0-1.43.53-1.8 1.28L13.5 1.8c-.18-.04-.38.05-.44.23l-1.5 4.74c-2.37.04-4.6.67-6.31 1.7-1.1-.73-2.07-1.17-3.08-1.17-1.65 0-3 1.35-3 3 0 1.13.63 2.12 1.56 2.62-.04.29-.06.58-.06.88 0 3.86 4.49 7 10 7s10-3.14 10-7c0-.3-.02-.59-.06-.88.94-.5 1.56-1.49 1.56-2.62zM6.5 12.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm10.74 3.76c-1.35 1.35-3.91 1.47-4.24 1.47-.33 0-2.89-.12-4.24-1.47-.18-.18-.18-.48 0-.66.18-.18.48-.18.66 0 1.09 1.09 3.12 1.17 3.58 1.17.46 0 2.49-.08 3.58-1.17.18-.18.48-.18.66 0 .18.18.18.48 0 .66zm-.24-1.76c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      </svg>
    )
  },
  {
    name: 'Threads',
    color: 'from-slate-900 to-neutral-900',
    glow: 'group-hover:shadow-neutral-400/20',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.318 15.65c-.538.563-1.168.852-1.892.868-.698.015-1.282-.23-1.751-.734-.055-.059-.109-.123-.162-.19-.887.896-1.92 1.351-3.097 1.365-1.164.014-2.12-.34-2.871-1.062-.734-.707-1.102-1.636-1.102-2.788 0-1.175.394-2.126 1.182-2.853.791-.726 1.792-1.077 3.003-1.054 1.258.024 2.29.479 3.098 1.366v-1.19h1.792v5.185c0 .736.216 1.264.647 1.586.326.244.731.332 1.215.263.633-.09 1.11-.478 1.433-1.162.24-.51.359-1.206.359-2.087v-2.023c0-3.328-2.228-5.753-5.719-5.753-3.666 0-5.918 2.502-5.918 6.136 0 3.738 2.296 6.177 5.955 6.177 1.634 0 3.048-.484 4.238-1.45l.983 1.293c-1.503 1.306-3.4 1.957-5.69 1.957-4.836 0-8.151-3.238-8.151-8.157 0-4.869 3.39-8.115 8.115-8.115 4.582 0 7.51 2.923 7.51 7.42v2.247c0 1.488-.239 2.65-.717 3.488-.517.904-1.309 1.411-2.378 1.521-.309.032-.619.034-.928.006zm-4.707-3.228c.55 0 1.011-.186 1.385-.558.375-.372.562-.84.562-1.403s-.188-1.026-.562-1.391c-.374-.365-.835-.547-1.385-.547-.565 0-1.029.182-1.393.547-.364.365-.546.828-.546 1.391s.182 1.031.546 1.403c.364.372.828.558 1.393.558z"/>
      </svg>
    )
  },
  {
    name: 'LinkedIn Company',
    color: 'from-sky-700 to-indigo-800',
    glow: 'group-hover:shadow-sky-600/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  {
    name: 'Pinterest',
    color: 'from-red-500 to-rose-600',
    glow: 'group-hover:shadow-red-500/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.168 1.777 2.168 2.128 0 3.768-2.245 3.768-5.487 0-2.868-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.138.89 2.738a.395.395 0 0 1 .09.371l-.337 1.378a.273.273 0 0 1-.38.163c-1.488-.694-2.422-2.872-2.422-4.618 0-3.763 2.735-7.22 7.879-7.22 4.14 0 7.355 2.95 7.355 6.892 0 4.116-2.586 7.43-6.183 7.43-1.206 0-2.343-.625-2.73-.1.362-1.378 1.406-5.957 1.406-5.957z"/>
      </svg>
    )
  },
  {
    name: 'Snapchat',
    color: 'from-yellow-400 to-yellow-500 text-black',
    glow: 'group-hover:shadow-yellow-400/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 0c-.82 0-1.63.07-2.43.2-1.49.25-2.94.8-4.18 1.6C4.16 2.62 3.2 3.65 2.53 4.9c-.67 1.25-.97 2.66-.89 4.08.09 1.63.67 3.19 1.66 4.49.17.22.36.43.57.62a8.65 8.65 0 0 0 1.83 1.23c.31.14.53.4.63.74l.02.06c.03.11.08.21.15.3l.03.04c.16.2.39.31.63.31.54 0 .97-.43.97-.97 0-.08-.01-.16-.03-.24l-.16-.76c-.05-.24-.03-.49.06-.72l.06-.14c.12-.27.34-.48.62-.57a7.84 7.84 0 0 1 2.21-.32c.76 0 1.51.1 2.22.3a1.9 1.9 0 0 0 .6.56l.06.14c.09.23.11.48.06.72l-.16.76c-.02.08-.03.16-.03.24 0 .54.43.97.97.97.24 0 .47-.11.63-.31l.03-.04c.07-.09.12-.19.15-.3l.02-.06c.1-.34.32-.6.63-.74a8.65 8.65 0 0 0 1.83-1.23c.21-.19.4-.4.57-.62a9.79 9.79 0 0 0 1.66-4.49c.08-1.42-.22-2.83-.89-4.08-.67-1.25-1.63-2.28-2.86-3.1a12.02 12.02 0 0 0-4.18-1.6A14.63 14.63 0 0 0 12 0zm.01 4.7c1.78 0 3.22 1.44 3.22 3.22 0 .48-.11.94-.3 1.35-.12.27-.3.51-.52.7a5.13 5.13 0 0 1-2.4 1.18c-.89.17-1.8.08-2.65-.24-.26-.1-.5-.24-.72-.42a4.42 4.42 0 0 1-1.35-2.57 3.22 3.22 0 0 1 3.22-3.22c.79 0 1.51.28 2.08.77.26-.2.43-.51.43-.87a1.1 1.1 0 0 0-2.2 0c0 .36.17.67.43.87-.57-.49-1.29-.77-2.08-.77zm0 10.3c1.78 0 3.22 1.44 3.22 3.22 0 .61-.17 1.18-.47 1.67-.3.49-.73.88-1.25 1.13-.5.25-1.07.38-1.65.38s-1.15-.13-1.65-.38a3.24 3.24 0 0 1-1.72-2.8c0-1.78 1.44-3.22 3.22-3.22z"/>
      </svg>
    )
  },
  {
    name: 'Google Business',
    color: 'from-blue-500 via-red-500 to-yellow-500',
    glow: 'group-hover:shadow-blue-500/30',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.95-3.24 3.51v2.9h5.1c2.98-2.75 4.7-6.8 4.7-11.64 0-.69-.06-1.35-.18-1.9H21.35zM12.18 21.05c2.61 0 4.8-.87 6.4-2.36l-5.1-2.9c-.87.58-1.98.93-3.1.93-2.4 0-4.43-1.62-5.16-3.8H.01v3.01c1.61 3.2 4.92 5.35 8.76 5.35h3.41zM2.87 12.92a7.17 7.17 0 0 1 0-4.04V5.87H.01a11.96 11.96 0 0 0 0 10.05l2.86-3zM12.18 5.75c1.42 0 2.7.49 3.7 1.44l2.77-2.77C16.98 2.8 14.8.95 12.18.95c-3.84 0-7.15 2.15-8.76 5.35l2.86 3c.73-2.18 2.76-3.8 5.16-3.8z"/>
      </svg>
    )
  },
  {
    name: 'Medium',
    color: 'from-slate-900 to-black',
    glow: 'group-hover:shadow-white/10',
    svg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 11.98 6.8 6.8 0 0 1 6.77 5.16 6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zM24 12c0 2.9-1.25 5.25-2.77 5.25-.66 0-1.24-.43-1.63-1.12v-8.2c.4-.73.98-1.18 1.63-1.18C22.75 6.75 24 9.1 24 12z"/>
      </svg>
    )
  }
];

export default function BusinessLandingPageClient() {
  const { lang, theme, setTheme, setLang, t } = useThemeLang();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white transition-colors duration-300">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300 flex-shrink-0" />
        <span className="truncate">{t('announcement')}</span>
        <Link href="/panel" className="underline font-bold hover:text-amber-200 ml-1 flex-shrink-0">
          {t('explore_panel')} &rarr;
        </Link>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 dark:bg-slate-950/80 light:bg-white/80 backdrop-blur-xl border-b border-slate-800 dark:border-slate-800 light:border-slate-200 px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo without Enterprise badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              FS
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                FlowSuite
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Omnichannel AI Social & Marketing Suite</p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/about" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
              {t('about')}
            </Link>
            <Link href="/contact" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
              {t('contact')}
            </Link>
            <Link href="/download" className="hover:text-purple-500 dark:hover:text-purple-400 font-bold text-purple-600 dark:text-purple-400 transition-colors">
              {t('download')}
            </Link>
            <Link href="/affiliate" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
              {t('affiliate_menu')}
            </Link>
            <Link href="/status" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
              {t('status')}
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>{languages.find(l => l.code === lang)?.name || 'Language'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 backdrop-blur-2xl max-h-60 overflow-y-auto"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-xs font-semibold transition ${
                          lang === l.code
                            ? 'bg-purple-600/80 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <span>{l.name}</span>
                        <span>{l.flag}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700 transition"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>

            {/* Launch App Button */}
            <Link
              href="/panel"
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-purple-600/25"
            >
              {t('launch_app')}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-2 flex flex-col"
            >
              <Link href="/about" className="px-4 py-2 hover:bg-slate-900 rounded-xl text-sm text-slate-300" onClick={() => setMobileMenuOpen(false)}>
                {t('about')}
              </Link>
              <Link href="/contact" className="px-4 py-2 hover:bg-slate-900 rounded-xl text-sm text-slate-300" onClick={() => setMobileMenuOpen(false)}>
                {t('contact')}
              </Link>
              <Link href="/download" className="px-4 py-2 hover:bg-slate-900 rounded-xl text-sm font-bold text-purple-400" onClick={() => setMobileMenuOpen(false)}>
                {t('download')}
              </Link>
              <Link href="/affiliate" className="px-4 py-2 hover:bg-slate-900 rounded-xl text-sm text-slate-300" onClick={() => setMobileMenuOpen(false)}>
                {t('affiliate_menu')}
              </Link>
              <Link href="/status" className="px-4 py-2 hover:bg-slate-900 rounded-xl text-sm text-slate-300" onClick={() => setMobileMenuOpen(false)}>
                {t('status')}
              </Link>
              <Link href="/panel" className="mx-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center font-bold rounded-xl text-xs shadow-md" onClick={() => setMobileMenuOpen(false)}>
                {t('launch_app')}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 dark:bg-purple-500/10 light:bg-purple-100 border border-purple-500/30 px-4 py-1.5 rounded-full text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            {t('hero_badge')}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            {t('hero_title')}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            {t('hero_desc')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/panel"
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:opacity-95 text-white text-base font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-purple-600/30 flex items-center gap-3 hover:scale-105"
            >
              {t('get_started')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-base font-semibold px-8 py-4 rounded-2xl transition-all flex items-center gap-3"
            >
              <Play className="w-4 h-4 text-purple-400" /> {t('view_demo')}
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-slate-900/60 border border-slate-800 dark:border-slate-800 light:border-slate-200 light:bg-slate-100/50 rounded-2xl">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{t('active_workspaces')}</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,482+</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 dark:border-slate-800 light:border-slate-200 light:bg-slate-100/50 rounded-2xl">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{t('uptime_sla')}</span>
              <p className="text-2xl font-black text-emerald-500 mt-1">99.99%</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 dark:border-slate-800 light:border-slate-200 light:bg-slate-100/50 rounded-2xl">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{t('ai_tokens')}</span>
              <p className="text-2xl font-black text-purple-500 mt-1">14.2M+</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 dark:border-slate-800 light:border-slate-200 light:bg-slate-100/50 rounded-2xl">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{t('social_channels')}</span>
              <p className="text-2xl font-black text-blue-500 mt-1">15 Channels</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Grid Section with Glow Cards */}
      <section className="py-16 px-6 bg-slate-900/10 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'bn' ? 'সাপোর্টেড সোশ্যাল মিডিয়া এপিআই পার্টনার্স' : 'Supported Social API Networks'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto">
              {lang === 'bn' 
                ? 'একটি একক ড্যাশবোর্ড থেকে বিশ্বের শীর্ষস্থানীয় ১৫+ প্ল্যাটফর্মে ক্যাপশনসহ মিডিয়া পোস্ট করুন।' 
                : 'Publish structured posts, status update notifications and auto-replies directly to over 15 social platforms.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {socialIcons.map((platform) => (
              <motion.div
                key={platform.name}
                whileHover={{ y: -5 }}
                className="group relative bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-100 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition shadow-md hover:border-purple-500/40 dark:hover:border-purple-400/40"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${platform.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                  {platform.svg}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{platform.name}</span>
                <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-100 px-2 py-0.5 rounded-full">
                  OFFICIAL API
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 px-6 bg-slate-900/40 dark:bg-slate-900/40 light:bg-slate-50/50 border-t border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('features_section_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto">
              {t('features_section_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 space-y-4 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('social_publisher')}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {lang === 'bn' 
                  ? 'ফেসবুক, ইনস্টাগ্রাম, ইউটিউব, লিঙ্কডইন সহ সব নেটওয়ার্কে পোস্ট শিডিউল করুন এক ড্রাগ অ্যান্ড ড্রপ ক্যালেন্ডার দিয়ে।' 
                  : 'Schedule and manage multi-account social publisher posts via drag-and-drop editorial calendar.'}
              </p>
              <Link href="/panel" className="text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-1 hover:underline">
                {t('social_publisher')} &rarr;
              </Link>
            </div>

            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 space-y-4 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('unified_inbox')}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {lang === 'bn'
                  ? 'সব সোশ্যাল পেজের মেসেজ, হোয়াটসঅ্যাপ চ্যাট এবং লাইভ চ্যাট উইজেট এর রিপ্লাই দিন একটি ইনবক্স থেকেই।'
                  : 'Combine WhatsApp, Instagram DMs, Facebook messages, and live web chat widgets into a single workspace inbox.'}
              </p>
              <Link href="/panel" className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
                {t('unified_inbox')} &rarr;
              </Link>
            </div>

            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 space-y-4 hover:border-amber-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('ai_agent_studio')}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {lang === 'bn'
                  ? 'এআই মডেল দিয়ে ক্যাপশন লিখুন, ইমেজ জেনারেট করুন এবং দিনরাত ২৪ ঘণ্টা কাস্টমার হ্যান্ডেল করার চ্যাটবট বানান।'
                  : 'Automate content creations, generation of model captions, voice calls, and customer Q&As using Gemini agents.'}
              </p>
              <Link href="/panel" className="text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1 hover:underline">
                {t('ai_agent_studio')} &rarr;
              </Link>
            </div>

            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 space-y-4 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'bn' ? 'স্মার্ট বায়োলিংক পেজ বিল্ডার' : 'Bio Links Landing Page Builder'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {lang === 'bn'
                  ? 'सहजেই মডুলার বায়োলিংক পেজ তৈরি করুন, মিডিয়া প্লেয়ার যুক্ত করুন এবং সোশ্যাল মিডিয়া ট্রাফিকের সঠিক অ্যানালিটিক্স ট্র্যাক করুন।'
                  : 'Design premium custom biolink pages with drag-and-drop links, video/music embeds, and real-time mobile preview.'}
              </p>
              <Link href="/panel" className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 hover:underline">
                {lang === 'bn' ? 'বায়োলিংক পেজ বিল্ডার' : 'Bio Links Builder'} &rarr;
              </Link>
            </div>

            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 space-y-4 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'bn' ? 'লিংক শর্টনার ও কিউআর জেনারেটর' : 'URL Shortener & QR Generator'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {lang === 'bn'
                  ? 'ব্র্যান্ডেড কাস্টম স্লাগ সহ লিংক সংক্ষেপ করুন এবং রঙ, কাস্টম লোগো ও গ্রেডিয়েন্ট সম্বলিত কিউআর কোড ডাউনলোড করুন।'
                  : 'Shorten target URLs with custom slugs and export beautiful high-fidelity QR codes with gradients.'}
              </p>
              <Link href="/panel" className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
                {lang === 'bn' ? 'লিংক শর্টনার ড্যাশবোর্ড' : 'URL Shortener'} &rarr;
              </Link>
            </div>

            <div className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 space-y-4 hover:border-indigo-500/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'bn' ? '১২০+ ওয়েব ডেভেলপার টুলস' : '120+ Web Developer Tools'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {lang === 'bn'
                  ? 'ডিএনএস, এসএসএল চেক, মোরস কনভার্টার, পাসওয়ার্ড স্ট্রেন্থ এবং মিনিফায়ার সহ সকল ডেভেলপার ইউটিলিটি এক জায়গায়।'
                  : 'Access a complete suite of network utility check tools, converters, minifiers, and cryptographic hash generators.'}
              </p>
              <Link href="/panel" className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 hover:underline">
                {lang === 'bn' ? 'ওয়েব টুলস ড্যাশবোর্ড' : 'Web Tools Suite'} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer without SuperAdmin link */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white">FS</div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">FlowSuite</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/about" className="hover:text-slate-700 dark:hover:text-white transition-colors">{t('about')}</Link>
            <Link href="/contact" className="hover:text-slate-700 dark:hover:text-white transition-colors">{t('contact')}</Link>
            <Link href="/download" className="hover:text-slate-700 dark:hover:text-white font-bold text-purple-500 transition-colors">{t('download')}</Link>
            <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-white transition-colors">{t('privacy_menu')}</Link>
            <Link href="/terms" className="hover:text-slate-700 dark:hover:text-white transition-colors">{t('terms_menu')}</Link>
            <Link href="/status" className="hover:text-slate-700 dark:hover:text-white transition-colors">{t('status')}</Link>
          </div>
          <p>{t('copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
