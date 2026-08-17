import React from 'react';
import PanelSidebar from '../../components/PanelSidebar';
import PanelHeader from '../../components/PanelHeader';

export const metadata = {
  title: 'FlowSuite Panel — User Control Center',
  description: 'FlowSuite User Application Control Panel — Social Publishing, AI Agents, Omnichannel Inbox, CRM & More.',
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
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
