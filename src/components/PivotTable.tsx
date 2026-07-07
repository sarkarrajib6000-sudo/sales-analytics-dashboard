import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '../lib/utils';

export function PivotTable({ orders }: { orders: any[] }) {
  const [view, setView] = useState<'table' | 'card'>('table');
  // Simple pivot table logic: Aggregate revenue by customer and status
  const pivotData = orders.reduce((acc, order) => {
    const key = `${order.customer}-${order.status}`;
    if (!acc[key]) {
      acc[key] = { customer: order.customer, status: order.status, totalRevenue: 0 };
    }
    acc[key].totalRevenue += order.revenue;
    return acc;
  }, {} as Record<string, { customer: string; status: string; totalRevenue: number }>);

  const rows = Object.values(pivotData) as any[];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Shipped':
        return 'bg-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Processing':
        return 'bg-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-rose-500 text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500';
      case 'Shipped': return 'bg-blue-500';
      case 'Processing': return 'bg-amber-500';
      default: return 'bg-rose-500';
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-left">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Sales Pivot Analysis</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Cross-tabulation of accounts matched with order lifecycle states</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 shadow-inner border border-slate-200/30 dark:border-slate-700/35">
          <button 
            onClick={() => setView('table')} 
            className={cn("p-1.5 rounded-lg transition-all cursor-pointer", view === 'table' ? "bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-650")}
            title="List View"
          >
            <List size={15} />
          </button>
          <button 
            onClick={() => setView('card')} 
            className={cn("p-1.5 rounded-lg transition-all cursor-pointer", view === 'card' ? "bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-650")}
            title="Grid View"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>
      
      {view === 'table' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-150/60 dark:border-slate-800/80">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 dark:text-slate-450 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-black uppercase tracking-wider">
                <th className="py-3 px-4">Customer Account</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Aggregated Billing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150/40 dark:divide-slate-800/50 text-xs">
              {rows.map((row, i) => (
                <tr key={i} className="text-slate-700 dark:text-slate-250 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-black text-slate-805 dark:text-slate-200">{row.customer}</td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                      getStatusColor(row.status)
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full inline-block", getStatusDot(row.status))} />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white">${row.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map((row, i) => (
            <div key={i} className="p-4 border border-slate-200/70 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 hover:border-slate-350 dark:hover:border-slate-700 transition-all hover:shadow-xs text-left relative overflow-hidden group">
              <div className="flex justify-between items-start gap-2">
                <p className="font-extrabold text-slate-800 dark:text-white text-sm">{row.customer}</p>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider",
                  getStatusColor(row.status)
                )}>
                  {row.status}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/45 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue</span>
                <span className="text-sm font-black text-indigo-650 dark:text-indigo-400">${row.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

