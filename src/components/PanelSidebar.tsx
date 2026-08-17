'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calendar, MessageSquare, Bot,
  FolderOpen, Send, Users, Wallet, Settings,
  Globe, ChevronLeft, ChevronRight, DollarSign, Gift, FileText, Lock
} from 'lucide-react';

export default function PanelSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/panel', icon: LayoutDashboard, color: 'text-blue-400' },
    { name: 'Social Publisher', href: '/panel/publisher', icon: Calendar, color: 'text-purple-400' },
    { name: 'Unified Inbox', href: '/panel/inbox', icon: MessageSquare, color: 'text-blue-400' },
    { name: 'AI Agent Studio', href: '/panel/ai-studio', icon: Bot, color: 'text-amber-400' },
    { name: 'Asset Manager', href: '/panel/assets', icon: FolderOpen, color: 'text-indigo-400' },
    { name: 'Marketing Suite', href: '/panel/marketing', icon: Send, color: 'text-blue-400' },
    { name: 'CRM & Contacts', href: '/panel/crm', icon: Users, color: 'text-purple-400' },
    { name: 'Billing & Wallet', href: '/panel/billing', icon: Wallet, color: 'text-amber-400' },
    { name: 'Settings', href: '/panel/settings', icon: Settings, color: 'text-slate-400' },
    { name: 'Affiliate', href: '/affiliate', icon: DollarSign, color: 'text-emerald-400' },
    { name: 'Rewards', href: '/rewards', icon: Gift, color: 'text-pink-400' },
    { name: 'Privacy Policy', href: '/privacy', icon: Lock, color: 'text-slate-400' },
    { name: 'Terms & SLA', href: '/terms', icon: FileText, color: 'text-slate-400' },
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between p-3 min-h-screen sticky top-0 transition-all duration-300 ease-in-out z-30`}>
      <div className="space-y-5">
        {/* Logo */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-purple-500/30 flex-shrink-0">
            FS
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-white tracking-wide text-sm">FlowSuite</h1>
              <p className="text-[10px] text-slate-400 font-medium">Omnichannel AI SaaS</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600/80 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : item.color}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl p-2 transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> <span>Collapse</span></>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
              U
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">Agency Workspace</h4>
              <p className="text-[10px] text-slate-400 truncate">Pro Agency Plan</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
