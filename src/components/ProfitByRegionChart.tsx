import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { regionData } from '../data';

export function ProfitByRegionChart() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-[350px]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Profit by Region</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={regionData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
          <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
