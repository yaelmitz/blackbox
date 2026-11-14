import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useStyles } from "./Lcd.styles";

/** Number display for investigation numbers (1001) and index badges (R1, L1): orange on black in dark mode, orange on white with an orange edge in light mode. */
export function Lcd({ children, size = "md", glow = false }: { children: ReactNode; size?: "sm" | "md" | "lg"; glow?: boolean }) {
  const { classes, cx } = useStyles();
  return (
    <Typography component="span" variant="inherit" dir="ltr" className={cx(classes.root, classes[size], glow && classes.glow)}>
      {children}
    </Typography>
  );
}
