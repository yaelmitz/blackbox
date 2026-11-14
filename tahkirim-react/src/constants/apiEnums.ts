import type { LessonStatus, TaskStatus } from "../types/models";

/** Hebrew type label → API enum */
export const TYPE_TO_API: Record<string, string> = {
  מבצעי: "OPERATIONAL",
  בטיחות: "SAFETY",
  הדרכה: "TRAINING",
  לוגיסטי: "LOGISTICS",
  טכנולוגי: "TECHNOLOGY",
  ארגוני: "ORGANIZATIONAL",
};
export const TYPE_FROM_API: Record<string, string> = Object.fromEntries(Object.entries(TYPE_TO_API).map(([he, en]) => [en, he]));

/** Classification index → API enum */
export const CLS_API = ["UNCLASSIFIED", "RESTRICTED", "SECRET"] as const;

export const LESSON_STATUS_API: Record<LessonStatus, string> = { new: "NEW", work: "IN_PROGRESS", done: "IMPLEMENTED", closed: "CLOSED" };
export const LESSON_STATUS_FROM_API = Object.fromEntries(Object.entries(LESSON_STATUS_API).map(([k, v]) => [v, k])) as Record<string, LessonStatus>;

export const TASK_STATUS_API: Record<TaskStatus, string> = { open: "OPEN", work: "IN_PROGRESS", done: "DONE", blocked: "BLOCKED" };
export const TASK_STATUS_FROM_API = Object.fromEntries(Object.entries(TASK_STATUS_API).map(([k, v]) => [v, k])) as Record<string, TaskStatus>;
