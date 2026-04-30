import { useState } from "react";
import { Search } from "lucide-react";
import Table       from "../components/ui/Table";
import StatusBadge from "../components/ui/StatusBadge";

export default function Tenants({ data, loading }) {
  const { tenants = [], leases = [] } = data;
  const [search, setSearch] = useState("");

  const leaseByTenant = Object.fromEntries(leases.map(l => [l.tenantId, l]));

  const filtered = tenants.filter(t => {
    const name = `${t.firstName || ""} ${t.lastName || ""}`.toLowerCase();
    const email = (t.email || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Tenants <span className="text-sm font-normal text-slate-400 ml-2">{filtered.length}</span>
        </h1>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search tenants…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-200 w-56"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table
          cols={["Name", "Email", "Phone", "Unit", "Lease Status"]}
          loading={loading}
          emptyMsg="No tenants found"
          rows={filtered.map(t => {
            const lease = leaseByTenant[t.id];
            return [
              `${t.firstName || ""} ${t.lastName || ""}`.trim() || "—",
              t.email || "—",
              t.phone || "—",
              lease?.unitName || "—",
              <StatusBadge status={lease?.status || (t.isActive ? "active" : "inactive")} />,
            ];
          })}
        />
      </div>
    </div>
  );
}
