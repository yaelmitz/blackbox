import { TYPE_TO_API } from "../constants/apiEnums";
import type { ApiDashboard } from "../types/api";
import type { DashboardQuery } from "../types/models";
import { toDashboard } from "../utils/mappers";
import { http } from "./http";

export const dashboardApi = {
  /** totals and breakdowns; with filters, only for the matching investigations */
  get: async (f: DashboardQuery = {}) =>
    toDashboard(await http.get<ApiDashboard>("/dashboard", { unitId: f.unitId, type: f.type ? TYPE_TO_API[f.type] : undefined, from: f.from, to: f.to })),
};
