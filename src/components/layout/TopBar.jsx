import { RefreshCw, Menu } from "lucide-react";

export default function TopBar({ onRefresh, lastRefresh, onMenuOpen }) {
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        {lastRefresh && (
          <p className="text-xs text-slate-400 hidden sm:block">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        )}
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <RefreshCw size={14} />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </header>
  );
}
