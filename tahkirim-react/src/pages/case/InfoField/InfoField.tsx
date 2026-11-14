import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useStyles } from "./InfoField.styles";

/** Label + value; `wide` spans the whole card grid */
export function InfoField({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  const { classes, cx } = useStyles();
  return (
    <Box className={cx(classes.root, wide && classes.wide)}>
      <Typography variant="label" color="text.secondary" component="div">{label}</Typography>
      <Box className={classes.value}>{children}</Box>
    </Box>
  );
}