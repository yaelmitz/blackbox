import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  content: { paddingTop: `${theme.spacing(1)} !important` },
  actions: { paddingInline: theme.spacing(3), paddingBottom: theme.spacing(2) },
  remove: { marginInlineEnd: "auto" },
}));
