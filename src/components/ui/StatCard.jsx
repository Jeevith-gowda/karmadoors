export default function StatCard({ label, value, sub, icon: Icon, accentColor = "indigo", loading }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green:  "bg-emerald-50 text-emerald-600",
    amber:  "bg-amber-50 text-amber-600",
    blue:   "bg-blue-50 text-blue-600",
    red:    "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[accentColor]}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
        {loading
          ? <div className="h-7 w-24 bg-slate-100 rounded animate-pulse" />
          : <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
        }
        {sub && !loading && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
