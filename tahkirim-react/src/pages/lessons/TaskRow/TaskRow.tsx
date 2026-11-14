import Box from "@mui/material/Box";
import AddRounded from "@mui/icons-material/AddRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState, type FormEvent } from "react";
import { TASK_TONE, useToneStyles } from "../../../components/ui/StatusPill";
import { TASK_STATUS } from "../../../constants/labels";
import type { useTaskActions } from "../../../hooks/useLessons";
import type { Task, TaskStatus } from "../../../types/models";
import { useStyles } from "./TaskRow.styles";

/** A task with its status and parameters (spec: every task has parameters and a status) */
export function TaskRow({ task: t, actions }: { task: Task; actions: ReturnType<typeof useTaskActions> }) {
  const { classes, cx } = useStyles();
  const { classes: tone } = useToneStyles();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const submitParam = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    actions.addParameter.mutate(
      { taskId: t.id, name: name.trim(), value: value.trim() },
      {
        onSuccess: () => {
          setName("");
          setValue("");
          setAdding(false);
        },
      },
    );
  };

  return (
    <Box component="li" className={classes.root}>
      <Box className={classes.top}>
        <Typography className={cx(classes.name, t.status === "done" && classes.done)}>{t.name}</Typography>
        <Select
          size="small"
          variant="standard"
          disableUnderline
          value={t.status}
          inputProps={{ "aria-label": `סטטוס המשימה ${t.name}` }}
          onChange={(e) => actions.setStatus.mutate({ taskId: t.id, status: e.target.value as TaskStatus })}
          className={cx(classes.status, tone[TASK_TONE[t.status]])}
        >
          {(Object.entries(TASK_STATUS) as [TaskStatus, string][]).map(([k, label]) => (
            <MenuItem key={k} value={k}>{label}</MenuItem>
          ))}
        </Select>
        <IconButton size="small" aria-label={`מחיקת המשימה ${t.name}`} onClick={() => actions.removeTask.mutate(t.id)} className={classes.remove}>
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>

      <Box className={classes.params}>
        {t.parameters.map((p) => (
          <Chip
            key={p.id}
            size="small"
            variant="outlined"
            label={<><Typography component="b" variant="inherit" className={classes.paramName}>{p.name}</Typography>{p.value && `: ${p.value}`}</>}
            onDelete={() => actions.removeParameter.mutate(p.id)}
            className={classes.param}
          />
        ))}
        {adding ? (
          <Box component="form" onSubmit={submitParam} className={classes.paramForm}>
            <TextField size="small" autoFocus label="פרמטר" value={name} onChange={(e) => setName(e.target.value)} className={classes.paramField} />
            <TextField size="small" label="ערך" value={value} onChange={(e) => setValue(e.target.value)} className={classes.paramField} />
            <Button type="submit" variant="outlined" disabled={actions.addParameter.isPending}>שמירה</Button>
            <Button color="inherit" onClick={() => setAdding(false)} className={classes.cancel}>ביטול</Button>
          </Box>
        ) : (
          <Button size="small" startIcon={<AddRounded />} onClick={() => setAdding(true)} className={classes.addParam}>
            פרמטר
          </Button>
        )}
      </Box>
    </Box>
  );
}
