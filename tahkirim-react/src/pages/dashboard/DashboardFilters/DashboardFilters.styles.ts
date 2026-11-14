import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: { display: "flex", flexDirection: "column", gap: theme.spacing(1) },
    row: { display: "flex", flexWrap: "wrap", gap: theme.spacing(1.5), alignItems: "flex-start" },
    select: { flex: "1 1 10rem", [theme.breakpoints.up("md")]: { flex: "0 1 12rem" } },
    date: { flex: "1 1 9.5rem", [theme.breakpoints.up("md")]: { flex: "0 1 10.5rem" } },
    /** a filter with a value: orange outline and text, like the investigations filters */
    on: {
      "& .MuiOutlinedInput-notchedOutline": { borderColor: p.primary.main },
      "& .MuiSelect-select, & input": { color: p.primary.main, fontWeight: 700 },
    },
    clear: { borderColor: p.bb.rule, color: p.text.secondary, minHeight: "2.5rem" },
    count: { marginInlineStart: theme.spacing(1) },
    presets: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: theme.spacing(0.75) },
    chip: { borderColor: p.bb.rule, fontWeight: 600 },
    chipOn: { borderColor: p.primary.main, color: p.primary.main, backgroundColor: p.bb.orangeWash2 },
  };
});
