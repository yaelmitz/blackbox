/** Shapes returned by the NestJS API (tahkirim-api). */

/** מסגרת */
export interface ApiUnit {
  id: number;
  name: string;
  investigationCount?: number;
}

export interface ApiAttachment {
  id: string;
  originalName: string;
}

export interface ApiParameter {
  id: number;
  name: string;
  value: string;
}

export interface ApiTask {
  id: number;
  name: string;
  status: string;
  parameters?: ApiParameter[];
}

export interface ApiLesson {
  id: number;
  name: string;
  notes: string;
  status: string;
  resources: string;
  /** sent to lessons management with "ליישום" */
  inImplementation: boolean;
  investigationId: number;
  tasks?: ApiTask[];
  investigation?: ApiInvestigation;
}

export interface ApiRecommendation {
  id: number;
  text: string;
  position: number;
  /** the lesson it became with "ליישום"; null = not sent yet */
  lessonId?: number | null;
}

export interface ApiInvestigation {
  id: number;
  subject: string;
  date: string;
  type: string;
  classification: string;
  units?: ApiUnit[];
  publisher: string;
  lessonCount?: number;
  background?: string;
  questions?: string;
  locationText?: string | null;
  locationFile?: ApiAttachment | null;
  coordinatesText?: string | null;
  coordinatesFile?: ApiAttachment | null;
  sourcesText?: string | null;
  sourcesFile?: ApiAttachment | null;
  whatHappened?: string;
  whatPlanned?: string;
  conclusions?: string;
  roles?: string;
  recommendations?: ApiRecommendation[];
  lessons?: ApiLesson[];
}

export interface ApiPage<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface ApiLessonPage extends ApiPage<ApiLesson> {
  counts: Record<string, number>;
}

export interface ApiDashboard {
  totals: {
    investigations: number;
    lessons: number;
    lessonsInImplementation: number;
    tasks: number;
    taskCompletionPct: number;
  };
  monthly: { month: string; investigations: number; lessons: number; tasks: number }[];
  byType: { key: string; count: number }[];
  byMonth: { key: string; count: number }[];
  lessonStatus: { key: string; count: number }[];
  taskStatus: { key: string; count: number }[];
}
