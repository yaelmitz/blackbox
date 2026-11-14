import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    bar: { display: "flex", height: "1rem", borderRadius: "0.1875rem", overflow: "hidden", gap: "0.125rem", backgroundColor: p.bb.rule },
    legend: { display: "flex", flexWrap: "wrap", columnGap: theme.spacing(2), rowGap: theme.spacing(1), marginTop: theme.spacing(1.5) },
    item: { display: "inline-flex", alignItems: "center", gap: theme.spacing(0.75) },
    dot: { width: "0.5625rem", height: "0.5625rem", borderRadius: "50%" },
    value: { fontWeight: 700 },
    total: { color: p.text.primary, fontWeight: 700 },
  };
});