import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    paper: {
      padding: theme.spacing(1.5),
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1),
      border: `${theme.hairline} solid ${p.bb.rule}`,
      backgroundColor: p.bb.panel,
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(4, 1.75rem)", gap: theme.spacing(0.75) },
    swatch: {
      width: "1.75rem",
      height: "1.75rem",
      borderRadius: theme.radius.sm,
      border: `${theme.hairline} solid ${p.bb.rule}`,
      color: "#fff",
      fontSize: "1rem",
      "&:hover, &.Mui-focusVisible": { outline: `0.125rem solid ${p.primary.main}`, outlineOffset: "0.0625rem" },
    },
    swatchOn: { outline: `0.125rem solid ${p.text.primary}`, outlineOffset: "0.0625rem" },
    reset: { justifyContent: "flex-start", color: p.text.secondary },
  };
});
