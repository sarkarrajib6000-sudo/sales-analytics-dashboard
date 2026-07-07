import { 
  salesData as initialSales, 
  kpiData as initialKpis, 
  productsMetrics as initialProducts, 
  regionData as initialRegions, 
  customersData as initialCustomers, 
  recentOrders as initialOrders,
  orderPriorityData as initialPriorities,
  shippingStatusData as initialShipping,
  categoryData as initialCategory,
  yearlyData as initialYearly,
  countryData as initialCountries,
  channelData as initialChannels
} from '../data';

export interface DateFilter {
  type: 'all' | 'year' | 'quarter' | 'month' | 'custom';
  year?: string;
  quarter?: string;
  month?: string;
  customStart?: string;
  customEnd?: string;
}

// Helper to check if localStorage is available
const isStorageAvailable = typeof window !== 'undefined' && window.localStorage;

const KEYS = {
  DB_INITIALIZED: 'sales_db_initialized_v1',
  ORDERS: 'sales_db_orders',
  CUSTOMERS: 'sales_db_customers',
  PRODUCTS: 'sales_db_products',
  SALES: 'sales_db_sales',
  KPI: 'sales_db_kpi',
  REGIONS: 'sales_db_regions',
  PRIORITIES: 'sales_db_priorities',
  SHIPPING: 'sales_db_shipping',
  CATEGORY: 'sales_db_category',
  YEARLY: 'sales_db_yearly',
  COUNTRIES: 'sales_db_countries',
  CHANNELS: 'sales_db_channels',
  DATE_FILTER: 'sales_db_date_filter'
};

// Programmatic High-Fidelity Mock Transactional Order Generator
function generateMockOrders() {
  const orders: any[] = [];
  const years = [2024, 2025, 2026];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const customers = [
    { name: 'Acme Corporation', segment: 'Enterprise' },
    { name: 'Stark Industries', segment: 'Enterprise' },
    { name: 'Wayne Enterprises', segment: 'Enterprise' },
    { name: 'LexCorp', segment: 'Mid-Market' },
    { name: 'Oscorp Technologies', segment: 'Mid-Market' },
    { name: 'Umbrella Corp', segment: 'Mid-Market' },
    { name: 'Initech LLC', segment: 'SMB' },
    { name: 'Dunder Mifflin', segment: 'SMB' }
  ];
  
  const products = [
    { name: 'Pro Laptop 15"', category: 'Electronics', price: 1200, margin: 0.36 },
    { name: 'Wireless Earbuds', category: 'Electronics', price: 100, margin: 0.35 },
    { name: 'Smart Fitness Watch', category: 'Electronics', price: 150, margin: 0.3 },
    { name: 'Ergonomic Desk Chair', category: 'Home & Kitchen', price: 250, margin: 0.28 },
    { name: 'Duffle Sports Bag', category: 'Sports & Outdoors', price: 50, margin: 0.34 },
    { name: 'Premium Coffee Maker', category: 'Home & Kitchen', price: 100, margin: 0.33 },
    { name: 'Mechanical Keyboard', category: 'Electronics', price: 100, margin: 0.32 },
    { name: 'Stainless Water Bottle', category: 'Sports & Outdoors', price: 20, margin: 0.4 },
    { name: 'Chef Knife 8"', category: 'Home & Kitchen', price: 50, margin: 0.33 },
    { name: 'Yoga Mat Non-Slip', category: 'Sports & Outdoors', price: 30, margin: 0.29 }
  ];
  
  const geographics = [
    { country: 'United States', region: 'North America' },
    { country: 'Canada', region: 'North America' },
    { country: 'United Kingdom', region: 'Europe' },
    { country: 'Germany', region: 'Europe' },
    { country: 'Japan', region: 'Asia' }
  ];
  
  const channels = ['Online Direct', 'Retail Store', 'Wholesale B2B', 'Social Commerce'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  let orderCount = 1001;

  years.forEach(year => {
    months.forEach((month, monthIdx) => {
      // 2026 goes up to July
      if (year === 2026 && monthIdx > 6) return;
      
      const numOrders = Math.floor(Math.random() * 4) + 6; // 6 to 9 orders per month
      
      for (let i = 0; i < numOrders; i++) {
        const cust = customers[Math.floor(Math.random() * customers.length)];
        const prod = products[Math.floor(Math.random() * products.length)];
        const geo = geographics[Math.floor(Math.random() * geographics.length)];
        const chan = channels[Math.floor(Math.random() * channels.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        let status = 'Delivered';
        const randStatus = Math.random();
        if (randStatus < 0.75) status = 'Delivered';
        else if (randStatus < 0.88) status = 'Shipped';
        else if (randStatus < 0.95) status = 'Processing';
        else status = 'Cancelled';
        
        const day = Math.floor(Math.random() * 28) + 1;
        const formattedDay = day < 10 ? `0${day}` : `${day}`;
        const dateStr = `${formattedDay} ${month} ${year}`;
        
        const quantity = Math.floor(Math.random() * 4) + 1;
        const revenue = prod.price * quantity;
        const profit = Math.round(revenue * prod.margin);

        orders.push({
          id: `ORD-${orderCount++}`,
          customer: cust.name,
          segment: cust.segment,
          productName: prod.name,
          category: prod.category,
          revenue,
          profit,
          status,
          priority,
          country: geo.country,
          region: geo.region,
          channel: chan,
          date: dateStr
        });
      }
    });
  });

  return orders.reverse(); // Order from newest to oldest
}

// Check if order is in selected DateFilter range
export function isOrderInDateRange(orderDateStr: string, filter: DateFilter): boolean {
  if (!filter || filter.type === 'all') return true;

  const parts = orderDateStr.split(' ');
  if (parts.length < 3) return true;
  
  const day = parseInt(parts[0], 10);
  const monthStr = parts[1];
  const yearStr = parts[2];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = months.indexOf(monthStr);

  if (filter.type === 'year') {
    return yearStr === filter.year;
  }

  if (filter.type === 'quarter') {
    if (yearStr !== filter.year) return false;
    if (filter.quarter === 'Q1') return monthIdx >= 0 && monthIdx <= 2;
    if (filter.quarter === 'Q2') return monthIdx >= 3 && monthIdx <= 5;
    if (filter.quarter === 'Q3') return monthIdx >= 6 && monthIdx <= 8;
    if (filter.quarter === 'Q4') return monthIdx >= 9 && monthIdx <= 11;
  }

  if (filter.type === 'month') {
    return yearStr === filter.year && monthStr === filter.month;
  }

  if (filter.type === 'custom') {
    if (!filter.customStart || !filter.customEnd) return true;
    const orderDate = new Date(parseInt(yearStr, 10), monthIdx >= 0 ? monthIdx : 0, day);
    const startDate = new Date(filter.customStart);
    const endDate = new Date(filter.customEnd);
    
    orderDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return orderDate >= startDate && orderDate <= endDate;
  }

  return true;
}

export function filterOrdersByDateRange(orders: any[], filter: DateFilter): any[] {
  if (!filter || filter.type === 'all') return orders;
  return orders.filter(o => isOrderInDateRange(o.date, filter));
}

// Initialize Database in LocalStorage if not exists
export function initDB(forceReset = false) {
  if (!isStorageAvailable) return;

  if (forceReset || !localStorage.getItem(KEYS.DB_INITIALIZED)) {
    const generatedOrders = generateMockOrders();
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(generatedOrders));
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(initialProducts));
    localStorage.setItem(KEYS.SALES, JSON.stringify(initialSales));
    localStorage.setItem(KEYS.KPI, JSON.stringify(initialKpis));
    localStorage.setItem(KEYS.REGIONS, JSON.stringify(initialRegions));
    localStorage.setItem(KEYS.PRIORITIES, JSON.stringify(initialPriorities));
    localStorage.setItem(KEYS.SHIPPING, JSON.stringify(initialShipping));
    localStorage.setItem(KEYS.CATEGORY, JSON.stringify(initialCategory));
    localStorage.setItem(KEYS.YEARLY, JSON.stringify(initialYearly));
    localStorage.setItem(KEYS.COUNTRIES, JSON.stringify(initialCountries));
    localStorage.setItem(KEYS.CHANNELS, JSON.stringify(initialChannels));
    localStorage.setItem(KEYS.DATE_FILTER, JSON.stringify({ type: 'all' }));
    localStorage.setItem(KEYS.DB_INITIALIZED, 'true');
  }
}

// Ensure database is initialized on load
initDB();

// General Storage Getters & Setters
function getItem<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable) return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

function setItem<T>(key: string, value: T): void {
  if (!isStorageAvailable) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('sales_db_update'));
}

// Export API with dynamic date-filtering and metrics calculations
export const dbService = {
  getDateRange: (): DateFilter => getItem<DateFilter>(KEYS.DATE_FILTER, { type: 'all' }),
  setDateRange: (filter: DateFilter) => setItem(KEYS.DATE_FILTER, filter),

  getOrders: () => getItem<any[]>(KEYS.ORDERS, []),
  setOrders: (orders: any[]) => setItem(KEYS.ORDERS, orders),

  getCustomers: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const custMap: Record<string, { name: string, revenue: number, orders: number, segment: string }> = {};
    filtered.forEach(o => {
      const cust = o.customer || 'Unknown Client';
      if (!custMap[cust]) {
        custMap[cust] = { name: cust, revenue: 0, orders: 0, segment: o.segment || 'SMB' };
      }
      custMap[cust].revenue += o.revenue;
      custMap[cust].orders += 1;
    });
    
    return Object.values(custMap).sort((a, b) => b.revenue - a.revenue);
  },
  setCustomers: (customers: any[]) => setItem(KEYS.CUSTOMERS, customers),

  getProducts: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const prodMap: Record<string, { name: string, category: string, revenue: number, profit: number, units: number }> = {};
    filtered.forEach(o => {
      const prod = o.productName || 'Custom Product';
      if (!prodMap[prod]) {
        prodMap[prod] = { name: prod, category: o.category || 'Other', revenue: 0, profit: 0, units: 0 };
      }
      prodMap[prod].revenue += o.revenue;
      prodMap[prod].profit += o.profit || Math.round(o.revenue * 0.35);
      prodMap[prod].units += 1;
    });
    
    return Object.values(prodMap).sort((a, b) => b.revenue - a.revenue);
  },
  setProducts: (products: any[]) => setItem(KEYS.PRODUCTS, products),

  getSales: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // 1. If filtering to a specific month, return daily trend
    if (filter.type === 'month' && filter.year && filter.month) {
      const year = parseInt(filter.year, 10);
      const monthIdx = months.indexOf(filter.month);
      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
      
      const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
        month: `${i + 1} ${filter.month}`,
        revenue: 0,
        profit: 0,
        orders: 0
      }));
      
      filtered.forEach(o => {
        const parts = o.date.split(' ');
        const d = parseInt(parts[0], 10);
        if (d >= 1 && d <= daysInMonth) {
          dailyData[d - 1].revenue += o.revenue;
          dailyData[d - 1].profit += o.profit || Math.round(o.revenue * 0.35);
          dailyData[d - 1].orders += 1;
        }
      });
      return dailyData;
    }
    
    // 2. If filtering to a specific quarter, return 3-month breakdown
    if (filter.type === 'quarter' && filter.year && filter.quarter) {
      let quarterMonths: string[] = [];
      if (filter.quarter === 'Q1') quarterMonths = ['Jan', 'Feb', 'Mar'];
      else if (filter.quarter === 'Q2') quarterMonths = ['Apr', 'May', 'Jun'];
      else if (filter.quarter === 'Q3') quarterMonths = ['Jul', 'Aug', 'Sep'];
      else if (filter.quarter === 'Q4') quarterMonths = ['Oct', 'Nov', 'Dec'];
      
      const monthlyData = quarterMonths.map(m => ({
        month: m,
        revenue: 0,
        profit: 0,
        orders: 0
      }));
      
      filtered.forEach(o => {
        const parts = o.date.split(' ');
        const m = parts[1];
        const idx = quarterMonths.indexOf(m);
        if (idx >= 0) {
          monthlyData[idx].revenue += o.revenue;
          monthlyData[idx].profit += o.profit || Math.round(o.revenue * 0.35);
          monthlyData[idx].orders += 1;
        }
      });
      return monthlyData;
    }

    // 3. If custom range spanning <= 35 days, return daily trend
    if (filter.type === 'custom' && filter.customStart && filter.customEnd) {
      const start = new Date(filter.customStart);
      const end = new Date(filter.customEnd);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 35) {
        const dailyDataMap: Record<string, { month: string, revenue: number, profit: number, orders: number }> = {};
        const curr = new Date(start);
        while (curr <= end) {
          const dayStr = curr.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
          dailyDataMap[dayStr] = { month: dayStr, revenue: 0, profit: 0, orders: 0 };
          curr.setDate(curr.getDate() + 1);
        }
        
        filtered.forEach(o => {
          const parts = o.date.split(' ');
          const dayStr = `${parts[0]} ${parts[1]}`;
          if (dailyDataMap[dayStr]) {
            dailyDataMap[dayStr].revenue += o.revenue;
            dailyDataMap[dayStr].profit += o.profit || Math.round(o.revenue * 0.35);
            dailyDataMap[dayStr].orders += 1;
          }
        });
        return Object.values(dailyDataMap);
      }
    }
    
    // Default: Return 12 months grouped (for standard charts)
    const monthlyData = months.map(m => ({
      month: m,
      revenue: 0,
      profit: 0,
      orders: 0
    }));
    
    filtered.forEach(o => {
      const parts = o.date.split(' ');
      const m = parts[1];
      const idx = months.indexOf(m);
      if (idx >= 0) {
        monthlyData[idx].revenue += o.revenue;
        monthlyData[idx].profit += o.profit || Math.round(o.revenue * 0.35);
        monthlyData[idx].orders += 1;
      }
    });
    
    return monthlyData;
  },
  setSales: (sales: any[]) => setItem(KEYS.SALES, sales),

  getKPIs: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    let totalRevenue = 0;
    let totalProfit = 0;
    const totalOrdersCount = filtered.length;
    
    filtered.forEach(o => {
      totalRevenue += o.revenue;
      totalProfit += o.profit || Math.round(o.revenue * 0.35);
    });
    
    const marginPercent = totalRevenue ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
    
    // Calculate comparative indicators or changes (just styling indicators)
    return [
      { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+18.4%' },
      { title: 'Total Profit', value: `$${totalProfit.toLocaleString()}`, change: '+22.1%' },
      { title: 'Profit Margin', value: `${marginPercent}%`, change: '+3.2%' },
      { title: 'Total Orders', value: totalOrdersCount.toLocaleString(), change: '+14.7%' },
    ];
  },
  setKPIs: (kpis: any[]) => setItem(KEYS.KPI, kpis),

  getRegions: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const regionMap: Record<string, { name: string, revenue: number, profit: number }> = {};
    filtered.forEach(o => {
      const reg = o.region || 'North America';
      if (!regionMap[reg]) {
        regionMap[reg] = { name: reg, revenue: 0, profit: 0 };
      }
      regionMap[reg].revenue += o.revenue;
      regionMap[reg].profit += o.profit || Math.round(o.revenue * 0.35);
    });
    
    return Object.values(regionMap).sort((a, b) => b.revenue - a.revenue);
  },
  setRegions: (regions: any[]) => setItem(KEYS.REGIONS, regions),

  getPriorities: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const colors: Record<string, string> = {
      'Critical': '#ef4444',
      'High': '#f97316',
      'Medium': '#3b82f6',
      'Low': '#10b981'
    };
    
    const counts: Record<string, number> = { 'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0 };
    filtered.forEach(o => {
      const p = o.priority || 'Medium';
      if (counts[p] !== undefined) counts[p] += 1;
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#3b82f6'
    }));
  },
  setPriorities: (priorities: any[]) => setItem(KEYS.PRIORITIES, priorities),

  getShipping: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const colors: Record<string, string> = {
      'Delivered': '#10b981',
      'Shipped': '#3b82f6',
      'Processing': '#f59e0b',
      'Cancelled': '#ef4444'
    };
    
    const counts: Record<string, number> = { 'Delivered': 0, 'Shipped': 0, 'Processing': 0, 'Cancelled': 0 };
    filtered.forEach(o => {
      const s = o.status || 'Delivered';
      if (counts[s] !== undefined) counts[s] += 1;
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#10b981'
    }));
  },
  setShipping: (shipping: any[]) => setItem(KEYS.SHIPPING, shipping),

  getCategory: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const catMap: Record<string, { name: string, revenue: number, profit: number, margin: number }> = {};
    filtered.forEach(o => {
      const cat = o.category || 'Other';
      if (!catMap[cat]) {
        catMap[cat] = { name: cat, revenue: 0, profit: 0, margin: 0 };
      }
      catMap[cat].revenue += o.revenue;
      catMap[cat].profit += o.profit || Math.round(o.revenue * 0.35);
    });
    
    return Object.values(catMap).map(c => ({
      ...c,
      margin: c.revenue ? Number(((c.profit / c.revenue) * 100).toFixed(1)) : 0
    }));
  },
  setCategory: (category: any[]) => setItem(KEYS.CATEGORY, category),

  getYearly: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const yearlyMap: Record<string, { year: string, revenue: number, profit: number }> = {};
    filtered.forEach(o => {
      const year = o.date.split(' ')[2] || '2025';
      if (!yearlyMap[year]) {
        yearlyMap[year] = { year, revenue: 0, profit: 0 };
      }
      yearlyMap[year].revenue += o.revenue;
      yearlyMap[year].profit += o.profit || Math.round(o.revenue * 0.35);
    });
    
    return Object.values(yearlyMap).sort((a, b) => a.year.localeCompare(b.year));
  },
  setYearly: (yearly: any[]) => setItem(KEYS.YEARLY, yearly),

  getCountries: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const countryMap: Record<string, { country: string, code: string, revenue: number, region: string }> = {};
    
    const countryCodes: Record<string, string> = {
      'United States': 'US',
      'Canada': 'CA',
      'United Kingdom': 'UK',
      'Germany': 'DE',
      'Japan': 'JP'
    };
    const countryRegions: Record<string, string> = {
      'United States': 'North America',
      'Canada': 'North America',
      'United Kingdom': 'Europe',
      'Germany': 'Europe',
      'Japan': 'Asia'
    };
    
    filtered.forEach(o => {
      const country = o.country || 'United States';
      if (!countryMap[country]) {
        countryMap[country] = { 
          country, 
          code: countryCodes[country] || 'US', 
          revenue: 0, 
          region: countryRegions[country] || 'North America' 
        };
      }
      countryMap[country].revenue += o.revenue;
    });
    
    return Object.values(countryMap).sort((a, b) => b.revenue - a.revenue);
  },
  setCountries: (countries: any[]) => setItem(KEYS.COUNTRIES, countries),

  getChannels: () => {
    const orders = dbService.getOrders();
    const filter = dbService.getDateRange();
    const filtered = filterOrdersByDateRange(orders, filter);
    
    const channelColors: Record<string, string> = {
      'Online Direct': '#4f46e5',
      'Retail Store': '#10b981',
      'Wholesale B2B': '#f59e0b',
      'Social Commerce': '#ec4899'
    };
    
    const channelMap: Record<string, { name: string, value: number, color: string }> = {};
    filtered.forEach(o => {
      const chan = o.channel || 'Online Direct';
      if (!channelMap[chan]) {
        channelMap[chan] = { name: chan, value: 0, color: channelColors[chan] || '#4f46e5' };
      }
      channelMap[chan].value += o.revenue;
    });
    
    return Object.values(channelMap).sort((a, b) => b.value - a.value);
  },
  setChannels: (channels: any[]) => setItem(KEYS.CHANNELS, channels),

  resetDatabase: () => {
    initDB(true);
    window.dispatchEvent(new Event('sales_db_update'));
  },

  getStorageMetrics: () => {
    if (!isStorageAvailable) return { sizeKB: 0, itemsCount: 0 };
    let totalChars = 0;
    let itemsCount = 0;
    for (const key in KEYS) {
      const val = localStorage.getItem((KEYS as any)[key]);
      if (val) {
        totalChars += val.length;
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            itemsCount += parsed.length;
          } else {
            itemsCount += 1;
          }
        } catch (_) {
          itemsCount += 1;
        }
      }
    }
    const sizeKB = Number(((totalChars * 2) / 1024).toFixed(2));
    return { sizeKB, itemsCount };
  },

  recalculateKPIs: () => {
    // Dynamic getters calculate on-the-fly, so we just dispatch updates
    window.dispatchEvent(new Event('sales_db_update'));
  },

  addOrder: (newOrder: { 
    customer: string; 
    date: string; 
    status: string; 
    revenue: number; 
    priority: string; 
    productName: string;
    profit: number;
    region: string;
    segment: string;
    category: string;
    country?: string;
    channel?: string;
  }) => {
    const orders = dbService.getOrders();
    const orderId = `ORD-${1000 + orders.length + 1}`;
    
    // Set fallback Country & Channel for random selection
    const defaultChannels = ['Online Direct', 'Retail Store', 'Wholesale B2B', 'Social Commerce'];
    const defaultGeographics = [
      { country: 'United States', region: 'North America' },
      { country: 'Canada', region: 'North America' },
      { country: 'United Kingdom', region: 'Europe' },
      { country: 'Germany', region: 'Europe' },
      { country: 'Japan', region: 'Asia' }
    ];
    const matchingGeo = defaultGeographics.find(g => g.region === newOrder.region) || defaultGeographics[0];

    const fullOrder = { 
      id: orderId, 
      country: newOrder.country || matchingGeo.country,
      channel: newOrder.channel || defaultChannels[Math.floor(Math.random() * defaultChannels.length)],
      ...newOrder 
    };
    
    orders.unshift(fullOrder);
    setItem(KEYS.ORDERS, orders);
  },

  addCustomer: (customer: { name: string; segment: string; revenue?: number; orders?: number }) => {
    // Dynamically derived, but let's simulate by adding mock order for this customer if needed,
    // or just allow inserting a dummy order to register them.
    const orders = dbService.getOrders();
    const orderId = `ORD-${1000 + orders.length + 1}`;
    
    orders.unshift({
      id: orderId,
      customer: customer.name,
      segment: customer.segment,
      productName: 'Pro Laptop 15"',
      category: 'Electronics',
      revenue: customer.revenue || 0,
      profit: Math.round((customer.revenue || 0) * 0.35),
      status: 'Delivered',
      priority: 'Medium',
      country: 'United States',
      region: 'North America',
      channel: 'Online Direct',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setItem(KEYS.ORDERS, orders);
  },

  addProduct: (product: { name: string; category: string; revenue?: number; profit?: number; units?: number }) => {
    const orders = dbService.getOrders();
    const orderId = `ORD-${1000 + orders.length + 1}`;
    
    orders.unshift({
      id: orderId,
      customer: 'Acme Corporation',
      segment: 'Enterprise',
      productName: product.name,
      category: product.category,
      revenue: product.revenue || 0,
      profit: product.profit || Math.round((product.revenue || 0) * 0.35),
      status: 'Delivered',
      priority: 'Medium',
      country: 'United States',
      region: 'North America',
      channel: 'Online Direct',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setItem(KEYS.ORDERS, orders);
  }
};
