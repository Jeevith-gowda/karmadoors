const BASE_URL = "/api";
const API_KEY  = import.meta.env.VITE_DOORLOOP_API_KEY;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

// Properties
export const getProperties  = (params = "") => get(`/properties?limit=100${params}`);
export const getProperty    = (id)           => get(`/properties/${id}`);

// Tenants
export const getTenants     = (params = "") => get(`/tenants?limit=100${params}`);
export const getTenant      = (id)           => get(`/tenants/${id}`);

// Leases
export const getLeases      = (params = "") => get(`/leases?limit=100${params}`);
export const getLease       = (id)           => get(`/leases/${id}`);

// Payments
export const getRentPayments = (params = "") => get(`/leases/rent-payments?limit=100${params}`);

// Units
export const getUnits        = (params = "") => get(`/units?limit=100${params}`);
export const getUnitsByProp  = (propertyId)  => get(`/units?limit=100&filter_propertyId=${propertyId}`);

// Bills / Expenses
export const getBills        = (params = "") => get(`/bills?limit=100${params}`);

// Journal Entries (fallback for expense transactions)
export const getJournalEntries = (params = "") => get(`/journal-entries?limit=100${params}`);

// Ledger / Reports
export const getLedger       = (params = "") => get(`/accounts/ledger?limit=100${params}`);
