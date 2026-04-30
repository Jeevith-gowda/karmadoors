import { LayoutDashboard, Users, FileText, DollarSign } from "lucide-react";
import StatCard    from "../components/ui/StatCard";
import Table       from "../components/ui/Table";
import StatusBadge from "../components/ui/StatusBadge";
import { fmt$, fmtDate } from "../utils/formatters";

export default function Dashboard({ data, loading }) {
  const { properties = [], tenants = [], leases = [], payments = [] } = data;

  const activeLeases   = leases.filter(l => l.status === "active").length;
  const totalRent      = leases.reduce((s, l) => s + (l.recurringCharges?.[0]?.amount || 0), 0);
  const activeTenants  = tenants.filter(t => t.isActive || t.status === "active").length;
  const recentPayments = payments.slice(0, 6);

  const expiringLeases = leases
    .filter(l => l.end)
    .sort((a, b) => new Date(a.end) - new Date(b.end))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Properties"     value={properties.length} sub="Residential" icon={LayoutDashboard} accentColor="indigo" loading={loading} />
        <StatCard label="Active Tenants" value={activeTenants}     sub={`${tenants.length} total`} icon={Users} accentColor="green" loading={loading} />
        <StatCard label="Active Leases"  value={activeLeases}      sub="Occupied units" icon={FileText} accentColor="amber" loading={loading} />
        <StatCard label="Monthly Rent"   value={fmt$(totalRent)}   sub="Scheduled income" icon={DollarSign} accentColor="blue" loading={loading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Payments</h2>
          </div>
          <Table
            cols={["Tenant", "Amount", "Date", "Status"]}
            loading={loading}
            emptyMsg="No payments found"
            rows={recentPayments.map(p => [
              p.tenantName || p.paidByName || "—",
              fmt$(p.amount),
              fmtDate(p.date || p.createdAt),
              <StatusBadge status={p.status || "paid"} />,
            ])}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Upcoming Lease Expirations</h2>
          </div>
          <Table
            cols={["Unit", "Tenant", "Expires", "Status"]}
            loading={loading}
            emptyMsg="No expiring leases"
            rows={expiringLeases.map(l => [
              l.unitName || "—",
              l.tenantName || "—",
              fmtDate(l.end),
              <StatusBadge status={l.status} />,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
