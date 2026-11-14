import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Lcd } from "../../../components/ui/Lcd";
import { useStyles } from "./CaseBlock.styles";

/** Numbered section of the investigation narrative */
export function CaseBlock({ no, title, children }: { no: string; title: string; children: ReactNode }) {
  const { classes } = useStyles();
  return (
    <Box component="section" className={classes.root}>
      <Box className={classes.head}>
        <Lcd size="sm">{no}</Lcd>
        <Typography variant="h3" component="h2">{title}</Typography>
      </Box>
      {children}
    </Box>
  );
}