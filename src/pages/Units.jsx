import { useState } from "react";
import { Search } from "lucide-react";
import Table       from "../components/ui/Table";
import StatusBadge from "../components/ui/StatusBadge";
import { fmt$ }   from "../utils/formatters";

const FILTERS = ["all", "occupied", "vacant"];

export default function Units({ data, loading }) {
  const { units = [], leases = [], tenants = [], properties = [] } = data;
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [propFilter, setProp] = useState("all");

  const propById    = Object.fromEntries(properties.map(p => [p.id, p]));
  const leaseByUnit = {};
  leases.filter(l => l.status === "active").forEach(l => {
    leaseByUnit[l.unitId] = l;
  });
  const tenantById = Object.fromEntries(tenants.map(t => [t.id, t]));

  const isOccupied = (u) => !!(leaseByUnit[u.id] || u.status === "occupied");

  const filtered = units.filter(u => {
    const name    = (u.name || u.displayName || "").toLowerCase();
    const address = (u.address || "").toLowerCase();
    const q       = search.toLowerCase();
    const matchQ  = name.includes(q) || address.includes(q);
    const matchF  = filter === "all" || (filter === "occupied" ? isOccupied(u) : !isOccupied(u));
    const matchP  = propFilter === "all" || u.propertyId === propFilter;
    return matchQ && matchF && matchP;
  });

  const occupied = units.filter(isOccupied).length;
  const vacant   = units.length - occupied;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Units <span className="text-sm font-normal text-slate-400 ml-2">{filtered.length}</span>
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

      <div className="flex gap-2">
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

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table
          cols={["Unit Name", "Property", "Bedrooms", "Bathrooms", "Sq Ft", "Market Rent", "Tenant", "Status"]}
          loading={loading}
          emptyMsg="No units found"
          rows={filtered.map(u => {
            const lease   = leaseByUnit[u.id];
            const tenant  = lease ? tenantById[lease.tenantId] : null;
            const prop    = propById[u.propertyId];
            const tenantName = tenant
              ? `${tenant.firstName || ""} ${tenant.lastName || ""}`.trim()
              : "—";
            const occ = isOccupied(u);

            return [
              u.name || u.displayName || `Unit ${u.id?.slice(0, 6)}`,
              prop?.name || prop?.displayName || "—",
              u.bedrooms != null ? u.bedrooms : "—",
              u.bathrooms != null ? u.bathrooms : "—",
              u.squareFeet ? `${u.squareFeet.toLocaleString()} ft²` : "—",
              fmt$(u.marketRent || lease?.recurringCharges?.[0]?.amount || 0),
              tenantName,
              <StatusBadge status={occ ? "occupied" : "vacant"} />,
            ];
          })}
        />
      </div>
    </div>
  );
}
