import Chip from "@mui/material/Chip";
import { useStyles } from "./TypeCell.styles";

export function TypeCell({ type }: { type: string }) {
  const { classes } = useStyles();
  return <Chip size="small" variant="outlined" label={type} className={classes.root} />;
}