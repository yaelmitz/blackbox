import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query";

/**
 * After any successful update: invalidate every query whose data may have changed,
 * so TanStack Query refetches it from the server. No manual cache editing anywhere.
 */
export function useInvalidate() {
  const qc = useQueryClient();
  return {
    /** an investigation or its recommendations / lessons changed */
    investigations: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.investigations }),
        qc.invalidateQueries({ queryKey: queryKeys.lessons }),
        qc.invalidateQueries({ queryKey: queryKeys.dashboard }),
      ]),
    /** a lesson, its tasks or their parameters changed */
    lesson: (lessonId: number) =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.lesson(lessonId) }),
        qc.invalidateQueries({ queryKey: ["lessons", "list"] }),
        qc.invalidateQueries({ queryKey: ["lessons", "case"] }),
        qc.invalidateQueries({ queryKey: queryKeys.investigations }),
        qc.invalidateQueries({ queryKey: queryKeys.dashboard }),
      ]),
  };
}
