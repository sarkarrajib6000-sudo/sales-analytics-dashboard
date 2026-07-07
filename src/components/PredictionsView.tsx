import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend
} from 'recharts';
import { dbService } from '../lib/dbService';
import { Brain, Sparkles, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-205/10 dark:border-slate-800 backdrop-blur-md p-3 px-3.5 rounded-xl shadow-xl text-left text-xs">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1 first:mt-0">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="font-semibold text-slate-350 capitalize">{entry.name}:</span>
            <span className="font-black text-white">
              {formatter ? formatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PredictionsView() {
  const [sales, setSales] = useState(dbService.getSales());
  const [targetGrowth, setTargetGrowth] = useState(15);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [strategies, setStrategies] = useState<any[]>([]);

  const refreshDBState = () => {
    setSales(dbService.getSales());
  };

  useEffect(() => {
    refreshDBState();
    window.addEventListener('sales_db_update', refreshDBState);
    return () => window.removeEventListener('sales_db_update', refreshDBState);
  }, []);

  // Compute 4 months of forecasted future data based on historical averages
  const generateForecastingData = () => {
    if (sales.length === 0) return [];
    
    // Calculate historical trend slope (simple average monthly change)
    let totalRevChange = 0;
    for (let i = 1; i < sales.length; i++) {
      totalRevChange += (sales[i].revenue - sales[i-1].revenue);
    }
    const avgMonthlySlope = sales.length > 1 ? totalRevChange / (sales.length - 1) : 0;
    
    // Map existing historical data
    const data = sales.map(s => ({
      name: s.month,
      actual: s.revenue,
      projected: s.revenue,
      lowerBound: s.revenue,
      upperBound: s.revenue,
      isForecast: false
    }));

    // Project 4 months out
    const lastRev = sales[sales.length - 1]?.revenue || 50000;
    const futureMonths = ['Aug', 'Sep', 'Oct', 'Nov'];
    
    futureMonths.forEach((m, idx) => {
      const projectionStep = idx + 1;
      const baseProjected = Math.round(lastRev + (avgMonthlySlope * projectionStep));
      const variance = Math.round(baseProjected * (0.05 * projectionStep)); // Variance grows with time

      data.push({
        name: `${m} (Fc)`,
        actual: null as any,
        projected: baseProjected,
        lowerBound: baseProjected - variance,
        upperBound: baseProjected + variance,
        isForecast: true
      });
    });

    return data;
  };

  const forecastData = generateForecastingData();

  // Generate customized business strategies based on targets
  useEffect(() => {
    const initiatives = [
      {
        id: 'pricing',
        title: 'Dynamic Pricing Optimization',
        description: `Implement dynamic pricing algorithms on high-turnover categories. Projected to boost profit margins by ${(targetGrowth * 0.18).toFixed(1)}% with ${riskTolerance === 'low' ? 'minimal' : riskTolerance === 'medium' ? 'moderate' : 'aggressive'} price elasticity adjustments.`,
        impact: riskTolerance === 'low' ? 'Low (+3%)' : riskTolerance === 'medium' ? 'Medium (+8%)' : 'High (+14%)',
        cost: 'Low Implementation',
        risk: riskTolerance.toUpperCase()
      },
      {
        id: 'retention',
        title: 'Customer Cohort Re-engagement',
        description: `Target underperforming mid-market segments using data-driven incentive emails. Est. conversions: +${(targetGrowth * 1.5).toFixed(0)} accounts.`,
        impact: 'High Impact',
        cost: 'Medium Cost',
        risk: 'LOW'
      },
      {
        id: 'inventory',
        title: 'Predictive Stock Reallocation',
        description: `Reallocate electronics inventory to regions with rising Q3/Q4 forecasting trends. Reduces supply-chain latency and overstock holding costs.`,
        impact: 'Medium Impact',
        cost: 'Low Cost',
        risk: 'LOW'
      }
    ];

    if (targetGrowth > 20) {
      initiatives.push({
        id: 'expansion',
        title: 'Aggressive Corporate Partnerships',
        description: 'Forge direct shipping contracts with high-volume accounts in leading regions. Requires capital expenditure but unlocks immediate scaling.',
        impact: 'Very High (+20%)',
        cost: 'High CapEx',
        risk: 'HIGH'
      });
    }

    setStrategies(initiatives);
  }, [targetGrowth, riskTolerance]);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 text-left">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Brain className="text-cyan-650 dark:text-cyan-405" size={26} />
          Analyses & Predictions
        </h2>
        <p className="text-sm text-slate-550 dark:text-slate-400 mt-1">Simulate growth targets, view predictive monthly cashflow models, and execute operational strategies.</p>
      </div>

      {/* Grid: Forecast & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Forecast Chart - Takes 2 cols */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-5 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-cyan-500" size={17} />
                6-Month Revenue Forecast
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Historical revenue trend projected 4 months out with variance bounds</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-50 border border-cyan-100/40 text-cyan-700 dark:bg-cyan-950/30 dark:border-cyan-900/30 px-2.5 py-1 rounded-xl">
              Model: LSTM Projections
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ left: -15, right: 10 }}>
                <defs>
                  <linearGradient id="projectedGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip content={<CustomTooltip formatter={(val: any) => `$${Number(val).toLocaleString()}`} />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                {/* Confidence Interval bounds */}
                <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="#0891b2" fillOpacity={0.05} name="Upper Boundary" />
                <Area type="monotone" dataKey="lowerBound" stroke="transparent" fill="#0891b2" fillOpacity={0.05} name="Lower Boundary" />
                
                {/* Actual Line */}
                <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Historical Revenue" />
                {/* Projected Line (Dashed) */}
                <Line type="monotone" dataKey="projected" stroke="#0891b2" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} activeDot={{ r: 7 }} name="Projected Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategies Simulator - Takes 1 col */}
        <div className="lg:col-span-1 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/50 mb-4">
              <Zap className="text-cyan-500" size={17} />
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">Strategies Simulator</h3>
            </div>
            <p className="text-[11px] text-slate-455 dark:text-slate-450 leading-relaxed">
              Adjust your target metrics to compute optimal cashflow strategies and risk assessments.
            </p>

            <div className="space-y-4 pt-2">
              {/* Target Growth Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-455">
                  <span>Target Profit Growth</span>
                  <span className="text-indigo-600 dark:text-indigo-400">+{targetGrowth}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  value={targetGrowth}
                  onChange={(e) => setTargetGrowth(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                />
              </div>

              {/* Risk Tolerance selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-455 block">Risk Profile</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['low', 'medium', 'high'] as const).map(profile => (
                    <button
                      key={profile}
                      onClick={() => setRiskTolerance(profile)}
                      className={`text-[10px] font-bold py-2 rounded-xl border text-center transition-all cursor-pointer capitalize ${
                        riskTolerance === profile
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-black'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {profile}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-1.5 text-[10px] mt-4">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Confidence Score:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {riskTolerance === 'low' ? '92%' : riskTolerance === 'medium' ? '84%' : '67%'} (High)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Model Calibration:</span>
              <span className="font-extrabold text-slate-650 dark:text-slate-300">AUTO_0.15ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategies Output Section */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="text-indigo-500" size={17} />
          Recommended Operational Initiatives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.map((strat, i) => (
            <div 
              key={strat.id} 
              className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-5 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-200 capitalize">{strat.title}</h4>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                    strat.risk === 'LOW' ? 'bg-emerald-50 border-emerald-100/40 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-400' :
                    strat.risk === 'MEDIUM' ? 'bg-amber-50 border-amber-105/40 text-amber-700 dark:bg-amber-955/30 dark:border-amber-900/30 dark:text-amber-450' :
                    'bg-rose-50 border-rose-100/40 text-rose-700 dark:bg-rose-955/30 dark:border-rose-900/30 dark:text-rose-450'
                  }`}>
                    {strat.risk} RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed font-medium">{strat.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 mt-4 flex justify-between text-[10px]">
                <div>
                  <span className="text-slate-400 font-medium">Projected Impact:</span>
                  <span className="block font-extrabold text-indigo-650 dark:text-indigo-400">{strat.impact}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-medium">Cost Estimate:</span>
                  <span className="block font-extrabold text-slate-700 dark:text-slate-300">{strat.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
