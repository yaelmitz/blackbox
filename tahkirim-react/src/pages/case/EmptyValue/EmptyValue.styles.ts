import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { color: theme.vars.palette.bb.placeholder, fontStyle: "italic" },
}));