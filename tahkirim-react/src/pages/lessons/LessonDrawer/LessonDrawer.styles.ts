import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  const grip = (lo: string, hi: string) => `linear-gradient(90deg, ${lo}, ${hi} 50%, ${lo})`;
  return {
    /** a lesson as a drawer pulled out of the box; grip handle on its outer edge */
    root: {
      display: "grid",
      gridTemplateColumns: "auto minmax(0,1fr)",
      gap: theme.spacing(1.5),
      alignItems: "center",
      width: "100%",
      textAlign: "start",
      position: "relative",
      paddingInline: theme.spacing(1.75),
      paddingBlock: theme.spacing(1.5),
      // RTL: the emotion RTL plugin mirrors physical sides, so "right" lands on the left (the outer edge)
      paddingRight: theme.spacing(4.25),
      borderRadius: theme.radius.md,
      border: `${theme.hairline} solid ${p.bb.rule}`,
      backgroundColor: p.bb.panel,
      boxShadow: `inset 0 0.0625rem 0 ${p.bb.sheen}, inset 0 -0.125rem 0 ${p.bb.shadow}`,
      "&:hover": { borderColor: p.bb.dash },
      "&::after": {
        content: '""',
        position: "absolute",
        right: "0.8125rem",
        top: "50%",
        width: "0.375rem",
        height: "1.75rem",
        marginTop: "-0.875rem",
        borderRadius: "0.1875rem",
        background: grip(p.bb.gripLo, p.bb.gripHi),
      },
    },
    selected: {
      borderColor: p.primary.main,
      backgroundImage: `linear-gradient(90deg, ${p.bb.panel}, ${p.bb.orangeWash2})`,
      "&:hover": { borderColor: p.primary.main },
      "&::after": { background: grip(p.bb.boltLo, p.primary.main) },
    },
    body: { minWidth: 0 },
    title: { fontWeight: 700, lineHeight: 1.35 },
    meta: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing(1.25), marginTop: theme.spacing(0.5) },
    caseTitle: { minWidth: 0 },
  };
});