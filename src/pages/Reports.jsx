import { Building2, CheckCircle, DollarSign, TrendingUp } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import Table    from "../components/ui/Table";
import { fmt$ } from "../utils/formatters";

export default function Reports({ data, loading }) {
  const { properties = [], leases = [], payments = [] } = data;

  const activeLeases  = leases.filter(l => l.status === "active").length;
  const totalMonthly  = leases.reduce((s, l) => s + (l.recurringCharges?.[0]?.amount || 0), 0);
  const occupancyRate = properties.length
    ? Math.round((activeLeases / properties.length) * 100)
    : 0;

  const byProp = {};
  payments.forEach(p => {
    const key = p.propertyName || "Unknown";
    if (!byProp[key]) byProp[key] = { collected: 0, outstanding: 0 };
    if (p.status !== "unpaid" && p.status !== "overdue") byProp[key].collected += p.amount || 0;
    else byProp[key].outstanding += p.amount || 0;
  });

  const propRows = Object.entries(byProp).map(([name, v]) => {
    const total = v.collected + v.outstanding;
    const pct   = total > 0 ? Math.round((v.collected / total) * 100) : 0;
    return [
      name,
      fmt$(v.collected),
      fmt$(v.outstanding),
      fmt$(total),
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div style={{ width: `${pct}%` }} className="h-full bg-emerald-500 rounded-full" />
        </div>
        <span className="text-xs text-slate-500 w-8">{pct}%</span>
      </div>,
    ];
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Properties"      value={properties.length}   icon={Building2}   accentColor="indigo" loading={loading} />
        <StatCard label="Occupied Units"  value={activeLeases}         icon={CheckCircle} accentColor="green"  loading={loading} />
        <StatCard label="Monthly Revenue" value={fmt$(totalMonthly)}  icon={DollarSign}  accentColor="amber"  loading={loading} />
        <StatCard label="Occupancy Rate"  value={`${occupancyRate}%`} icon={TrendingUp}  accentColor="blue"   loading={loading} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Revenue by Property</h2>
        </div>
        <Table
          cols={["Property", "Collected", "Outstanding", "Total Billed", "Collection Rate"]}
          loading={loading}
          emptyMsg="No revenue data available"
          rows={propRows}
        />
      </div>
    </div>
  );
}
