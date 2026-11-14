import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Plate } from "../../../components/ui/Plate";
import { useStyles } from "./InfoCard.styles";

/** Side card on the reading page */
export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  const { classes } = useStyles();
  return (
    <Plate className={classes.root}>
      <Typography variant="mono" color="primary" component="h2" className={classes.title}>{title}</Typography>
      {children}
    </Plate>
  );
}