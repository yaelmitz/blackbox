/** Reads a CSS custom property from <html> (for canvas drawing, which can't use CSS directly). */
export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Same, for a MUI theme palette path: paletteVar("bb.trace1") → value of --mui-palette-bb-trace1 */
export const paletteVar = (path: string) => cssVar(`--mui-palette-${path.replace(/\./g, "-")}`);

/** CSS var() reference for a palette path, for SVG attributes: paletteRef("primary.main") → var(--mui-palette-primary-main) */
export const paletteRef = (path: string) => `var(--mui-palette-${path.replace(/\./g, "-")})`;
