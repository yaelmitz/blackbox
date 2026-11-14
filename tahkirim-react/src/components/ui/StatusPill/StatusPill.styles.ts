import { tss } from "tss-react/mui";

/** Text / background colour classes per tone, shared by the status pill, selects and charts */
export const useToneStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    info: { color: p.info.main },
    warning: { color: p.warning.main },
    success: { color: p.success.main },
    muted: { color: p.text.secondary },
    error: { color: p.error.main },
    bg_info: { backgroundColor: p.info.main },
    bg_warning: { backgroundColor: p.warning.main },
    bg_success: { backgroundColor: p.success.main },
    bg_muted: { backgroundColor: p.text.secondary },
    bg_error: { backgroundColor: p.error.main },
  };
});

export const useStyles = tss.create(({ theme }) => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.875),
    fontWeight: 700,
    fontSize: "0.78rem",
    whiteSpace: "nowrap",
    "&::before": { content: '""', width: "0.5rem", height: "0.5rem", borderRadius: "50%", backgroundColor: "currentColor", boxShadow: "0 0 0.5rem currentColor" },
  },
  noGlow: { "&::before": { boxShadow: "none" } },
}));
