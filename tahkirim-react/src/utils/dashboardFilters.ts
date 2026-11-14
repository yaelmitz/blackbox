import type { DashboardQuery } from "../types/models";

/** The dashboard filter fields as the inputs hold them ("" = not set) */
export interface DashboardFilterValues {
  unit: string;
  /** Hebrew type label */
  type: string;
  from: string;
  to: string;
}

export const EMPTY_DASHBOARD_FILTERS: DashboardFilterValues = { unit: "", type: "", from: "", to: "" };

/** Local date as YYYY-MM-DD */
export function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

/** Quick date ranges, each ending today */
export const DATE_PRESETS = [
  { label: "30 ימים אחרונים", range: () => ({ from: isoDay(daysAgo(30)), to: isoDay(new Date()) }) },
  { label: "3 חודשים", range: () => ({ from: isoDay(daysAgo(91)), to: isoDay(new Date()) }) },
  { label: "השנה", range: () => ({ from: `${new Date().getFullYear()}-01-01`, to: isoDay(new Date()) }) },
];

/** "to" before "from" */
export const isRangeInvalid = (f: DashboardFilterValues) => !!(f.from && f.to && f.to < f.from);

/** The query sent to the server; an invalid range sends neither date */
export function toDashboardQuery(f: DashboardFilterValues): DashboardQuery {
  const badRange = isRangeInvalid(f);
  return {
    unitId: f.unit ? Number(f.unit) : undefined,
    type: f.type || undefined,
    from: !badRange && f.from ? f.from : undefined,
    to: !badRange && f.to ? f.to : undefined,
  };
}
