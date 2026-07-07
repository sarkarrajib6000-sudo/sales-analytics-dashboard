import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { dbService } from '../lib/dbService';
import { ShoppingCart, Calendar, AlertTriangle, Truck, Filter, RotateCcw } from 'lucide-react';

export function OrdersView({ orders: propOrders }: { orders?: any[] }) {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const [orders, setOrders] = useState(dbService.getOrders());
  const [sales, setSales] = useState(dbService.getSales());
  const [priorities, setPriorities] = useState(dbService.getPriorities());
  const [shipping, setShipping] = useState(dbService.getShipping());

  const refreshDBState = () => {
    setOrders(dbService.getOrders());
    setSales(dbService.getSales());
    setPriorities(dbService.getPriorities());
    setShipping(dbService.getShipping());
  };

  useEffect(() => {
    refreshDBState();
    window.addEventListener('sales_db_update', refreshDBState);
    return () => window.removeEventListener('sales_db_update', refreshDBState);
  }, []);

  // Filter individual orders based on selection and optional external prop search text
  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || order.priority === selectedPriority;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="text-indigo-600 dark:text-indigo-400" size={28} />
            Orders Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monitor order placement trends, shipping fulfillment states, and priority queues.</p>
        </div>
        
        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <Filter size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-500 dark:text-slate-400">Status:</span>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-medium border-none focus:outline-none dark:text-slate-200 cursor-pointer text-slate-700 dark:text-slate-300 font-bold"
            >
              <option value="All" className="dark:bg-slate-900">All Statuses</option>
              <option value="Delivered" className="dark:bg-slate-900">Delivered</option>
              <option value="Shipped" className="dark:bg-slate-900">Shipped</option>
              <option value="Processing" className="dark:bg-slate-900">Processing</option>
              <option value="Cancelled" className="dark:bg-slate-900">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <AlertTriangle size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-500 dark:text-slate-400">Priority:</span>
            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent font-medium border-none focus:outline-none dark:text-slate-200 cursor-pointer text-slate-700 dark:text-slate-300 font-bold"
            >
              <option value="All" className="dark:bg-slate-900">All Priorities</option>
              <option value="Critical" className="dark:bg-slate-900">Critical</option>
              <option value="High" className="dark:bg-slate-900">High</option>
              <option value="Medium" className="dark:bg-slate-900">Medium</option>
              <option value="Low" className="dark:bg-slate-900">Low</option>
            </select>
          </div>

          {(selectedStatus !== 'All' || selectedPriority !== 'All') && (
            <button 
              onClick={() => { setSelectedStatus('All'); setSelectedPriority('All'); }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Orders by Month */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="text-indigo-500" size={18} />
              Orders by Month
            </h3>
            <p className="text-xs text-slate-400">Order frequency growth across the calendar year</p>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales} margin={{ left: -25, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [`${val} Orders`, 'Volume']}
                />
                <Line type="monotone" dataKey="orders" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Order Priority Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={18} />
              Order Priority Split
            </h3>
            <p className="text-xs text-slate-400">Severity split of current processing backlog</p>
          </div>
          <div className="h-[240px] w-full flex flex-col items-center justify-center">
            <div className="w-[140px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorities}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `${val} Orders`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4">
              {priorities.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Shipping Status Block */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="text-emerald-500" size={18} />
              Shipping Status Track
            </h3>
            <p className="text-xs text-slate-400">Consolidated delivery fulfillment success metrics</p>
          </div>
          <div className="h-[240px] flex flex-col justify-center space-y-4">
            {shipping.map((status, i) => {
              const maxVal = Math.max(...shipping.map(o => o.value)) || 1;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{status.name}</span>
                    <span>{status.value.toLocaleString()} units</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(status.value / maxVal) * 100}%`,
                        backgroundColor: status.color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* High Fidelity Filtered Order Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Fulfillment Ledger</h3>
            <p className="text-xs text-slate-400">Individual record logs of customer sales receipts</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full">
            {filteredOrders.length} records found
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-center">Priority</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">{order.id}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">{order.customer}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-medium">{order.date}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        order.priority === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' :
                        order.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400' :
                        order.priority === 'Medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      }`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' :
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-semibold text-slate-900 dark:text-white">${order.revenue.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No orders matching the current filter options.
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
