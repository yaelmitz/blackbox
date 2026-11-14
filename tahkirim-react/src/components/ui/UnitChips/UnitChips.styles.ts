import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { display: "flex", flexWrap: "wrap", gap: theme.spacing(0.5) },
  chip: { backgroundColor: theme.vars.palette.bb.panel2, borderColor: theme.vars.palette.bb.rule, fontWeight: 600 },
}));