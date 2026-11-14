import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    /** same frame as the expand button; orange on hover / keyboard focus */
    root: {
      border: `${theme.hairline} solid ${p.bb.rule}`,
      borderRadius: theme.radius.sm,
      backgroundColor: p.bb.panel,
      color: p.text.secondary,
      "&:hover, &.Mui-focusVisible": { color: p.primary.main, borderColor: p.primary.main, backgroundColor: p.bb.orangeWash2 },
    },
    /** visually hidden, still read by screen readers */
    hidden: { position: "absolute", width: "0.0625rem", height: "0.0625rem", overflow: "hidden", clip: "rect(0 0 0 0)" },
  };
});
