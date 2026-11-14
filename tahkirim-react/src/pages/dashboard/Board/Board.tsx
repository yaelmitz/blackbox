import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Plate } from "../../../components/ui/Plate";
import { useStyles } from "./Board.styles";

/** Dashboard panel with a title and an instrument tag */
export function Board({ title, tag, children }: { title: string; tag: string; children: ReactNode }) {
  const { classes } = useStyles();
  return (
    <Plate className={classes.root}>
      <Box className={classes.head}>
        <Typography variant="h3" component="h2">{title}</Typography>
        <Typography variant="mono" color="text.secondary">{tag}</Typography>
      </Box>
      {children}
    </Plate>
  );
}