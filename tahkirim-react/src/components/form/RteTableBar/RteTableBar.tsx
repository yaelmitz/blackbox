import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { Editor } from "@tiptap/react";
import { useStyles } from "./RteTableBar.styles";

type Action = { label: string; run: (e: Editor) => boolean; danger?: boolean };

const ACTIONS: Action[] = [
  { label: "+ שורה מעל", run: (e) => e.chain().focus().addRowBefore().run() },
  { label: "+ שורה מתחת", run: (e) => e.chain().focus().addRowAfter().run() },
  { label: "+ עמודה מימין", run: (e) => e.chain().focus().addColumnBefore().run() },
  { label: "+ עמודה משמאל", run: (e) => e.chain().focus().addColumnAfter().run() },
  { label: "שורת כותרת", run: (e) => e.chain().focus().toggleHeaderRow().run() },
  { label: "מיזוג / פיצול תאים", run: (e) => e.chain().focus().mergeOrSplit().run() },
  { label: "− שורה", run: (e) => e.chain().focus().deleteRow().run(), danger: true },
  { label: "− עמודה", run: (e) => e.chain().focus().deleteColumn().run(), danger: true },
  { label: "מחיקת טבלה", run: (e) => e.chain().focus().deleteTable().run(), danger: true },
];

/** Table actions, shown while the cursor is inside a table */
export function RteTableBar({ editor }: { editor: Editor }) {
  const { classes } = useStyles();
  if (!editor.isActive("table")) return null;
  return (
    <Box className={classes.root} role="toolbar" aria-label="פעולות טבלה">
      <Typography variant="label" color="text.secondary" className={classes.title}>טבלה</Typography>
      {ACTIONS.map((a) => (
        <Button
          key={a.label}
          size="small"
          color={a.danger ? "error" : "inherit"}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => a.run(editor)}
          className={classes.action}
        >
          {a.label}
        </Button>
      ))}
    </Box>
  );
}
