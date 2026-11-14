import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unitsApi } from "../api/units";
import { queryKeys } from "../constants/query";
import { errorMessage } from "../utils/format";
import { useNotify } from "./useNotify";

/** All units (id + name), alphabetical, from the server */
export const useUnits = () => useQuery({ queryKey: queryKeys.units, queryFn: unitsApi.list, staleTime: 60_000 });

/** Creates a unit; on success the unit lists (form + table filter) are refetched */
export function useCreateUnit() {
  const qc = useQueryClient();
  const notify = useNotify();
  return useMutation({
    mutationFn: (name: string) => unitsApi.create(name),
    onSuccess: () =>
      Promise.all([qc.invalidateQueries({ queryKey: queryKeys.units }), qc.invalidateQueries({ queryKey: queryKeys.filterOptions })]),
    onError: (e) => notify(`לא הצלחנו ליצור את המסגרת: ${errorMessage(e)}`, "error"),
  });
}
