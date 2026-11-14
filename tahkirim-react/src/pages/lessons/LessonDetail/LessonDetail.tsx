import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Annunciator } from "../../../components/ui/Annunciator";
import { Housing } from "../../../components/ui/Housing";
import { Segments } from "../../../components/ui/Segments";
import { LESSON_STATUS } from "../../../constants/labels";
import { SAVE_DEBOUNCE_MS } from "../../../constants/query";
import { useTaskActions, useUpdateLesson } from "../../../hooks/useLessons";
import type { Lesson, LessonStatus } from "../../../types/models";
import { fmtDate } from "../../../utils/format";
import { unitNames } from "../../../utils/units";
import { TaskRow } from "../TaskRow";
import { useStyles } from "./LessonDetail.styles";

type Draft = Pick<Lesson, "title" | "resources" | "notes">;

/** Selected lesson: source investigation, editable fields (saved through a mutation), tasks with parameters */
export function LessonDetail({ lesson: l, onOpenCase }: { lesson: Lesson; onOpenCase: (id: number) => void }) {
  const { classes } = useStyles();
  const update = useUpdateLesson(l.id);
  const actions = useTaskActions(l.id);
  const [draft, setDraft] = useState<Draft>({ title: l.title, resources: l.resources, notes: l.notes });
  const [newTask, setNewTask] = useState("");
  const dirty = useRef(false);

  // text fields are saved a moment after typing stops (one mutation, then invalidation)
  useEffect(() => {
    if (!dirty.current) return;
    const t = window.setTimeout(() => {
      dirty.current = false;
      update.mutate(draft);
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const edit = (patch: Partial<Draft>) => {
    dirty.current = true;
    setDraft((d) => ({ ...d, ...patch }));
  };

  const submitTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    actions.addTask.mutate(newTask.trim(), { onSuccess: () => setNewTask("") });
  };

  const c = l.case;
  const done = l.tasks.filter((t) => t.status === "done").length;

  return (
    <>
      <Housing end={<Typography component="span" variant="inherit" dir="ltr">CH-{l.caseId}</Typography>}>READOUT · LESSON {String(l.id).padStart(2, "0")}</Housing>
      <Box className={classes.body}>
        {c && (
          <Box className={classes.source}>
            <Box className={classes.sourceHead}>
              <Typography variant="label" color="primary">תחקיר מקור</Typography>
              <Annunciator cls={c.cls} />
            </Box>
            <Link component="button" underline="hover" color="inherit" onClick={() => onOpenCase(c.id)} className={classes.sourceTitle}>
              {c.title}
            </Link>
            <Typography variant="body2" color="text.secondary" className={classes.sourceMeta}>
              {fmtDate(c.date)} · {c.type} · {unitNames(c.units)} · מפרסם: {c.by}
            </Typography>
            {c.conclusionsHtml && <Box className={classes.conclusions} dangerouslySetInnerHTML={{ __html: c.conclusionsHtml }} />}
          </Box>
        )}

        <TextField id="l-name" label="שם הלקח" value={draft.title} onChange={(e) => edit({ title: e.target.value })} fullWidth />
        <Box className={classes.twoCol}>
          <TextField id="l-st" select label="סטטוס" value={l.status} disabled={update.isPending} onChange={(e) => update.mutate({ status: e.target.value as LessonStatus })}>
            {(Object.entries(LESSON_STATUS) as [LessonStatus, string][]).map(([k, label]) => (
              <MenuItem key={k} value={k}>{label}</MenuItem>
            ))}
          </TextField>
          <TextField id="l-res" label="משאבים" placeholder="תקציב, כוח אדם, ציוד…" value={draft.resources} onChange={(e) => edit({ resources: e.target.value })} />
        </Box>
        <TextField id="l-notes" label="הערות" placeholder="הערות ליישום הלקח" multiline minRows={3} value={draft.notes} onChange={(e) => edit({ notes: e.target.value })} />

        <Box className={classes.tasks}>
          <Box className={classes.tasksHead}>
            <Typography variant="label" color="text.secondary">משימות</Typography>
            <Typography variant="label" color="text.secondary">{done}/{l.tasks.length} הושלמו</Typography>
          </Box>
          {l.tasks.length > 0 && <Segments on={done} total={l.tasks.length} />}
          <Box component="ul" className={classes.taskList}>
            {l.tasks.length === 0 && <Typography component="li" variant="body2" color="text.secondary">עדיין אין משימות ללקח הזה.</Typography>}
            {l.tasks.map((t) => <TaskRow key={t.id} task={t} actions={actions} />)}
          </Box>
          <Box component="form" onSubmit={submitTask} className={classes.addTask}>
            <TextField id="t-new" size="small" placeholder="משימה חדשה…" value={newTask} onChange={(e) => setNewTask(e.target.value)} slotProps={{ htmlInput: { "aria-label": "משימה חדשה" } }} className={classes.addField} />
            <Button type="submit" variant="outlined" disabled={actions.addTask.isPending}>{actions.addTask.isPending ? "שומר…" : "הוספה"}</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
