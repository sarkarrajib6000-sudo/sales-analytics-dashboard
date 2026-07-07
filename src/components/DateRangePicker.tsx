import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Check, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { dbService, DateFilter } from '../lib/dbService';

export function DateRangePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<DateFilter>(dbService.getDateRange());
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen to external updates (e.g. database resets)
  useEffect(() => {
    const handleUpdate = () => {
      setFilter(dbService.getDateRange());
    };
    window.addEventListener('sales_db_update', handleUpdate);
    return () => window.removeEventListener('sales_db_update', handleUpdate);
  }, []);

  const handleApplyFilter = (newFilter: DateFilter) => {
    dbService.setDateRange(newFilter);
    setFilter(newFilter);
    setIsOpen(false);
  };

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) return;
    handleApplyFilter({
      type: 'custom',
      customStart,
      customEnd
    });
  };

  // Get human-readable button label based on active filter
  const getFilterLabel = () => {
    if (!filter || filter.type === 'all') return 'All Time';
    if (filter.type === 'year') return `Year ${filter.year}`;
    if (filter.type === 'quarter') return `${filter.quarter} ${filter.year}`;
    if (filter.type === 'month') return `${filter.month} ${filter.year}`;
    if (filter.type === 'custom') {
      const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      };
      return `${formatDate(filter.customStart)} - ${formatDate(filter.customEnd)}`;
    }
    return 'Date Filter';
  };

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = ['2026', '2025', '2024'];

  return (
    <div className="relative" ref={containerRef} id="global-date-range-picker">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-all shadow-sm focus:outline-none"
      >
        <Calendar size={16} className="text-indigo-500 dark:text-indigo-400" />
        <span className="min-w-[80px] text-left">{getFilterLabel()}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute top-11 left-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-5 w-[360px] md:w-[420px] text-slate-800 dark:text-slate-100 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-indigo-600 dark:text-indigo-400" />
              Global Date Filters
            </h4>
            <button
              onClick={() => handleApplyFilter({ type: 'all' })}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Clear Filter
            </button>
          </div>

          <div className="space-y-4">
            {/* Quick Actions / All Time */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleApplyFilter({ type: 'all' })}
                className={`text-xs font-semibold p-2 rounded-lg border text-center transition-all ${
                  filter.type === 'all'
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100/50 dark:bg-slate-800/50 dark:border-slate-700/40'
                }`}
              >
                All Time (Unified)
              </button>
              <button
                onClick={() => handleApplyFilter({ type: 'year', year: '2025' })}
                className={`text-xs font-semibold p-2 rounded-lg border text-center transition-all ${
                  filter.type === 'year' && filter.year === '2025'
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100/50 dark:bg-slate-800/50 dark:border-slate-700/40'
                }`}
              >
                Full Year 2025
              </button>
            </div>

            {/* Target Year Selector */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">Target Year</span>
              <div className="flex gap-1 ml-auto">
                {years.map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`text-xs font-bold px-3 py-1 rounded-md transition-all ${
                      selectedYear === yr
                        ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Quarters Selection */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Quarterly Analysis ({selectedYear})</p>
              <div className="grid grid-cols-4 gap-2">
                {quarters.map(q => {
                  const isActive = filter.type === 'quarter' && filter.year === selectedYear && filter.quarter === q;
                  return (
                    <button
                      key={q}
                      onClick={() => handleApplyFilter({ type: 'quarter', year: selectedYear, quarter: q })}
                      className={`text-xs font-bold py-2 rounded-lg border text-center transition-all ${
                        isActive
                          ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400'
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50 dark:bg-slate-800/40 dark:border-slate-800/50'
                      }`}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monthly Selection */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Monthly Analysis ({selectedYear})</p>
              <div className="grid grid-cols-4 gap-1.5">
                {months.map(m => {
                  // Disable future months for 2026 (Aug onwards)
                  const isFuture2026 = selectedYear === '2026' && months.indexOf(m) > 6;
                  const isActive = filter.type === 'month' && filter.year === selectedYear && filter.month === m;
                  
                  return (
                    <button
                      key={m}
                      disabled={isFuture2026}
                      onClick={() => handleApplyFilter({ type: 'month', year: selectedYear, month: m })}
                      className={`text-[11px] font-semibold py-1.5 rounded-md border text-center transition-all ${
                        isFuture2026
                          ? 'opacity-30 cursor-not-allowed border-transparent'
                          : isActive
                          ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50 dark:bg-slate-800/40 dark:border-slate-800/50'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Range Selector */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Custom Range Period</p>
              <form onSubmit={handleCustomApply} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-400 font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <ArrowRight size={14} className="text-slate-400 mt-5 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-400 font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Apply Custom Range
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
