import {
  CLS_API,
  LESSON_STATUS_FROM_API,
  TASK_STATUS_FROM_API,
  TYPE_FROM_API,
} from "../constants/apiEnums";
import type { ApiAttachment, ApiDashboard, ApiInvestigation, ApiLesson, ApiParameter, ApiTask } from "../types/api";
import type { Case, Classification, Dashboard, Lesson, LessonStatus, Task, TaskParameter, TaskStatus, TextOrFile } from "../types/models";

/** API ↔ UI translation (field names and enums). */

const tof = (text?: string | null, file?: ApiAttachment | null): TextOrFile | undefined =>
  file ? { kind: "file", fileName: file.originalName, fileId: file.id } : text != null ? { kind: "text", text } : undefined;

export const toClassification = (c: string): Classification =>
  Math.max(0, CLS_API.indexOf(c as (typeof CLS_API)[number])) as Classification;

export function toCase(i: ApiInvestigation): Case {
  return {
    id: i.id,
    title: i.subject,
    date: i.date,
    type: TYPE_FROM_API[i.type] ?? i.type,
    units: (i.units ?? []).map((u) => ({ id: u.id, name: u.name })),
    cls: toClassification(i.classification),
    by: i.publisher,
    lessonCount: i.lessonCount ?? i.lessons?.length,
    background: i.background,
    questions: i.questions,
    location: tof(i.locationText, i.locationFile),
    coordinates: tof(i.coordinatesText, i.coordinatesFile),
    sources: tof(i.sourcesText, i.sourcesFile),
    whatHappenedHtml: i.whatHappened,
    whatPlannedHtml: i.whatPlanned,
    conclusionsHtml: i.conclusions,
    roles: i.roles,
    recommendations: i.recommendations?.map((r) => ({ id: r.id, text: r.text, lessonId: r.lessonId ?? null })),
  };
}

export const toParameter = (p: ApiParameter): TaskParameter => ({ id: p.id, name: p.name, value: p.value });

export const toTask = (t: ApiTask): Task => ({
  id: t.id,
  name: t.name,
  status: TASK_STATUS_FROM_API[t.status] ?? "open",
  parameters: (t.parameters ?? []).map(toParameter),
});

export function toLesson(l: ApiLesson): Lesson {
  return {
    id: l.id,
    caseId: l.investigationId,
    title: l.name,
    status: LESSON_STATUS_FROM_API[l.status] ?? "new",
    resources: l.resources,
    notes: l.notes,
    inImplementation: !!l.inImplementation,
    tasks: (l.tasks ?? []).map(toTask),
    case: l.investigation ? toCase(l.investigation) : undefined,
  };
}

export function toDashboard(d: ApiDashboard): Dashboard {
  const lessonStatus = { new: 0, work: 0, done: 0, closed: 0 } as Record<LessonStatus, number>;
  d.lessonStatus.forEach((r) => {
    const k = LESSON_STATUS_FROM_API[r.key];
    if (k) lessonStatus[k] = r.count;
  });
  const taskStatus = { open: 0, work: 0, done: 0, blocked: 0 } as Record<TaskStatus, number>;
  d.taskStatus.forEach((r) => {
    const k = TASK_STATUS_FROM_API[r.key];
    if (k) taskStatus[k] = r.count;
  });
  return {
    totals: d.totals,
    monthly: d.monthly,
    // already ordered by count on the server
    byType: d.byType.map((r) => ({ label: TYPE_FROM_API[r.key] ?? r.key, count: r.count })),
    lessonStatus,
    taskStatus,
  };
}
