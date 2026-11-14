import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  const hair = `${theme.hairline} solid ${p.bb.rule}`;
  const well = { backgroundColor: p.bb.well, border: hair, borderRadius: theme.radius.md };
  return {
    page: { display: "flex", flexDirection: "column", gap: theme.spacing(2.25) },
    topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: theme.spacing(1.5) },
    back: { color: p.text.secondary },
    layout: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: theme.spacing(2.25),
      alignItems: "start",
      [theme.breakpoints.up("md")]: { gridTemplateColumns: "minmax(0,1fr) 21.25rem" },
    },
    article: { overflow: "hidden" },
    articleBody: { paddingInline: theme.spacing(3), paddingTop: theme.spacing(1), paddingBottom: theme.spacing(3) },
    list: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: theme.spacing(1) },
    rec: { ...well, display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: theme.spacing(1.25), padding: theme.spacing(1.25) },
    recText: { flex: "1 1 12rem", minWidth: 0 },
    recAction: { marginInlineStart: "auto" },
    side: { display: "flex", flexDirection: "column", gap: theme.spacing(1.75), [theme.breakpoints.up("md")]: { position: "sticky", top: "5rem" } },
    fields: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing(1.5), paddingInline: theme.spacing(1.25) },
    fieldsOne: { display: "grid", gap: theme.spacing(1.5), paddingInline: theme.spacing(1.25) },
    roles: { whiteSpace: "pre-line", fontWeight: 600 },
    stats: { paddingInline: theme.spacing(1.25) },
    stat: { display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBlock: theme.spacing(0.75), borderBottom: hair },
    statValue: { fontWeight: 700, fontSize: "1.125rem" },
    statBar: { marginTop: theme.spacing(1.5) },
    lessonsPanel: { paddingInline: theme.spacing(2.5), paddingTop: theme.spacing(2.75), paddingBottom: theme.spacing(2.5) },
    lessonsHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: theme.spacing(1.25), paddingInline: theme.spacing(1.25), marginBottom: theme.spacing(2) },
    lessonsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(20rem, 100%), 1fr))", gap: theme.spacing(1.5) },
    lesson: { ...well, display: "flex", flexDirection: "column", gap: theme.spacing(1.25), padding: theme.spacing(1.75) },
    lessonHead: { display: "flex", alignItems: "center", gap: theme.spacing(1.25) },
    lessonTitle: { flex: 1, fontWeight: 700 },
    row: { display: "flex", justifyContent: "space-between" },
    tasks: { display: "flex", flexDirection: "column", gap: theme.spacing(0.5) },
    task: { display: "flex", justifyContent: "space-between", gap: theme.spacing(1.25), paddingInline: theme.spacing(1.25), paddingBlock: theme.spacing(1), backgroundColor: p.bb.panel, borderRadius: theme.radius.sm },
    taskBody: { minWidth: 0 },
    taskDone: { color: p.text.secondary, textDecoration: "line-through" },
    params: { display: "flex", flexWrap: "wrap", gap: theme.spacing(0.75), marginTop: theme.spacing(0.75) },
    manage: { alignSelf: "flex-start" },
  };
});