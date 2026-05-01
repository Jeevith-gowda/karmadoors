import { NavLink } from "react-router-dom";
import { X, Building2, LayoutDashboard, Grid3X3, Users, FileText, DollarSign, Receipt, BarChart3 } from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard",    icon: LayoutDashboard },
  { to: "/rentals",   label: "Rentals",      icon: Building2 },
  { to: "/units",     label: "Units",        icon: Grid3X3 },
  { to: "/tenants",   label: "Tenants",      icon: Users },
  { to: "/leases",    label: "Leases",       icon: FileText },
  { to: "/payments",  label: "Payments",     icon: DollarSign },
  { to: "/expenses",  label: "Expenses",     icon: Receipt },
  { to: "/reports",   label: "Reports",      icon: BarChart3 },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-56 bg-slate-900 text-white flex flex-col shrink-0
        transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">PropManager</p>
              <p className="text-xs text-slate-500">Residential</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
