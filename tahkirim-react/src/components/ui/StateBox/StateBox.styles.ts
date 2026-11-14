import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { padding: theme.spacing(3.5), display: "flex", flexDirection: "column", alignItems: "flex-start", gap: theme.spacing(1.25) },
  error: { borderColor: theme.vars.palette.error.main },
  loading: { display: "flex", alignItems: "center", gap: theme.spacing(1) },
}));
