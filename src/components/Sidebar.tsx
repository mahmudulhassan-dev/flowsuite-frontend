'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, MessageSquare, Bot, FolderOpen, Send, Users, Wallet, Settings, Sun, Moon, Globe } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Social Publisher', href: '/publisher', icon: Calendar },
    { name: 'Omnichannel Inbox', href: '/inbox', icon: MessageSquare },
    { name: 'AI Agent Studio', href: '/ai-studio', icon: Bot },
    { name: 'Asset Manager', href: '/assets', icon: FolderOpen },
    { name: 'Marketing Suite', href: '/marketing', icon: Send },
    { name: 'CRM & Contacts', href: '/crm', icon: Users },
    { name: 'Billing & Wallet', href: '/billing', icon: Wallet },
    { name: 'Platform Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between p-4 min-h-screen sticky top-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
            FS
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-sm">FlowSuite</h1>
            <p className="text-[10px] text-slate-400 font-medium">Omnichannel AI SaaS</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-800 text-xs text-slate-300">
          <button className="flex items-center gap-1.5 hover:text-white transition">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Light
          </button>
          <button className="flex items-center gap-1.5 hover:text-white transition">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> RTL
          </button>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            FS
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">Admin Workspace</h4>
            <p className="text-[10px] text-slate-400 truncate">Pro Agency Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
