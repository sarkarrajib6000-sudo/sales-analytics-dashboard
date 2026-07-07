import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, AlertCircle, Award, Sparkles, RefreshCw, Key } from 'lucide-react';
import { dbService } from '../lib/dbService';

interface InsightItem {
  type: 'trend' | 'concern' | 'recommendation';
  title: string;
  description: string;
}

export function InsightsPanel() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [error, setError] = useState('');

  // Sync API Key from settings/localStorage
  const checkApiKey = () => {
    const key = localStorage.getItem('gemini_api_key') || '';
    setApiKey(key);
    setHasKey(!!key.trim());
  };

  useEffect(() => {
    checkApiKey();
    window.addEventListener('sales_db_update', checkApiKey);
    return () => window.removeEventListener('sales_db_update', checkApiKey);
  }, []);

  const generateLocalMock = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const kpis = dbService.getKPIs();
      const products = dbService.getProducts();
      const regions = dbService.getRegions();
      
      const revVal = kpis.find(k => k.title === 'Total Revenue')?.value || '$0';
      const marginVal = kpis.find(k => k.title === 'Profit Margin')?.value || '0%';
      const topProd = products[0]?.name || 'N/A';
      const topReg = regions[0]?.name || 'N/A';

      setInsights([
        {
          type: 'trend',
          title: 'Strong Performance',
          description: `Total revenue stands at a solid ${revVal} with a healthy average profit margin of ${marginVal}.`
        },
        {
          type: 'concern',
          title: 'Inventory Concentration',
          description: `The sales matrix is heavily dependent on "${topProd}". Underperforming categories need active promotion.`
        },
        {
          type: 'recommendation',
          title: 'Regional Expansion',
          description: `Capitalize on high conversions in the "${topReg}" region by reallocating direct marketing campaigns there.`
        }
      ]);
      setLoading(false);
    }, 1200);
  };

  const generateAIInsights = async () => {
    if (!apiKey) {
      setError('Gemini API key is not configured.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const kpis = dbService.getKPIs();
      const monthlySales = dbService.getSales();
      const categories = dbService.getCategory();
      const regions = dbService.getRegions();
      const products = dbService.getProducts().slice(0, 5);

      const datasetSummary = {
        totalRevenue: kpis.find(k => k.title === 'Total Revenue')?.value,
        totalProfit: kpis.find(k => k.title === 'Total Profit')?.value,
        margin: kpis.find(k => k.title === 'Profit Margin')?.value,
        totalOrders: kpis.find(k => k.title === 'Total Orders')?.value,
        recentMonthlyTrend: monthlySales.map(s => ({ month: s.month, revenue: s.revenue, profit: s.profit })),
        categoryShare: categories.map(c => ({ name: c.name, revenue: c.revenue, profit: c.profit, margin: c.margin })),
        regionShare: regions.map(r => ({ name: r.name, revenue: r.revenue, profit: r.profit })),
        topProducts: products.map(p => ({ name: p.name, revenue: p.revenue, units: p.units }))
      };

      const systemPrompt = `You are an expert enterprise business analyst. Review the provided sales analytics dataset summary and return exactly 3 key business insights in a JSON array format.
Each object in the array MUST contain "type", "title", and "description".
- Object 1 type MUST be "trend" (identifying a strong growth trajectory or positive metric).
- Object 2 type MUST be "concern" (identifying a risk, drop-off, or inventory concentration).
- Object 3 type MUST be "recommendation" (an actionable, high-impact tactical strategy).

JSON structure MUST match:
[
  {
    "type": "trend",
    "title": "Short title describing the trend",
    "description": "Elaborate detail with specific metrics."
  },
  ...
]

Keep explanations extremely concise (1-2 sentences). Respond ONLY with the raw JSON array. Do not wrap in markdown blocks or include pre-text.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nDataset Summary:\n${JSON.stringify(datasetSummary, null, 2)}` }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API returned HTTP status ${response.status}`);
      }

      const responseData = await response.json();
      const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Clean up markdown block wraps if returned
      const cleanJsonStr = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsedInsights = JSON.parse(cleanJsonStr);
      if (Array.isArray(parsedInsights) && parsedInsights.length === 3) {
        setInsights(parsedInsights);
      } else {
        throw new Error('Invalid JSON structure returned by Gemini.');
      }
    } catch (err: any) {
      console.error('Gemini Insights Error:', err);
      setError('Failed to load AI insights. Using local statistical fallback.');
      generateLocalMock();
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />;
      case 'concern':
        return <AlertCircle size={16} className="text-rose-600 dark:text-rose-450 stroke-[2.5]" />;
      default:
        return <Lightbulb size={16} className="text-amber-500 stroke-[2.5]" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'trend':
        return 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30';
      case 'concern':
        return 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
      default:
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-450 border border-amber-150/40 dark:border-amber-900/30';
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/70 dark:border-slate-800/80 shadow-sm h-full flex flex-col justify-between text-left">
      <div className="space-y-5">
        <div className="flex justify-between items-center pb-3.5 border-b border-slate-100 dark:border-slate-800/50">
          <h3 className="text-base font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
            <Sparkles size={17} className="text-indigo-500" />
            AI Executive Insights
          </h3>
          {hasKey && insights.length > 0 && !loading && (
            <button 
              onClick={generateAIInsights}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition-all duration-200 cursor-pointer"
              title="Refresh Insights"
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
            {error}
          </div>
        )}

        {loading ? (
          /* Typewriter loader block */
          <div className="space-y-4 py-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : insights.length > 0 ? (
          /* Render parsed insights */
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div 
                key={i} 
                className="flex gap-3.5 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100/50 dark:border-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-805/30 transition-all"
              >
                <div className={`p-2 rounded-lg shrink-0 w-8 h-8 flex items-center justify-center ${getBadgeStyle(insight.type)}`}>
                  {getIcon(insight.type)}
                </div>
                <div className="space-y-0.5 text-left">
                  <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-200 capitalize">{insight.title}</h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed font-medium">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty / Trigger State */
          <div className="py-6 text-center space-y-4">
            {!hasKey ? (
              <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/20 p-4 rounded-xl space-y-2 text-left">
                <div className="flex gap-2 text-indigo-650 dark:text-indigo-400 font-bold text-xs">
                  <Key size={14} className="mt-0.5" />
                  <span>Gemini Integration Available</span>
                </div>
                <p className="text-[10px] text-slate-450 dark:text-slate-450 leading-relaxed">
                  Provide a **Gemini API Key** in the **Settings** panel to unlock real-time business diagnostics, inventory concentration checks, and growth predictions.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">Ready to analyze sales performance dataset using Gemini.</p>
            )}

            <div className="flex flex-col gap-2 pt-2">
              {hasKey ? (
                <button
                  onClick={generateAIInsights}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide shadow-md hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={13} />
                  GENERATE AI INSIGHTS
                </button>
              ) : (
                <button
                  onClick={generateLocalMock}
                  className="bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-all border border-slate-200/50 dark:border-slate-700/50 cursor-pointer"
                >
                  GENERATE MOCK ANALYSIS
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-[9px] text-slate-400 dark:text-slate-500 text-center pt-4 border-t border-slate-100 dark:border-slate-800/50">
        AI analysis uses client-side endpoint processing.
      </div>
    </div>
  );
}

