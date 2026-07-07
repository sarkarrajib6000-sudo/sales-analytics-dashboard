import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, TrendingUp, TrendingDown, DollarSign, Award, ChevronDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-205/10 dark:border-slate-800 backdrop-blur-md p-3 px-3.5 rounded-xl shadow-xl text-left text-xs">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1 first:mt-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="font-semibold text-slate-350 capitalize">{entry.name}:</span>
            <span className="font-black text-white">
              {formatter ? formatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ProductsView() {
  const [sortKey, setSortKey] = useState<'revenue' | 'profit' | 'units'>('revenue');
  const [products, setProducts] = useState(dbService.getProducts());

  const refreshDBState = () => {
    setProducts(dbService.getProducts());
  };

  useEffect(() => {
    refreshDBState();
    window.addEventListener('sales_db_update', refreshDBState);
    return () => window.removeEventListener('sales_db_update', refreshDBState);
  }, []);

  // Top Products (Sorted descending)
  const topProducts = [...products].sort((a, b) => b[sortKey] - a[sortKey]);

  // Bottom Products (Sorted ascending)
  const bottomProducts = [...products].sort((a, b) => a[sortKey] - b[sortKey]);

  const formatTooltipVal = (val: any) => {
    if (sortKey === 'units') return `${Number(val).toLocaleString()} units`;
    return `$${Number(val).toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Package className="text-indigo-650 dark:text-indigo-400" size={26} />
            Products Analysis
          </h2>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">Deep-dive into individual product margins, underperforming items, and total volume metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 px-3.5 rounded-xl border border-slate-205/65 dark:border-slate-800/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Sort Matrix:</span>
          <select 
            value={sortKey} 
            onChange={(e) => setSortKey(e.target.value as any)}
            className="text-xs bg-transparent font-bold border-none focus:outline-none dark:text-slate-200 cursor-pointer text-slate-705 dark:text-slate-350"
          >
            <option value="revenue" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Revenue</option>
            <option value="profit" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Net Profit</option>
            <option value="units" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">Units Sold</option>
          </select>
        </div>
      </div>

      {/* Top vs Bottom Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Products */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={17} />
              Top Performing Products
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Ranked by your selected sort matrix</p>
          </div>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {topProducts.slice(0, 5).map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/15 border border-emerald-100/40 dark:border-emerald-900/20 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-6.5 h-6.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-305 flex items-center justify-center text-[10px] font-black">
                    #{i + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-850 dark:text-slate-205">{prod.name}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{prod.units} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {sortKey === 'revenue' && `$${prod.revenue.toLocaleString()}`}
                    {sortKey === 'profit' && `$${prod.profit.toLocaleString()}`}
                    {sortKey === 'units' && `${prod.units.toLocaleString()} units`}
                  </span>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Contribution</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Products */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingDown className="text-rose-500" size={17} />
              Bottom Performing Products
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Identify underperforming inventory needing promotion</p>
          </div>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {bottomProducts.slice(0, 5).map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-rose-500/5 dark:bg-rose-950/15 border border-rose-100/40 dark:border-rose-900/20 hover:bg-rose-500/10 dark:hover:bg-rose-950/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-6.5 h-6.5 rounded-lg bg-rose-105 dark:bg-rose-955/50 text-rose-700 dark:text-rose-350 flex items-center justify-center text-[10px] font-black">
                    #{i + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-855 dark:text-slate-205">{prod.name}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-505 mt-0.5 font-medium">{prod.units} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {sortKey === 'revenue' && `$${prod.revenue.toLocaleString()}`}
                    {sortKey === 'profit' && `$${prod.profit.toLocaleString()}`}
                    {sortKey === 'units' && `${prod.units.toLocaleString()} units`}
                  </span>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Contribution</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Distribution Chart of ALL products */}
      <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-indigo-500" size={17} />
              Full Product Inventory Metrics
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Comparison across all items currently stored in the database registry</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts} margin={{ bottom: 15 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => sortKey === 'units' ? val : `$${val/1000}k`} />
              <Tooltip content={<CustomTooltip formatter={formatTooltipVal} />} />
              <Bar dataKey={sortKey} fill="#4f46e5" radius={[4, 4, 0, 0]} name={sortKey.toUpperCase()}>
                {topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? '#4f46e5' : '#818cf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

