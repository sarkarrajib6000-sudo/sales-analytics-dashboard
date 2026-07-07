import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, ShoppingBag, Award, Search, Filter, ArrowUpDown } from 'lucide-react';

export function CustomersView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [sortBy, setSortBy] = useState<'revenue' | 'orders'>('revenue');

  const [customers, setCustomers] = useState(dbService.getCustomers());

  const refreshDBState = () => {
    setCustomers(dbService.getCustomers());
  };

  useEffect(() => {
    refreshDBState();
    window.addEventListener('sales_db_update', refreshDBState);
    return () => window.removeEventListener('sales_db_update', refreshDBState);
  }, []);

  // Filter and sort the complete customer list
  const filteredCustomers = customers
    .filter(cust => {
      const matchesSearch = cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cust.segment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSegment = selectedSegment === 'All' || cust.segment === selectedSegment;
      return matchesSearch && matchesSegment;
    })
    .sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Users className="text-indigo-600 dark:text-indigo-400" size={28} />
          Customer Insights
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track key corporate accounts, purchase frequencies, and overall account cashflow profiles.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Customer Revenue Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="text-emerald-500" size={18} />
              Customer Revenue
            </h3>
            <p className="text-xs text-slate-400">Cumulative billing contribution per account</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customers} layout="vertical" margin={{ left: 15, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={110} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[0, 6, 6, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Customer Orders Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="text-indigo-500" size={18} />
              Customer Orders (Frequency)
            </h3>
            <p className="text-xs text-slate-400">Total number of finalized order transactions</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customers} margin={{ left: -15, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [`${val} orders`, 'Orders']}
                />
                <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Comprehensive Customers Ledger with Search, Filter & Sort */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Award className="text-amber-500" size={20} />
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">All Customers List</h3>
                <p className="text-xs text-slate-400 font-medium">Interactive account directory with multi-field searching and filters</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full self-start md:self-center">
              {filteredCustomers.length} Accounts Listed
            </span>
          </div>

          {/* Search, Filter, Sort Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search by name or segment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>

            {/* Segment Selector */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-sm">
              <Filter size={15} className="text-slate-400 dark:text-slate-500" />
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Segment:</span>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="bg-transparent font-semibold border-none focus:outline-none text-slate-800 dark:text-slate-100 cursor-pointer text-xs"
              >
                <option value="All" className="dark:bg-slate-900 text-slate-850 dark:text-slate-100">All Segments</option>
                <option value="Enterprise" className="dark:bg-slate-900 text-slate-850 dark:text-slate-100">Enterprise</option>
                <option value="Mid-Market" className="dark:bg-slate-900 text-slate-850 dark:text-slate-100">Mid-Market</option>
                <option value="SMB" className="dark:bg-slate-900 text-slate-850 dark:text-slate-100">SMB</option>
              </select>
            </div>

            {/* Sort Matrix */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-sm">
              <ArrowUpDown size={15} className="text-slate-400 dark:text-slate-500" />
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'revenue' | 'orders')}
                className="bg-transparent font-semibold border-none focus:outline-none text-slate-800 dark:text-slate-100 cursor-pointer text-xs"
              >
                <option value="revenue" className="dark:bg-slate-900 text-slate-850 dark:text-slate-100">Revenue Contribution</option>
                <option value="orders" className="dark:bg-slate-900 text-slate-850 dark:text-slate-100">Orders Placed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Listing Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Market Segment</th>
                <th className="py-4 px-6 text-right">Orders Count</th>
                <th className="py-4 px-6 text-right">Revenue Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-400 dark:text-slate-500 font-mono">
                      #{i + 1}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                      {cust.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        cust.segment === 'Enterprise' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' :
                        cust.segment === 'Mid-Market' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}>
                        {cust.segment}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-medium text-slate-600 dark:text-slate-400">
                      {cust.orders}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      ${cust.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No customers match the active query or filter selections.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
