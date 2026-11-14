import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Lcd } from "../../../components/ui/Lcd";
import { Plate } from "../../../components/ui/Plate";
import { useStyles, useFormGrid } from "./FormSection.styles";

/** Numbered section of the investigation form */
export function FormSection({ no, title, children }: { no: string; title: string; children: ReactNode }) {
  const { classes } = useStyles();
  return (
    <Plate component="fieldset" className={classes.root}>
      <Box component="legend" className={classes.legend}>
        <Lcd size="sm">{no}</Lcd>
        <Typography variant="h3" component="span">{title}</Typography>
      </Box>
      <Box className={classes.body}>{children}</Box>
    </Plate>
  );
}

