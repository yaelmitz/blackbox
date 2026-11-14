import { LESSON_STATUS_API, LESSON_STATUS_FROM_API, TASK_STATUS_API } from "../constants/apiEnums";
import type { ApiLesson, ApiLessonPage, ApiParameter, ApiTask } from "../types/api";
import type { LessonPage, LessonPatch, LessonStatus, TaskStatus } from "../types/models";
import { toLesson, toParameter, toTask } from "../utils/mappers";
import { http } from "./http";

export const lessonsApi = {
  /** One page of lessons (with source investigation and tasks), plus counts per status */
  page: async (args: { page: number; pageSize: number; status?: LessonStatus; caseId?: number; inImplementation?: boolean }): Promise<LessonPage> => {
    const res = await http.get<ApiLessonPage>("/lessons", {
      page: args.page,
      pageSize: args.pageSize,
      status: args.status ? LESSON_STATUS_API[args.status] : undefined,
      investigationId: args.caseId,
      inImplementation: args.inImplementation,
    });
    const counts: LessonPage["counts"] = {};
    Object.entries(res.counts ?? {}).forEach(([k, v]) => {
      const s = LESSON_STATUS_FROM_API[k];
      if (s) counts[s] = v;
    });
    return { ...res, items: res.items.map(toLesson), counts };
  },

  get: async (id: number) => toLesson(await http.get<ApiLesson>(`/lessons/${id}`)),

  create: async (caseId: number, name: string) => toLesson(await http.post<ApiLesson>(`/investigations/${caseId}/lessons`, { name })),

  update: async (id: number, patch: LessonPatch) => {
    const body: Record<string, string> = {};
    if (patch.title !== undefined) body.name = patch.title;
    if (patch.status !== undefined) body.status = LESSON_STATUS_API[patch.status];
    if (patch.resources !== undefined) body.resources = patch.resources;
    if (patch.notes !== undefined) body.notes = patch.notes;
    return toLesson(await http.patch<ApiLesson>(`/lessons/${id}`, body));
  },

  /** "ליישום": moves the lesson into lessons management */
  sendToImplementation: async (id: number) => toLesson(await http.post<ApiLesson>(`/lessons/${id}/implement`, {})),

  delete: (id: number) => http.delete(`/lessons/${id}`),
};

export const tasksApi = {
  create: async (lessonId: number, name: string) => toTask(await http.post<ApiTask>(`/lessons/${lessonId}/tasks`, { name })),
  update: async (id: number, patch: { name?: string; status?: TaskStatus }) =>
    toTask(await http.patch<ApiTask>(`/tasks/${id}`, { name: patch.name, status: patch.status && TASK_STATUS_API[patch.status] })),
  delete: (id: number) => http.delete(`/tasks/${id}`),
  addParameter: async (taskId: number, name: string, value: string) =>
    toParameter(await http.post<ApiParameter>(`/tasks/${taskId}/parameters`, { name, value })),
  deleteParameter: (id: number) => http.delete(`/parameters/${id}`),
};
