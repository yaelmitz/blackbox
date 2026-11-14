/**
 * Rich text options. Text and highlight colours are content the user picks (saved inside the HTML),
 * not UI colours, so they live here rather than in the theme. Each one reads on both the light and
 * the dark panels: mid-tone text colours, translucent highlights.
 */

export interface Swatch {
  label: string;
  value: string;
}

export const TEXT_COLORS: Swatch[] = [
  { label: "אדום", value: "#dc2626" },
  { label: "כתום", value: "#ea580c" },
  { label: "חרדל", value: "#ca8a04" },
  { label: "ירוק", value: "#16a34a" },
  { label: "טורקיז", value: "#0d9488" },
  { label: "כחול", value: "#2563eb" },
  { label: "סגול", value: "#7c3aed" },
  { label: "אפור", value: "#6b7280" },
];

export const HIGHLIGHT_COLORS: Swatch[] = [
  { label: "צהוב", value: "rgba(250, 204, 21, 0.4)" },
  { label: "כתום", value: "rgba(249, 115, 22, 0.35)" },
  { label: "ורוד", value: "rgba(244, 63, 94, 0.3)" },
  { label: "ירוק", value: "rgba(34, 197, 94, 0.3)" },
  { label: "כחול", value: "rgba(59, 130, 246, 0.3)" },
  { label: "סגול", value: "rgba(139, 92, 246, 0.3)" },
];

/** Paragraph style menu: value "p" or a heading level */
export const BLOCK_STYLES = [
  { value: "p", label: "פסקה" },
  { value: "2", label: "כותרת 1" },
  { value: "3", label: "כותרת 2" },
  { value: "4", label: "כותרת 3" },
] as const;

export type BlockStyle = (typeof BLOCK_STYLES)[number]["value"];

export const HEADING_LEVELS = [2, 3, 4] as const;

/** a new table: 3×3 with a header row */
export const NEW_TABLE = { rows: 3, cols: 3, withHeaderRow: true } as const;
