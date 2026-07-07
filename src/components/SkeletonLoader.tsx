import React from 'react';

// Base pulse block for consistent dark-mode aware shimmers
export function SkeletonBlock({ className = '', style, ...props }: { className?: string, style?: React.CSSProperties, [key: string]: any }) {
  return (
    <div 
      className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg ${className}`} 
      style={style}
      {...props}
    />
  );
}

// Skeleton structure for KPI Cards
export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <SkeletonBlock className="h-4 w-1/2" />
              <SkeletonBlock className="h-8 w-3/4" />
            </div>
            <SkeletonBlock className="w-10 h-10 rounded-lg" />
          </div>
          <SkeletonBlock className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}

// Skeleton structure for Line/Bar charts
export function ChartSkeleton({ title = 'Analyzing Performance...' }: { title?: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5 w-1/3">
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
        <SkeletonBlock className="h-6 w-16" />
      </div>
      {/* Visualizing Bar/Line Chart Grid Bars */}
      <div className="h-[240px] flex items-end justify-between gap-4 pt-4 border-b border-l border-slate-100 dark:border-slate-800/60 pl-4">
        {[20, 45, 30, 80, 60, 95, 70, 40, 85, 50, 65, 90].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <SkeletonBlock 
              className="w-full rounded-t-md" 
              style={{ height: `${height}%` }} 
            />
            <SkeletonBlock className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton structure for table elements
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
        <SkeletonBlock className="h-5 w-1/4" />
        <SkeletonBlock className="h-3 w-1/3" />
      </div>
      <div className="p-6 space-y-4">
        {/* Table Header mock */}
        <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <SkeletonBlock className="h-4 w-1/6" />
          <SkeletonBlock className="h-4 w-1/4" />
          <SkeletonBlock className="h-4 w-1/6" />
          <SkeletonBlock className="h-4 w-12" />
        </div>
        {/* Table Rows mocks */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-3 w-1/3">
              <SkeletonBlock className="w-8 h-8 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="h-3 w-1/2" />
              </div>
            </div>
            <SkeletonBlock className="h-4 w-1/6" />
            <SkeletonBlock className="h-4 w-1/6" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton structure for generic list components
export function ListSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="space-y-1.5 mb-4">
        <SkeletonBlock className="h-5 w-1/3" />
        <SkeletonBlock className="h-3 w-1/2" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3 w-2/3">
              <SkeletonBlock className="w-8 h-8 rounded-lg" />
              <div className="space-y-1.5 flex-1">
                <SkeletonBlock className="h-4 w-1/2" />
                <SkeletonBlock className="h-3 w-1/4" />
              </div>
            </div>
            <SkeletonBlock className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// View-specific composite skeleton loaders
export function ViewSkeleton({ type }: { type: string }) {
  switch (type) {
    case 'dashboard':
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-1/3" />
            <SkeletonBlock className="h-4 w-1/2" />
          </div>
          <KpiSkeleton />
          <ChartSkeleton title="Analyzing Revenue Trends..." />
          <TableSkeleton rows={4} />
        </div>
      );
    case 'revenue':
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2 w-1/2">
              <SkeletonBlock className="h-8 w-2/3" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
            <SkeletonBlock className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartSkeleton title="Consolidating Annual Revenue..." />
            <ChartSkeleton title="Mapping Category Shares..." />
            <ListSkeleton />
            <ListSkeleton />
            <ChartSkeleton title="Calculating Regional Distribution..." />
            <ChartSkeleton title="Proportioning Acquisition Channels..." />
          </div>
        </div>
      );
    case 'profit':
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2 w-1/2">
            <SkeletonBlock className="h-8 w-2/3" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartSkeleton title="Calculating Profit growth..." />
            <ChartSkeleton title="Charting Division Margins..." />
            <ChartSkeleton title="Evaluating Category Efficiencies..." />
            <ChartSkeleton title="Analyzing Individual Profit Contribution..." />
          </div>
        </div>
      );
    case 'product':
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2 w-1/2">
              <SkeletonBlock className="h-8 w-2/3" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
            <SkeletonBlock className="h-10 w-36" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ListSkeleton />
            <ListSkeleton />
          </div>
          <TableSkeleton rows={6} />
        </div>
      );
    case 'orders':
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2 w-1/2">
              <SkeletonBlock className="h-8 w-2/3" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-10 w-28" />
              <SkeletonBlock className="h-10 w-28" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ChartSkeleton title="Indexing Backlogs..." />
            <ChartSkeleton title="Charting Priorities..." />
            <ChartSkeleton title="Mapping Deliveries..." />
          </div>
          <TableSkeleton rows={5} />
        </div>
      );
    case 'customers':
      return (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2 w-1/2">
            <SkeletonBlock className="h-8 w-2/3" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartSkeleton title="Synthesizing Account Lifetimes..." />
            <ChartSkeleton title="Analyzing Placement Volume..." />
          </div>
          <TableSkeleton rows={6} />
        </div>
      );
    default:
      return (
        <div className="space-y-6">
          <KpiSkeleton />
          <TableSkeleton />
        </div>
      );
  }
}
