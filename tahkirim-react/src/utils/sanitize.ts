import DOMPurify from "dompurify";

// Links open in a new tab and never get access to this page.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("href")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer nofollow");
  }
});

/**
 * Rich text comes from the server and is rendered as HTML, so it is cleaned first: scripts, event
 * handlers and javascript: links are removed. Formatting the editor produces (inline colour and
 * alignment styles, data-* attributes of checklists, table spans) is kept.
 */
export const sanitizeRichText = (html: string) =>
  DOMPurify.sanitize(html, { USE_PROFILES: { html: true }, ADD_ATTR: ["target", "colspan", "rowspan", "colwidth"] });
