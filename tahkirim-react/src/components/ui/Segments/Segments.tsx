import Box from "@mui/material/Box";
import { useStyles } from "./Segments.styles";

/** Segmented level bar: `on` lit segments out of `total`. */
export function Segments({ on, total, height = "0.5rem" }: { on: number; total: number; height?: string }) {
  const { classes, cx } = useStyles({ height });
  return (
    <Box className={classes.root} role="img" aria-label={`${on} מתוך ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <Box component="span" key={i} className={cx(classes.seg, i < on && classes.on)} />
      ))}
    </Box>
  );
}
