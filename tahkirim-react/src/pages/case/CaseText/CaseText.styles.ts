import { tss } from "tss-react/mui";
import { richTextContent } from "../../../theme/richTextContent";

export const useStyles = tss.create(({ theme }) => ({
  plain: { whiteSpace: "pre-line", maxWidth: "72ch" },
  rich: {
    ...richTextContent(theme),
    maxWidth: "72ch",
    // checklists are read-only here
    '& input[type="checkbox"]': { pointerEvents: "none" },
  },
}));
