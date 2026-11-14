import type { CaseFormValues } from "../types/forms";
import type { Case, Classification, Lesson, TextOrFile } from "../types/models";
import { todayIso } from "./format";

export const emptyTextOrFile = (): TextOrFile => ({ kind: "text", text: "" });

/** Required fields, for the "missing details" summary */
export const REQUIRED_LABELS: Partial<Record<keyof CaseFormValues, string>> = {
  id: "מספר מזהה",
  title: "נושא",
  date: "תאריך",
  type: "סוג",
  cls: "סיווג",
  by: "מפרסם",
};

export const emptyCaseForm = (nextId: number): CaseFormValues => ({
  id: nextId,
  title: "",
  date: todayIso(),
  type: "",
  cls: "",
  unitIds: [],
  by: "",
  background: "",
  questions: "",
  location: emptyTextOrFile(),
  coordinates: emptyTextOrFile(),
  whatHappenedHtml: "",
  whatPlannedHtml: "",
  conclusionsHtml: "",
  recommendations: [{ text: "" }],
  lessons: [{ title: "" }],
  sources: emptyTextOrFile(),
  roles: "",
});

export const caseToForm = (c: Case, lessons: Lesson[]): CaseFormValues => ({
  id: c.id,
  title: c.title,
  date: c.date,
  type: c.type,
  cls: String(c.cls) as CaseFormValues["cls"],
  unitIds: c.units.map((u) => u.id),
  by: c.by,
  background: c.background ?? "",
  questions: c.questions ?? "",
  location: c.location ?? emptyTextOrFile(),
  coordinates: c.coordinates ?? emptyTextOrFile(),
  whatHappenedHtml: c.whatHappenedHtml ?? "",
  whatPlannedHtml: c.whatPlannedHtml ?? "",
  conclusionsHtml: c.conclusionsHtml ?? "",
  recommendations: (c.recommendations ?? []).map((r) => ({ rid: r.id, text: r.text })),
  lessons: lessons.map((l) => ({ lid: l.id, title: l.title })),
  sources: c.sources ?? emptyTextOrFile(),
  roles: c.roles ?? "",
});

export const formToCase = (v: CaseFormValues): Case => ({
  id: Number(v.id),
  title: v.title.trim(),
  date: v.date,
  type: v.type,
  cls: Number(v.cls) as Classification,
  // only the ids are sent to the server
  units: v.unitIds.map((id) => ({ id, name: "" })),
  by: v.by.trim(),
  background: v.background,
  questions: v.questions,
  location: v.location,
  coordinates: v.coordinates,
  whatHappenedHtml: v.whatHappenedHtml,
  whatPlannedHtml: v.whatPlannedHtml,
  conclusionsHtml: v.conclusionsHtml,
  recommendations: v.recommendations.map((r) => ({ id: r.rid, text: r.text.trim() })).filter((r) => r.text),
  sources: v.sources,
  roles: v.roles,
});
