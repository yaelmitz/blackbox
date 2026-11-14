import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1),
      padding: theme.spacing(1.25),
      border: `${theme.hairline} solid ${p.bb.rule}`,
      borderRadius: theme.radius.md,
      backgroundColor: p.bb.well,
    },
    top: { display: "flex", alignItems: "center", gap: theme.spacing(1.25) },
    name: { flex: 1, minWidth: 0 },
    done: { color: p.text.secondary, textDecoration: "line-through" },
    status: { fontWeight: 700, fontSize: "0.8125rem", "& .MuiSelect-select": { paddingBlock: theme.spacing(0.25) } },
    remove: { "&:hover": { color: p.error.main } },
    params: { display: "flex", flexWrap: "wrap", gap: theme.spacing(0.75), alignItems: "center" },
    param: { backgroundColor: p.bb.panel, borderColor: p.bb.rule },
    paramName: { color: p.primary.main },
    paramForm: { display: "flex", flexWrap: "wrap", gap: theme.spacing(0.75), width: "100%" },
    paramField: { flex: "1 1 7.5rem" },
    cancel: { color: p.text.secondary },
    addParam: { border: `${theme.hairline} dashed ${p.bb.dash}`, color: p.text.secondary, paddingBlock: theme.spacing(0.25) },
  };
});
