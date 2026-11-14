import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: {
      marginInline: theme.spacing(1.75),
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(0.5),
      paddingInline: theme.spacing(2),
      paddingBlock: theme.spacing(1.5),
      borderInlineStart: `0.125rem solid ${p.primary.main}`,
    },
    head: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: theme.spacing(1.25), marginBottom: theme.spacing(1.25) },
    /** the recommendations heading, below the lessons */
    section: { marginTop: theme.spacing(2) },
    /** R1, R2… badge in the stamp column */
    badge: { display: "flex", justifyContent: "flex-end" },
    list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: theme.spacing(0.25) },
    item: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: theme.spacing(0.5),
      alignItems: "center",
      paddingInline: theme.spacing(1.25),
      paddingBlock: theme.spacing(1),
      borderRadius: theme.radius.md,
      "&:hover": { backgroundColor: p.bb.panel },
      [theme.breakpoints.up("sm")]: { gridTemplateColumns: "5.5rem minmax(0,1fr) auto", gap: theme.spacing(1.75) },
    },
    stamp: { fontSize: "0.75rem", color: p.text.secondary, textAlign: "end", letterSpacing: "0.04em" },
    title: { fontWeight: 700 },
    actions: { display: "flex", alignItems: "center", gap: theme.spacing(1) },
  };
});
