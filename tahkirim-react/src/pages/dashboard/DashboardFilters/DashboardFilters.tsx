import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { CASE_TYPES } from "../../../constants/labels";
import { useFilterOptions } from "../../../hooks/useInvestigations";
import { DATE_PRESETS, EMPTY_DASHBOARD_FILTERS, type DashboardFilterValues } from "../../../utils/dashboardFilters";
import { useStyles } from "./DashboardFilters.styles";

interface Props {
  value: DashboardFilterValues;
  onChange: (next: DashboardFilterValues) => void;
  /** investigations matching the current filters (shown on the clear button) */
  matching?: number;
  /** "to" is before "from" */
  rangeError?: boolean;
}

/** Dashboard filters: unit (יחידה), type (סוג) and date range with quick presets */
export function DashboardFilters({ value, onChange, matching, rangeError }: Props) {
  const { classes, cx } = useStyles();
  const { data: options } = useFilterOptions();
  const set = (patch: Partial<DashboardFilterValues>) => onChange({ ...value, ...patch });
  const active = !!(value.unit || value.type || value.from || value.to);
  const preset = DATE_PRESETS.find((p) => {
    const r = p.range();
    return r.from === value.from && r.to === value.to;
  });

  return (
    <Box className={classes.root} role="search" aria-label="סינון הדשבורד">
      <Box className={classes.row}>
        <TextField
          id="dash-unit"
          select
          size="small"
          label="יחידה"
          value={value.unit}
          onChange={(e) => set({ unit: e.target.value })}
          className={cx(classes.select, !!value.unit && classes.on)}
        >
          <MenuItem value="">כל היחידות</MenuItem>
          {(options?.units ?? []).map((u) => <MenuItem key={u.id} value={String(u.id)}>{u.name}</MenuItem>)}
        </TextField>
        <TextField
          id="dash-type"
          select
          size="small"
          label="סוג"
          value={value.type}
          onChange={(e) => set({ type: e.target.value })}
          className={cx(classes.select, !!value.type && classes.on)}
        >
          <MenuItem value="">כל הסוגים</MenuItem>
          {CASE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField
          id="dash-from"
          type="date"
          size="small"
          label="מתאריך"
          value={value.from}
          onChange={(e) => set({ from: e.target.value })}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: value.to || undefined } }}
          className={cx(classes.date, !!value.from && classes.on)}
        />
        <TextField
          id="dash-to"
          type="date"
          size="small"
          label="עד תאריך"
          value={value.to}
          onChange={(e) => set({ to: e.target.value })}
          error={rangeError}
          helperText={rangeError ? "לפני תאריך ההתחלה" : undefined}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: value.from || undefined } }}
          className={cx(classes.date, !!value.to && classes.on)}
        />
        {active && (
          <Button variant="outlined" color="inherit" onClick={() => onChange(EMPTY_DASHBOARD_FILTERS)} className={classes.clear}>
            ניקוי
            {matching != null && <Typography component="span" variant="label" className={classes.count}>{matching} תחקירים</Typography>}
          </Button>
        )}
      </Box>
      <Box className={classes.presets} role="group" aria-label="טווח תאריכים מהיר">
        <Typography variant="label" color="text.secondary">טווח מהיר:</Typography>
        {DATE_PRESETS.map((p) => (
          <Chip
            key={p.label}
            label={p.label}
            size="small"
            variant="outlined"
            clickable
            aria-pressed={preset === p}
            onClick={() => set(preset === p ? { from: "", to: "" } : p.range())}
            className={cx(classes.chip, preset === p && classes.chipOn)}
          />
        ))}
      </Box>
    </Box>
  );
}
