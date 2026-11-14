import Box from "@mui/material/Box";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { TextOrFile } from "../../../types/models";
import { useStyles } from "./TextOrFileInput.styles";

interface Props {
  id: string;
  label: string;
  value: TextOrFile;
  onChange: (v: TextOrFile) => void;
  placeholder?: string;
  multiline?: boolean;
}

/** Field the spec defines as "text or file": switch between typing and attaching. */
export function TextOrFileInput({ id, label, value, onChange, placeholder, multiline }: Props) {
  const { classes, cx } = useStyles();
  return (
    <Box className={classes.root}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={value.kind}
        aria-label={`${label}: סוג קלט`}
        onChange={(_, kind: TextOrFile["kind"] | null) => {
          if (!kind || kind === value.kind) return;
          onChange(kind === "text" ? { kind: "text", text: "" } : { kind: "file", fileName: "" });
        }}
        className={classes.switch}
      >
        <ToggleButton value="text" className={classes.option}>טקסט</ToggleButton>
        <ToggleButton value="file" className={classes.option}>קובץ</ToggleButton>
      </ToggleButtonGroup>

      {value.kind === "text" ? (
        <TextField
          id={id}
          label={label}
          value={value.text}
          placeholder={placeholder}
          multiline={multiline}
          minRows={multiline ? 3 : undefined}
          onChange={(e) => onChange({ kind: "text", text: e.target.value })}
          fullWidth
        />
      ) : (
        <Button component="label" variant="outlined" startIcon={<UploadFileOutlined />} className={cx(classes.file, !!value.fileName && classes.chosen)}>
          {value.fileName || `${label}: בחירת קובץ…`}
          <Box component="input"
            id={id}
            type="file"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              onChange(f ? { kind: "file", fileName: f.name, file: f } : { kind: "file", fileName: "" });
            }}
          />
        </Button>
      )}
    </Box>
  );
}
