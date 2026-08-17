'use client';

import React from 'react';
import PanelSidebar from '../../components/PanelSidebar';
import PanelHeader from '../../components/PanelHeader';
import { useAuth } from '../../lib/auth-context';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin" />
        <p className="text-slate-400 text-xs font-semibold tracking-wider">LOADING SECURE SESSION...</p>
      </div>
    );
  }

  // AuthContext handles redirect to /auth/login, but as fallback:
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <PanelSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PanelHeader />
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
