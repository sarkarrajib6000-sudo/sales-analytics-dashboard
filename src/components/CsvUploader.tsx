import React, { useState, useCallback, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import { Upload, Download, Info, FileText, CheckCircle, MoreVertical } from 'lucide-react';

interface CsvUploaderProps {
  onDataLoaded: (data: any[]) => void;
}

export function CsvUploader({ onDataLoaded }: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parseCsvFile = (file: File) => {
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoaded(results.data);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) parseCsvFile(file);
  }, [onDataLoaded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'text/csv') {
      parseCsvFile(file);
    }
  }, [onDataLoaded]);

  // Generate and download a sample CSV file
  const downloadSampleCSV = () => {
    const headers = [
      'id', 'customer', 'segment', 'date', 'status', 'revenue', 
      'profit', 'priority', 'productName', 'category', 'region', 
      'country', 'channel'
    ];
    
    const sampleRows = [
      ['ORD-2001', 'Acme Corporation', 'Enterprise', '12 Jan 2026', 'Delivered', '1200', '432', 'High', 'Pro Laptop 15"', 'Electronics', 'North America', 'United States', 'Online Direct'],
      ['ORD-2002', 'Stark Industries', 'Enterprise', '15 Feb 2026', 'Shipped', '150', '45', 'Critical', 'Smart Fitness Watch', 'Electronics', 'Europe', 'United Kingdom', 'Wholesale B2B'],
      ['ORD-2003', 'Initech LLC', 'SMB', '22 Mar 2026', 'Processing', '250', '70', 'Medium', 'Ergonomic Desk Chair', 'Home & Kitchen', 'North America', 'Canada', 'Retail Store'],
      ['ORD-2004', 'Dunder Mifflin', 'SMB', '05 Apr 2026', 'Cancelled', '50', '17', 'Low', 'Duffle Sports Bag', 'Sports & Outdoors', 'North America', 'United States', 'Social Commerce']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sales_data_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const requiredColumns = [
    { name: 'customer', desc: 'Customer name (e.g., Acme Corporation)', required: true },
    { name: 'revenue', desc: 'Revenue amount as a number (e.g., 1200)', required: true },
    { name: 'date', desc: 'Format: DD MMM YYYY (e.g., 12 Jan 2026)', required: false },
    { name: 'productName', desc: 'Product purchased (e.g., Pro Laptop 15")', required: false },
    { name: 'profit', desc: 'Profit amount (defaults to 35% of revenue)', required: false },
    { name: 'status', desc: 'Delivered | Shipped | Processing | Cancelled', required: false },
    { name: 'priority', desc: 'Critical | High | Medium | Low', required: false },
    { name: 'category', desc: 'Electronics | Home & Kitchen | Sports & Outdoors', required: false },
    { name: 'segment', desc: 'Enterprise | Mid-Market | SMB', required: false },
    { name: 'region', desc: 'North America | Europe | Asia', required: false },
    { name: 'country', desc: 'United States | Canada | United Kingdom | Germany | Japan', required: false },
    { name: 'channel', desc: 'Online Direct | Retail Store | Wholesale B2B | Social Commerce', required: false },
  ];

  return (
    <div className="space-y-3" id="csv-uploader-section">
      {/* Compact Upload Bar */}
      <div className="flex items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/85 rounded-2xl p-2.5 px-4 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 flex items-center gap-3.5 cursor-pointer select-none rounded-xl p-2 transition-all duration-200 ${
            isDragging
              ? 'bg-indigo-50/50 dark:bg-indigo-950/20 outline-2 outline-dashed outline-indigo-500'
              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
          }`}
        >
          {/* Hidden file input */}
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className={`p-2 rounded-xl transition-colors shadow-xs ${
            uploadSuccess 
              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-450' 
              : 'bg-indigo-555/10 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
          }`}>
            {uploadSuccess ? <CheckCircle size={16} /> : <Upload size={16} />}
          </div>
          
          <div className="min-w-0 flex-1 text-left">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 leading-tight">
              {uploadSuccess ? 'Data Loaded' : 'Import Custom Sales CSV'}
              {uploadSuccess && (
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md">
                  Success
                </span>
              )}
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[200px] sm:max-w-xs md:max-w-md leading-tight mt-0.5 font-medium">
              {uploadSuccess 
                ? `File: ${fileName}` 
                : 'Drag file here or click to browse'}
            </p>
          </div>
        </div>

        {/* 3-Dot Dropdown Trigger */}
        <div className="relative flex items-center" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-655 dark:hover:text-slate-300 transition-colors cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
            title="Options"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/80 rounded-xl shadow-lg z-50 p-1 w-48 text-slate-700 dark:text-slate-200 animate-fade-in">
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
              >
                <Upload size={14} className="text-indigo-500" />
                Browse Files
              </button>
              
              <button
                onClick={() => {
                  downloadSampleCSV();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
              >
                <Download size={14} className="text-emerald-500" />
                Get Template CSV
              </button>
              
              <div className="border-t border-slate-100 dark:border-slate-800/80 my-1"></div>
              
              <button
                onClick={() => {
                  setShowFormatGuide(!showFormatGuide);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
              >
                <Info size={14} className="text-amber-500" />
                {showFormatGuide ? 'Hide Format Guide' : 'Format Guide'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Accordion Format & Column Guide */}
      {showFormatGuide && (
        <div className="bg-slate-50/50 dark:bg-slate-950/30 backdrop-blur-xs border border-slate-250/50 dark:border-slate-850 rounded-2xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-205 dark:border-slate-800/80 pb-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-550 flex items-center gap-1.5">
              <FileText size={12} className="text-indigo-500" />
              CSV Format Specifications
            </h4>
            <span className="text-[9px] text-slate-400 font-bold">Headers are case-sensitive</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {requiredColumns.map((col) => (
              <div 
                key={col.name} 
                className="flex flex-col p-3 bg-white dark:bg-slate-900/90 border border-slate-150/50 dark:border-slate-800/80 rounded-xl hover:shadow-xs hover:border-slate-300/60 dark:hover:border-slate-700/60 transition-all text-left"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <code className="text-[10px] font-mono font-black text-indigo-650 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/35 px-2 py-0.5 rounded-md">
                    {col.name}
                  </code>
                  {col.required ? (
                    <span className="text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20">
                      Required
                    </span>
                  ) : (
                    <span className="text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {col.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-550/5 border border-indigo-100/50 dark:border-indigo-900/35 p-3 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5 text-left">
            <Info size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <p className="font-black text-slate-700 dark:text-slate-300">Format & Analysis Tips</p>
              <p className="leading-relaxed">
                Ensure <strong>revenue</strong> is a valid number, and <strong>date</strong> follows <code>DD MMM YYYY</code> (e.g. <code>24 May 2025</code>). Optional values default automatically if left out.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
