import React from 'react';
import './globals.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export const metadata = {
  title: 'FlowSuite — Omnichannel AI Social Media Automation & Unified Inbox Platform',
  description: '100% Strict TypeScript SaaS platform for omnichannel social publishing, AI agents, unified inbox & local billing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="p-6 flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
