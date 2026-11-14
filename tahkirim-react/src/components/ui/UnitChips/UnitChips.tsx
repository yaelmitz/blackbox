import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { Unit } from "../../../types/models";
import { useStyles } from "./UnitChips.styles";

/** The units (מסגרות) of an investigation as small chips */
export function UnitChips({ units }: { units: Unit[] }) {
  const { classes } = useStyles();
  if (!units.length) return <Typography variant="body2" color="text.secondary">—</Typography>;
  return (
    <Box className={classes.root}>
      {units.map((u) => <Chip key={u.id} size="small" variant="outlined" label={u.name} className={classes.chip} />)}
    </Box>
  );
}