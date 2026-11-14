import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    toggle: {
      border: `${theme.hairline} solid ${p.bb.rule}`,
      borderRadius: theme.radius.sm,
      backgroundColor: p.bb.panel,
      color: p.text.secondary,
      "&:hover": { backgroundColor: p.bb.hover },
      "& svg": { transition: "transform .2s" },
    },
    toggleOpen: {
      backgroundColor: p.primary.main,
      color: p.primary.contrastText,
      "&:hover": { backgroundColor: p.primary.main },
      "& svg": { transform: "rotate(180deg)" },
    },
    /** visually hidden, still read by screen readers */
    hidden: { position: "absolute", width: "0.0625rem", height: "0.0625rem", overflow: "hidden", clip: "rect(0 0 0 0)" },
  };
});