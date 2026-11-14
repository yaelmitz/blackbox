import Typography from "@mui/material/Typography";
import { fmtDate } from "../../../utils/format";
import { useStyles } from "./DateCell.styles";

export function DateCell({ date }: { date: string }) {
  const { classes } = useStyles();
  return <Typography className={classes.root}>{fmtDate(date)}</Typography>;
}