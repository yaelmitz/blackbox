import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    page: { display: "flex", flexDirection: "column", gap: theme.spacing(2.25) },
    toolbar: { display: "flex", flexWrap: "wrap", gap: theme.spacing(1.5), alignItems: "center" },
    search: { flex: "1 1 15rem" },
    filter: { flex: "1 1 8.75rem", minWidth: "8rem", [theme.breakpoints.up("md")]: { flex: "0 1 10.5rem" } },
    filterOn: {
      "& .MuiOutlinedInput-notchedOutline": { borderColor: p.primary.main },
      "& .MuiSelect-select": { color: p.primary.main, fontWeight: 700 },
    },
    clear: { borderColor: p.bb.rule, color: p.text.secondary },
    clearCount: { marginInlineStart: theme.spacing(1) },
    create: { flex: "1 1 100%", [theme.breakpoints.up("sm")]: { flex: "0 0 auto" } },
  };
});
