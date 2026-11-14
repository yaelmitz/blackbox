import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { paddingInline: theme.spacing(2), paddingTop: theme.spacing(2.25), paddingBottom: theme.spacing(1.75), display: "flex", flexDirection: "column", alignItems: "center" },
  svg: { width: "100%", maxWidth: "9.375rem", height: "auto" },
  text: { fontFamily: theme.font },
  label: { marginTop: theme.spacing(-0.75) },
}));