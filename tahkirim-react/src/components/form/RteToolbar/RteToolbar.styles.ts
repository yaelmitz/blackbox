import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: theme.spacing(0.5),
      padding: theme.spacing(0.75),
      backgroundColor: p.bb.panel2,
      borderBottom: `${theme.hairline} solid ${p.bb.rule}`,
    },
    group: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: theme.spacing(0.25) },
    divider: { marginInline: theme.spacing(0.5) },
    tool: {
      border: 0,
      borderRadius: theme.radius.sm,
      padding: theme.spacing(0.5),
      "&.Mui-selected": { color: p.primary.main, backgroundColor: p.bb.orangeWash2 },
    },
    blockSelect: {
      minWidth: "7.5rem",
      "& .MuiSelect-select": { paddingBlock: theme.spacing(0.5), fontSize: "0.875rem", fontWeight: 600 },
    },
    /** paragraph style menu: each option previews its own size */
    stylep: { fontSize: "0.9375rem" },
    style2: { fontSize: "1.25rem", fontWeight: 700 },
    style3: { fontSize: "1.0625rem", fontWeight: 700 },
    style4: { fontSize: "0.9375rem", fontWeight: 700, color: p.text.secondary },
    swatchIcon: { display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 0 },
    swatchBar: { width: "1rem", height: "0.1875rem", borderRadius: "0.0625rem", marginTop: "0.0625rem" },
    swatchNone: { backgroundColor: p.bb.dash },
  };
});
