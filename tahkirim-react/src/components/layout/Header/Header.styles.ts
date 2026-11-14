import { keyframes } from "@mui/material/styles";
import { tss } from "tss-react/mui";

const blink = keyframes`to { visibility: hidden; }`;

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  const boxed = { border: `${theme.hairline} solid ${p.bb.rule}`, borderRadius: theme.radius.md, backgroundColor: p.bb.panel };
  return {
    bar: { backgroundColor: p.bb.headerBg, color: p.text.primary, backdropFilter: "blur(0.5rem)", borderBottom: `${theme.hairline} solid ${p.bb.rule}` },
    row: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing(2), paddingBlock: theme.spacing(1.25) },
    /** logo + name: a link back to the investigations page */
    brand: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1.5),
      color: "inherit",
      textDecoration: "none",
      borderRadius: theme.radius.md,
      padding: theme.spacing(0.5),
      "&:hover": { opacity: 0.85 },
      "&.Mui-focusVisible": { outline: `0.125rem solid ${p.primary.main}`, outlineOffset: "0.125rem" },
    },
    name: { fontWeight: 800, fontSize: "1.25rem", letterSpacing: "0.08em", lineHeight: 1, textAlign: "end" },
    nameAccent: { color: p.primary.main },
    tagline: { fontWeight: 600, marginTop: theme.spacing(0.5) },
    nav: { ...boxed, display: "flex", flexWrap: "wrap", gap: theme.spacing(0.5), padding: theme.spacing(0.5) },
    navLink: {
      color: p.text.secondary,
      paddingInline: theme.spacing(1.75),
      paddingBlock: theme.spacing(0.875),
      "& .MuiButton-startIcon": { marginInlineStart: 0, marginInlineEnd: theme.spacing(0.75) },
      "&.active": { backgroundColor: p.primary.main, color: p.primary.contrastText },
    },
    end: { display: "flex", alignItems: "center", gap: theme.spacing(1.75) },
    rec: { display: "none", alignItems: "center", gap: theme.spacing(1), [theme.breakpoints.up("sm")]: { display: "flex" } },
    recLight: { width: "0.5625rem", height: "0.5625rem", borderRadius: "50%", backgroundColor: p.error.main, boxShadow: `0 0 0.625rem ${p.error.main}`, animation: `${blink} 1.6s steps(2, start) infinite` },
    themeBtn: { ...boxed, "&:hover": { color: p.primary.main, borderColor: p.primary.main } },
  };
});
