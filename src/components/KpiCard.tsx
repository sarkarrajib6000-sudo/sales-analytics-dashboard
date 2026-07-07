import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from "../lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  icon?: React.ReactNode;
  key?: React.Key;
}

export function KpiCard({ title, value, change, icon }: KpiCardProps) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className={cn(
      "relative bg-white/80 dark:bg-slate-900/75 backdrop-blur-md p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden group flex flex-col justify-between"
    )}>
      {/* Decorative colored glow on top */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[3px] transition-all duration-350",
        isPositive ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-rose-450 to-pink-550"
      )} />

      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{title}</span>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div className={cn(
            "p-3 rounded-xl transition-colors duration-300",
            isPositive 
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/40" 
              : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-950/40"
          )}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
        <span className={cn(
          "text-xs font-black flex items-center gap-1 px-2.5 py-1 rounded-lg",
          isPositive 
            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" 
            : "text-rose-605 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20"
        )}>
          {isPositive ? <ArrowUp size={12} className="stroke-[3]" /> : <ArrowDown size={12} className="stroke-[3]" />}
          {change}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">vs last month</span>
      </div>
      
      {/* Decorative background glow on hover */}
      <div className={cn(
        "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity pointer-events-none duration-300",
        isPositive ? "bg-emerald-450" : "bg-rose-450"
      )} />
    </div>
  );
}

