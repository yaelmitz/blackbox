/** UI models. The API's English enums are mapped to these in utils/mappers.ts. */

export type Classification = 0 | 1 | 2; // בלמ"ס | שמור | סודי
export type LessonStatus = "new" | "work" | "done" | "closed";
export type TaskStatus = "open" | "work" | "done" | "blocked";

/** A field the spec defines as "text or file". */
export type TextOrFile =
  | { kind: "text"; text: string }
  | { kind: "file"; fileName: string; file?: File; fileId?: string };

/** תחקיר */
export interface Case {
  id: number; // מספר מזהה
  title: string; // נושא
  date: string; // תאריך, YYYY-MM-DD
  type: string; // סוג (Hebrew label)
  units: Unit[]; // מסגרות (many-to-many)
  cls: Classification; // סיווג
  by: string; // מפרסם
  lessonCount?: number;
  background?: string; // רקע
  questions?: string; // שאלות
  location?: TextOrFile; // מיקום
  coordinates?: TextOrFile; // נ"צ
  whatHappenedHtml?: string; // מה קרה
  whatPlannedHtml?: string; // מה תוכנן
  conclusionsHtml?: string; // מסקנות
  recommendations?: Recommendation[]; // המלצות
  sources?: TextOrFile; // מקורות מידע
  roles?: string; // בעלי התפקידים
}

/** מסגרת */
export interface Unit {
  id: number;
  name: string;
  investigationCount?: number;
}

export interface Recommendation {
  id?: number;
  text: string;
  /** the lesson it became with "ליישום" (in lessons management); null = not sent yet */
  lessonId?: number | null;
}

export interface TaskParameter {
  id: number;
  name: string;
  value: string;
}

/** משימה */
export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
  parameters: TaskParameter[];
}

/** לקח */
export interface Lesson {
  id: number;
  caseId: number;
  title: string;
  status: LessonStatus;
  resources: string;
  notes: string;
  /** sent to lessons management with "ליישום" (only these appear there) */
  inImplementation: boolean;
  tasks: Task[];
  /** the source investigation, when the API includes it */
  case?: Case;
}

export type LessonPatch = Partial<Pick<Lesson, "title" | "status" | "resources" | "notes">>;

/** Filters + paging for the investigations table */
export interface CaseQuery {
  page: number; // 1-based
  pageSize: number;
  q?: string;
  unitId?: number;
  type?: string; // Hebrew label
  cls?: Classification;
  sort?: "date" | "id" | "subject";
  order?: "ASC" | "DESC";
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface LessonPage extends Page<Lesson> {
  counts: Partial<Record<LessonStatus, number>>;
}

export interface MonthPoint {
  month: string; // YYYY-MM
  investigations: number;
  lessons: number;
  tasks: number;
}

/** Dashboard filters (all optional): the dashboard counts only the matching investigations */
export interface DashboardQuery {
  /** יחידה – a unit id (the investigation's מסגרות) */
  unitId?: number;
  /** YYYY-MM-DD, inclusive */
  from?: string;
  to?: string;
  /** סוג – Hebrew label from CASE_TYPES */
  type?: string;
}

export interface Dashboard {
  totals: {
    investigations: number;
    lessons: number;
    lessonsInImplementation: number;
    tasks: number;
    taskCompletionPct: number;
  };
  monthly: MonthPoint[];
  byType: { label: string; count: number }[];
  lessonStatus: Record<LessonStatus, number>;
  taskStatus: Record<TaskStatus, number>;
}
