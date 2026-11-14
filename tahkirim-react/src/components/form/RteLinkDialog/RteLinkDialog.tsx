import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect, useState, type FormEvent } from "react";
import { normalizeUrl } from "../../../utils/format";
import { useStyles } from "./RteLinkDialog.styles";

interface Props {
  open: boolean;
  /** the link under the cursor, when editing one */
  initialUrl: string;
  onClose: () => void;
  onSave: (url: string) => void;
  onRemove: () => void;
}

/** Add, change or remove a link */
export function RteLinkDialog({ open, initialUrl, onClose, onSave, onRemove }: Props) {
  const { classes } = useStyles();
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (open) setUrl(initialUrl);
  }, [open, initialUrl]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clean = normalizeUrl(url);
    if (clean) onSave(clean);
    else onRemove();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ component: "form", onSubmit: submit }}>
      <DialogTitle>{initialUrl ? "עריכת קישור" : "הוספת קישור"}</DialogTitle>
      <DialogContent className={classes.content}>
        <TextField
          autoFocus
          fullWidth
          label="כתובת"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          inputProps={{ dir: "ltr" }}
          helperText="אם לא נבחר טקסט, הכתובת עצמה תיכנס כקישור."
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        {initialUrl && <Button color="error" onClick={onRemove} className={classes.remove}>הסרת קישור</Button>}
        <Button color="inherit" onClick={onClose}>ביטול</Button>
        <Button type="submit" variant="contained">שמירה</Button>
      </DialogActions>
    </Dialog>
  );
}
