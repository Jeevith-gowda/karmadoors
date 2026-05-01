import { useState } from "react";
import { Building2, Home, DollarSign, TrendingUp } from "lucide-react";
import StatCard    from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import Skeleton    from "../components/ui/Skeleton";
import EmptyState  from "../components/ui/EmptyState";
import { fmt$ }   from "../utils/formatters";

export default function Rentals({ data, loading }) {
  const { properties = [], units = [], leases = [] } = data;
  const [search, setSearch] = useState("");

  const unitsByProp  = {};
  units.forEach(u => {
    const pid = u.propertyId;
    if (!unitsByProp[pid]) unitsByProp[pid] = [];
    unitsByProp[pid].push(u);
  });

  const rentByUnit = {};
  leases.filter(l => l.status === "active").forEach(l => {
    rentByUnit[l.unitId] = (l.recurringCharges?.[0]?.amount || 0);
  });

  const totalUnits    = units.length;
  const occupiedUnits = leases.filter(l => l.status === "active").length;
  const totalMonthly  = Object.values(rentByUnit).reduce((s, v) => s + v, 0);
  const occupancyPct  = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const filtered = properties.filter(p =>
    (p.name || p.displayName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Rentals <span className="text-sm font-normal text-slate-400 ml-2">{filtered.length}</span>
        </h1>
        <input
          placeholder="Search properties…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-56 pl-4 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Properties"   value={properties.length} icon={Building2}  accentColor="indigo" loading={loading} />
        <StatCard label="Total Units"  value={totalUnits}        icon={Home}        accentColor="blue"   loading={loading} />
        <StatCard label="Occupied"     value={`${occupiedUnits} / ${totalUnits}`} sub={`${occupancyPct}% occupancy`} icon={TrendingUp} accentColor="green" loading={loading} />
        <StatCard label="Monthly Rent" value={fmt$(totalMonthly)} icon={DollarSign} accentColor="amber"  loading={loading} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
              <Skeleton className="w-3/5" />
              <Skeleton className="w-2/5" />
              <Skeleton className="w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState msg="No properties found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(prop => {
            const propUnits   = unitsByProp[prop.id] || [];
            const occupied    = propUnits.filter(u => u.status === "occupied" || rentByUnit[u.id]).length;
            const monthlyRent = propUnits.reduce((s, u) => s + (rentByUnit[u.id] || 0), 0);
            const occ         = propUnits.length > 0
              ? Math.round((occupied / propUnits.length) * 100) : 0;

            return (
              <div key={prop.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-900 text-base leading-tight">
                      {prop.name || prop.displayName || "Unnamed Property"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {prop.address?.street || prop.address || "No address"}
                    </p>
                  </div>
                  <StatusBadge status={prop.status || "active"} />
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{occupied} occupied</span>
                    <span>{propUnits.length} total units</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${occ}%` }}
                      className="h-full bg-indigo-500 rounded-full transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{occ}% occupancy</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">Monthly Income</p>
                    <p className="font-bold text-slate-900">{fmt$(monthlyRent)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Type</p>
                    <p className="text-sm font-medium text-slate-700 capitalize">
                      {prop.type || prop.propertyType || "Residential"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
