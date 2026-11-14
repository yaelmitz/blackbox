import AttachFileRounded from "@mui/icons-material/AttachFileRounded";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { attachmentsApi } from "../../../api/attachments";
import type { TextOrFile } from "../../../types/models";
import { useStyles } from "./TextOrFileValue.styles";

/** Shows a "text or file" field: the text, or the file as a download chip */
export function TextOrFileValue({ v, ltr }: { v?: TextOrFile; ltr?: boolean }) {
  const { classes } = useStyles();
  if (!v || (v.kind === "text" && !v.text.trim()) || (v.kind === "file" && !v.fileName)) return <Typography component="span" color="text.secondary">לא הוזן</Typography>;
  if (v.kind === "text") return <Typography component="span" dir={ltr ? "ltr" : undefined} className={ltr ? classes.ltr : classes.text}>{v.text}</Typography>;
  return (
    <Chip
      icon={<AttachFileRounded />}
      label={v.fileName}
      component="a"
      href={v.fileId ? attachmentsApi.url(v.fileId) : undefined}
      clickable={!!v.fileId}
      variant="outlined"
      className={classes.file}
    />
  );
}