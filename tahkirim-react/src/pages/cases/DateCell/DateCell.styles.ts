import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { fontSize: "0.8125rem", color: theme.vars.palette.text.secondary },
}));