import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ComposedChart
} from 'recharts';
import { dbService } from '../lib/dbService';
import { TrendingUp, Percent, DollarSign, Award, Calendar, Layers, ShieldCheck, Filter } from 'lucide-react';

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

export function ProfitView() {
  const [currentFilter, setCurrentFilter] = useState(dbService.getDateRange());
  const [profitTimeGrouping, setProfitTimeGrouping] = useState<'year' | 'month'>('year');
  const [sales, setSales] = useState(dbService.getSales());
  const [yearly, setYearly] = useState(dbService.getYearly());
  const [category, setCategory] = useState(dbService.getCategory());
  const [products, setProducts] = useState(dbService.getProducts());

  const refreshDBState = () => {
    setCurrentFilter(dbService.getDateRange());
    setSales(dbService.getSales());
    setYearly(dbService.getYearly());
    setCategory(dbService.getCategory());
    setProducts(dbService.getProducts());
  };

  useEffect(() => {
    refreshDBState();
    window.addEventListener('sales_db_update', refreshDBState);
    return () => window.removeEventListener('sales_db_update', refreshDBState);
  }, []);

  // Compute active filters for the slicers
  const activeYear = currentFilter.type === 'all' ? 'All' : currentFilter.year || 'All';
  const activeMonth = currentFilter.type === 'month' ? currentFilter.month || 'All' : 'All';

  const handleSlicerChange = (year: string, month: string) => {
    if (year === 'All' && month === 'All') {
      dbService.setDateRange({ type: 'all' });
    } else if (month === 'All') {
      dbService.setDateRange({ type: 'year', year });
    } else {
      const targetYear = year === 'All' ? '2025' : year;
      dbService.setDateRange({ type: 'month', year: targetYear, month });
    }
  };

  // Sorting products by profit to find Top Profitable Products
  const sortedProfitableProducts = [...products]
    .sort((a, b) => b.profit - a.profit);

  // Profit Margin calculations for category composed charts
  const categoryWithMargins = category.map(cat => ({
    ...cat,
    marginPercentage: cat.revenue ? parseFloat(((cat.profit / cat.revenue) * 100).toFixed(1)) : 30.0
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in text-slate-800 dark:text-slate-100 text-left">
      {/* Main Analysis Column */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <TrendingUp className="text-emerald-650 dark:text-emerald-400" size={26} />
              Profit Analysis
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">Deep dive into profitability performance, margin efficiency, and top money-makers.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 px-3.5 rounded-xl border border-slate-205/65 dark:border-slate-800/80 shadow-xs">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Year:</span>
            <select 
              value={activeYear} 
              onChange={(e) => handleSlicerChange(e.target.value, activeMonth)}
              className="text-xs bg-transparent font-bold border-none focus:outline-none dark:text-slate-200 cursor-pointer text-slate-700 dark:text-slate-300"
            >
              <option value="All" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">All Years</option>
              <option value="2026" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">2026</option>
              <option value="2025" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">2025</option>
              <option value="2024" className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">2024</option>
            </select>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Profit by Year */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="text-emerald-500" size={17} />
                {profitTimeGrouping === 'year' ? 'Profit by Year' : 'Profit by Month'}
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">
                {profitTimeGrouping === 'year' ? 'Growth trajectory of annual net earnings' : 'Monthly trend breakdown of net profitability'}
              </p>
            </div>

            {/* Toggle Switch Button Group */}
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
              <button
                onClick={() => setProfitTimeGrouping('year')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  profitTimeGrouping === 'year'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-750 dark:text-slate-400'
                }`}
              >
                Year
              </button>
              <button
                onClick={() => setProfitTimeGrouping('month')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  profitTimeGrouping === 'month'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-750 dark:text-slate-400'
                }`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {profitTimeGrouping === 'year' ? (
                <BarChart data={yearly} margin={{ left: -15, right: 10 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                  <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} name="Net Profit" />
                </BarChart>
              ) : (
                <BarChart data={sales} margin={{ left: -15, right: 10 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                  <Bar dataKey="profit" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={25} name="Net Profit" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Profit by Category */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="text-indigo-500" size={17} />
              Profit by Category
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Profit contribution across product divisions</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={category} margin={{ left: -15, right: 10 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                <Bar dataKey="profit" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Profit Margin % */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Percent className="text-purple-500" size={17} />
              Profit Margin (Category Efficiency)
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Net margin percentage per product category</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categoryWithMargins} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `${val}%`} />
                <Tooltip content={<CustomTooltip formatter={(val: any) => `${val}%`} />} />
                <Line type="monotone" dataKey="marginPercentage" stroke="#a855f7" strokeWidth={3.5} activeDot={{ r: 7 }} name="Margin" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Profit by Product */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="text-sky-500" size={17} />
              Profit by Product
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Profit contribution of individual products</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={products.slice(0, 5)} layout="vertical" margin={{ left: 15, right: 10 }}>
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={85} />
                <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                <Bar dataKey="profit" fill="#06b6d4" radius={[0, 6, 6, 0]} maxBarSize={25} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5 & 6. Top Profitable Products */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-amber-500" size={17} />
              Top Profitable Products & Efficiency Rank
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Individual products ranked by high gross profit contribution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3.5">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-2">High Margin Winners</h4>
              {sortedProfitableProducts.slice(0, 3).map((prod, i) => {
                const margin = prod.revenue ? ((prod.profit / prod.revenue) * 100).toFixed(1) : '35.0';
                return (
                  <div key={i} className="p-3.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100/50 dark:border-slate-850/55 hover:border-slate-200/50 dark:hover:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-805/30 transition-all flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">{prod.name}</h5>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-405 mt-0.5 font-bold">Margin: {margin}%</p>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">${prod.profit.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-505 uppercase tracking-wider mb-2.5">Total Profit Value Contribution</h4>
              <div className="h-[145px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedProfitableProducts.slice(0, 4)} margin={{ left: -10, right: 10 }}>
                    <XAxis dataKey="name" tick={false} axisLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                    <Bar dataKey="profit" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        </div>

      </div>

      {/* Slicer Sidebar on the Right */}
      <div className="w-full lg:w-[240px] shrink-0">
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-5 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm space-y-5 sticky top-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-150 dark:border-slate-800">
            <Filter size={14} className="text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450">Interactive Slicers</h4>
          </div>

          {/* Year Slicer */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-550 block">Year Filter</span>
            <div className="flex flex-wrap gap-1.5">
              {['All', '2026', '2025', '2024'].map(yr => {
                const isSelected = activeYear === yr;
                return (
                  <button
                    key={yr}
                    onClick={() => handleSlicerChange(yr, activeMonth)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month Slicer */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-550 block">Month Filter</span>
            <div className="grid grid-cols-3 gap-1.5">
              {['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => {
                const isSelected = activeMonth === m;
                const isFuture2026 = activeYear === '2026' && m !== 'All' && ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(m);
                return (
                  <button
                    key={m}
                    disabled={isFuture2026}
                    onClick={() => handleSlicerChange(activeYear, m)}
                    className={`text-[10px] font-semibold py-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isFuture2026
                        ? 'opacity-30 cursor-not-allowed border-transparent bg-transparent text-slate-300 dark:text-slate-700'
                        : isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Selected range:</span>
            <span className="font-bold text-emerald-605 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              {activeYear === 'All' && activeMonth === 'All' ? 'All Time' : activeMonth === 'All' ? activeYear : `${activeMonth} ${activeYear}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

