import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { investigationsApi } from "../api/investigations";
import { lessonsApi, tasksApi } from "../api/lessons";
import { LESSONS_PAGE_SIZE, queryKeys } from "../constants/query";
import type { LessonPatch, LessonStatus, TaskStatus } from "../types/models";
import { errorMessage } from "../utils/format";
import { useInvalidate } from "./useInvalidate";
import { useNotify } from "./useNotify";

/**
 * Lessons management list as an infinite query: only lessons sent with "ליישום". The server filters by status and returns
 * LESSONS_PAGE_SIZE at a time; the next page loads when the list end scrolls into view.
 */
export const useLessonsInfinite = (status?: LessonStatus) =>
  useInfiniteQuery({
    queryKey: queryKeys.lessonList(status),
    queryFn: ({ pageParam }) => lessonsApi.page({ page: pageParam, pageSize: LESSONS_PAGE_SIZE, status, inImplementation: true }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pageCount ? last.page + 1 : undefined),
  });

/** Lessons of one investigation (filtered by the server), for the expanded table row */
export const useCaseLessons = (caseId: number) =>
  useQuery({
    queryKey: queryKeys.caseLessons(caseId),
    queryFn: () => lessonsApi.page({ page: 1, pageSize: 100, caseId }),
    select: (p) => p.items,
  });

export const useLesson = (id: number | null) =>
  useQuery({ queryKey: queryKeys.lesson(id ?? -1), queryFn: () => lessonsApi.get(id!), enabled: id != null });

function useOnError() {
  const notify = useNotify();
  return (e: unknown) => notify(`השמירה נכשלה: ${errorMessage(e)}`, "error");
}

/** Updates a lesson's fields; on success the lesson, the lists and the dashboard are refetched. */
export function useUpdateLesson(id: number) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (patch: LessonPatch) => lessonsApi.update(id, patch),
    onSuccess: () => invalidate.lesson(id),
    onError: useOnError(),
  });
}

/** "ליישום": sends the lesson to lessons management; on success the lists, the investigations and the dashboard are refetched. */
export function useSendToImplementation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: number) => lessonsApi.sendToImplementation(id),
    onSuccess: (_, id) => invalidate.lesson(id),
    onError: useOnError(),
  });
}

/**
 * "ליישום" on a recommendation: the server turns it into a lesson that is already in lessons management
 * and returns the recommendation with that lessonId. Investigations, lessons and the dashboard are refetched.
 */
export function useSendRecommendationToImplementation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (recommendationId: number) => investigationsApi.sendRecommendationToImplementation(recommendationId),
    onSuccess: () => invalidate.investigations(),
    onError: useOnError(),
  });
}

/** Task and parameter mutations for one lesson. Each invalidates the lesson's queries when it succeeds. */
export function useTaskActions(lessonId: number) {
  const invalidate = useInvalidate();
  const onError = useOnError();
  const onSuccess = () => invalidate.lesson(lessonId);

  return {
    addTask: useMutation({ mutationFn: (name: string) => tasksApi.create(lessonId, name), onSuccess, onError }),
    setStatus: useMutation({
      mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) => tasksApi.update(taskId, { status }),
      onSuccess,
      onError,
    }),
    removeTask: useMutation({ mutationFn: (taskId: number) => tasksApi.delete(taskId), onSuccess, onError }),
    addParameter: useMutation({
      mutationFn: ({ taskId, name, value }: { taskId: number; name: string; value: string }) => tasksApi.addParameter(taskId, name, value),
      onSuccess,
      onError,
    }),
    removeParameter: useMutation({ mutationFn: (paramId: number) => tasksApi.deleteParameter(paramId), onSuccess, onError }),
  };
}
