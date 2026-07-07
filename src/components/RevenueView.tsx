import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { dbService } from '../lib/dbService';
import { Coins, Filter, DollarSign, Calendar, Tag, Package, MapPin, Globe, Share2, TrendingUp } from 'lucide-react';

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

export function RevenueView({ salesData: monthlyDataProps }: { salesData?: any[] }) {
  const [currentFilter, setCurrentFilter] = useState(dbService.getDateRange());
  const [revenueTimeGrouping, setRevenueTimeGrouping] = useState<'year' | 'month'>('year');

  // Relational Database reactive state hook
  const [sales, setSales] = useState(dbService.getSales());
  const [yearly, setYearly] = useState(dbService.getYearly());
  const [category, setCategory] = useState(dbService.getCategory());
  const [products, setProducts] = useState(dbService.getProducts());
  const [countries, setCountries] = useState(dbService.getCountries());
  const [regions, setRegions] = useState(dbService.getRegions());
  const [channels, setChannels] = useState(dbService.getChannels());

  const refreshDBState = () => {
    setCurrentFilter(dbService.getDateRange());
    setSales(dbService.getSales());
    setYearly(dbService.getYearly());
    setCategory(dbService.getCategory());
    setProducts(dbService.getProducts());
    setCountries(dbService.getCountries());
    setRegions(dbService.getRegions());
    setChannels(dbService.getChannels());
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
  
  // Custom colors for charts
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in text-slate-800 dark:text-slate-100 text-left">
      {/* Main Analysis Column */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Coins className="text-indigo-650 dark:text-indigo-400" size={26} />
              Revenue Analysis
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">Comprehensive view of business cashflows across time, channels, categories, products, and geographies.</p>
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

        {/* 0. Revenue & Profit Overlapping Monthly Trend */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-indigo-500" size={17} />
                Monthly Revenue & Profit Overlap Trend
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Overlapping area visualization tracking revenue flow against net earnings</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-indigo-500/20 border-2 border-indigo-600" />
                <span className="text-slate-655 dark:text-slate-350">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500/20 border-2 border-emerald-500" />
                <span className="text-slate-655 dark:text-slate-350">Profit</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="revenue" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" name="profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Revenue by Year */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="text-indigo-500" size={17} />
                {revenueTimeGrouping === 'year' ? 'Revenue by Year' : 'Revenue by Month'}
              </h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">
                {revenueTimeGrouping === 'year' ? 'Comparison of year-over-year revenue progress' : 'Monthly trend breakdown of sales performance'}
              </p>
            </div>
            
            {/* Toggle Switch Button Group */}
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
              <button
                onClick={() => setRevenueTimeGrouping('year')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  revenueTimeGrouping === 'year'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                Year
              </button>
              <button
                onClick={() => setRevenueTimeGrouping('month')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  revenueTimeGrouping === 'month'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                Month
              </button>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {revenueTimeGrouping === 'year' ? (
                <BarChart data={yearly} margin={{ left: -15, right: 10 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={50} name="Revenue" />
                </BarChart>
              ) : (
                <BarChart data={sales} margin={{ left: -15, right: 10 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={25} name="Revenue" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Revenue by Category */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="text-emerald-500" size={17} />
              Revenue by Category
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Performance split across top product categories</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={category} layout="vertical" margin={{ left: 15, right: 10 }}>
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={85} />
                <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 6, 6, 0]} maxBarSize={25} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Revenue by Product */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="text-purple-500" size={17} />
              Revenue by Product
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Total cashflow contributions by individual items</p>
          </div>
          <div className="h-[260px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {products.slice(0, 5).map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/50 dark:border-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-200/50 dark:hover:border-slate-700/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650 dark:text-indigo-400 font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{product.name}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{product.units} Units Sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">${product.revenue.toLocaleString()}</span>
                  <div className="w-24 bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-indigo-550 h-full rounded-full" 
                      style={{ width: `${products[0] && products[0].revenue ? (product.revenue / products[0].revenue) * 100 : 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Revenue by Country */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="text-sky-500" size={17} />
              Revenue by Country
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Global revenue share and contribution</p>
          </div>
          <div className="h-[260px] w-full flex flex-col justify-center space-y-4">
            {countries.map((country, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-705 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400">{country.code}</span>
                    <span>{country.country}</span>
                  </div>
                  <span>${country.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-sky-500" 
                    style={{ width: `${countries[0] && countries[0].revenue ? (country.revenue / countries[0].revenue) * 100 : 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Revenue by Region */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="text-rose-500" size={17} />
              Revenue by Region
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Consolidated revenue by world zones</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} margin={{ left: -15, right: 10 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                <Bar dataKey="revenue" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={40} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Revenue by Channel */}
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="text-amber-500" size={17} />
              Revenue by Channel
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Inbound sales channel proportion</p>
          </div>
          <div className="h-[260px] w-full flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="w-[180px] h-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channels}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {channels.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip label="Inbound Channel" formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4 md:mt-0 max-w-xs w-full text-xs">
              {channels.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/50 dark:border-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-805/30 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-655 dark:text-slate-350">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        </div>

      </div>

      {/* Slicer Sidebar on the Right */}
      <div className="w-full lg:w-[240px] shrink-0">
        <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-5 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm space-y-5 sticky top-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-150 dark:border-slate-800">
            <Filter size={14} className="text-indigo-650 dark:text-indigo-400" />
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
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold'
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
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold'
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
            <span className="font-bold text-indigo-605 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
              {activeYear === 'All' && activeMonth === 'All' ? 'All Time' : activeMonth === 'All' ? activeYear : `${activeMonth} ${activeYear}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
