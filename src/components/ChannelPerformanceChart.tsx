import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { channelData } from '../data';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export function ChannelPerformanceChart() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-[350px]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sales by Channel</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={channelData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {channelData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
