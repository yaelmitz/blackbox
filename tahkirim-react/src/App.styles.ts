import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { minHeight: "100vh" },
  main: { paddingBottom: theme.spacing(9) },
}));
