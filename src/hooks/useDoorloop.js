import { useState, useEffect, useCallback } from "react";
import * as api from "../api/doorloop";

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
    try {
      const [propRes, tenantRes, leaseRes, payRes, unitRes, billRes, journalRes] =
        await Promise.all([
          api.getProperties(),
          api.getTenants(),
          api.getLeases(),
          api.getRentPayments(),
          api.getUnits(),
          api.getBills(),
          api.getJournalEntries(),
        ]);

      setData({
        properties:     propRes?.data    || [],
        tenants:        tenantRes?.data   || [],
        leases:         leaseRes?.data    || [],
        payments:       payRes?.data      || [],
        units:          unitRes?.data     || [],
        bills:          billRes?.data     || [],
        journalEntries: journalRes?.data  || [],
      });
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, error, refresh, lastRefresh };
}
