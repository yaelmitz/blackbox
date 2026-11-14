import { tss } from "tss-react/mui";
import { richTextContent } from "../../../theme/richTextContent";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: {
      border: `${theme.hairline} solid ${p.bb.rule}`,
      borderRadius: theme.radius.md,
      backgroundColor: p.bb.well,
      overflow: "hidden",
      "&:focus-within": { borderColor: p.primary.main },
    },
    invalid: { borderColor: p.error.main },
    body: {
      position: "relative",
      "& .rte-body": {
        ...richTextContent(theme),
        minHeight: "8rem",
        maxHeight: "32rem",
        overflowY: "auto",
        paddingInline: theme.spacing(1.75),
        paddingBlock: theme.spacing(1.5),
        outline: "none",
        lineHeight: 1.7,
      },
      // editing aids: the selected table cell, a clickable link
      "& .rte-body .selectedCell": { backgroundColor: p.bb.orangeWash2 },
      "& .rte-body a": { cursor: "text" },
    },
    /** placeholder text comes from the data-placeholder attribute */
    empty: {
      "&::before": {
        content: "attr(data-placeholder)",
        position: "absolute",
        insetInlineStart: "0.875rem",
        top: "0.75rem",
        color: p.bb.placeholder,
        pointerEvents: "none",
      },
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      paddingInline: theme.spacing(1.5),
      paddingBlock: theme.spacing(0.5),
      borderTop: `${theme.hairline} solid ${p.bb.rule}`,
      backgroundColor: p.bb.panel2,
    },
  };
});
