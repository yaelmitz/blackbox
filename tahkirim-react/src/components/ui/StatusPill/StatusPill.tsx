import Typography from "@mui/material/Typography";
import { LESSON_STATUS, TASK_STATUS } from "../../../constants/labels";
import type { LessonStatus, TaskStatus } from "../../../types/models";
import { useToneStyles, useStyles } from "./StatusPill.styles";

/** Tone per status: a palette role, so the LED colour follows the theme */
export type Tone = "info" | "warning" | "success" | "muted" | "error";
export const LESSON_TONE: Record<LessonStatus, Tone> = { new: "info", work: "warning", done: "success", closed: "muted" };
export const TASK_TONE: Record<TaskStatus, Tone> = { open: "info", work: "warning", done: "success", blocked: "error" };

/** Status as an LED plus label */
export function StatusPill(props: { lesson: LessonStatus } | { task: TaskStatus }) {
  const { classes, cx } = useStyles();
  const { classes: tone } = useToneStyles();
  const [t, label] = "lesson" in props ? [LESSON_TONE[props.lesson], LESSON_STATUS[props.lesson]] : [TASK_TONE[props.task], TASK_STATUS[props.task]];
  return <Typography component="span" variant="inherit" className={cx(classes.root, tone[t], t === "muted" && classes.noGlow)}>{label}</Typography>;
}
