import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: theme.spacing(0.5),
      paddingInline: theme.spacing(1),
      paddingBlock: theme.spacing(0.5),
      backgroundColor: p.bb.orangeWash,
      borderBottom: `${theme.hairline} solid ${p.bb.rule}`,
    },
    title: { marginInlineEnd: theme.spacing(0.5) },
    action: { minWidth: 0, paddingInline: theme.spacing(1), fontSize: "0.8125rem", fontWeight: 600 },
  };
});
