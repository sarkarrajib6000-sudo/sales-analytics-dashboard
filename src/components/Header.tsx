import { Moon, Sun, Search, Bell, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DateRangePicker } from './DateRangePicker';

interface HeaderProps {
  onExport: () => void;
  filterText: string;
  onFilterChange: (text: string) => void;
}

export function Header({ onExport, filterText, onFilterChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/85 flex items-center justify-between px-8 z-10 shadow-xs">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-550 transition-colors" size={17} />
        <input 
          type="text" 
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Search by customer..." 
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-transparent focus:border-indigo-500/80 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
        />
      </div>
      
      {/* Controls & User Profile */}
      <div className="flex items-center gap-3.5">
        <DateRangePicker />
        
        {/* Export Button */}
        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 text-indigo-650 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 font-bold text-xs tracking-wide transition-all shadow-xs hover:shadow-sm cursor-pointer"
        >
          <Download size={14} className="stroke-[2.5]" />
          EXPORT CSV
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Theme Switcher */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl bg-slate-150/40 hover:bg-slate-200/70 dark:bg-slate-800/55 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 cursor-pointer shadow-xs"
          title="Toggle Theme"
        >
          {isDark ? <Sun size={17} className="animate-spin-slow" /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl bg-slate-150/40 hover:bg-slate-200/70 dark:bg-slate-800/55 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 cursor-pointer relative shadow-xs">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500 animate-pulse border border-white dark:border-slate-900" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 ml-1.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-550 to-purple-650 flex items-center justify-center text-white font-bold text-xs shadow-md border border-indigo-200 dark:border-indigo-900/50">
              RJ
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-black dark:text-white leading-tight">Rajib</span>
            <span className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

