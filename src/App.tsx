import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CsvUploader } from './components/CsvUploader';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { RevenueView } from './components/RevenueView';
import { ProfitView } from './components/ProfitView';
import { ProductsView } from './components/ProductsView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { SettingsView } from './components/SettingsView';
import { Layout } from './components/Layout';
import { ViewSkeleton } from './components/SkeletonLoader';
import { AntigravityGuideView } from './components/AntigravityGuideView';
import { dbService, isOrderInDateRange } from './lib/dbService';

export default function App() {
  const [orders, setOrders] = useState(dbService.getOrders());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterText, setFilterText] = useState('');
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [isLoading, setIsLoading] = useState(false);

  // Sync state with dbService
  const refreshOrders = () => {
    setOrders(dbService.getOrders());
  };

  useEffect(() => {
    refreshOrders();
    window.addEventListener('sales_db_update', refreshOrders);
    return () => window.removeEventListener('sales_db_update', refreshOrders);
  }, []);

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.customer.toLowerCase().includes(filterText.toLowerCase());
    const matchesDate = isOrderInDateRange(order.date, dbService.getDateRange());
    return matchesSearch && matchesDate;
  });

  const handleTabChange = (tab: string) => {
    setIsLoading(true);
    setActiveTab(tab);
    const delay = tab === 'dashboard' || tab === 'revenue' ? 650 : 450;
    setTimeout(() => {
      setIsLoading(false);
    }, delay);
  };

  const handleDataLoaded = (data: any[]) => {
    setIsLoading(true);
    setTimeout(() => {
      // Map CSV records safely with all high-fidelity analytics fields
      const parsedOrders = data.map((o, index) => ({
        id: o.id || `ORD-${1000 + index + 1}`,
        customer: o.customer || 'Unknown Client',
        date: o.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: o.status || 'Delivered',
        revenue: Number(o.revenue) || 0,
        priority: o.priority || 'Medium',
        productName: o.productName || 'Custom Product',
        profit: o.profit !== undefined ? Number(o.profit) : Math.round((Number(o.revenue) || 0) * 0.35),
        region: o.region || 'North America',
        segment: o.segment || 'SMB',
        category: o.category || 'Electronics',
        country: o.country || 'United States',
        channel: o.channel || 'Online Direct'
      }));

      dbService.setOrders(parsedOrders);
      dbService.recalculateKPIs();
      setIsLoading(false);
    }, 900);
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredOrders);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dashboard_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('dashboard')} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
      onExport={handleExport}
      filterText={filterText}
      onFilterChange={setFilterText}
    >
      <div className="mb-6">
        <CsvUploader onDataLoaded={handleDataLoaded} />
      </div>
      
      <div className="mt-8">
        {isLoading ? (
          <ViewSkeleton type={activeTab} />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView orders={filteredOrders} />
            )}
            
            {activeTab === 'revenue' && (
              <RevenueView />
            )}

            {activeTab === 'profit' && (
              <ProfitView />
            )}

            {activeTab === 'product' && (
              <ProductsView />
            )}

            {activeTab === 'orders' && (
              <OrdersView orders={filteredOrders} />
            )}

            {activeTab === 'customers' && (
              <CustomersView />
            )}

            {activeTab === 'settings' && (
              <SettingsView />
            )}

            {activeTab === 'guide' && (
              <AntigravityGuideView />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
