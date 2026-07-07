import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { regionData } from '../data';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

interface RegionPerformanceChartProps {
  data: any[];
}

export function RegionPerformanceChart({ data }: RegionPerformanceChartProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-[350px]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue by Region</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
