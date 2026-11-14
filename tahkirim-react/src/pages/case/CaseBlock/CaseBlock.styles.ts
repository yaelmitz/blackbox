import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { paddingBlock: theme.spacing(2.5), borderBottom: `${theme.hairline} dashed ${theme.vars.palette.bb.rule}`, "&:last-of-type": { borderBottom: 0 } },
  head: { display: "flex", alignItems: "center", gap: theme.spacing(1.25), marginBottom: theme.spacing(1.25) },
}));