import { tss } from "tss-react/mui";

export const useStyles = tss.withParams<{ height: string }>().create(({ theme, height }) => ({
  root: { display: "flex", gap: "0.1875rem", height },
  seg: { flex: 1, borderRadius: "0.125rem", backgroundColor: theme.vars.palette.bb.rule },
  on: { backgroundColor: theme.vars.palette.primary.main, boxShadow: `0 0 0.375rem ${theme.vars.palette.bb.lcdGlow}` },
}));
