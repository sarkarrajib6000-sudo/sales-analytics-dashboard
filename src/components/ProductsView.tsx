import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, TrendingUp, TrendingDown, DollarSign, Award, ChevronDown } from 'lucide-react';

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

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="text-indigo-600 dark:text-indigo-400" size={28} />
            Products Analysis
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Deep-dive into individual product margins, underperforming items, and total volume metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sort Matrix:</span>
          <select 
            value={sortKey} 
            onChange={(e) => setSortKey(e.target.value as any)}
            className="text-xs bg-transparent font-medium border-none focus:outline-none dark:text-slate-200 cursor-pointer text-slate-700 dark:text-slate-300"
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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={18} />
              Top Performing Products
            </h3>
            <p className="text-xs text-slate-400">Ranked by your selected sort matrix</p>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {topProducts.slice(0, 5).map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                    #{i + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{prod.name}</h4>
                    <p className="text-xs text-slate-400">{prod.units} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {sortKey === 'revenue' && `$${prod.revenue.toLocaleString()}`}
                    {sortKey === 'profit' && `$${prod.profit.toLocaleString()}`}
                    {sortKey === 'units' && `${prod.units.toLocaleString()} units`}
                  </span>
                  <p className="text-[10px] text-slate-400">contribution</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Products */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingDown className="text-rose-500" size={18} />
              Bottom Performing Products
            </h3>
            <p className="text-xs text-slate-400">Identify underperforming inventory needing promotion</p>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {bottomProducts.slice(0, 5).map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 flex items-center justify-center text-xs font-bold">
                    #{i + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{prod.name}</h4>
                    <p className="text-xs text-slate-400">{prod.units} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {sortKey === 'revenue' && `$${prod.revenue.toLocaleString()}`}
                    {sortKey === 'profit' && `$${prod.profit.toLocaleString()}`}
                    {sortKey === 'units' && `${prod.units.toLocaleString()} units`}
                  </span>
                  <p className="text-[10px] text-slate-400">contribution</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Distribution Chart of ALL products */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-indigo-500" size={18} />
              Full Product Inventory Metrics
            </h3>
            <p className="text-xs text-slate-400 font-medium">Comparison across all items currently stored in the database registry</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts} margin={{ bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => sortKey === 'units' ? val : `$${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(val) => [sortKey === 'units' ? val : `$${Number(val).toLocaleString()}`, sortKey.toUpperCase()]}
              />
              <Bar dataKey={sortKey} fill="#4f46e5" radius={[4, 4, 0, 0]}>
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
