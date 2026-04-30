import { useState } from "react";
import { DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import StatCard    from "../components/ui/StatCard";
import Table       from "../components/ui/Table";
import StatusBadge from "../components/ui/StatusBadge";
import { fmt$, fmtDate } from "../utils/formatters";

const FILTERS = ["all", "paid", "unpaid", "overdue"];

export default function Payments({ data, loading }) {
  const { payments = [] } = data;
  const [filter, setFilter] = useState("all");

  const collected   = payments.filter(p => p.status !== "unpaid" && p.status !== "overdue").reduce((s, p) => s + (p.amount || 0), 0);
  const outstanding = payments.filter(p => p.status === "unpaid" || p.status === "overdue").reduce((s, p) => s + (p.amount || 0), 0);

  const filtered = filter === "all"
    ? payments
    : payments.filter(p => p.status?.toLowerCase() === filter);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Payments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Collected"    value={fmt$(collected)}   icon={CheckCircle}  accentColor="green" loading={loading} />
        <StatCard label="Outstanding"  value={fmt$(outstanding)} icon={AlertCircle}  accentColor="red"   loading={loading} />
        <StatCard label="Transactions" value={payments.length}   icon={DollarSign}   accentColor="indigo" loading={loading} />
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-slate-500">{filtered.length} records</p>
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
          cols={["Tenant", "Property / Unit", "Amount", "Due Date", "Paid Date", "Status"]}
          loading={loading}
          emptyMsg="No payments found"
          rows={filtered.map(p => [
            p.tenantName || p.paidByName || "—",
            p.propertyName || p.unitName || "—",
            fmt$(p.amount),
            fmtDate(p.dueDate || p.date),
            fmtDate(p.paidDate || p.paymentDate),
            <StatusBadge status={p.status || "paid"} />,
          ])}
        />
      </div>
    </div>
  );
}
