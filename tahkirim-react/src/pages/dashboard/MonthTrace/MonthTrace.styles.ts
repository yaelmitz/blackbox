import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { width: "100%", height: "auto", display: "block" },
  text: { fontFamily: theme.font },
}));