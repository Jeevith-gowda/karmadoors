import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  X, Building2, LayoutDashboard, Grid3X3, Users, FileText,
  DollarSign, Receipt, BarChart3, ChevronDown, Home,
} from "lucide-react";

const topNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const bottomNav = [
  { to: "/tenants",  label: "Tenants",  icon: Users },
  { to: "/leases",   label: "Leases",   icon: FileText },
  { to: "/payments", label: "Payments", icon: DollarSign },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/reports",  label: "Reports",  icon: BarChart3 },
];

const rentalsSubNav = [
  { to: "/rentals", label: "Properties", icon: Building2 },
  { to: "/units",   label: "Units",      icon: Grid3X3 },
];

const linkClass = (isActive) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
  ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`;

export default function Sidebar({ open, onClose }) {
  const location = useLocation();
  const inRentals = location.pathname === "/rentals" || location.pathname === "/units";
  const [rentalsOpen, setRentalsOpen] = useState(inRentals);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (inRentals) setRentalsOpen(true); }, [inRentals]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
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
          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {topNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => linkClass(isActive)}
            >
              <Icon size={18} />{label}
            </NavLink>
          ))}

          {/* Rentals group */}
          <div>
            <button
              onClick={() => setRentalsOpen(o => !o)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${inRentals ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              <Home size={18} />
              <span className="flex-1 text-left">Rentals</span>
              <ChevronDown size={14} className={`transition-transform ${rentalsOpen ? "rotate-180" : ""}`} />
            </button>

            {rentalsOpen && (
              <div className="mt-1 ml-3 pl-3 border-l border-white/10 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-3 pt-1 pb-0.5">
                  Real Estate
                </p>
                {rentalsSubNav.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} onClick={onClose}
                    className={({ isActive }) => linkClass(isActive)}
                  >
                    <Icon size={16} />{label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {bottomNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => linkClass(isActive)}
            >
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
