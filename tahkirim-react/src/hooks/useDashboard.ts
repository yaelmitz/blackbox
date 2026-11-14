import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard";
import { queryKeys } from "../constants/query";
import type { DashboardQuery } from "../types/models";

/**
 * Totals, monthly series and breakdowns, aggregated (and filtered) on the server.
 * Without filters it is the whole system (header count, page-heading trace).
 * While new filters load, the previous figures stay on screen.
 */
export const useDashboard = (f: DashboardQuery = {}) =>
  useQuery({ queryKey: queryKeys.dashboardSummary(f), queryFn: () => dashboardApi.get(f), placeholderData: keepPreviousData });
