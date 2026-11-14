import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: theme.spacing(2.5),
    alignItems: "center",
    paddingBlock: theme.spacing(2.25),
    [theme.breakpoints.up("md")]: { gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)" },
  },
  text: { minWidth: 0 },
  title: { marginBlock: theme.spacing(0.75), textWrap: "balance" },
  lede: { maxWidth: "62ch", fontSize: "0.875rem" },
}));
