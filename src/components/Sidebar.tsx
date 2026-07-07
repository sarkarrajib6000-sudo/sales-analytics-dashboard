import { LayoutDashboard, BarChart3, Users, Settings, ChevronLeft, ChevronRight, Package, ShoppingCart, Percent, Brain } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard, activeClass: "bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border-indigo-600" },
    { name: 'Revenue', id: 'revenue', icon: BarChart3, activeClass: "bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-600" },
    { name: 'Profit', id: 'profit', icon: Percent, activeClass: "bg-fuchsia-50/50 dark:bg-fuchsia-955/20 text-fuchsia-605 dark:text-fuchsia-400 border-fuchsia-600" },
    { name: 'Products', id: 'product', icon: Package, activeClass: "bg-rose-50/50 dark:bg-rose-955/20 text-rose-650 dark:text-rose-450 border-rose-600" },
    { name: 'Orders', id: 'orders', icon: ShoppingCart, activeClass: "bg-amber-50/50 dark:bg-amber-950/20 text-amber-650 dark:text-amber-450 border-amber-600" },
    { name: 'Customers', id: 'customers', icon: Users, activeClass: "bg-sky-50/50 dark:bg-sky-950/20 text-sky-655 dark:text-sky-400 border-sky-600" },
    { name: 'AI Forecast', id: 'predictions', icon: Brain, activeClass: "bg-cyan-50/50 dark:bg-cyan-955/20 text-cyan-650 dark:text-cyan-405 border-cyan-600" },
    { name: 'Settings', id: 'settings', icon: Settings, activeClass: "bg-purple-50/50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 border-purple-600" },
  ];

  return (
    <div className={cn(
      "h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 flex flex-col z-20 shadow-sm",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/85">
        {!collapsed && (
          <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center gap-1.5 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded bg-indigo-600 dark:bg-indigo-500 inline-block" />
            AeroSales
          </span>
        )}
        {collapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-white font-black text-xs">A</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1.5 rounded-lg border border-slate-250/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition-all duration-200 cursor-pointer shadow-sm"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-3 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.name} 
              onClick={() => onTabChange && onTabChange(item.id)}
              className={cn(
                "flex items-center w-full px-4 py-3 rounded-xl transition-all duration-205 cursor-pointer relative group text-sm font-medium",
                isActive 
                  ? `${item.activeClass} font-black border-l-4 shadow-xs`
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              )}
            >
              <item.icon size={18} className={cn("transition-transform group-hover:scale-105 duration-200", isActive ? "" : "text-slate-400 dark:text-slate-500")} />
              
              {!collapsed && (
                <span className="ml-3.5 tracking-wide">{item.name}</span>
              )}

              {/* Hover tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-16 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Decorative Card inside Sidebar when not collapsed */}
      {!collapsed && (
        <div className="p-4 m-4 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-150/40 dark:border-slate-800/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            V1.0 Operational
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Local client database is synchronized using LocalStorage.</p>
        </div>
      )}
    </div>
  );
}

