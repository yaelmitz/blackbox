import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const bb = theme.vars.palette.bb;
  return {
    root: { overflow: "hidden" },
    progress: { height: "0.1875rem" },
    scroll: { overflowX: "auto" },
    table: { minWidth: "56rem" },
    head: { position: "relative" },
    /** the narrow icon columns: expand and edit */
    expandCol: { width: "3.5rem" },
    row: { "&.MuiTableRow-hover:hover": { backgroundColor: bb.orangeWash } },
    highlight: { backgroundColor: bb.orangeWash2 },
    openRow: { backgroundColor: bb.rowOpen },
    openCell: { padding: 0 },
    pagination: { borderTop: `${theme.hairline} solid ${bb.rule}` },
  };
});
