import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    body: { display: "flex", flexDirection: "column", gap: theme.spacing(2.25), padding: theme.spacing(2.5) },
    source: { padding: theme.spacing(1.75), backgroundColor: p.bb.well, border: `${theme.hairline} solid ${p.bb.rule}`, borderRadius: theme.radius.md },
    sourceHead: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: theme.spacing(1.25) },
    sourceTitle: { fontWeight: 700, fontSize: "1.0625rem", lineHeight: 1.35, display: "block", marginTop: theme.spacing(0.75), textAlign: "start" },
    sourceMeta: { marginTop: theme.spacing(0.5) },
    conclusions: { marginTop: theme.spacing(1), fontSize: "0.875rem", "& ul": { margin: 0, paddingInlineStart: theme.spacing(2.5) }, "& p": { margin: 0 } },
    twoCol: { display: "grid", gridTemplateColumns: "1fr", gap: theme.spacing(1.75), [theme.breakpoints.up("sm")]: { gridTemplateColumns: "1fr 1fr" } },
    tasks: { display: "flex", flexDirection: "column", gap: theme.spacing(1.25) },
    tasksHead: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    taskList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: theme.spacing(0.75) },
    addTask: { display: "flex", gap: theme.spacing(1) },
    addField: { flex: 1 },
  };
});
