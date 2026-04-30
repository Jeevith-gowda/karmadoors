import { useState, useEffect, useCallback } from "react";
import * as api from "../api/doorloop";

const ENDPOINTS = [
  ["properties",     api.getProperties],
  ["tenants",        api.getTenants],
  ["leases",         api.getLeases],
  ["payments",       api.getRentPayments],
  ["units",          api.getUnits],
  ["bills",          api.getBills],
  ["journalEntries", api.getJournalEntries],
];

export function useDoorloop() {
  const [data, setData] = useState({
    properties: [],
    tenants: [],
    leases: [],
    payments: [],
    units: [],
    bills: [],
    journalEntries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const results = await Promise.allSettled(ENDPOINTS.map(([, fn]) => fn()));

    const next = {};
    const failures = [];
    results.forEach((res, i) => {
      const [key] = ENDPOINTS[i];
      if (res.status === "fulfilled") {
        next[key] = res.value?.data || [];
      } else {
        next[key] = [];
        failures.push(`${key}: ${res.reason?.message || "unknown error"}`);
      }
    });

    setData(next);
    setLastRefresh(new Date());
    setError(failures.length === ENDPOINTS.length ? failures.join(" | ") : null);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, error, refresh, lastRefresh };
}
