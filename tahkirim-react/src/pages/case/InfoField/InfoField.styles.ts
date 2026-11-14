import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { minWidth: 0 },
  wide: { gridColumn: "1 / -1" },
  value: { marginTop: theme.spacing(0.375), fontWeight: 600, overflowWrap: "anywhere" },
}));