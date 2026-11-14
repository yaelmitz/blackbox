import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { investigationsApi } from "../api/investigations";
import { lessonsApi } from "../api/lessons";
import { queryKeys } from "../constants/query";
import type { CaseFormValues } from "../types/forms";
import type { CaseQuery } from "../types/models";
import { formToCase } from "../utils/caseForm";
import { useInvalidate } from "./useInvalidate";

/** One page of the investigations table. Keeps showing the previous page while the next one loads. */
export const useInvestigationsPage = (q: CaseQuery) =>
  useQuery({
    queryKey: queryKeys.investigationPage(q),
    queryFn: () => investigationsApi.page(q),
    placeholderData: keepPreviousData,
  });

/** Full investigation with recommendations, lessons and tasks */
export const useInvestigation = (id: number) =>
  useQuery({ queryKey: queryKeys.investigation(id), queryFn: () => investigationsApi.get(id), enabled: Number.isFinite(id) });

export const useFilterOptions = () =>
  useQuery({ queryKey: queryKeys.filterOptions, queryFn: investigationsApi.filterOptions, staleTime: 60_000 });

export const useNextCaseId = () => useQuery({ queryKey: queryKeys.nextId, queryFn: investigationsApi.nextId, staleTime: 0 });

/**
 * Async check for the create form: is this investigation number taken?
 * Goes through the query client so it's cached and deduplicated like any other query.
 */
export function useCaseIdTaken() {
  const qc = useQueryClient();
  return (id: number) => qc.fetchQuery({ queryKey: queryKeys.idTaken(id), queryFn: () => investigationsApi.exists(id), staleTime: 0 });
}

export function useCreateInvestigation() {
  const invalidate = useInvalidate().investigations;
  return useMutation({
    mutationFn: (v: CaseFormValues) =>
      investigationsApi.create(
        formToCase(v),
        v.lessons.map((l) => l.title.trim()).filter(Boolean),
      ),
    onSuccess: invalidate,
  });
}

/**
 * Saves an edit: the investigation's fields, then the differences in recommendations and lessons
 * compared with `initial` (what was loaded into the form).
 */
export function useUpdateInvestigation(initial: CaseFormValues) {
  const invalidate = useInvalidate().investigations;
  return useMutation({
    mutationFn: async (v: CaseFormValues) => {
      const c = formToCase(v);
      await investigationsApi.update(c);

      // recommendations: removed / emptied → delete, changed text or order → patch, new → post
      const kept = new Set(v.recommendations.filter((r) => r.text.trim()).map((r) => r.rid));
      for (const r of initial.recommendations) if (r.rid && !kept.has(r.rid)) await investigationsApi.deleteRecommendation(r.rid);
      const recs = v.recommendations.filter((r) => r.text.trim());
      for (const [i, r] of recs.entries()) {
        if (!r.rid) {
          await investigationsApi.addRecommendation(c.id, r.text.trim(), i);
          continue;
        }
        const before = initial.recommendations.findIndex((o) => o.rid === r.rid);
        if (before !== i || initial.recommendations[before]?.text !== r.text.trim())
          await investigationsApi.updateRecommendation(r.rid, r.text.trim(), i);
      }

      // lessons: removed → delete (with tasks), renamed → patch, new → post
      const keptLessons = new Set(v.lessons.map((l) => l.lid).filter(Boolean));
      for (const l of initial.lessons) if (l.lid && !keptLessons.has(l.lid)) await lessonsApi.delete(l.lid);
      for (const l of v.lessons) {
        const name = l.title.trim();
        if (l.lid) {
          const before = initial.lessons.find((o) => o.lid === l.lid);
          if (name && before && before.title !== name) await lessonsApi.update(l.lid, { title: name });
        } else if (name) {
          await lessonsApi.create(c.id, name);
        }
      }
      return c;
    },
    onSuccess: invalidate,
  });
}
