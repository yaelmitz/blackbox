import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { Segments } from "../../../components/ui/Segments";
import { StateBox } from "../../../components/ui/StateBox";
import { LESSON_TONE, TASK_TONE } from "../../../components/ui/StatusPill";
import { LESSON_STATUS, TASK_STATUS } from "../../../constants/labels";
import { useDashboard } from "../../../hooks/useDashboard";
import type { LessonStatus, TaskStatus } from "../../../types/models";
import { EMPTY_DASHBOARD_FILTERS, isRangeInvalid, toDashboardQuery, type DashboardFilterValues } from "../../../utils/dashboardFilters";
import { errorMessage } from "../../../utils/format";
import { Board } from "../Board";
import { DashboardFilters } from "../DashboardFilters";
import { Gauge } from "../Gauge";
import { MonthTrace } from "../MonthTrace";
import { StatusBar } from "../StatusBar";
import { useStyles } from "./DashboardPage.styles";

/**
 * Instrument panel of totals and breakdowns, all aggregated by the server (GET /api/dashboard).
 * Filters (unit, type, date range) are sent to the server; every figure counts only the
 * matching investigations and their lessons and tasks.
 */
export default function DashboardPage() {
  const { classes, cx } = useStyles();
  const [filters, setFilters] = useState<DashboardFilterValues>(EMPTY_DASHBOARD_FILTERS);
  const query = useMemo(() => toDashboardQuery(filters), [filters]);
  const { data, isLoading, isFetching, isPlaceholderData, isError, error, refetch } = useDashboard(query);
  const filtered = Object.values(query).some((v) => v != null);

  const bar = (
    <DashboardFilters
      value={filters}
      onChange={setFilters}
      matching={isPlaceholderData ? undefined : data?.totals.investigations}
      rangeError={isRangeInvalid(filters)}
    />
  );

  if (isLoading) return <Box className={classes.page}>{bar}<StateBox kind="loading" message="טוען נתונים…" /></Box>;
  if (isError || !data) {
    return (
      <Box className={classes.page}>
        {bar}
        <StateBox kind="error" title="אין חיבור לשרת" message={errorMessage(error)} action={{ label: "ניסיון חוזר", onClick: () => refetch() }} />
      </Box>
    );
  }

  const t = data.totals;
  const maxType = Math.max(1, ...data.byType.map((x) => x.count));

  return (
    <Box className={classes.page}>
      {bar}
      {filtered && t.investigations === 0 && !isFetching ? (
        <StateBox
          kind="empty"
          title="אין תחקירים שמתאימים לסינון"
          message="נסו יחידה או סוג אחרים, או טווח תאריכים רחב יותר."
          action={{ label: "ניקוי הסינון", onClick: () => setFilters(EMPTY_DASHBOARD_FILTERS) }}
        />
      ) : (
        <Box className={cx(classes.content, isFetching && isPlaceholderData && classes.stale)} aria-busy={isFetching}>
          <Box className={classes.gauges}>
            <Gauge label="תחקירים" value={t.investigations} max={Math.max(20, t.investigations)} />
            <Gauge label="לקחים" value={t.lessons} max={Math.max(30, t.lessons)} />
            <Gauge label="לקחים ביישום" value={t.lessonsInImplementation} max={Math.max(1, t.lessons)} />
            <Gauge label="משימות" value={t.tasks} max={Math.max(40, t.tasks)} />
            <Gauge label="השלמת משימות" value={t.taskCompletionPct} max={100} suffix="%" hot />
          </Box>
          <Box className={classes.boards}>
            <Board title="תחקירים לפי חודש" tag="FDR TRACE"><MonthTrace data={data.monthly} /></Board>
            <Board title="תחקירים לפי סוג" tag="LEVEL">
              <Box className={classes.meters}>
                {data.byType.map((x) => (
                  <Box key={x.label} className={classes.meter}>
                    <Typography variant="body2">{x.label}</Typography>
                    <Segments on={x.count * 3} total={maxType * 3} height="0.75rem" />
                    <Typography variant="body2" className={classes.meterValue}>{x.count}</Typography>
                  </Box>
                ))}
              </Box>
            </Board>
            <Board title="סטטוס לקחים" tag="LESSONS">
              <StatusBar items={(Object.keys(LESSON_STATUS) as LessonStatus[]).map((k) => ({ label: LESSON_STATUS[k], value: data.lessonStatus[k], tone: LESSON_TONE[k] }))} />
            </Board>
            <Board title="סטטוס משימות" tag="TASKS">
              <StatusBar items={(["done", "work", "open", "blocked"] as TaskStatus[]).map((k) => ({ label: TASK_STATUS[k], value: data.taskStatus[k], tone: TASK_TONE[k] }))} />
            </Board>
          </Box>
        </Box>
      )}
    </Box>
  );
}
