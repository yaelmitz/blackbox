import Box from "@mui/material/Box";
import AddRounded from "@mui/icons-material/AddRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ExpandedState, PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StateBox } from "../../../components/ui/StateBox";
import { CASE_TYPES, CLS } from "../../../constants/labels";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../../../constants/query";
import { routes } from "../../../constants/routes";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useFilterOptions, useInvestigationsPage } from "../../../hooks/useInvestigations";
import { useNotify } from "../../../hooks/useNotify";
import type { CaseQuery, Classification } from "../../../types/models";
import { errorMessage } from "../../../utils/format";
import { CasesTable } from "../CasesTable";
import { SORT_FIELD } from "../caseColumns";
import { useStyles } from "./CasesPage.styles";

interface Props {
  onOpenCase: (id: number) => void;
  onGoToLesson: (lessonId: number) => void;
}

/** Filter select in the search row; orange when a value is chosen */
function FilterSelect({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (v: string) => void; children: ReactNode }) {
  const { classes, cx } = useStyles();
  return (
    <TextField id={id} select size="small" label={label} value={value} onChange={(e) => onChange(e.target.value)} className={cx(classes.filter, !!value && classes.filterOn)}>
      {children}
    </TextField>
  );
}

/**
 * Investigations table. Search, filters, sorting and paging are all sent to the server
 * (GET /api/investigations); the page only shows what comes back.
 */
export default function CasesPage({ onOpenCase, onGoToLesson }: Props) {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const notify = useNotify();
  const created = (useLocation().state as { created?: number } | null)?.created;

  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const [unit, setUnit] = useState("");
  const [type, setType] = useState("");
  const [cls, setCls] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [expanded, setExpanded] = useState<ExpandedState>(created != null ? { [String(created)]: true } : {});

  // a filter change starts again from the first page
  useEffect(() => setPagination((p) => ({ ...p, pageIndex: 0 })), [q, unit, type, cls]);

  useEffect(() => {
    if (created != null) notify(`תחקיר ${created} נשמר`);
  }, [created, notify]);

  const query: CaseQuery = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      q: q || undefined,
      unitId: unit ? Number(unit) : undefined,
      type: type || undefined,
      cls: cls === "" ? undefined : (Number(cls) as Classification),
      sort: SORT_FIELD[sorting[0]?.id ?? "date"],
      order: sorting[0]?.desc === false ? "ASC" : "DESC",
    }),
    [pagination, q, unit, type, cls, sorting],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useInvestigationsPage(query);
  const { data: options } = useFilterOptions();
  const filtered = !!(search.trim() || unit || type || cls);

  const clearFilters = () => {
    setSearch("");
    setUnit("");
    setType("");
    setCls("");
  };

  return (
    <Box className={classes.page}>
      <Box className={classes.toolbar} role="search">
        <TextField
          id="q"
          type="search"
          size="small"
          placeholder="חיפוש לפי נושא, מספר תיק או מפרסם…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> },
            htmlInput: { "aria-label": "חיפוש" },
          }}
          className={classes.search}
        />
        <FilterSelect id="flt-unit" label="מסגרת" value={unit} onChange={setUnit}>
          <MenuItem value="">כל המסגרות</MenuItem>
          {(options?.units ?? []).map((u) => <MenuItem key={u.id} value={String(u.id)}>{u.name}</MenuItem>)}
        </FilterSelect>
        <FilterSelect id="flt-type" label="סוג" value={type} onChange={setType}>
          <MenuItem value="">כל הסוגים</MenuItem>
          {CASE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </FilterSelect>
        <FilterSelect id="flt-cls" label="סיווג" value={cls} onChange={setCls}>
          <MenuItem value="">כל הסיווגים</MenuItem>
          {CLS.map((name, i) => <MenuItem key={name} value={String(i)}>{name}</MenuItem>)}
        </FilterSelect>
        {filtered && (
          <Button variant="outlined" color="inherit" onClick={clearFilters} className={classes.clear}>
            ניקוי
            <Typography component="span" variant="label" className={classes.clearCount}>{data ? `${data.total} תוצאות` : ""}</Typography>
          </Button>
        )}
        <Button variant="contained" startIcon={<AddRounded />} onClick={() => navigate(routes.newCase)} className={classes.create}>
          פתיחת תחקיר חדש
        </Button>
      </Box>

      {isError ? (
        <StateBox kind="error" title="אין חיבור לשרת" message={errorMessage(error)} action={{ label: "ניסיון חוזר", onClick: () => refetch() }} />
      ) : isLoading ? (
        <StateBox kind="loading" message="טוען תחקירים…" />
      ) : data && data.total === 0 ? (
        <StateBox
          kind="empty"
          message={filtered ? "אין תחקירים שמתאימים לחיפוש ולסינון." : "עדיין אין תחקירים. פתחו את הראשון בכפתור למעלה."}
          action={filtered ? { label: "ניקוי סינון", onClick: clearFilters } : undefined}
        />
      ) : (
        <CasesTable
          rows={data?.items ?? []}
          total={data?.total ?? 0}
          loading={isFetching}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          expanded={expanded}
          onExpandedChange={setExpanded}
          highlightId={created}
          onOpenCase={onOpenCase}
          onGoToLesson={onGoToLesson}
        />
      )}
    </Box>
  );
}
