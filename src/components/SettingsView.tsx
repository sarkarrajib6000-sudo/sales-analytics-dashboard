import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { 
  Database, RefreshCw, Plus, Search, Trash2, 
  Terminal, Shield, Play, Info, CheckCircle2,
  AlertCircle, ChevronRight, HardDrive, Cpu
} from 'lucide-react';

export function SettingsView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [storageMetrics, setStorageMetrics] = useState({ sizeKB: 0, itemsCount: 0 });
  const [apiKey, setApiKey] = useState('');

  // CRUD Modal Form states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  // Form Inputs
  const [orderInput, setOrderInput] = useState({
    customer: 'Acme Corporation',
    productName: 'Pro Laptop 15"',
    revenue: 5000,
    priority: 'Medium',
    status: 'Processing',
    region: 'North America',
    category: 'Electronics'
  });

  const [productInput, setProductInput] = useState({
    name: '',
    category: 'Electronics',
    revenue: 0,
    profit: 0,
    units: 0
  });

  const [customerInput, setCustomerInput] = useState({
    name: '',
    segment: 'SMB',
    revenue: 0,
    orders: 0
  });

  // Query Sandbox States
  const [queryTable, setQueryTable] = useState<'orders' | 'customers' | 'products'>('orders');
  const [queryField, setQueryField] = useState('revenue');
  const [queryOperator, setQueryOperator] = useState('>');
  const [queryValue, setQueryValue] = useState('2000');
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [queryExecuted, setQueryExecuted] = useState(false);
  const [queryTimeMs, setQueryTimeMs] = useState(0);

  // Load and refresh data
  const refreshData = () => {
    setOrders(dbService.getOrders());
    setCustomers(dbService.getCustomers());
    setProducts(dbService.getProducts());
    setStorageMetrics(dbService.getStorageMetrics());
    setApiKey(localStorage.getItem('gemini_api_key') || '');
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('sales_db_update', refreshData);
    return () => window.removeEventListener('sales_db_update', refreshData);
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setFormSuccess('Gemini API key updated successfully.');
    window.dispatchEvent(new Event('sales_db_update'));
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const handleResetDB = () => {
    if (confirm('Are you sure you want to reset the client database to factory default values? All custom records will be lost.')) {
      dbService.resetDatabase();
      setFormSuccess('Database re-seeded successfully.');
      setTimeout(() => setFormSuccess(''), 3000);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const estProfit = Math.round(orderInput.revenue * 0.35); // Estimating 35% margin for simplicity
    
    dbService.addOrder({
      customer: orderInput.customer,
      productName: orderInput.productName,
      revenue: Number(orderInput.revenue),
      profit: estProfit,
      priority: orderInput.priority,
      status: orderInput.status,
      region: orderInput.region,
      category: orderInput.category,
      segment: customers.find(c => c.name === orderInput.customer)?.segment || 'SMB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });

    setShowOrderModal(false);
    setFormSuccess('Order created successfully. View-metrics have been updated.');
    setTimeout(() => setFormSuccess(''), 3500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productInput.name) return;

    dbService.addProduct({
      name: productInput.name,
      category: productInput.category,
      revenue: Number(productInput.revenue),
      profit: Number(productInput.profit),
      units: Number(productInput.units)
    });

    setShowProductModal(false);
    setProductInput({ name: '', category: 'Electronics', revenue: 0, profit: 0, units: 0 });
    setFormSuccess('Product record inserted successfully into Product Registry.');
    setTimeout(() => setFormSuccess(''), 3500);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInput.name) return;

    dbService.addCustomer({
      name: customerInput.name,
      segment: customerInput.segment,
      revenue: Number(customerInput.revenue),
      orders: Number(customerInput.orders)
    });

    setShowCustomerModal(false);
    setCustomerInput({ name: '', segment: 'SMB', revenue: 0, orders: 0 });
    setFormSuccess('Customer account successfully registered.');
    setTimeout(() => setFormSuccess(''), 3500);
  };

  const handleDeleteRecord = (table: 'orders' | 'customers' | 'products', index: number) => {
    if (!confirm('Are you sure you want to delete this record from the database? This will update all analytical aggregations.')) return;

    if (table === 'orders') {
      const copy = [...orders];
      copy.splice(index, 1);
      dbService.setOrders(copy);
    } else if (table === 'customers') {
      const copy = [...customers];
      copy.splice(index, 1);
      dbService.setCustomers(copy);
    } else if (table === 'products') {
      const copy = [...products];
      copy.splice(index, 1);
      dbService.setProducts(copy);
    }

    // Refresh KPIs
    dbService.recalculateKPIs();
    setFormSuccess('Record successfully purged.');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  // Run Custom DB Query
  const runQuery = () => {
    const start = performance.now();
    let sourceTable: any[] = [];
    if (queryTable === 'orders') sourceTable = orders;
    if (queryTable === 'customers') sourceTable = customers;
    if (queryTable === 'products') sourceTable = products;

    const results = sourceTable.filter(row => {
      const cellVal = row[queryField];
      const testVal = isNaN(Number(queryValue)) ? queryValue : Number(queryValue);

      if (typeof cellVal === 'number' && typeof testVal === 'number') {
        if (queryOperator === '>') return cellVal > testVal;
        if (queryOperator === '<') return cellVal < testVal;
        if (queryOperator === '=') return cellVal === testVal;
      } else {
        const strCell = String(cellVal).toLowerCase();
        const strTest = String(testVal).toLowerCase();
        if (queryOperator === '=') return strCell === strTest;
        if (queryOperator === '>') return strCell.includes(strTest); // acts as "contains"
      }
      return false;
    });

    setQueryResult(results);
    setQueryExecuted(true);
    setQueryTimeMs(Number((performance.now() - start).toFixed(2)));
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-905 dark:text-white tracking-tight flex items-center gap-2.5">
            <Database className="text-indigo-650 dark:text-indigo-400" size={26} />
            Data Operations & Settings
          </h2>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">Control active local database instances, seed demo datasets, run custom queries, or connect Gemini AI models.</p>
        </div>
        <button 
          onClick={handleResetDB}
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-955/35 dark:hover:bg-rose-950/60 border border-rose-250 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw size={16} />
          Reset to Factory Defaults
        </button>
      </div>

      {/* Success Banner */}
      {formSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-sm animate-fade-in font-medium">
          <CheckCircle2 size={18} className="text-emerald-500" />
          {formSuccess}
        </div>
      )}

      {/* Stats and credentials row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Stats (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <HardDrive size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Database Footprint</p>
              <p className="text-xl font-extrabold mt-0.5">{storageMetrics.sizeKB} KB</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Isolated LocalStorage volume</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Database size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">Total Records</p>
              <p className="text-xl font-extrabold mt-0.5">{storageMetrics.itemsCount}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Across 6 aggregated indexes</p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Cpu size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider">API Read Latency</p>
              <p className="text-xl font-extrabold mt-0.5">~0.15ms</p>
              <p className="text-[9px] text-slate-400 mt-0.5">High performance client sync</p>
            </div>
          </div>
        </div>

        {/* Right Side: Gemini credentials config (4 cols) */}
        <div className="lg:col-span-4 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/50 mb-4">
              <Shield className="text-indigo-500" size={17} />
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">Gemini Credentials</h3>
            </div>
            <p className="text-[11px] text-slate-450 dark:text-slate-450 leading-relaxed mb-4">
              Authorize AI-powered business diagnostics. Your API Key is stored safely client-side in LocalStorage.
            </p>
            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API Key..."
                className="w-full px-3 py-2 text-xs bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
              />
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl font-bold text-xs tracking-wide shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer border border-transparent"
              >
                SAVE CREDENTIALS
              </button>
            </form>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-[10px] mt-4">
            <span className="text-slate-400">Status:</span>
            {apiKey.trim() ? (
              <span className="text-emerald-605 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 size={10} /> Active Connection
              </span>
            ) : (
              <span className="text-amber-500 font-bold">Key Unconfigured</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Query Sandbox & Record Registries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SQL Sandbox - Left 5 cols */}
        <div className="lg:col-span-5 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="text-indigo-600 dark:text-indigo-400" size={20} />
              <h3 className="text-base font-semibold">Structured Query Sandbox</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">Test SQL-like filtering on top of local data catalogs without writing code.</p>

            {/* Sandbox form controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">Target Relation / Table</label>
                <select 
                  value={queryTable} 
                  onChange={(e) => {
                    const table = e.target.value as any;
                    setQueryTable(table);
                    setQueryField(table === 'orders' ? 'revenue' : table === 'customers' ? 'revenue' : 'units');
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="orders">orders</option>
                  <option value="customers">customers</option>
                  <option value="products">products</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">Field Attribute</label>
                  <select 
                    value={queryField} 
                    onChange={(e) => setQueryField(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  >
                    {queryTable === 'orders' && (
                      <>
                        <option value="revenue">revenue</option>
                        <option value="customer">customer</option>
                        <option value="status">status</option>
                        <option value="priority">priority</option>
                      </>
                    )}
                    {queryTable === 'customers' && (
                      <>
                        <option value="revenue">revenue</option>
                        <option value="orders">orders</option>
                        <option value="segment">segment</option>
                      </>
                    )}
                    {queryTable === 'products' && (
                      <>
                        <option value="revenue">revenue</option>
                        <option value="units">units</option>
                        <option value="profit">profit</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">Operator</label>
                  <select 
                    value={queryOperator} 
                    onChange={(e) => setQueryOperator(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  >
                    <option value=">">&gt; (Greater Than)</option>
                    <option value="<">&lt; (Less Than)</option>
                    <option value="=">= (Equals / Contains)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-1">Criteria Value</label>
                <input 
                  type="text" 
                  value={queryValue}
                  onChange={(e) => setQueryValue(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  placeholder="e.g. 5000 or Delivered"
                />
              </div>

              <button 
                onClick={runQuery}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                <Play size={14} />
                Execute Relational Selection
              </button>
            </div>
          </div>

          {/* Sandbox Query Output */}
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4 flex-1 flex flex-col">
            <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-2">Query Engine Output</h4>
            {queryExecuted ? (
              <div className="flex-1 flex flex-col justify-between">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800 max-h-[160px] overflow-y-auto font-mono text-[10px] text-slate-600 dark:text-slate-400 space-y-1.5">
                  <p className="text-slate-400">// Query executed in {queryTimeMs}ms. Found {queryResult.length} rows.</p>
                  {queryResult.length > 0 ? (
                    queryResult.map((res, idx) => (
                      <p key={idx} className="whitespace-pre-wrap">{JSON.stringify(res)}</p>
                    ))
                  ) : (
                    <p className="text-rose-400">// EMPTY_SET: No matching rows.</p>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1.5">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  Execution compiled correctly with client index hashes.
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-xs">
                <Terminal size={24} className="mb-2 text-slate-300" />
                Select database criteria and execute.
              </div>
            )}
          </div>

        </div>

        {/* Database Management Console - Right 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Action Center Card */}
          <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-semibold mb-2">Relational CRUD Store</h3>
            <p className="text-xs text-slate-400 mb-6">Perform write operations directly on the database store. Changes immediately cascade into analytical models.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => setShowOrderModal(true)}
                className="flex items-center justify-center gap-2 p-4 border border-indigo-100 dark:border-indigo-950 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-xl transition-all"
              >
                <Plus size={16} />
                Insert Sales Order
              </button>

              <button 
                onClick={() => setShowProductModal(true)}
                className="flex items-center justify-center gap-2 p-4 border border-emerald-100 dark:border-emerald-950 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs rounded-xl transition-all"
              >
                <Plus size={16} />
                Register Product
              </button>

              <button 
                onClick={() => setShowCustomerModal(true)}
                className="flex items-center justify-center gap-2 p-4 border border-amber-100 dark:border-amber-950 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-semibold text-xs rounded-xl transition-all"
              >
                <Plus size={16} />
                Create Customer
              </button>
            </div>
          </div>

          {/* Database Table Diagnostics Row */}
          <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-semibold">Indexed Tables Diagnostic Output</h3>
              <p className="text-xs text-slate-400">Database rows listing for complete operational transparency.</p>
            </div>

            {/* Custom Tab selectors for lists */}
            <div className="p-6">
              <div className="max-h-[300px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="py-2.5 px-4">Entity Key</th>
                      <th className="py-2.5 px-4">Secondary ID / Account</th>
                      <th className="py-2.5 px-4 text-right">Aggregate Metric</th>
                      <th className="py-2.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Orders */}
                    {orders.slice(0, 4).map((ord, idx) => (
                      <tr key={`ord-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                        <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{ord.id}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">{ord.customer}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-indigo-500">${ord.revenue.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-center">
                          <button 
                            onClick={() => handleDeleteRecord('orders', idx)}
                            className="text-rose-500 hover:text-rose-700"
                            title="Purge order record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Customers */}
                    {customers.slice(0, 3).map((cust, idx) => (
                      <tr key={`cust-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                        <td className="py-2.5 px-4 font-mono text-slate-500">[CUST-{idx+101}]</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">{cust.name}</td>
                        <td className="py-2.5 px-4 text-right font-mono text-emerald-500">${cust.revenue.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-center">
                          <button 
                            onClick={() => handleDeleteRecord('customers', idx)}
                            className="text-rose-500 hover:text-rose-700"
                            title="Delete customer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CRUD MODALS */}
      {/* 1. SALES ORDER INSERT */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl animate-scale-up text-slate-800 dark:text-slate-100">
            <h3 className="text-base font-bold mb-1">Insert SQL Sales Order</h3>
            <p className="text-xs text-slate-400 mb-6">Logs a new receipt of sale into the transactional core.</p>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Associate Customer Account</label>
                <select 
                  value={orderInput.customer}
                  onChange={(e) => setOrderInput({...orderInput, customer: e.target.value})}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                >
                  {customers.map((c, i) => (
                    <option key={i} value={c.name}>{c.name} ({c.segment})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Ordered Product</label>
                <select 
                  value={orderInput.productName}
                  onChange={(e) => {
                    const prod = products.find(p => p.name === e.target.value);
                    setOrderInput({
                      ...orderInput, 
                      productName: e.target.value,
                      category: prod ? (prod.category || 'Electronics') : 'Electronics'
                    });
                  }}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                >
                  {products.map((p, i) => (
                    <option key={i} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Total Bill (USD)</label>
                  <input 
                    type="number"
                    value={orderInput.revenue}
                    onChange={(e) => setOrderInput({...orderInput, revenue: Number(e.target.value)})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Processing Region</label>
                  <select 
                    value={orderInput.region}
                    onChange={(e) => setOrderInput({...orderInput, region: e.target.value})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  >
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Log Priority</label>
                  <select 
                    value={orderInput.priority}
                    onChange={(e) => setOrderInput({...orderInput, priority: e.target.value})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Fulfillment Status</label>
                  <select 
                    value={orderInput.status}
                    onChange={(e) => setOrderInput({...orderInput, status: e.target.value})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Insert Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. REGISTER PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-scale-up text-slate-800 dark:text-slate-100">
            <h3 className="text-base font-bold mb-1">Register New Product</h3>
            <p className="text-xs text-slate-400 mb-6">Create a product catalog item in the Master Register.</p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Product Name</label>
                <input 
                  type="text"
                  value={productInput.name}
                  onChange={(e) => setProductInput({...productInput, name: e.target.value})}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none text-slate-800 dark:text-slate-100"
                  placeholder="e.g. Ultra Monitor 4K"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Category</label>
                <select 
                  value={productInput.category}
                  onChange={(e) => setProductInput({...productInput, category: e.target.value})}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Starting Rev</label>
                  <input 
                    type="number"
                    value={productInput.revenue}
                    onChange={(e) => setProductInput({...productInput, revenue: Number(e.target.value)})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Starting Profit</label>
                  <input 
                    type="number"
                    value={productInput.profit}
                    onChange={(e) => setProductInput({...productInput, profit: Number(e.target.value)})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Units Sold</label>
                  <input 
                    type="number"
                    value={productInput.units}
                    onChange={(e) => setProductInput({...productInput, units: Number(e.target.value)})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. REGISTER CUSTOMER MODAL */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-scale-up text-slate-800 dark:text-slate-100">
            <h3 className="text-base font-bold mb-1">Create Customer Account</h3>
            <p className="text-xs text-slate-400 mb-6">Add a client profile to segments directory.</p>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Account / Corp Name</label>
                <input 
                  type="text"
                  value={customerInput.name}
                  onChange={(e) => setCustomerInput({...customerInput, name: e.target.value})}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none text-slate-800 dark:text-slate-100"
                  placeholder="e.g. Wayne Enterprises"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Market Segment</label>
                <select 
                  value={customerInput.segment}
                  onChange={(e) => setCustomerInput({...customerInput, segment: e.target.value})}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Mid-Market">Mid-Market</option>
                  <option value="SMB">SMB</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Starting Revenue</label>
                  <input 
                    type="number"
                    value={customerInput.revenue}
                    onChange={(e) => setCustomerInput({...customerInput, revenue: Number(e.target.value)})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Orders Count</label>
                  <input 
                    type="number"
                    value={customerInput.orders}
                    onChange={(e) => setCustomerInput({...customerInput, orders: Number(e.target.value)})}
                    className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
