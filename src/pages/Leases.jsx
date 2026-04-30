import { useState } from "react";
import Table       from "../components/ui/Table";
import StatusBadge from "../components/ui/StatusBadge";
import { fmt$, fmtDate } from "../utils/formatters";

const FILTERS = ["all", "active", "inactive"];

export default function Leases({ data, loading }) {
  const { leases = [] } = data;
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? leases
    : leases.filter(l => l.status?.toLowerCase() === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          Leases <span className="text-sm font-normal text-slate-400 ml-2">{filtered.length}</span>
        </h1>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all
                ${filter === f
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table
          cols={["Tenant", "Unit / Property", "Start", "End", "Monthly Rent", "Status"]}
          loading={loading}
          emptyMsg="No leases found"
          rows={filtered.map(l => [
            l.tenantName || "—",
            l.unitName || l.propertyName || "—",
            fmtDate(l.start),
            fmtDate(l.end),
            fmt$(l.recurringCharges?.[0]?.amount || l.rentAmount || 0),
            <StatusBadge status={l.status} />,
          ])}
        />
      </div>
    </div>
  );
}
