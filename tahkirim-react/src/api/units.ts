import type { ApiUnit } from "../types/api";
import type { Unit } from "../types/models";
import { http } from "./http";

const toUnit = (u: ApiUnit): Unit => ({ id: u.id, name: u.name, investigationCount: u.investigationCount });

/** מסגרות – GET/POST/PATCH/DELETE /api/units */
export const unitsApi = {
  list: async () => (await http.get<ApiUnit[]>("/units")).map(toUnit),
  create: async (name: string) => toUnit(await http.post<ApiUnit>("/units", { name })),
  rename: async (id: number, name: string) => toUnit(await http.patch<ApiUnit>(`/units/${id}`, { name })),
  delete: (id: number) => http.delete(`/units/${id}`),
};
