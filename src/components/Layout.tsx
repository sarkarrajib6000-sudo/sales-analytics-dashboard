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
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header onExport={onExport} filterText={filterText} onFilterChange={onFilterChange} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
