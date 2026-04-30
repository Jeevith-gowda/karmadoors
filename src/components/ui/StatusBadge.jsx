const map = {
  active:   "bg-emerald-100 text-emerald-800",
  inactive: "bg-red-100 text-red-800",
  paid:     "bg-emerald-100 text-emerald-800",
  unpaid:   "bg-red-100 text-red-800",
  overdue:  "bg-red-100 text-red-800",
  partial:  "bg-amber-100 text-amber-800",
  pending:  "bg-indigo-100 text-indigo-800",
  current:  "bg-emerald-100 text-emerald-800",
  occupied: "bg-emerald-100 text-emerald-800",
  vacant:   "bg-slate-100 text-slate-600",
};

export default function StatusBadge({ status }) {
  const s = status?.toLowerCase() || "unknown";
  const cls = map[s] || "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}
