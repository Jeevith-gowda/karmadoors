import { useState } from "react";
import { Search, Home } from "lucide-react";
import Skeleton   from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { fmtDate } from "../utils/formatters";

const FILTERS = ["all", "occupied", "vacant"];

export default function Units({ data, loading }) {
  const { units = [], leases = [], properties = [] } = data;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [propFilter, setProp] = useState("all");

  const propById = Object.fromEntries(properties.map(p => [p.id, p]));

  const activeLeaseByUnit = {};
  leases.filter(l => l.status?.toLowerCase() === "active").forEach(l => {
    activeLeaseByUnit[l.unitId] = l;
  });

  const futureLeaseByUnit = {};
  leases
    .filter(l => l.status?.toLowerCase() !== "active" && l.start && new Date(l.start) > new Date())
    .forEach(l => { futureLeaseByUnit[l.unitId] = l; });

  const isOccupied = u => !!(activeLeaseByUnit[u.id] || u.status?.toLowerCase() === "occupied");

  const occupied = units.filter(isOccupied).length;
  const vacant   = units.length - occupied;

  const filtered = units.filter(u => {
    const name   = (u.name || u.displayName || "").toLowerCase();
    const q      = search.toLowerCase();
    const matchQ = name.includes(q);
    const matchF = filter === "all" || (filter === "occupied" ? isOccupied(u) : !isOccupied(u));
    const matchP = propFilter === "all" || u.propertyId === propFilter;
    return matchQ && matchF && matchP;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Units
          <span className="text-sm font-normal text-slate-400 ml-2">{filtered.length}</span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={propFilter}
            onChange={e => setProp(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name || p.displayName}</option>
            ))}
          </select>
          <div className="relative flex-1 sm:flex-none">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search units…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-200 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => {
          const count = f === "all" ? units.length : f === "occupied" ? occupied : vacant;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all
                ${filter === f
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`ml-1.5 text-xs ${filter === f ? "opacity-70" : "text-slate-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
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
              <Skeleton className="w-3/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState msg="No units found" />
      ) : (
        <div className="space-y-3">
          {filtered.map(unit => {
            const prop        = propById[unit.propertyId];
            const activeLease = activeLeaseByUnit[unit.id];
            const futureLease = futureLeaseByUnit[unit.id];
            const occupied    = isOccupied(unit);

            const beds  = unit.bedrooms  != null ? `${unit.bedrooms} Bed${unit.bedrooms !== 1 ? "s" : ""}` : null;
            const baths = unit.bathrooms != null ? `${unit.bathrooms} Bath${unit.bathrooms !== 1 ? "s" : ""}` : null;
            const sqft  = unit.squareFeet ? `${unit.squareFeet.toLocaleString()} sqft` : null;
            const specs = [beds, baths, sqft].filter(Boolean).join(" • ");

            const unitTitle = unit.name || unit.displayName || `Unit ${unit.id?.slice(0, 6)}`;
            const propName  = prop?.name || prop?.displayName || "";
            const fullTitle = propName ? `${unitTitle} > ${propName}` : unitTitle;

            return (
              <div key={unit.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 p-4">
                  {unit.imageUrl || prop?.imageUrl ? (
                    <img
                      src={unit.imageUrl || prop?.imageUrl}
                      alt={unitTitle}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <Home size={24} className="text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate text-sm">{fullTitle}</p>
                    {specs && <p className="text-xs text-slate-400 mt-0.5">{specs}</p>}
                  </div>
                </div>

                {/* Leasing status */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-start justify-between gap-2">
                  <span className="text-sm text-slate-500 font-medium shrink-0">Leasing status</span>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${occupied ? "text-emerald-600" : "text-slate-400"}`}>
                      {occupied ? "Leased" : "Vacant"}
                    </span>
                    {activeLease && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {fmtDate(activeLease.start)} – {fmtDate(activeLease.end)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Future lease */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-start justify-between gap-2">
                  <span className="text-sm text-slate-500 font-medium shrink-0">Future lease</span>
                  <div className="text-right">
                    {futureLease ? (
                      <>
                        <span className="text-sm font-semibold text-indigo-600">Upcoming</span>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {fmtDate(futureLease.start)} – {fmtDate(futureLease.end)}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400">No upcoming lease</span>
                    )}
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
