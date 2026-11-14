import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: {
    display: "inline-block",
    fontWeight: 700,
    color: theme.vars.palette.primary.main,
    backgroundColor: theme.vars.palette.bb.lcd,
    border: `0.0625rem solid ${theme.vars.palette.bb.lcdEdge}`,
    borderRadius: theme.radius.sm,
    paddingInline: theme.spacing(0.875),
    paddingBlock: theme.spacing(0.375),
    lineHeight: 1.3,
    textAlign: "center",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.04em",
  },
  sm: { fontSize: "0.6875rem" },
  md: { fontSize: "0.75rem" },
  lg: { fontSize: "0.9375rem" },
  glow: { textShadow: `0 0 0.5rem ${theme.vars.palette.bb.lcdGlow}` },
}));
