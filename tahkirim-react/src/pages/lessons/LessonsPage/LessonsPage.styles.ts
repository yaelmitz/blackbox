import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    page: { display: "flex", flexDirection: "column", gap: theme.spacing(2.25) },
    chips: { display: "flex", flexWrap: "wrap", gap: theme.spacing(0.75) },
    chip: { backgroundColor: p.bb.panel, borderColor: p.bb.rule, color: p.text.secondary },
    chipOn: { borderColor: p.primary.main, color: p.primary.main },
    layout: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: theme.spacing(2.25),
      alignItems: "start",
      [theme.breakpoints.up("md")]: { gridTemplateColumns: "minmax(0,5fr) minmax(0,7fr)" },
    },
    list: { display: "flex", flexDirection: "column", gap: theme.spacing(1.25) },
    more: { display: "flex", justifyContent: "center", paddingBlock: theme.spacing(1) },
    detail: {
      overflow: "hidden",
      scrollMarginTop: "8.75rem",
      "&::before, &::after": { display: "none" },
      [theme.breakpoints.up("md")]: { position: "sticky", top: "5rem" },
    },
    detailState: { padding: theme.spacing(3) },
  };
});
