import Link from "@mui/material/Link";
import { useStyles } from "./TitleCell.styles";

/** Investigation subject; opens the reading page */
export function TitleCell({ title, onOpen }: { title: string; onOpen: () => void }) {
  const { classes } = useStyles();
  return (
    <Link component="button" underline="hover" color="inherit" onClick={onOpen} className={classes.root}>
      {title}
    </Link>
  );
}