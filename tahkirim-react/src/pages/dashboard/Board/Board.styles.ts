import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { padding: theme.spacing(2.5), minWidth: 0 },
  head: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: theme.spacing(1.25), marginBottom: theme.spacing(1.75), paddingInline: theme.spacing(1.25) },
}));