import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { paddingInline: theme.spacing(2.5), paddingTop: theme.spacing(2.75), paddingBottom: theme.spacing(2.25) },
  title: { display: "block", marginBottom: theme.spacing(1.5), paddingInline: theme.spacing(1.25) },
}));