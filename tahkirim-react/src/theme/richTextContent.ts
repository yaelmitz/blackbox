import type { Theme } from "@mui/material/styles";
import type { CSSObject } from "tss-react";

/**
 * Styles for rich text HTML (TipTap output): headings, lists, checklists, quotes, links, highlights,
 * tables, rules. Shared by the editor and the reading page so both show the text the same way.
 */
export function richTextContent(theme: Theme): CSSObject {
  const p = theme.vars.palette;
  const hair = `${theme.hairline} solid ${p.bb.rule}`;
  const gap = theme.spacing(1);
  return {
    lineHeight: 1.75,
    overflowWrap: "anywhere",
    "& p": { margin: 0, marginBottom: gap },
    "& h2, & h3, & h4": { fontWeight: 700, lineHeight: 1.35, marginTop: theme.spacing(1.5), marginBottom: theme.spacing(0.75) },
    "& h2": { fontSize: "1.25rem" },
    "& h3": { fontSize: "1.0625rem" },
    "& h4": { fontSize: "0.9375rem", color: p.text.secondary },
    "& > :first-child": { marginTop: 0 },
    "& ul, & ol": { margin: 0, marginBottom: gap, paddingInlineStart: theme.spacing(2.75) },
    "& li > p": { marginBottom: theme.spacing(0.25) },
    "& blockquote": { margin: 0, marginBottom: gap, paddingInlineStart: theme.spacing(1.5), borderInlineStart: `0.1875rem solid ${p.primary.main}`, color: p.text.secondary },
    "& hr": { border: 0, borderTop: `0.125rem solid ${p.bb.rule}`, marginBlock: theme.spacing(2) },
    "& a": { color: p.primary.main, textDecoration: "underline", textUnderlineOffset: "0.15em" },
    "& mark": { color: "inherit", borderRadius: "0.125rem", paddingInline: "0.0625rem", backgroundColor: "rgba(250, 204, 21, 0.4)" },
    "& code": { fontFamily: "monospace", fontSize: "0.875em", backgroundColor: p.bb.panel2, border: hair, borderRadius: theme.radius.sm, paddingInline: "0.25rem" },
    // checklist: <ul data-type="taskList"><li data-checked><label><input type=checkbox></label><div>…</div></li></ul>
    '& ul[data-type="taskList"]': { listStyle: "none", paddingInlineStart: 0 },
    '& ul[data-type="taskList"] li': { display: "flex", alignItems: "flex-start", gap: theme.spacing(1) },
    '& ul[data-type="taskList"] li > label': { flex: "0 0 auto", marginTop: "0.3em", userSelect: "none" },
    '& ul[data-type="taskList"] li > div': { flex: 1, minWidth: 0 },
    '& ul[data-type="taskList"] input[type="checkbox"]': { accentColor: p.primary.main, width: "1rem", height: "1rem", margin: 0, cursor: "pointer" },
    '& li[data-checked="true"] > div': { color: p.text.secondary, textDecoration: "line-through" },
    // tables scroll sideways on narrow screens instead of widening the page
    "& .tableWrapper": { overflowX: "auto", marginBottom: gap },
    "& table": { borderCollapse: "collapse", width: "100%", tableLayout: "fixed", marginBottom: gap },
    "& th, & td": { border: hair, paddingInline: theme.spacing(1), paddingBlock: theme.spacing(0.5), verticalAlign: "top", minWidth: "4rem", textAlign: "start" },
    "& th": { backgroundColor: p.bb.panel2, fontWeight: 700 },
    "& th p, & td p": { marginBottom: 0 },
  };
}
