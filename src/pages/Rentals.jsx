import { useState } from "react";
import { Search, Building2, MapPin } from "lucide-react";
import Skeleton   from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

export default function Rentals({ data, loading }) {
  const { properties = [], units = [], leases = [] } = data;
  const [search, setSearch] = useState("");

  const unitsByProp = {};
  units.forEach(u => {
    if (!unitsByProp[u.propertyId]) unitsByProp[u.propertyId] = [];
    unitsByProp[u.propertyId].push(u);
  });

  const activeLeaseUnitIds = new Set(
    leases.filter(l => l.status === "active").map(l => l.unitId)
  );

  const filtered = properties.filter(p =>
    (p.name || p.displayName || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.address?.street || p.address || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Properties
          <span className="text-sm font-normal text-slate-400 ml-2">{filtered.length}</span>
        </h1>
        <div className="relative w-full sm:w-56">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search properties…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
              <div className="flex gap-3">
                <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4" />
                  <Skeleton className="w-1/2" />
                </div>
              </div>
              <Skeleton className="w-full h-px" />
              <Skeleton className="w-2/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState msg="No properties found" />
      ) : (
        <div className="space-y-3">
          {filtered.map(prop => {
            const propUnits   = unitsByProp[prop.id] || [];
            const activeUnits = propUnits.filter(u => activeLeaseUnitIds.has(u.id)).length;
            const address     = prop.address?.street
              ? `${prop.address.street}, ${prop.address.city || ""} ${prop.address.state || ""} ${prop.address.zip || ""}`.trim()
              : (prop.address || "No address");
            const type = prop.type || prop.propertyType || "Residential";

            return (
              <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="flex items-center gap-3 p-4">
                  {prop.imageUrl ? (
                    <img
                      src={prop.imageUrl}
                      alt={prop.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <Building2 size={24} className="text-indigo-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {prop.name || prop.displayName || "Unnamed Property"}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <p className="text-xs text-slate-400 truncate">{address}</p>
                    </div>
                  </div>
                </div>

                {/* Type row */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">Type</span>
                  <span className="text-sm text-slate-900 font-semibold capitalize">{type}</span>
                </div>

                {/* Active units row */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">Active units</span>
                  <span className="text-sm text-slate-900 font-semibold">
                    {activeUnits} / {propUnits.length} Unit{propUnits.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
