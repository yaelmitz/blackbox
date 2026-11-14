import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: {
      ...theme.typography.mono,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "4rem",
      paddingInline: theme.spacing(1),
      paddingBlock: theme.spacing(0.625),
      borderRadius: theme.radius.sm,
      border: `${theme.hairline} solid`,
      letterSpacing: "0.04em",
      lineHeight: 1,
    },
    s0: { color: p.bb.ann0, borderColor: p.bb.ann0Edge, backgroundColor: p.bb.annBg },
    s1: { color: p.warning.main, borderColor: p.warning.main, backgroundColor: p.bb.warnWash, boxShadow: `0 0 0.75rem ${p.bb.warnGlow}` },
    s2: { color: p.error.main, borderColor: p.error.main, backgroundColor: p.bb.alertWash, boxShadow: `0 0 0.75rem ${p.bb.alertGlow}` },
    /** on the orange housing band the light sits on a display panel (black in dark mode, white in light) so it stays readable */
    onHousing: { backgroundColor: p.bb.lcd },
  };
});
