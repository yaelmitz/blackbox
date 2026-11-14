import type { LessonStatus, TaskStatus } from "../types/models";

/** סיווג, by Classification index */
export const CLS = ['בלמ"ס', "שמור", "סודי"] as const;

/** סטטוס לקח */
export const LESSON_STATUS: Record<LessonStatus, string> = {
  new: "חדש",
  work: "בטיפול",
  done: "יושם",
  closed: "נסגר",
};

/** סטטוס משימה */
export const TASK_STATUS: Record<TaskStatus, string> = {
  open: "פתוחה",
  work: "בביצוע",
  done: "הושלמה",
  blocked: "חסומה",
};

/** סוג – fixed list */
export const CASE_TYPES = ["מבצעי", "בטיחות", "הדרכה", "לוגיסטי", "טכנולוגי", "ארגוני"] as const;

export const APP_NAME = "BLACKBOX";
export const APP_TAGLINE = "כל תחקיר מתועד, כל לקח נלמד";
