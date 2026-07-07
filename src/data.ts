/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Monthly performance data across 12 months with rich metrics
export const salesData = [
  { month: 'Jan', revenue: 45000, profit: 12000, orders: 150 },
  { month: 'Feb', revenue: 52000, profit: 15000, orders: 180 },
  { month: 'Mar', revenue: 48000, profit: 11000, orders: 165 },
  { month: 'Apr', revenue: 61000, profit: 18000, orders: 210 },
  { month: 'May', revenue: 55000, profit: 14000, orders: 195 },
  { month: 'Jun', revenue: 67000, profit: 21000, orders: 240 },
  { month: 'Jul', revenue: 72000, profit: 24500, orders: 260 },
  { month: 'Aug', revenue: 69000, profit: 22000, orders: 245 },
  { month: 'Sep', revenue: 75000, profit: 26000, orders: 280 },
  { month: 'Oct', revenue: 82000, profit: 30000, orders: 310 },
  { month: 'Nov', revenue: 95000, profit: 37000, orders: 380 },
  { month: 'Dec', revenue: 110000, profit: 45000, orders: 450 },
];

// KPI cards key metrics
export const kpiData = [
  { title: 'Total Revenue', value: '$831,000', change: '+18.4%' },
  { title: 'Total Profit', value: '$275,500', change: '+22.1%' },
  { title: 'Profit Margin', value: '33.1%', change: '+3.2%' },
  { title: 'Total Orders', value: '3,065', change: '+14.7%' },
];

// Yearly breakdown of revenue & profit
export const yearlyData = [
  { year: '2023', revenue: 580000, profit: 185000 },
  { year: '2024', revenue: 710000, profit: 230000 },
  { year: '2025', revenue: 831000, profit: 275500 },
];

// Revenue & Profit by product category
export const categoryData = [
  { name: 'Electronics', revenue: 320000, profit: 110000, margin: 34.3 },
  { name: 'Clothing', revenue: 210000, profit: 65000, margin: 30.9 },
  { name: 'Home & Kitchen', revenue: 150000, profit: 48000, margin: 32.0 },
  { name: 'Sports & Outdoors', revenue: 95000, profit: 32000, margin: 33.6 },
  { name: 'Beauty & Personal Care', revenue: 56000, profit: 20500, margin: 36.6 },
];

// Detailed product metrics (revenue, profit, unit sales)
export const productsMetrics = [
  { name: 'Pro Laptop 15"', revenue: 180000, profit: 65000, units: 150 },
  { name: 'Wireless Earbuds', revenue: 95000, profit: 35000, units: 950 },
  { name: 'Smart Fitness Watch', revenue: 75000, profit: 22000, units: 500 },
  { name: 'Ergonomic Desk Chair', revenue: 65000, profit: 18000, units: 260 },
  { name: 'Duffle Sports Bag', revenue: 35000, profit: 12000, units: 700 },
  { name: 'Premium Coffee Maker', revenue: 45000, profit: 15000, units: 450 },
  { name: 'Mechanical Keyboard', revenue: 28000, profit: 9000, units: 280 },
  { name: 'Stainless Water Bottle', revenue: 18000, profit: 7500, units: 900 },
  { name: 'Chef Knife 8"', revenue: 15000, profit: 5000, units: 300 },
  { name: 'Yoga Mat Non-Slip', revenue: 12000, profit: 3500, units: 400 },
];

// Revenue by Country & Region
export const countryData = [
  { country: 'United States', code: 'US', revenue: 450000, region: 'North America' },
  { country: 'United Kingdom', code: 'UK', revenue: 120000, region: 'Europe' },
  { country: 'Germany', code: 'DE', revenue: 95000, region: 'Europe' },
  { country: 'Japan', code: 'JP', revenue: 88000, region: 'Asia' },
  { country: 'Canada', code: 'CA', revenue: 78000, region: 'North America' },
];

// Regional Performance
export const regionData = [
  { name: 'North America', revenue: 528000, profit: 175000 },
  { name: 'Europe', revenue: 215000, profit: 71000 },
  { name: 'Asia', revenue: 88000, profit: 29500 },
];

// Channel metrics
export const channelData = [
  { name: 'Online Direct', value: 380000, color: '#4f46e5' },
  { name: 'Retail Store', value: 240000, color: '#10b981' },
  { name: 'Wholesale B2B', value: 160000, color: '#f59e0b' },
  { name: 'Social Commerce', value: 51000, color: '#ec4899' },
];

// Top Customer list
export const customersData = [
  { name: 'Acme Corporation', revenue: 85000, orders: 42, segment: 'Enterprise' },
  { name: 'Stark Industries', revenue: 72000, orders: 35, segment: 'Enterprise' },
  { name: 'Wayne Enterprises', revenue: 64000, orders: 28, segment: 'Enterprise' },
  { name: 'LexCorp', revenue: 45000, orders: 19, segment: 'Mid-Market' },
  { name: 'Oscorp Technologies', revenue: 38000, orders: 15, segment: 'Mid-Market' },
  { name: 'Umbrella Corp', revenue: 31000, orders: 12, segment: 'Mid-Market' },
  { name: 'Initech LLC', revenue: 18000, orders: 8, segment: 'SMB' },
  { name: 'Dunder Mifflin', revenue: 12000, orders: 6, segment: 'SMB' },
];

// Orders segmentation parameters
export const orderPriorityData = [
  { name: 'Critical', value: 450, color: '#ef4444' },
  { name: 'High', value: 980, color: '#f97316' },
  { name: 'Medium', value: 1125, color: '#3b82f6' },
  { name: 'Low', value: 510, color: '#10b981' },
];

export const shippingStatusData = [
  { name: 'Delivered', value: 2150, color: '#10b981' },
  { name: 'Shipped', value: 580, color: '#3b82f6' },
  { name: 'Processing', value: 245, color: '#f59e0b' },
  { name: 'Cancelled', value: 90, color: '#ef4444' },
];

// Sample list of individual orders (recent orders table)
export const recentOrders = [
  { id: 'ORD-1001', customer: 'Acme Corporation', date: '06 Jul 2026', status: 'Delivered', revenue: 12400, priority: 'Critical' },
  { id: 'ORD-1002', customer: 'Stark Industries', date: '05 Jul 2026', status: 'Delivered', revenue: 9800, priority: 'High' },
  { id: 'ORD-1003', customer: 'Wayne Enterprises', date: '04 Jul 2026', status: 'Shipped', revenue: 7600, priority: 'Medium' },
  { id: 'ORD-1004', customer: 'LexCorp', date: '03 Jul 2026', status: 'Processing', revenue: 6200, priority: 'High' },
  { id: 'ORD-1005', customer: 'Oscorp Technologies', date: '02 Jul 2026', status: 'Delivered', revenue: 4900, priority: 'Low' },
  { id: 'ORD-1006', customer: 'Umbrella Corp', date: '01 Jul 2026', status: 'Cancelled', revenue: 3100, priority: 'Critical' },
  { id: 'ORD-1007', customer: 'Initech LLC', date: '30 Jun 2026', status: 'Delivered', revenue: 1800, priority: 'Medium' },
];
