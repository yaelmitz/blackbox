import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  root: { margin: 0, paddingInline: theme.spacing(2.5), paddingTop: theme.spacing(2.75), paddingBottom: theme.spacing(2.5), minWidth: 0 },
  legend: { float: "right", width: "100%", display: "flex", alignItems: "center", gap: theme.spacing(1.25), paddingInline: theme.spacing(1.25), marginBottom: theme.spacing(2) },
  body: { clear: "both", display: "flex", flexDirection: "column", gap: theme.spacing(2) },
}));

/** Responsive field grid used inside form sections */
export const useFormGrid = tss.create(({ theme }) => ({
  two: { display: "grid", gridTemplateColumns: "1fr", gap: theme.spacing(2), [theme.breakpoints.up("md")]: { gridTemplateColumns: "1fr 1fr" } },
  three: { display: "grid", gridTemplateColumns: "1fr", gap: theme.spacing(2), [theme.breakpoints.up("md")]: { gridTemplateColumns: "repeat(3, minmax(0,1fr))" } },
  span2: { [theme.breakpoints.up("md")]: { gridColumn: "span 2" } },
  stack: { display: "flex", flexDirection: "column", gap: theme.spacing(1) },
  stackSm: { display: "flex", flexDirection: "column", gap: theme.spacing(0.75) },
}));
