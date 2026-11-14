import Typography from "@mui/material/Typography";
import { CLS } from "../../../constants/labels";
import type { Classification } from "../../../types/models";
import { useStyles } from "./Annunciator.styles";

/** Classification shown as a cockpit annunciator light: dim / amber / red. */
export function Annunciator({ cls, onHousing = false }: { cls: Classification; onHousing?: boolean }) {
  const { classes, cx } = useStyles();
  return <Typography component="span" variant="inherit" className={cx(classes.root, classes[`s${cls}`], onHousing && classes.onHousing)}>{CLS[cls]}</Typography>;
}
