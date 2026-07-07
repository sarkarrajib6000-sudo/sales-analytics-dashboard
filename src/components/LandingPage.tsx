import React from 'react';
import { ArrowRight, BarChart3, TrendingUp, Users, CheckCircle2, Sparkles, Activity } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center p-6 text-white font-sans">
      {/* Background Glowing Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 py-12">
        {/* Left Column: Hero Copy & CTA */}
        <div className="lg:col-span-6 space-y-8 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-semibold tracking-wide">
            <Sparkles size={14} className="text-purple-400 animate-pulse" />
            <span>Next-Generation Sales Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            Visualize Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Sales Success</span> in Real-Time.
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
            Turn complex transaction records and CSV spreadsheets into stunning, interactive insights. Empower your sales operation with high-fidelity charts, cohort statistics, and revenue projections.
          </p>

          {/* Quick Checklist */}
          <ul className="space-y-3.5 text-slate-300">
            <li className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-medium">Automatic CSV parsing & dynamic metrics</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-purple-500/20 text-purple-400">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-medium">Monthly revenue trend & profit margins overlap</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-pink-500/20 text-pink-400">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-medium">Interactive regional distribution map & tables</span>
            </li>
          </ul>

          {/* Call to Action */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button 
              onClick={onGetStarted}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-base flex items-center gap-2.5 transition-all shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-indigo-500 cursor-pointer"
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            
            <div className="flex items-center gap-2 text-slate-400 text-xs px-2 py-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Offline LocalStorage Sync Enabled</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Dashboard Mockup */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="relative w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl overflow-hidden hover:border-white/20 transition-all duration-500 group select-none">
            {/* Header of Preview */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono tracking-wider text-slate-500">AERO_ANALYTICS_V1.0</span>
              <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-indigo-300">RJ</span>
              </div>
            </div>

            {/* Mock KPI Section */}
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Revenue</span>
                  <BarChart3 size={12} className="text-indigo-400" />
                </div>
                <h4 className="text-lg font-bold mt-1 text-white">$148,250</h4>
                <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded mt-1.5 inline-block">+18.4%</span>
              </div>

              <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Profit Margin</span>
                  <TrendingUp size={12} className="text-purple-400" />
                </div>
                <h4 className="text-lg font-bold mt-1 text-white">35.4%</h4>
                <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded mt-1.5 inline-block">+3.2%</span>
              </div>
            </div>

            {/* Mock Chart Area */}
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className="text-pink-400" />
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Performance Trend</span>
                </div>
                <span className="text-[9px] text-slate-500 font-medium">Jan - Jul 2026</span>
              </div>

              {/* Graphic Columns */}
              <div className="h-28 flex items-end justify-between gap-1.5 pt-2">
                {[30, 48, 65, 45, 75, 90, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group-hover:scale-y-105 transition-transform duration-500 origin-bottom">
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-sm" 
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-slate-500 font-bold">
                      {['J', 'F', 'M', 'A', 'M', 'J', 'J'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Table/List Row */}
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={12} className="text-indigo-400" />
                <div className="min-w-0">
                  <h5 className="text-[10px] font-bold text-white truncate max-w-[120px]">Acme Corporation</h5>
                  <p className="text-[8px] text-slate-500">12 Jan 2026</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">$1,200</span>
            </div>
            
            {/* Soft decorative elements */}
            <div className="absolute top-[20%] right-[-10%] w-[120px] h-[120px] rounded-full bg-indigo-500/20 blur-[30px] pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

