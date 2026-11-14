import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useStyles } from "./Housing.styles";

/** Orange recorder-housing band across the top of a panel, with a bolt at each end. */
export function Housing({ children, end }: { children: ReactNode; end?: ReactNode }) {
  const { classes } = useStyles();
  return (
    <Box className={classes.root}>
      <Box component="span" className={classes.bolt} />
      <Typography component="span" variant="inherit" className={classes.text}>{children}</Typography>
      {end}
      <Box component="span" className={classes.bolt} />
    </Box>
  );
}
