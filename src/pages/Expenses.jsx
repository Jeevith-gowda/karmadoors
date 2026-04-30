import { useState, useMemo } from "react";
import { Receipt, Wrench, UserCheck, ClipboardCheck, FileText } from "lucide-react";
import StatCard    from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState  from "../components/ui/EmptyState";
import { fmt$, fmtDate } from "../utils/formatters";

const CATEGORIES = [
  {
    key: "maintenance",
    label: "Maintenance Fees",
    icon: Wrench,
    color: "blue",
    keywords: ["maintenance", "repair", "upkeep", "hvac", "plumbing", "electrical"],
  },
  {
    key: "placement",
    label: "Tenant Placement Fees",
    icon: UserCheck,
    color: "indigo",
    keywords: ["tenant placement", "leasing fee", "placement fee", "find tenant", "listing fee"],
  },
  {
    key: "movein_inspection",
    label: "Move-In Inspection Fees",
    icon: ClipboardCheck,
    color: "amber",
    keywords: ["move-in inspection", "move in inspection", "move-in insp", "inspection fee"],
  },
  {
    key: "movein_admin",
    label: "Move-In Admin Fees",
    icon: FileText,
    color: "green",
    keywords: ["move-in admin", "move in admin", "admin fee", "administrative fee", "move in fee"],
  },
];

function matchCategory(item) {
  const haystack = [
    item.description, item.memo, item.notes,
    item.accountName, item.categoryName, item.type,
    ...(item.lineItems || []).map(l => `${l.description} ${l.accountName}`),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => haystack.includes(kw))) return cat.key;
  }
  return null;
}

function toYearMonth(d) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt) ? null : `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(ym) {
  if (!ym) return "—";
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function Expenses({ data, loading }) {
  const { bills = [], journalEntries = [] } = data;
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedCat, setSelectedCat]     = useState("all");

  const allExpenses = useMemo(() => {
    const fromBills = bills.map(b => ({
      id:          b.id,
      date:        b.date || b.dueDate || b.createdAt,
      description: b.description || b.memo || "Bill",
      amount:      b.totalAmount || b.amount || 0,
      vendor:      b.vendorName || b.payee || "—",
      property:    b.propertyName || "—",
      status:      b.status || "unpaid",
      source:      "bill",
      lineItems:   b.lineItems || [],
      accountName: b.lineItems?.[0]?.accountName || "",
      memo:        b.memo || "",
      notes:       b.notes || "",
    }));

    const fromJournal = journalEntries
      .filter(j => j.type === "expense" || j.isExpense || j.debitAmount > 0)
      .map(j => ({
        id:          j.id,
        date:        j.date || j.createdAt,
        description: j.description || j.memo || "Journal Entry",
        amount:      j.debitAmount || j.amount || 0,
        vendor:      j.payee || "—",
        property:    j.propertyName || "—",
        status:      "posted",
        source:      "journal",
        lineItems:   j.lineItems || [],
        accountName: j.accountName || "",
        memo:        j.memo || "",
        notes:       j.notes || "",
      }));

    return [...fromBills, ...fromJournal]
      .map(e => ({ ...e, category: matchCategory(e) }))
      .filter(e => e.category !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [bills, journalEntries]);

  const months = useMemo(() => {
    const set = new Set(allExpenses.map(e => toYearMonth(e.date)).filter(Boolean));
    return Array.from(set).sort().reverse();
  }, [allExpenses]);

  const filtered = allExpenses.filter(e => {
    const matchM = selectedMonth === "all" || toYearMonth(e.date) === selectedMonth;
    const matchC = selectedCat  === "all" || e.category === selectedCat;
    return matchM && matchC;
  });

  const byMonth = selectedMonth === "all" ? allExpenses : allExpenses.filter(e => toYearMonth(e.date) === selectedMonth);
  const catTotals = Object.fromEntries(CATEGORIES.map(c => [
    c.key,
    byMonth.filter(e => e.category === c.key).reduce((s, e) => s + e.amount, 0),
  ]));
  const grandTotal = Object.values(catTotals).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Expenses</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Maintenance, Placement, Inspection &amp; Admin fees
          </p>
        </div>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">All Months</option>
          {months.map(m => (
            <option key={m} value={m}>{monthLabel(m)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => (
          <StatCard
            key={cat.key}
            label={cat.label}
            value={fmt$(catTotals[cat.key])}
            icon={cat.icon}
            accentColor={cat.color}
            loading={loading}
          />
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Receipt size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-300">
              {selectedMonth === "all" ? "All-time total fees" : `Total for ${monthLabel(selectedMonth)}`}
            </p>
            <p className="text-2xl font-extrabold">{fmt$(grandTotal)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{filtered.length} transactions</p>
          <p className="text-xs text-slate-400">{CATEGORIES.length} fee categories</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCat("all")}
          className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all
            ${selectedCat === "all"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCat(cat.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all
              ${selectedCat === cat.key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Transactions</h2>
          <span className="text-xs text-slate-400">{filtered.length} records</span>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${70 + i * 5}%` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState msg={
            allExpenses.length === 0
              ? "No matching expense transactions found in DoorLoop. Make sure your bill descriptions or account names contain the fee keywords (e.g. 'maintenance', 'tenant placement', 'move-in inspection', 'admin fee')."
              : "No transactions match the selected filters."
          } />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {["Date", "Description", "Category", "Vendor", "Property", "Amount", "Status"].map(c => (
                  <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200 whitespace-nowrap">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const cat = CATEGORIES.find(c => c.key === e.category);
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-600 whitespace-nowrap">
                      {fmtDate(e.date)}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 font-medium text-slate-900 max-w-xs truncate">
                      {e.description}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                        {cat?.label || e.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-600">{e.vendor}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-600">{e.property}</td>
                    <td className="px-4 py-3 border-b border-slate-100 font-semibold text-slate-900">
                      {fmt$(e.amount)}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100">
                      <StatusBadge status={e.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>How expense matching works:</strong> Transactions are matched by scanning bill descriptions, memos, and account names for keywords. If your DoorLoop account uses different naming, update the <code className="bg-amber-100 px-1 rounded">KEYWORDS</code> arrays inside <code className="bg-amber-100 px-1 rounded">Expenses.jsx</code> to match your chart of accounts exactly.
      </div>
    </div>
  );
}
