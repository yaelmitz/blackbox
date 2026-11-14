import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { display: "inline-flex", alignItems: "center", gap: theme.spacing(1), flexWrap: "wrap" },
  pending: { color: theme.vars.palette.text.secondary, whiteSpace: "nowrap" },
}));
