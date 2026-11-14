import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../../api/http";
import { StateBox } from "../../../components/ui/StateBox";
import { routes } from "../../../constants/routes";
import { useInvestigation, useNextCaseId } from "../../../hooks/useInvestigations";
import { caseToForm, emptyCaseForm } from "../../../utils/caseForm";
import { errorMessage } from "../../../utils/format";
import { CaseForm } from "../CaseForm";

/** #/new */
export function NewCasePage() {
  const next = useNextCaseId();
  if (next.isLoading) return <StateBox kind="loading" message="מכין טופס…" />;
  // if the server can't suggest a number the user types one
  return <CaseForm defaults={emptyCaseForm(next.data ?? 1)} />;
}

/** #/case/:id/edit — loads the investigation, then shows the same form filled in */
export function EditCasePage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useInvestigation(id);
  const initial = useMemo(() => (data ? caseToForm(data.case, data.lessons) : undefined), [data]);

  if (isLoading) return <StateBox kind="loading" message="טוען את התחקיר לעריכה…" />;
  if (isError || !initial)
    return (
      <StateBox
        kind="error"
        title="לא ניתן לערוך"
        message={error instanceof ApiError && error.status === 404 ? `תחקיר ${id} לא נמצא` : errorMessage(error)}
        action={{ label: "חזרה לטבלת התחקירים", onClick: () => navigate(routes.cases) }}
      />
    );
  return <CaseForm key={id} defaults={initial} initial={initial} />;
}
