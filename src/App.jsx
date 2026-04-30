import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar   from "./components/layout/Sidebar";
import TopBar    from "./components/layout/TopBar";
import Dashboard from "./pages/Dashboard";
import Tenants   from "./pages/Tenants";
import Leases    from "./pages/Leases";
import Payments  from "./pages/Payments";
import Reports   from "./pages/Reports";
import Rentals   from "./pages/Rentals";
import Units     from "./pages/Units";
import Expenses  from "./pages/Expenses";
import { useDoorloop } from "./hooks/useDoorloop";

export default function App() {
  const { data, loading, error, refresh, lastRefresh } = useDoorloop();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar onRefresh={refresh} lastRefresh={lastRefresh} />
          <main className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                API Error: {error}
              </div>
            )}
            <Routes>
              <Route path="/"           element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"  element={<Dashboard data={data} loading={loading} />} />
              <Route path="/rentals"    element={<Rentals   data={data} loading={loading} />} />
              <Route path="/units"      element={<Units     data={data} loading={loading} />} />
              <Route path="/tenants"    element={<Tenants   data={data} loading={loading} />} />
              <Route path="/leases"     element={<Leases    data={data} loading={loading} />} />
              <Route path="/payments"   element={<Payments  data={data} loading={loading} />} />
              <Route path="/expenses"   element={<Expenses  data={data} loading={loading} />} />
              <Route path="/reports"    element={<Reports   data={data} loading={loading} />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
