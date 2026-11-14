import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../../api/http";
import { RichTextEditor } from "../../../components/form/RichTextEditor";
import { TextOrFileInput } from "../../../components/form/TextOrFileInput";
import { CASE_TYPES, CLS } from "../../../constants/labels";
import { routes } from "../../../constants/routes";
import { useCaseIdTaken, useCreateInvestigation, useUpdateInvestigation } from "../../../hooks/useInvestigations";
import type { CaseFormValues } from "../../../types/forms";
import { REQUIRED_LABELS } from "../../../utils/caseForm";
import { errorMessage } from "../../../utils/format";
import { FormSection, useFormGrid } from "../FormSection";
import { RepeaterField } from "../RepeaterField";
import { UnitsField } from "../UnitsField";
import { useStyles } from "./CaseForm.styles";

/** Create / edit investigation form (react-hook-form + MUI). `initial` = edit mode. */
export function CaseForm({ defaults, initial }: { defaults: CaseFormValues; initial?: CaseFormValues }) {
  const { classes, cx } = useStyles();
  const { classes: grid } = useFormGrid();
  const isEdit = !!initial;
  const navigate = useNavigate();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const create = useCreateInvestigation();
  const update = useUpdateInvestigation(initial ?? defaults);
  const idTaken = useCaseIdTaken();
  const saving = create.isPending || update.isPending;
  const serverError = (create.error ?? update.error) as Error | null;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitted },
  } = useForm<CaseFormValues>({ mode: "onTouched", defaultValues: initial ?? defaults });

  const lessonsNow = useWatch({ control, name: "lessons" });
  const removedLessons = isEdit ? initial.lessons.filter((o) => !lessonsNow.some((l) => l.lid === o.lid)) : [];
  const backTo = isEdit ? routes.case(initial.id) : routes.cases;

  // the mutation hooks invalidate the affected queries on success; here we only navigate
  const onValid = (v: CaseFormValues) => {
    const onError = (e: Error) => {
      if (e instanceof ApiError && e.status === 409) setError("id", { message: `מספר ${v.id} כבר קיים, בחרו מספר אחר` }, { shouldFocus: true });
    };
    if (isEdit) update.mutate(v, { onError, onSuccess: () => navigate(routes.case(v.id), { state: { saved: true } }) });
    else create.mutate(v, { onError, onSuccess: () => navigate(routes.cases, { state: { created: Number(v.id) } }) });
    window.scrollTo(0, 0);
  };

  const onInvalid = (errs: FieldErrors<CaseFormValues>) => document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
  const cancel = () => (isDirty && !confirmLeave ? setConfirmLeave(true) : navigate(backTo));
  const missing = Object.keys(errors).filter((k) => k in REQUIRED_LABELS) as (keyof CaseFormValues)[];

  const text = (name: keyof CaseFormValues, label: string, opts: { required?: string; placeholder?: string; multiline?: boolean; type?: string } = {}) => (
    <Controller
      control={control}
      name={name}
      rules={opts.required ? { required: opts.required, validate: (s: unknown) => String(s ?? "").trim().length > 0 || opts.required } : undefined}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value as string}
          id={`f-${name}`}
          label={label}
          required={!!opts.required}
          type={opts.type}
          placeholder={opts.placeholder}
          multiline={opts.multiline}
          minRows={opts.multiline ? 3 : undefined}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          slotProps={{ inputLabel: opts.type === "date" ? { shrink: true } : undefined }}
          fullWidth
        />
      )}
    />
  );

  return (
    <Box component="form" onSubmit={handleSubmit(onValid, onInvalid)} noValidate className={classes.form}>
      {serverError && !(serverError instanceof ApiError && serverError.status === 409) && (
        <Alert severity="error" variant="outlined">השמירה בשרת נכשלה: {errorMessage(serverError)}</Alert>
      )}
      {isSubmitted && missing.length > 0 && (
        <Alert severity="error" variant="outlined"><Typography component="b" variant="inherit">חסרים פרטים לפני השמירה:</Typography> {missing.map((k) => REQUIRED_LABELS[k]).join(" · ")}</Alert>
      )}

      <FormSection no="01" title="פרטי זיהוי">
        <Box className={grid.three}>
          <Controller
            control={control}
            name="id"
            rules={{
              required: "צריך מספר מזהה",
              min: { value: 1, message: "מספר חיובי בלבד" },
              validate: async (n) => {
                if (!Number.isInteger(Number(n))) return "מספר שלם בלבד";
                if (!isEdit && (await idTaken(Number(n)))) return `מספר ${n} כבר קיים, בחרו מספר אחר`;
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                id="f-id"
                label="מספר מזהה"
                required
                type="number"
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? (isEdit ? "מספר מזהה לא ניתן לשינוי" : undefined)}
                slotProps={{ htmlInput: { readOnly: isEdit, dir: "ltr", inputMode: "numeric" } }}
                className={classes.idInput}
              />
            )}
          />
          <Box className={grid.span2}>{text("title", "נושא", { required: "צריך נושא לתחקיר", placeholder: "לדוגמה: תקלה בשרשרת האספקה – מחסן מרכזי" })}</Box>
          {text("date", "תאריך", { required: "צריך תאריך", type: "date" })}
          <Controller
            control={control}
            name="type"
            rules={{ required: "בחרו סוג" }}
            render={({ field, fieldState }) => (
              <TextField {...field} id="f-type" select label="סוג" required error={!!fieldState.error} helperText={fieldState.error?.message}>
                {CASE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="cls"
            rules={{ required: "בחרו סיווג" }}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error}>
                <FormLabel id="cls-label" required className={classes.clsLabel}>סיווג</FormLabel>
                <ToggleButtonGroup id="f-cls" exclusive value={field.value} onChange={(_, v: string | null) => v !== null && field.onChange(v)} aria-labelledby="cls-label" className={classes.clsGroup}>
                  {CLS.map((name, i) => (
                    <ToggleButton key={name} value={String(i)} className={cx(classes.cls, classes[`cls${i as 0 | 1 | 2}`])}>
                      {name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller control={control} name="unitIds" render={({ field }) => <UnitsField value={field.value} onChange={field.onChange} onBlur={field.onBlur} />} />
          {text("by", "מפרסם", { required: "צריך שם מפרסם", placeholder: "שם מלא" })}
        </Box>
      </FormSection>

      <FormSection no="02" title="רקע ושאלות">
        <Box className={grid.two}>
          {text("background", "רקע", { multiline: true, placeholder: "מה ההקשר של האירוע?" })}
          {text("questions", "שאלות", { multiline: true, placeholder: "אילו שאלות התחקיר צריך לענות עליהן?" })}
        </Box>
      </FormSection>

      <FormSection no="03" title="מיקום">
        <Box className={grid.two}>
          <Controller control={control} name="location" render={({ field }) => <TextOrFileInput id="f-location" label="מיקום" value={field.value} onChange={field.onChange} placeholder="לדוגמה: מחסן מרכזי, רציף 4" />} />
          <Controller control={control} name="coordinates" render={({ field }) => <TextOrFileInput id="f-coordinates" label='נ"צ' value={field.value} onChange={field.onChange} placeholder="לדוגמה: 31.7683, 35.2137" />} />
        </Box>
      </FormSection>

      <FormSection no="04" title="ממצאים">
        {([
          ["whatHappenedHtml", "מה קרה", "תארו את רצף האירועים…"],
          ["whatPlannedHtml", "מה תוכנן", "מה הייתה התוכנית המקורית?"],
          ["conclusionsHtml", "מסקנות", "מה למדנו? כל מסקנה בשורה או בתבליט נפרד."],
        ] as const).map(([name, label, ph]) => (
          <Box key={name} className={grid.stackSm}>
            <Typography component="label" htmlFor={`f-${name}`} variant="label" color="text.secondary">{label}</Typography>
            <Controller control={control} name={name} render={({ field }) => <RichTextEditor id={`f-${name}`} value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder={ph} />} />
          </Box>
        ))}
      </FormSection>

      <FormSection no="05" title="המלצות ולקחים">
        <Box className={grid.two}>
          <RepeaterField control={control} name="recommendations" label="המלצות" itemLabel="המלצה" prefix="R" addLabel="הוספת המלצה" isExisting={() => true} />
          <Box className={grid.stack}>
            <RepeaterField control={control} name="lessons" label="לקחים" itemLabel="לקח" prefix="L" addLabel="הוספת לקח" isExisting={(i) => !isEdit || !!lessonsNow[i]?.lid} />
            <Typography variant="body2" color="text.secondary">
              {isEdit ? 'שינוי שם של לקח קיים שומר את הסטטוס והמשימות שלו. לקח חדש נשמר בסטטוס "חדש".' : 'כל לקח נשמר בסטטוס "חדש" ויופיע בניהול הלקחים.'}
            </Typography>
            {removedLessons.length > 0 && (
              <Alert severity="warning" variant="outlined">
                {removedLessons.length === 1
                  ? `בשמירה יימחק הלקח "${removedLessons[0].title}", כולל המשימות שלו.`
                  : `בשמירה יימחקו ${removedLessons.length} לקחים (${removedLessons.map((l) => l.title).join(", ")}), כולל המשימות שלהם.`}
              </Alert>
            )}
          </Box>
        </Box>
      </FormSection>

      <FormSection no="06" title="מקורות ובעלי תפקידים">
        <Box className={grid.two}>
          <Controller control={control} name="sources" render={({ field }) => <TextOrFileInput id="f-sources" label="מקורות מידע" value={field.value} onChange={field.onChange} placeholder="יומנים, הקלטות, עדויות…" multiline />} />
          {text("roles", "בעלי התפקידים", { multiline: true, placeholder: "מי היה מעורב ובאיזה תפקיד?" })}
        </Box>
      </FormSection>

      <Box className={classes.footer}>
        <Button type="submit" variant="contained" disabled={saving}>{saving ? "שומר…" : isEdit ? "שמירת השינויים" : "שמירת התחקיר"}</Button>
        {confirmLeave ? (
          <Box className={classes.leave}>
            <Typography color="warning.main">יש שינויים שלא נשמרו. לצאת בכל זאת?</Typography>
            <Button variant="outlined" color="inherit" onClick={() => navigate(backTo)}>יציאה בלי לשמור</Button>
            <Button variant="outlined" color="inherit" onClick={() => setConfirmLeave(false)}>המשך עריכה</Button>
          </Box>
        ) : (
          <Button variant="outlined" color="inherit" onClick={cancel}>ביטול</Button>
        )}
      </Box>
    </Box>
  );
}
