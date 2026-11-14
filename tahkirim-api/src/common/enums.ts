/** סוג – fixed list */
export enum InvestigationType {
  OPERATIONAL = 'OPERATIONAL', // מבצעי
  SAFETY = 'SAFETY', // בטיחות
  TRAINING = 'TRAINING', // הדרכה
  LOGISTICS = 'LOGISTICS', // לוגיסטי
  TECHNOLOGY = 'TECHNOLOGY', // טכנולוגי
  ORGANIZATIONAL = 'ORGANIZATIONAL', // ארגוני
}

/** סיווג – fixed list */
export enum Classification {
  UNCLASSIFIED = 'UNCLASSIFIED', // בלמ"ס
  RESTRICTED = 'RESTRICTED', // שמור
  SECRET = 'SECRET', // סודי
}

/** סטטוס לקח */
export enum LessonStatus {
  NEW = 'NEW', // חדש
  IN_PROGRESS = 'IN_PROGRESS', // בטיפול
  IMPLEMENTED = 'IMPLEMENTED', // יושם
  CLOSED = 'CLOSED', // נסגר
}

/** סטטוס משימה */
export enum TaskStatus {
  OPEN = 'OPEN', // פתוחה
  IN_PROGRESS = 'IN_PROGRESS', // בביצוע
  DONE = 'DONE', // הושלמה
  BLOCKED = 'BLOCKED', // חסומה
}

/** Hebrew labels, for clients that want to show them as-is. */
export const LABELS = {
  type: {
    OPERATIONAL: 'מבצעי',
    SAFETY: 'בטיחות',
    TRAINING: 'הדרכה',
    LOGISTICS: 'לוגיסטי',
    TECHNOLOGY: 'טכנולוגי',
    ORGANIZATIONAL: 'ארגוני',
  },
  classification: { UNCLASSIFIED: 'בלמ"ס', RESTRICTED: 'שמור', SECRET: 'סודי' },
  lessonStatus: { NEW: 'חדש', IN_PROGRESS: 'בטיפול', IMPLEMENTED: 'יושם', CLOSED: 'נסגר' },
  taskStatus: { OPEN: 'פתוחה', IN_PROGRESS: 'בביצוע', DONE: 'הושלמה', BLOCKED: 'חסומה' },
} as const;
