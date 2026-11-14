/** 2026-09-14 → 14.9.2026 */
export const fmtDate = (d: string) => {
  const [y, m, dd] = d.split("-");
  return `${+dd}.${+m}.${y}`;
};

/** 2026-09 → 9/26 */
export const monthLabel = (m: string) => `${+m.slice(5)}/${m.slice(2, 4)}`;

/** 2026-09-14 → 260914 (recorder-style timestamp) */
export const recStamp = (d: string) => {
  const [y, m, dd] = d.split("-");
  return `${y.slice(2)}${m}${dd}`;
};

/** Today as YYYY-MM-DD in local time */
export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** Error → readable message */
export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

/**
 * A link typed by the user: trimmed, and given https:// when it has no scheme.
 * Only http(s), mailto and tel are kept as they are, so "javascript:…" turns into a harmless https:// address.
 */
export function normalizeUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return "";
  return /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : `https://${url.replace(/^\/+/, "")}`;
}

/** Word and character count of plain text (the rich text editor's footer) */
export function textStats(text: string) {
  const trimmed = text.trim();
  return { words: trimmed ? trimmed.split(/\s+/).length : 0, chars: trimmed.length };
}
