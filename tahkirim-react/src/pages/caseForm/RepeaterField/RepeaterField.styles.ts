import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { display: "flex", flexDirection: "column", gap: theme.spacing(1) },
  list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: theme.spacing(0.75) },
  item: { display: "flex", alignItems: "center", gap: theme.spacing(1) },
  field: { flex: 1 },
  remove: { "&:hover": { color: theme.vars.palette.error.main } },
  add: { alignSelf: "flex-start", border: `${theme.hairline} dashed ${theme.vars.palette.bb.dash}` },
}));
