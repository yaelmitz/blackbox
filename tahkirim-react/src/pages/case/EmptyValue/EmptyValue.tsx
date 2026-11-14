import Typography from "@mui/material/Typography";
import { useStyles } from "./EmptyValue.styles";

/** "לא הוזן" placeholder for an empty field */
export function EmptyValue() {
  const { classes } = useStyles();
  return <Typography className={classes.root}>לא הוזן</Typography>;
}