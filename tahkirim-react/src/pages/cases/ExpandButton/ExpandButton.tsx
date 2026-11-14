import Typography from "@mui/material/Typography";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";
import { useStyles } from "./ExpandButton.styles";

/** Header of the expand column (screen-reader only) */
export function ExpandHeader() {
  const { classes } = useStyles();
  return <Typography component="span" variant="inherit" className={classes.hidden}>הצגת לקחים</Typography>;
}

/** Opens / closes the lessons row under an investigation */
export function ExpandButton({ open, onToggle, id }: { open: boolean; onToggle: () => void; id: number }) {
  const { classes, cx } = useStyles();
  return (
    <IconButton size="small" onClick={onToggle} aria-expanded={open} aria-label={`הצגת לקחים לתיק ${id}`} className={cx(classes.toggle, open && classes.toggleOpen)}>
      <KeyboardArrowDown fontSize="small" />
    </IconButton>
  );
}