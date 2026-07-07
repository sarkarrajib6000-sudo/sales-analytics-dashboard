import React, { useState, useEffect } from 'react';
import { KpiCard } from './KpiCard';
import { PivotTable } from './PivotTable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dbService } from '../lib/dbService';
import { TrendingUp, BarChart3, Wallet, ShoppingBag } from 'lucide-react';

interface DashboardViewProps {
  orders: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-205/10 dark:border-slate-800 backdrop-blur-md p-3.5 rounded-xl shadow-xl text-left">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-xs font-semibold text-slate-300">Revenue:</span>
          <span className="text-sm font-black text-white">${Number(payload[0].value).toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function DashboardView({ orders }: DashboardViewProps) {
  const [kpis, setKpis] = useState(dbService.getKPIs());
  const [sales, setSales] = useState(dbService.getSales());

  useEffect(() => {
    const handleUpdate = () => {
      setKpis(dbService.getKPIs());
      setSales(dbService.getSales());
    };
    window.addEventListener('sales_db_update', handleUpdate);
    return () => window.removeEventListener('sales_db_update', handleUpdate);
  }, []);

  // Map icons to the KPI cards dynamically
  const getIcon = (title: string) => {
    switch (title) {
      case 'Total Revenue':
        return <BarChart3 className="text-indigo-600 dark:text-indigo-400 stroke-[2.5]" size={18} />;
      case 'Total Profit':
        return <TrendingUp className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" size={18} />;
      case 'Profit Margin':
        return <Wallet className="text-purple-600 dark:text-purple-400 stroke-[2.5]" size={18} />;
      default:
        return <ShoppingBag className="text-blue-600 dark:text-blue-400 stroke-[2.5]" size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h2>
        <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">High-level view of your business performance, trends, and revenue metrics.</p>
      </div>

      {/* KPIs Section */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-805 dark:text-slate-205 flex items-center gap-2">
          <span className="w-1 h-5 bg-indigo-650 rounded-full inline-block"></span>
          Key Performance Indicators (KPIs)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <KpiCard key={idx_safe_i(i, kpi.title)} title={kpi.title} value={kpi.value} change={kpi.change} icon={getIcon(kpi.title)} />
          ))}
        </div>
      </div>

      {/* Revenue Trend Section */}
      <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-805 dark:text-slate-205 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-indigo-650 rounded-full inline-block"></span>
          Revenue Trend (Monthly)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Section */}
      <div>
        <PivotTable orders={orders} />
      </div>
    </div>
  );
}

function idx_safe_i(i: number, title: string) {
  return `${title}-${i}`;
}


