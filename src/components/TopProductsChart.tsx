import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { productsMetrics } from '../data';

export function TopProductsChart() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-[350px]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Products by Revenue</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={productsMetrics} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
          <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
