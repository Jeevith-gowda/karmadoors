import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Building2, Grid3X3,
  Users, FileText, DollarSign,
  Receipt, BarChart3
} from "lucide-react";

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

export default function Sidebar() {
  return (
    <aside className="w-56 bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Building2 size={18} />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">PropManager</p>
            <p className="text-xs text-slate-500">Residential</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
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
  );
}
