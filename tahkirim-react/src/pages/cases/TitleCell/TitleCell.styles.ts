import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { fontWeight: 700, textAlign: "start", fontSize: "0.9375rem", "&:hover": { color: theme.vars.palette.primary.main } },
}));