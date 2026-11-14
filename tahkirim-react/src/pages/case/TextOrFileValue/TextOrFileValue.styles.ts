import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  text: { whiteSpace: "pre-line" },
  ltr: { display: "block", textAlign: "end" },
  file: { backgroundColor: theme.vars.palette.bb.well, borderColor: theme.vars.palette.bb.rule, maxWidth: "100%" },
}));