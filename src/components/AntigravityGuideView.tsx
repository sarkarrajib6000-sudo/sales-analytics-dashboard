import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Code2, 
  Laptop, 
  BookOpen, 
  ArrowUpRight, 
  Check, 
  Copy, 
  Play, 
  Sparkles, 
  Settings, 
  Layers, 
  Lock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

// Subdocs paths for local references
const SUBDOCS = {
  cli: 'file:///data/data/com.termux/files/home/.gemini/antigravity-cli/builtin/skills/antigravity_guide/references/cli.md',
  ide: 'file:///data/data/com.termux/files/home/.gemini/antigravity-cli/builtin/skills/antigravity_guide/references/ide.md',
  app: 'file:///data/data/com.termux/files/home/.gemini/antigravity-cli/builtin/skills/antigravity_guide/references/app.md',
  sdk: 'file:///data/data/com.termux/files/home/.gemini/antigravity-cli/builtin/skills/antigravity_guide/references/sdk.md'
};

export function AntigravityGuideView() {
  const [activeSubTab, setActiveSubTab] = useState<'cli' | 'ide' | 'app' | 'sdk' | 'web'>('cli');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // CLI state
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<Array<{ type: 'input' | 'output' | 'error', text: string | React.ReactNode }>>([
    { type: 'output', text: 'Welcome to Antigravity CLI (agy) v2.5.0' },
    { type: 'output', text: 'Type /help or a command to begin.' }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cliHistory]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const executeCliCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory = [...cliHistory, { type: 'input' as const, text: trimmed }];

    if (trimmed.startsWith('/')) {
      const parts = trimmed.split(' ');
      const action = parts[0].toLowerCase();

      switch (action) {
        case '/help':
          newHistory.push({
            type: 'output',
            text: (
              <div className="space-y-1">
                <p className="text-indigo-400 font-bold">Available Interactive commands:</p>
                <p>  <span className="text-emerald-400">/context</span> - View what is currently loaded in active context</p>
                <p>  <span className="text-emerald-400">/diff</span> - Inspect active local edits</p>
                <p>  <span className="text-emerald-400">/skills</span> - List loaded agent capabilities</p>
                <p>  <span className="text-emerald-400">/config</span> - Display CLI settings</p>
                <p>  <span className="text-emerald-400">/clear</span> - Reset terminal session</p>
              </div>
            )
          });
          break;
        case '/context':
          newHistory.push({
            type: 'output',
            text: (
              <div className="space-y-1">
                <p className="text-slate-400 font-semibold">Active Agent Context (2 files, 1 workspace):</p>
                <p className="text-xs text-indigo-300"> • [workspace] /data/data/com.termux/files/home/downloads</p>
                <p className="text-xs text-indigo-300"> • [file] src/App.tsx</p>
                <p className="text-xs text-indigo-300"> • [file] src/components/Sidebar.tsx</p>
              </div>
            )
          });
          break;
        case '/diff':
          newHistory.push({
            type: 'output',
            text: (
              <div className="font-mono text-xs text-left bg-slate-950 p-2 rounded border border-slate-800">
                <p className="text-emerald-400">+ import { "AntigravityGuideView" } from './components/AntigravityGuideView';</p>
                <p className="text-emerald-400">+ activeTab === 'guide' && &lt;AntigravityGuideView /&gt;</p>
                <p className="text-slate-500">  // App active view router logic successfully synchronized</p>
              </div>
            )
          });
          break;
        case '/skills':
          newHistory.push({
            type: 'output',
            text: (
              <div className="space-y-1">
                <p className="text-slate-400 font-semibold">Loaded Workspace Skills:</p>
                <p> • <span className="text-purple-400">antigravity-guide</span> - Comprehensive sitemap and guides</p>
                <p> • <span className="text-purple-400">sales-analytics-utils</span> - Local CSV parsed formulas</p>
              </div>
            )
          });
          break;
        case '/config':
          newHistory.push({
            type: 'output',
            text: (
              <div className="font-mono text-xs">
                <p className="text-amber-400">{"{"}</p>
                <p>  "model": "gemini-3.5-flash",</p>
                <p>  "enableTerminalSandbox": true,</p>
                <p>  "allowNonWorkspaceAccess": false,</p>
                <p>  "artifactReviewPolicy": "asks-for-review"</p>
                <p className="text-amber-400">{"}"}</p>
              </div>
            )
          });
          break;
        case '/clear':
          setCliHistory([]);
          setCliInput('');
          return;
        default:
          newHistory.push({
            type: 'error',
            text: `Command "${action}" not recognized. Type /help to see all interactive triggers.`
          });
      }
    } else {
      newHistory.push({
        type: 'output',
        text: `Command interpreted. Running prompt on Gemini... [Simulated Response: You typed "${trimmed}". Under active workspace context.]`
      });
    }

    setCliHistory(newHistory);
    setCliInput('');
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 p-8 text-white border border-indigo-850/50 shadow-md">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider animate-pulse">
              <Sparkles size={12} />
              AI Developer Hub
            </div>
            <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200">
              Google Antigravity
            </h2>
            <p className="text-sm text-slate-350 max-w-xl">
              Understand and master the local AI-first environment. Read reference files, try interactive CLI actions, inspect integration code blocks, or browse resources.
            </p>
          </div>
          <div className="flex gap-3">
            <a 
              href={SUBDOCS.cli}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all duration-200"
            >
              Raw Reference Docs
            </a>
          </div>
        </div>

        {/* Tab Selector inside View */}
        <div className="flex overflow-x-auto gap-2 mt-8 border-t border-white/10 pt-6 no-scrollbar">
          {[
            { id: 'cli', label: 'CLI (agy)', icon: TerminalIcon },
            { id: 'ide', label: 'IDE Extension', icon: Code2 },
            { id: 'app', label: 'Desktop App 2.0', icon: Laptop },
            { id: 'sdk', label: 'Python SDK', icon: BookOpen },
            { id: 'web', label: 'Web Documentation', icon: ArrowUpRight }
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-220 cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-white text-indigo-950 shadow-md scale-102' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Contents */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* CLI Tab */}
        {activeSubTab === 'cli' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-900 shadow-xl overflow-hidden flex flex-col h-[480px]">
              {/* Terminal Title Bar */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                  <span className="text-xs font-bold text-slate-400 ml-2 font-mono">terminal - agy</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                  <Lock size={10} className="text-emerald-500" />
                  sandboxed
                </div>
              </div>

              {/* Terminal History */}
              <div className="flex-1 overflow-y-auto p-5 font-mono text-sm text-slate-200 space-y-3 scrollbar-thin">
                {cliHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    {item.type === 'input' && (
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-400 font-bold">~</span>
                        <span className="text-indigo-300 font-bold">$</span>
                        <span className="text-white">{item.text}</span>
                      </div>
                    )}
                    {item.type === 'output' && (
                      <div className="text-slate-300 leading-relaxed pl-4 border-l-2 border-slate-800">
                        {item.text}
                      </div>
                    )}
                    {item.type === 'error' && (
                      <div className="text-rose-400 pl-4 border-l-2 border-rose-900/60 font-semibold">
                        {item.text}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Command Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  executeCliCommand(cliInput);
                }}
                className="bg-slate-900 border-t border-slate-950 p-4 flex gap-2"
              >
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold font-mono">
                  <span>~</span>
                  <span>$</span>
                </div>
                <input 
                  type="text" 
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="Type a command (e.g. /context, /diff, /config)..." 
                  className="flex-1 bg-transparent border-0 outline-none text-white text-sm font-mono placeholder-slate-650"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-mono text-xs font-bold transition duration-200"
                >
                  Enter
                </button>
              </form>
            </div>

            {/* Quick Actions and Help List */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <TerminalIcon size={18} className="text-indigo-500" />
                  Terminal Shortcuts
                </h3>
                <div className="space-y-3.5">
                  {[
                    { cmd: '/context', label: 'View current active context files' },
                    { cmd: '/diff', label: 'Show changes made to files' },
                    { cmd: '/skills', label: 'List loaded custom skills' },
                    { cmd: '/config', label: 'Read settings.json config' }
                  ].map((x) => (
                    <div key={x.cmd} className="flex justify-between items-center gap-4 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <div className="text-left">
                        <code className="text-xs font-bold text-indigo-650 dark:text-indigo-400">{x.cmd}</code>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{x.label}</p>
                      </div>
                      <button 
                        onClick={() => executeCliCommand(x.cmd)}
                        className="p-1.5 rounded-lg bg-indigo-55 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 cursor-pointer transition"
                        title="Run in mock terminal"
                      >
                        <Play size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  Environment Status
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  The terminal emulator operates inside a secure user sandbox environment. External file access policies and internet filters are managed globally.
                </p>
                <a 
                  href={SUBDOCS.cli} 
                  className="inline-flex items-center gap-1 text-indigo-650 dark:text-indigo-400 font-bold hover:underline"
                >
                  Read full cli.md reference <ChevronRight size={12} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* IDE Tab */}
        {activeSubTab === 'ide' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'A. Passive Autocomplete',
                  tag: 'Tab Completion',
                  desc: 'A next-intent prediction engine mapped directly to your Tab key. Integrates local lines, doc additions, and cursor jumps.',
                  shortcut: 'Tab to Accept'
                },
                {
                  title: 'B. Instructive Inline Edit',
                  tag: 'Localized Edits',
                  desc: 'Run a direct selection prompt inside files. Highlights any code snippet to comment, refactor, or test in-place.',
                  shortcut: 'Ctrl + I / ⌘ + I'
                },
                {
                  title: 'C. Collaborative Agent',
                  tag: 'Complex Agentic Tasks',
                  desc: 'Launches a sidecar agent helper. Reads/writes multiple workspace files, executes commands, and searches online.',
                  shortcut: 'Sidebar Panel'
                }
              ].map((item) => (
                <div key={item.title} className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md p-6 rounded-2xl border border-slate-205/80 dark:border-slate-800/85 shadow-sm space-y-4">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                    {item.tag}
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-400">Trigger shortcut:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold border border-slate-200 dark:border-slate-700/80">{item.shortcut}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Editor mockup */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-6 font-mono text-xs text-left relative overflow-hidden">
              <div className="absolute right-4 top-4 bg-indigo-900/35 border border-indigo-500/20 px-2 py-1 rounded text-[10px] text-indigo-300 font-bold uppercase">
                Mock Code Canvas
              </div>
              <div className="space-y-1.5 text-slate-400">
                <p><span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-emerald-400">'react'</span>;</p>
                <p><span className="text-purple-400">import</span> {"{"} KpiCard {"}"} <span className="text-purple-400">from</span> <span className="text-emerald-400">'./KpiCard'</span>;</p>
                <p>&nbsp;</p>
                <p><span className="text-blue-400">export function</span> <span className="text-amber-400">Dashboard</span>() {"{"}</p>
                <p className="text-slate-500">  // Antigravity Autocomplete Suggestion:</p>
                <p className="bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded border-l-2 border-emerald-500 flex items-center justify-between">
                  <span>  const [kpis, setKpis] = useState(dbService.getKPIs());</span>
                  <span className="text-[10px] bg-emerald-800 text-white px-1.5 rounded animate-pulse font-sans">Press TAB to insert</span>
                </p>
                <p className="opacity-40">  return (</p>
                <p className="opacity-40">    &lt;div className="grid grid-cols-4 gap-6"&gt;</p>
                <p className="opacity-40">      ...</p>
                <p className="opacity-40">    &lt;/div&gt;</p>
                <p className="opacity-40">  );</p>
                <p><span className="text-blue-400">{"}"}</span></p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-indigo-50/40 dark:bg-indigo-950/15 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/40">
              <span className="text-xs text-slate-600 dark:text-slate-400">For complete inline editor instructions, review the local reference file.</span>
              <a 
                href={SUBDOCS.ide} 
                className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Read ide.md <ChevronRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Desktop App Tab */}
        {activeSubTab === 'app' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-205/85 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Laptop size={18} className="text-indigo-500" />
                Antigravity 2.0 Electron Client
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                The desktop app acts as an orchestrator completely independent of your IDE. It lets you run multiple parallel subagent processes, schedule automation cron triggers, configure folder access whitelist arrays, and manage sandbox permissions.
              </p>
            </div>

            {/* Electron mock diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sidebar Nav</span>
                <div className="space-y-1.5 text-left text-xs">
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">📁 Projects</div>
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">⏰ Scheduled Tasks</div>
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">⚙️ Settings</div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chat Canvas & Mentions</span>
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-950/40 text-left text-xs space-y-2">
                  <p className="text-slate-550 dark:text-slate-400">Ask a question or specify a path:</p>
                  <div className="bg-white dark:bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                    Create a new view using <span className="text-indigo-500 font-bold">@src/App.tsx</span> and configure permissions.
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auxiliary Pane</span>
                <div className="space-y-1.5 text-left text-xs">
                  <div className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-semibold">🤖 Subagents</div>
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">📜 Terminal Logs</div>
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">📄 File Diffs</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-indigo-50/40 dark:bg-indigo-950/15 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/40">
              <span className="text-xs text-slate-600 dark:text-slate-400">For global settings parameters details, read the app.md file.</span>
              <a 
                href={SUBDOCS.app} 
                className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Read app.md <ChevronRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Python SDK Tab */}
        {activeSubTab === 'sdk' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-205/85 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 size={18} className="text-indigo-500" />
                Python SDK Integration
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Integrate agents programmatically in pipelines, scripts, or testing suites. Exposes runtime binaries, streams reasoning logs, and yields parsed results.
              </p>

              {/* Install code block */}
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 select-none">$</span>
                  <span className="text-emerald-400">pip install google-antigravity</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('pip install google-antigravity', 'pip')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {copiedText === 'pip' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* SDK Code Playground mockup */}
            <div className="bg-slate-950 rounded-2xl border border-slate-900 shadow-lg overflow-hidden">
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-950 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>agent_quickstart.py</span>
                <button
                  type="button"
                  onClick={() => handleCopy(`import asyncio\nfrom google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig\n\nasync def main():\n    config = LocalAgentConfig(capabilities=CapabilitiesConfig())\n    async with Agent(config) as agent:\n        response = await agent.chat("Explain project structure")\n        async for token in response:\n            print(token, end="", flush=True)\n\nasyncio.run(main())`, 'code')}
                  className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {copiedText === 'code' ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-6 font-mono text-xs text-left text-slate-350 space-y-1">
                <p><span className="text-rose-400">import</span> asyncio</p>
                <p><span className="text-rose-400">from</span> google.antigravity <span className="text-rose-400">import</span> Agent, LocalAgentConfig, CapabilitiesConfig</p>
                <p>&nbsp;</p>
                <p><span className="text-blue-400">async def</span> <span className="text-amber-400">main</span>():</p>
                <p className="text-slate-500">    # Configure capabilities enabling write tools (command running, editing)</p>
                <p>    config = LocalAgentConfig(capabilities=CapabilitiesConfig())</p>
                <p>&nbsp;</p>
                <p>    <span className="text-blue-400">async with</span> Agent(config) <span className="text-blue-400">as</span> agent:</p>
                <p>        response = <span className="text-blue-400">await</span> agent.chat(<span className="text-emerald-400">"List files in active workspace"</span>)</p>
                <p>&nbsp;</p>
                <p className="text-slate-550">        # Async token stream rendering</p>
                <p>        <span className="text-blue-400">async for</span> token <span className="text-blue-400">in</span> response:</p>
                <p>            print(token, end=<span className="text-emerald-400">""</span>, flush=<span className="text-blue-400">True</span>)</p>
                <p>&nbsp;</p>
                <p><span className="text-rose-400">if</span> __name__ == <span className="text-emerald-400">"__main__"</span>:</p>
                <p>    asyncio.run(main())</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-indigo-50/40 dark:bg-indigo-950/15 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/40">
              <span className="text-xs text-slate-600 dark:text-slate-400">For programmatic agent leasing and SDK event streams, read sdk.md.</span>
              <a 
                href={SUBDOCS.sdk} 
                className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Read sdk.md <ChevronRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Web Documentation Tab */}
        {activeSubTab === 'web' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Main Documentation Home', url: 'https://antigravity.google/docs', desc: 'Central guide hub covering onboarding, architecture, and commands.' },
                { title: 'Agent Skills & Actions', url: 'https://antigravity.google/docs/skills', desc: 'How to structure and register custom skills inside .agents/' },
                { title: 'Workspace Agent Rules', url: 'https://antigravity.google/docs/rules', desc: 'Persisting directives, guidelines, and context overrides via AGENTS.md' },
                { title: 'Lifecycle Hooks & Pipelines', url: 'https://antigravity.google/docs/hooks', desc: 'Configure pre-run and post-run triggers in your workspace workflows.' },
                { title: 'Plugins & Extension Core', url: 'https://antigravity.google/docs/plugins', desc: 'Create sidecar tools, custom menus, and web client layouts.' },
                { title: 'Model Context Protocol (MCP)', url: 'https://antigravity.google/docs/mcp', desc: 'Standardize tool schemas and server-to-agent data channels.' },
                { title: 'Agent Security & Permissions', url: 'https://antigravity.google/docs/agent-permissions', desc: 'Control sandboxing flags, domain lists, and filesystem filters.' },
                { title: 'Changelog & Releases', url: 'https://antigravity.google/changelog', desc: 'See recent updates, fixes, and engine improvement histories.' }
              ].map((doc) => (
                <a 
                  key={doc.title}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-850 hover:shadow-md transition-all duration-200 group text-left flex flex-col justify-between h-40"
                >
                  <div className="space-y-2">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 flex items-center justify-between">
                      {doc.title}
                      <ArrowUpRight size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </h4>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">{doc.desc}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono select-all">{doc.url}</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
