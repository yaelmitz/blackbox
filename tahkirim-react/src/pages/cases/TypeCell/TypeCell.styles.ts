import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { backgroundColor: theme.vars.palette.bb.panel2, borderColor: theme.vars.palette.bb.rule },
}));