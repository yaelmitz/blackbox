import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { sanitizeRichText } from "../../../utils/sanitize";
import { EmptyValue } from "../EmptyValue";
import { useStyles } from "./CaseText.styles";

/** Multi-line plain text, or the empty placeholder */
export function PlainText({ text }: { text?: string }) {
  const { classes } = useStyles();
  return text?.trim() ? <Typography className={classes.plain}>{text}</Typography> : <EmptyValue />;
}

/** Rich text HTML from the editor, sanitized before it is rendered, or the empty placeholder */
export function RichText({ html }: { html?: string }) {
  const { classes } = useStyles();
  const clean = useMemo(() => (html?.trim() ? sanitizeRichText(html) : ""), [html]);
  return clean ? <Box className={classes.rich} dangerouslySetInnerHTML={{ __html: clean }} /> : <EmptyValue />;
}
