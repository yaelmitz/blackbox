import type { CaseQuery } from "../types/models";

/** TanStack Query keys, in one place so invalidation stays consistent. */
export const queryKeys = {
  investigations: ["investigations"] as const,
  investigationPage: (q: CaseQuery) => ["investigations", "page", q] as const,
  investigation: (id: number) => ["investigations", "detail", id] as const,
  filterOptions: ["investigations", "filters"] as const,
  nextId: ["investigations", "next-id"] as const,
  idTaken: (id: number) => ["investigations", "id-taken", id] as const,
  units: ["units"] as const,
  lessons: ["lessons"] as const,
  lessonList: (status?: string) => ["lessons", "list", status ?? "all"] as const,
  caseLessons: (caseId: number) => ["lessons", "case", caseId] as const,
  lesson: (id: number) => ["lessons", "detail", id] as const,
  /** prefix of every dashboard query (invalidated after any change) */
  dashboard: ["dashboard"] as const,
  dashboardSummary: (f: object) => ["dashboard", f] as const,
};

export const PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;
/** Lessons list loads this many per "page" of the infinite list */
export const LESSONS_PAGE_SIZE = 12;
/** Wait this long after typing before searching / saving */
export const SEARCH_DEBOUNCE_MS = 350;
export const SAVE_DEBOUNCE_MS = 600;
