import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: {
    ...theme.typography.mono,
    backgroundColor: theme.vars.palette.primary.main,
    color: theme.vars.palette.primary.contrastText,
    paddingInline: theme.spacing(2.25),
    paddingBlock: theme.spacing(1.5),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.25),
    fontWeight: 800,
    fontSize: "0.75rem",
    letterSpacing: "0.14em",
  },
  bolt: {
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "50%",
    flex: "none",
    background: `radial-gradient(circle at 35% 35%, ${theme.vars.palette.bb.boltHi}, ${theme.vars.palette.bb.boltLo})`,
  },
  text: { flex: 1, minWidth: 0 },
}));
