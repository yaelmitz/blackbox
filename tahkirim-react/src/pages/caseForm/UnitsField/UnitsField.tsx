import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCreateUnit, useUnits } from "../../../hooks/useUnits";
import type { Unit } from "../../../types/models";
import { useStyles } from "./UnitsField.styles";

/** An existing unit, or the typed text offered as a new one */
type Option = Unit | { id: null; name: string; isNew: true };
const filter = createFilterOptions<Option>({ stringify: (o) => o.name });

/**
 * מסגרות: multi-select from the units table (GET /api/units).
 * Typing a name that doesn't exist offers "הוספת מסגרת", which creates it (POST /api/units) and selects it.
 */
export function UnitsField({ value, onChange, onBlur }: { value: number[]; onChange: (ids: number[]) => void; onBlur?: () => void }) {
  const { classes } = useStyles();
  const { data: units = [], isLoading } = useUnits();
  const create = useCreateUnit();
  const selected = units.filter((u) => value.includes(u.id));

  return (
    <Autocomplete<Option, true, false, false>
      id="f-unitIds"
      multiple
      options={units}
      value={selected}
      loading={isLoading || create.isPending}
      getOptionLabel={(o) => o.name}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      filterSelectedOptions
      filterOptions={(options, params) => {
        const res = filter(options, params);
        const typed = params.inputValue.trim();
        if (typed && !units.some((u) => u.name === typed)) res.push({ id: null, name: typed, isNew: true });
        return res;
      }}
      renderOption={(props, o) => {
        const { key, ...rest } = props as typeof props & { key: string };
        return (
          <Box component="li" key={key} {...rest}>
            {"isNew" in o ? <Typography component="span" className={classes.create}>+ הוספת מסגרת "{o.name}"</Typography> : o.name}
          </Box>
        );
      }}
      renderTags={(tags, getTagProps) =>
        tags.map((t, i) => {
          const { key, ...rest } = getTagProps({ index: i });
          return <Chip key={key} {...rest} size="small" variant="outlined" label={t.name} className={classes.chip} />;
        })
      }
      onChange={(_, next) => {
        const newOne = next.find((o): o is Extract<Option, { isNew: true }> => "isNew" in o);
        const ids = next.filter((o): o is Unit => !("isNew" in o)).map((o) => o.id);
        if (!newOne) return onChange(ids);
        create.mutate(newOne.name, { onSuccess: (u) => onChange([...ids, u.id]) });
      }}
      onBlur={onBlur}
      renderInput={(params) => <TextField {...params} label="מסגרות" placeholder={selected.length ? "" : "בחירה או הקלדת מסגרת חדשה…"} />}
      noOptionsText="אין מסגרות. הקלידו שם כדי להוסיף."
      loadingText="טוען…"
    />
  );
}