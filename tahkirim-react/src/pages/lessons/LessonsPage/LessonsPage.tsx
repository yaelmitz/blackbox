import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { Plate } from "../../../components/ui/Plate";
import { StateBox } from "../../../components/ui/StateBox";
import { LESSON_STATUS } from "../../../constants/labels";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { useLesson, useLessonsInfinite } from "../../../hooks/useLessons";
import type { LessonStatus } from "../../../types/models";
import { errorMessage } from "../../../utils/format";
import { LessonDetail } from "../LessonDetail";
import { LessonDrawer } from "../LessonDrawer";
import { useStyles } from "./LessonsPage.styles";

interface Props {
  selected: number | null;
  onSelect: (id: number) => void;
  onOpenCase: (id: number) => void;
}

/**
 * Lessons management. The status filter and the counts come from the server; the list is an
 * infinite query that loads the next page when its end scrolls into view.
 */
export default function LessonsPage({ selected, onSelect, onOpenCase }: Props) {
  const { classes, cx } = useStyles();
  const [filter, setFilter] = useState<LessonStatus | undefined>();
  const list = useLessonsInfinite(filter);
  const lessons = list.data?.pages.flatMap((p) => p.items) ?? [];
  const counts = list.data?.pages[0]?.counts ?? {};
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const current = selected ?? lessons[0]?.id ?? null;
  const detail = useLesson(current);
  const detailRef = useRef<HTMLDivElement>(null);

  const sentinel = useInfiniteScroll(() => list.hasNextPage && !list.isFetchingNextPage && list.fetchNextPage(), !!list.hasNextPage);

  useEffect(() => {
    if (selected == null && lessons[0]) onSelect(lessons[0].id);
  }, [selected, lessons, onSelect]);

  // the selected lesson no longer exists (deleted elsewhere) or was not sent with "ליישום": fall back to the first one in the list
  const unavailable = detail.isError || (detail.data && !detail.data.inImplementation);
  useEffect(() => {
    if (unavailable && lessons[0] && lessons[0].id !== current) onSelect(lessons[0].id);
  }, [unavailable, lessons, current, onSelect]);

  const select = (id: number) => {
    onSelect(id);
    if (window.matchMedia("(max-width: 56.25rem)").matches) detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filters: [LessonStatus | undefined, string, number][] = [
    [undefined, "הכול", total],
    ...(Object.entries(LESSON_STATUS) as [LessonStatus, string][]).map(([k, v]) => [k, v, counts[k] ?? 0] as [LessonStatus, string, number]),
  ];

  if (list.isError) return <StateBox kind="error" title="אין חיבור לשרת" message={errorMessage(list.error)} action={{ label: "ניסיון חוזר", onClick: () => list.refetch() }} />;

  return (
    <Box className={classes.page}>
      <Box className={classes.chips} role="group" aria-label="סינון לפי סטטוס">
        {filters.map(([k, label, n]) => (
          <Chip key={label} label={`${label} · ${n}`} variant="outlined" clickable aria-pressed={filter === k} onClick={() => setFilter(k)} className={cx(classes.chip, filter === k && classes.chipOn)} />
        ))}
      </Box>

      {list.isLoading ? (
        <StateBox kind="loading" message="טוען לקחים…" />
      ) : lessons.length === 0 ? (
        <StateBox kind="empty" message={filter ? "אין לקחים בסטטוס הזה." : "עדיין לא הועברו לקחים ליישום. בטבלת התחקירים פתחו שורה של תחקיר ולחצו ״ליישום״ ליד הלקח."} />
      ) : (
        <Box className={classes.layout}>
          <Box className={classes.list} role="listbox" aria-label="רשימת לקחים">
            {lessons.map((l) => <LessonDrawer key={l.id} lesson={l} selected={l.id === current} onClick={() => select(l.id)} />)}
            <Box ref={sentinel} className={classes.more}>
              {list.isFetchingNextPage ? (
                <CircularProgress size="1.25rem" />
              ) : list.hasNextPage ? (
                <Button variant="outlined" size="small" onClick={() => list.fetchNextPage()}>טעינת לקחים נוספים</Button>
              ) : (
                <Typography variant="label" color="text.secondary">{lessons.length} לקחים · סוף הרשימה</Typography>
              )}
            </Box>
          </Box>

          <Plate ref={detailRef} className={classes.detail}>
            {detail.isLoading ? (
              <Box className={classes.detailState}><CircularProgress size="1.25rem" /></Box>
            ) : detail.data?.inImplementation ? (
              <LessonDetail key={detail.data.id} lesson={detail.data} onOpenCase={onOpenCase} />
            ) : (
              <Typography color="text.secondary" className={classes.detailState}>בחרו לקח מהרשימה.</Typography>
            )}
          </Plate>
        </Box>
      )}
    </Box>
  );
}
