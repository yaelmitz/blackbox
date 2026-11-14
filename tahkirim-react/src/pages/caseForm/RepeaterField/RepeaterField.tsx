import Box from "@mui/material/Box";
import AddRounded from "@mui/icons-material/AddRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useFieldArray, type Control } from "react-hook-form";
import { Lcd } from "../../../components/ui/Lcd";
import type { CaseFormValues } from "../../../types/forms";
import { useStyles } from "./RepeaterField.styles";

type Name = "recommendations" | "lessons";

/** Dynamic list (useFieldArray) for recommendations or lessons */
export function RepeaterField({
  control,
  name,
  label,
  itemLabel,
  prefix,
  addLabel,
  isExisting,
}: {
  control: Control<CaseFormValues>;
  name: Name;
  label: string;
  itemLabel: string;
  prefix: string;
  addLabel: string;
  isExisting: (i: number) => boolean;
}) {
  const { classes } = useStyles();
  const { fields, append, remove } = useFieldArray({ control, name });
  const textKey = name === "recommendations" ? "text" : "title";

  return (
    <Box className={classes.root}>
      <Typography variant="label" color="text.secondary">{label}</Typography>
      <Box component="ol" className={classes.list}>
        {fields.map((f, i) => (
          <Box component="li" key={f.id} className={classes.item}>
            <Lcd size="sm">{isExisting(i) ? `${prefix}${i + 1}` : "חדש"}</Lcd>
            <Controller
              control={control}
              name={`${name}.${i}.${textKey}` as `recommendations.${number}.text`}
              render={({ field }) => (
                <TextField {...field} size="small" placeholder={`${itemLabel}…`} slotProps={{ htmlInput: { "aria-label": `${itemLabel} ${i + 1}` } }} className={classes.field} />
              )}
            />
            <IconButton aria-label={`הסרת ${itemLabel} ${i + 1}`} onClick={() => remove(i)} className={classes.remove}>
              <CloseRounded fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button startIcon={<AddRounded />} onClick={() => append(name === "recommendations" ? { text: "" } : ({ title: "" } as never))} className={classes.add}>
        {addLabel}
      </Button>
    </Box>
  );
}
