import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    form: { display: "flex", flexDirection: "column", gap: theme.spacing(2) },
    idInput: { "& input": { fontVariantNumeric: "tabular-nums" } },
    clsLabel: { ...theme.typography.label, marginBottom: theme.spacing(0.75) },
    clsGroup: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: theme.spacing(0.75),
      "& .MuiToggleButtonGroup-grouped": { border: `${theme.hairline} solid`, borderRadius: theme.radius.sm, margin: 0 },
    },
    cls: { ...theme.typography.mono, paddingBlock: theme.spacing(1), opacity: 0.55, "&.Mui-selected": { opacity: 1, backgroundColor: p.bb.orangeWash2 } },
    cls0: { color: p.text.primary, borderColor: p.text.secondary, "&.Mui-selected": { color: p.text.primary } },
    cls1: { color: p.warning.main, borderColor: p.warning.main, "&.Mui-selected": { color: p.warning.main } },
    cls2: { color: p.error.main, borderColor: p.error.main, "&.Mui-selected": { color: p.error.main } },
    footer: {
      position: "sticky",
      bottom: "0.75rem",
      zIndex: 2,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: theme.spacing(1.5),
      paddingInline: theme.spacing(2),
      paddingBlock: theme.spacing(1.5),
      backgroundColor: p.bb.footBg,
      backdropFilter: "blur(0.5rem)",
      border: `${theme.hairline} solid ${p.bb.rule}`,
      borderRadius: theme.radius.lg,
      boxShadow: theme.shadows[6],
    },
    leave: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: theme.spacing(1.25) },
  };
});
