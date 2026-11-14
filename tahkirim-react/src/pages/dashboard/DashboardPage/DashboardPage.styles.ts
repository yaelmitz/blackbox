import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => ({
  page: { display: "flex", flexDirection: "column", gap: theme.spacing(1.75) },
  content: { display: "flex", flexDirection: "column", gap: theme.spacing(1.75), transition: "opacity 150ms" },
  /** previous figures while the new filter's figures load */
  stale: { opacity: 0.55 },
  gauges: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(10.625rem, 100%), 1fr))", gap: theme.spacing(1.75) },
  boards: { display: "grid", gridTemplateColumns: "1fr", gap: theme.spacing(1.75), [theme.breakpoints.up("md")]: { gridTemplateColumns: "repeat(2, minmax(0,1fr))" } },
  meters: { display: "flex", flexDirection: "column", gap: theme.spacing(1.25) },
  meter: { display: "grid", gridTemplateColumns: "4.75rem 1fr 1.375rem", gap: theme.spacing(1.25), alignItems: "center" },
  meterValue: { textAlign: "end" },
}));
