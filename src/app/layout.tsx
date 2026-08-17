import React from 'react';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';

export const metadata = {
  title: 'FlowSuite — Omnichannel AI Social Media Automation & Unified Inbox Platform',
  description: '100% Strict TypeScript SaaS platform for omnichannel social publishing, AI agents, unified inbox & local billing.',
};

// Root layout — NO Sidebar/Header here. 
// Landing page (/) is clean. /panel has its own layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

