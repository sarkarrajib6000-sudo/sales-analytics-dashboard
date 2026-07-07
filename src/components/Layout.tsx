import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onExport: () => void;
  filterText: string;
  onFilterChange: (text: string) => void;
}

export function Layout({ children, activeTab, onTabChange, onExport, filterText, onFilterChange }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
      {/* Ambient background gradients for glassmorphism layout */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-pink-500/5 dark:bg-pink-500/10 blur-[150px] pointer-events-none" />

      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Header onExport={onExport} filterText={filterText} onFilterChange={onFilterChange} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}

