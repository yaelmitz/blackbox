import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: { paddingInline: theme.spacing(1.75), paddingTop: theme.spacing(1.25), paddingBottom: theme.spacing(1) },
    empty: { minHeight: "6rem", display: "grid", placeItems: "center" },
    canvas: {
      display: "block",
      width: "100%",
      height: "3.875rem",
      cursor: "crosshair",
      "&:focus-visible": { outline: `0.125rem solid ${p.primary.main}`, borderRadius: theme.radius.sm },
    },
    legend: {
      ...theme.typography.label,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      columnGap: theme.spacing(1.75),
      rowGap: theme.spacing(0.5),
      paddingInline: theme.spacing(1.75),
      paddingTop: theme.spacing(0.5),
      color: p.text.secondary,
    },
    month: { color: p.primary.main, fontWeight: 700 },
    item: { display: "inline-flex", alignItems: "center", gap: theme.spacing(0.75) },
    swatch: { width: "0.875rem", height: "0.125rem", display: "inline-block" },
    investigations: { backgroundColor: p.bb.trace1 },
    lessons: { backgroundColor: p.bb.trace2 },
    tasks: { backgroundColor: p.bb.trace3 },
    value: { color: p.text.primary },
    range: { marginInlineStart: "auto" },
  };
});
