import { Lightbulb, TrendingUp, AlertCircle, Award } from 'lucide-react';

export function InsightsPanel() {
  const insights = [
    { icon: TrendingUp, title: 'Highest Revenue', description: 'You earned the highest revenue in December', color: 'text-indigo-600' },
    { icon: Award, title: 'Top Performing Region', description: 'North region is leading by 24%', color: 'text-emerald-600' },
    { icon: AlertCircle, title: 'Best Selling Product', description: 'Product A contributes 28% of total revenue', color: 'text-amber-600' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Lightbulb size={20} className="text-amber-500" />
        Insights
      </h3>
      <div className="space-y-6">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-4">
            <div className={cn("p-2 rounded-lg bg-slate-100 dark:bg-slate-800", insight.color)}>
              <insight.icon size={20} />
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white">{insight.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
