import type { CSSProperties } from "react";
// adds theme.vars (CSS-variable palette) to the Theme type
import type {} from "@mui/material/themeCssVarsAugmentation";
import type { BbPalette } from "./palette";

declare module "@mui/material/styles" {
  interface Palette {
    bb: BbPalette;
  }
  interface PaletteOptions {
    bb?: BbPalette;
  }
  interface TypographyVariants {
    mono: CSSProperties;
    eyebrow: CSSProperties;
    label: CSSProperties;
  }
  interface TypographyVariantsOptions {
    mono?: CSSProperties;
    eyebrow?: CSSProperties;
    label?: CSSProperties;
  }
  interface Theme {
    radius: { sm: string; md: string; lg: string; pill: string };
    /** the app's one font family */
    font: string;
    hairline: string;
  }
  interface ThemeOptions {
    radius?: { sm: string; md: string; lg: string; pill: string };
    font?: string;
    hairline?: string;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    mono: true;
    eyebrow: true;
    label: true;
  }
}
