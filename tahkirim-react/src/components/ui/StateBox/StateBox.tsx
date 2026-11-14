import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Plate } from "../Plate";
import { useStyles } from "./StateBox.styles";

/** Loading / error / empty panel */
export function StateBox({
  kind,
  title,
  message,
  action,
}: {
  kind: "loading" | "error" | "empty";
  title?: string;
  message?: ReactNode;
  action?: { label: string; onClick: () => void };
}) {
  const { classes, cx } = useStyles();
  return (
    <Plate role={kind === "error" ? "alert" : "status"} className={cx(classes.root, kind === "error" && classes.error)}>
      {kind === "loading" && (
        <Box className={classes.loading}>
          <CircularProgress size="1rem" />
          <Typography variant="mono" color="primary">LOADING</Typography>
        </Box>
      )}
      {title && <Typography variant="h3">{title}</Typography>}
      {message && <Typography color="text.secondary">{message}</Typography>}
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Plate>
  );
}
