import { RefreshCw } from "lucide-react";

export default function TopBar({ onRefresh, lastRefresh }) {
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
      <div>
        {lastRefresh && (
          <p className="text-xs text-slate-400">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        )}
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <RefreshCw size={14} />
        Refresh
      </button>
    </header>
  );
}
