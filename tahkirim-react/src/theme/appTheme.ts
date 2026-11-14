import { createTheme, type Shadows } from "@mui/material/styles";
import { darkBb, darkRoles, lightBb, lightRoles } from "./palette";

/*
 * AppTheme: the single source for colours, shadows, spacing, radii and type.
 * - One font family for the whole app (Rubik: Hebrew + Latin + digits).
 * - Colours: palette roles + palette.bb.* tokens, separate for light and dark (colorSchemes).
 *   With cssVariables on, every colour is a CSS variable (--mui-palette-*), read in styles as theme.vars.palette.*.
 * - Sizes are in rem: spacing(1) = 0.5rem, radii and type in rem, breakpoints in rem.
 * Component styles live next to each component (tss.create → useStyles), built only from these values.
 */

const font = '"Rubik", system-ui, sans-serif';
const v = (name: string) => `var(--mui-palette-bb-${name})`;

/**
 * elevation 1 = instrument panel: top sheen, a tight contact shadow (seats the panel on the ground,
 * which matters most in light mode) and a soft drop shadow. The rest scale the drop shadow.
 */
const shadows = [
  "none",
  `inset 0 0.0625rem 0 ${v("sheen")}, 0 0.0625rem 0.125rem ${v("shadow")}, 0 0.625rem 1.5rem ${v("shadow")}`,
  ...Array.from({ length: 23 }, (_, i) => `0 ${0.125 * (i + 2)}rem ${0.25 * (i + 2)}rem ${v("shadow")}`),
] as Shadows;

export const appTheme = createTheme({
  direction: "rtl",
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    dark: { palette: { ...darkRoles, bb: darkBb } },
    light: { palette: { ...lightRoles, bb: lightBb } },
  },
  spacing: (factor: number) => `${0.5 * factor}rem`,
  breakpoints: { unit: "rem", values: { xs: 0, sm: 37.5, md: 56.25, lg: 75, xl: 96 } },
  shape: { borderRadius: 8 },
  radius: { sm: "0.375rem", md: "0.5rem", lg: "0.625rem", pill: "62.4375rem" },
  hairline: "0.0625rem",
  font,
  shadows,
  typography: {
    fontFamily: font,
    htmlFontSize: 16,
    fontSize: 15,
    h1: { fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.375rem)", lineHeight: 1.1 },
    h2: { fontWeight: 800, fontSize: "1.625rem", lineHeight: 1.2 },
    h3: { fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.35 },
    h4: { fontWeight: 700, fontSize: "1rem" },
    body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
    body2: { fontSize: "0.8125rem", lineHeight: 1.5 },
    button: { fontWeight: 700, textTransform: "none" },
    /** codes and readouts (REC, CH-1001, DO NOT OPEN): same font, tracked and tabular */
    mono: { fontWeight: 700, fontSize: "0.6875rem", letterSpacing: "0.12em", fontVariantNumeric: "tabular-nums" },
    eyebrow: { fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.04em" },
    /** small field labels */
    label: { fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.02em" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          backgroundColor: theme.vars.palette.bb.void,
          backgroundImage: `linear-gradient(${v("gridLine")} 0.0625rem, transparent 0.0625rem), linear-gradient(90deg, ${v("gridLine")} 0.0625rem, transparent 0.0625rem)`,
          backgroundSize: "2rem 2rem",
          fontVariantNumeric: "tabular-nums",
        },
        "@media (prefers-reduced-motion: reduce)": { "*": { animation: "none !important", transition: "none !important" } },
      }),
    },
    MuiTypography: {
      defaultProps: { variantMapping: { mono: "span", eyebrow: "div", label: "span" } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme }) => ({ borderRadius: theme.radius.md, paddingInline: theme.spacing(2.25) }),
        containedPrimary: ({ theme }) => ({ boxShadow: `inset 0 -0.1875rem 0 ${theme.vars.palette.bb.btnShade}` }),
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.bb.well,
          borderRadius: theme.radius.md,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.vars.palette.bb.rule },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.vars.palette.bb.dash },
        }),
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: "0.875rem" } } },
    MuiChip: { styleOverrides: { root: ({ theme }) => ({ borderRadius: theme.radius.sm, fontWeight: 600 }) } },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.vars.palette.bb.tipBg,
          color: theme.vars.palette.bb.tipText,
          border: `${theme.hairline} solid ${theme.vars.palette.bb.tipEdge}`,
          boxShadow: theme.shadows[2],
          fontSize: "0.75rem",
          fontWeight: 600,
        }),
        arrow: ({ theme }) => ({
          color: theme.vars.palette.bb.tipBg,
          "&::before": { border: `${theme.hairline} solid ${theme.vars.palette.bb.tipEdge}` },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({ borderBottomColor: theme.vars.palette.bb.rule, paddingBlock: theme.spacing(1.5), paddingInline: theme.spacing(1.5) }),
        head: ({ theme }) => ({ ...theme.typography.label, color: theme.vars.palette.text.secondary, whiteSpace: "nowrap" }),
      },
    },
    MuiDialog: { styleOverrides: { paper: ({ theme }) => ({ borderRadius: theme.radius.lg }) } },
  },
});

export type AppTheme = typeof appTheme;
