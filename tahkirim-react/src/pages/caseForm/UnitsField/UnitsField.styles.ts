import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  chip: { backgroundColor: theme.vars.palette.bb.panel2, borderColor: theme.vars.palette.bb.rule },
  create: { color: theme.vars.palette.primary.main, fontWeight: 700 },
}));