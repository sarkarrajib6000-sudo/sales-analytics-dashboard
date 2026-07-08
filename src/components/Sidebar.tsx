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
    { 
      name: 'Dashboard', 
      id: 'dashboard', 
      icon: LayoutDashboard,
      activeClass: "bg-indigo-500/10 dark:bg-indigo-500/5 text-indigo-650 dark:text-indigo-400",
      iconClass: "bg-indigo-100 dark:bg-indigo-950/40 border-indigo-200/20 dark:border-indigo-800/20 text-indigo-600 dark:text-indigo-400",
      indicatorClass: "bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_10px_#6366f1]"
    },
    { 
      name: 'Revenue', 
      id: 'revenue', 
      icon: BarChart3,
      activeClass: "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-650 dark:text-emerald-400",
      iconClass: "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-200/20 dark:border-emerald-800/20 text-emerald-600 dark:text-emerald-400",
      indicatorClass: "bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_10px_#10b981]"
    },
    { 
      name: 'Profit', 
      id: 'profit', 
      icon: Percent,
      activeClass: "bg-fuchsia-500/10 dark:bg-fuchsia-500/5 text-fuchsia-650 dark:text-fuchsia-400",
      iconClass: "bg-fuchsia-100 dark:bg-fuchsia-955/40 border-fuchsia-200/20 dark:border-fuchsia-800/20 text-fuchsia-600 dark:text-fuchsia-400",
      indicatorClass: "bg-fuchsia-600 dark:bg-fuchsia-400 shadow-[0_0_10px_#d946ef]"
    },
    { 
      name: 'Products', 
      id: 'product', 
      icon: Package,
      activeClass: "bg-rose-500/10 dark:bg-rose-500/5 text-rose-650 dark:text-rose-450",
      iconClass: "bg-rose-100 dark:bg-rose-955/40 border-rose-200/20 dark:border-rose-800/20 text-rose-600 dark:text-rose-400",
      indicatorClass: "bg-rose-600 dark:bg-rose-400 shadow-[0_0_10px_#f43f5e]"
    },
    { 
      name: 'Orders', 
      id: 'orders', 
      icon: ShoppingCart,
      activeClass: "bg-amber-500/10 dark:bg-amber-500/5 text-amber-650 dark:text-amber-450",
      iconClass: "bg-amber-100 dark:bg-amber-950/40 border-amber-200/20 dark:border-amber-800/20 text-amber-600 dark:text-amber-400",
      indicatorClass: "bg-amber-600 dark:bg-amber-400 shadow-[0_0_10px_#f59e0b]"
    },
    { 
      name: 'Customers', 
      id: 'customers', 
      icon: Users,
      activeClass: "bg-sky-500/10 dark:bg-sky-500/5 text-sky-655 dark:text-sky-400",
      iconClass: "bg-sky-100 dark:bg-sky-950/40 border-sky-200/20 dark:border-sky-800/20 text-sky-600 dark:text-sky-400",
      indicatorClass: "bg-sky-600 dark:bg-sky-400 shadow-[0_0_10px_#0ea5e9]"
    },
    { 
      name: 'AI Forecast', 
      id: 'predictions', 
      icon: Brain,
      activeClass: "bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-650 dark:text-cyan-405",
      iconClass: "bg-cyan-100 dark:bg-cyan-955/40 border-cyan-200/20 dark:border-cyan-800/20 text-cyan-600 dark:text-cyan-400",
      indicatorClass: "bg-cyan-600 dark:bg-cyan-400 shadow-[0_0_10px_#06b6d4]"
    },
    { 
      name: 'Settings', 
      id: 'settings', 
      icon: Settings,
      activeClass: "bg-purple-500/10 dark:bg-purple-500/5 text-purple-650 dark:text-purple-400",
      iconClass: "bg-purple-100 dark:bg-purple-950/40 border-purple-200/20 dark:border-purple-800/20 text-purple-600 dark:text-purple-400",
      indicatorClass: "bg-purple-600 dark:bg-purple-400 shadow-[0_0_10px_#a855f7]"
    },
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
                "flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-250 cursor-pointer relative group text-sm font-medium hover:scale-[1.01] hover:-translate-y-[0.5px] border border-transparent",
                isActive 
                  ? `${item.activeClass} font-black shadow-xs border-slate-200/10 dark:border-slate-800/20`
                  : "text-slate-500 dark:text-slate-450 hover:text-slate-850 dark:hover:text-slate-100 hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
              )}
            >
              {/* Left Edge Indicator Pill */}
              {isActive && (
                <div className={cn("absolute left-0 w-1 h-6 rounded-r-full top-1/2 -translate-y-1/2", item.indicatorClass)} />
              )}

              {/* Tiled Icon Container */}
              <div className={cn(
                "p-2 rounded-xl border transition-all duration-200 flex items-center justify-center",
                isActive
                  ? item.iconClass
                  : "bg-slate-50 dark:bg-slate-800/30 border-slate-200/10 dark:border-slate-800/10 text-slate-400 dark:text-slate-500 group-hover:bg-slate-100 dark:group-hover:bg-slate-850/60 group-hover:text-slate-700 dark:group-hover:text-slate-205"
              )}>
                <item.icon size={16} />
              </div>
              
              {!collapsed && (
                <span className="ml-3 tracking-wide">{item.name}</span>
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


