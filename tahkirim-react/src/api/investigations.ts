import { CLS_API, TYPE_TO_API } from "../constants/apiEnums";
import type { ApiInvestigation, ApiPage, ApiRecommendation, ApiUnit } from "../types/api";
import type { Case, CaseQuery, Page, TextOrFile } from "../types/models";
import { toCase, toLesson } from "../utils/mappers";
import { attachmentsApi } from "./attachments";
import { http } from "./http";

type TofKey = "location" | "coordinates" | "sources";

/**
 * Body fields shared by create and update. "Text or file" fields upload a new file first.
 * On update an emptied text field is sent as "" so the server clears it (and any file).
 */
async function investigationBody(c: Case, isUpdate: boolean) {
  const tofFields = async (key: TofKey, v?: TextOrFile) => {
    if (!v) return {};
    if (v.kind === "text") return v.text.trim() || isUpdate ? { [`${key}Text`]: v.text } : {};
    if (v.file) return { [`${key}FileId`]: (await attachmentsApi.upload(v.file)).id };
    if (v.fileId) return { [`${key}FileId`]: v.fileId };
    return {};
  };
  return {
    subject: c.title,
    date: c.date,
    type: TYPE_TO_API[c.type],
    classification: CLS_API[c.cls],
    unitIds: c.units.map((u) => u.id),
    publisher: c.by,
    background: c.background ?? "",
    questions: c.questions ?? "",
    whatHappened: c.whatHappenedHtml ?? "",
    whatPlanned: c.whatPlannedHtml ?? "",
    conclusions: c.conclusionsHtml ?? "",
    roles: c.roles ?? "",
    ...(await tofFields("location", c.location)),
    ...(await tofFields("coordinates", c.coordinates)),
    ...(await tofFields("sources", c.sources)),
  };
}

export const investigationsApi = {
  /** One page of the table, filtered and sorted on the server */
  page: async (q: CaseQuery): Promise<Page<Case>> => {
    const res = await http.get<ApiPage<ApiInvestigation>>("/investigations", {
      page: q.page,
      pageSize: q.pageSize,
      q: q.q?.trim(),
      unitId: q.unitId,
      type: q.type ? TYPE_TO_API[q.type] : undefined,
      classification: q.cls !== undefined ? CLS_API[q.cls] : undefined,
      sort: q.sort,
      order: q.order,
    });
    return { ...res, items: res.items.map(toCase) };
  },

  get: async (id: number) => {
    const i = await http.get<ApiInvestigation>(`/investigations/${id}`);
    return { case: toCase(i), lessons: (i.lessons ?? []).map((l) => toLesson({ ...l, investigationId: i.id })) };
  },

  /** true if the number is already taken */
  exists: async (id: number) => {
    try {
      await http.get(`/investigations/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  filterOptions: () => http.get<{ units: ApiUnit[] }>("/investigations/filters"),
  nextId: async () => (await http.get<{ id: number }>("/investigations/next-id")).id,

  create: async (c: Case, lessonNames: string[]) =>
    toCase(
      await http.post<ApiInvestigation>("/investigations", {
        id: c.id,
        ...(await investigationBody(c, false)),
        recommendations: (c.recommendations ?? []).map((r) => r.text),
        lessons: lessonNames,
      }),
    ),

  /** Updates the investigation's own fields (not its id, recommendations or lessons). */
  update: async (c: Case) => toCase(await http.patch<ApiInvestigation>(`/investigations/${c.id}`, await investigationBody(c, true))),

  addRecommendation: (investigationId: number, text: string, position: number) =>
    http.post<ApiRecommendation>(`/investigations/${investigationId}/recommendations`, { text, position }),
  updateRecommendation: (id: number, text: string, position: number) => http.patch<ApiRecommendation>(`/recommendations/${id}`, { text, position }),
  deleteRecommendation: (id: number) => http.delete(`/recommendations/${id}`),
  /** "ליישום": the recommendation becomes a lesson in lessons management; returns it with its lessonId */
  sendRecommendationToImplementation: (id: number) => http.post<ApiRecommendation>(`/recommendations/${id}/implement`, {}),
};
