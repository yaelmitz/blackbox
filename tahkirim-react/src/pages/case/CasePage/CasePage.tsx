import Box from "@mui/material/Box";
import EditOutlined from "@mui/icons-material/EditOutlined";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../../api/http";
import { Annunciator } from "../../../components/ui/Annunciator";
import { ImplementButton } from "../../../components/ui/ImplementButton";
import { Housing } from "../../../components/ui/Housing";
import { Lcd } from "../../../components/ui/Lcd";
import { Plate } from "../../../components/ui/Plate";
import { Segments } from "../../../components/ui/Segments";
import { StateBox } from "../../../components/ui/StateBox";
import { StatusPill } from "../../../components/ui/StatusPill";
import { UnitChips } from "../../../components/ui/UnitChips";
import { routes } from "../../../constants/routes";
import { useInvestigation } from "../../../hooks/useInvestigations";
import { useSendRecommendationToImplementation, useSendToImplementation } from "../../../hooks/useLessons";
import { useNotify } from "../../../hooks/useNotify";
import { errorMessage, fmtDate } from "../../../utils/format";
import { CaseBlock } from "../CaseBlock";
import { PlainText, RichText } from "../CaseText";
import { EmptyValue } from "../EmptyValue";
import { InfoCard } from "../InfoCard";
import { InfoField } from "../InfoField";
import { TextOrFileValue } from "../TextOrFileValue";
import { useStyles } from "./CasePage.styles";

/** Reading page: everything about one investigation (GET /api/investigations/:id) */
export default function CasePage({ onGoToLesson }: { onGoToLesson: (lessonId: number) => void }) {
  const { classes, cx } = useStyles();
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const notify = useNotify();
  const saved = (useLocation().state as { saved?: boolean } | null)?.saved;
  const { data, isLoading, isError, error, refetch } = useInvestigation(id);
  const sendLesson = useSendToImplementation();
  const sendRec = useSendRecommendationToImplementation();

  useEffect(() => {
    if (saved) notify("השינויים נשמרו");
  }, [saved, notify]);

  if (isLoading) return <StateBox kind="loading" message="טוען את התחקיר…" />;
  if (isError || !data) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <StateBox
        kind={notFound ? "empty" : "error"}
        title={notFound ? `תחקיר ${id} לא נמצא` : "לא הצלחנו לטעון את התחקיר"}
        message={notFound ? "ייתכן שהמספר שגוי או שהתחקיר נמחק." : errorMessage(error)}
        action={notFound ? { label: "חזרה לטבלת התחקירים", onClick: () => navigate(routes.cases) } : { label: "ניסיון חוזר", onClick: () => refetch() }}
      />
    );
  }

  const { case: c, lessons } = data;
  const allTasks = lessons.flatMap((l) => l.tasks);
  const doneTasks = allTasks.filter((t) => t.status === "done").length;

  return (
    <Box className={classes.page}>
      <Box className={classes.topBar}>
        <Button component={RouterLink} to={routes.cases} color="inherit" className={classes.back}>→ חזרה לטבלת התחקירים</Button>
        <Button component={RouterLink} to={routes.editCase(c.id)} variant="contained" startIcon={<EditOutlined />}>עריכת תחקיר</Button>
      </Box>

      <Box className={classes.layout}>
        <Plate component="article" className={classes.article}>
          <Housing end={<Annunciator cls={c.cls} onHousing />}>BLACKBOX · DO NOT OPEN · CH-{c.id}</Housing>
          <Box className={classes.articleBody}>
            <CaseBlock no="01" title="רקע"><PlainText text={c.background} /></CaseBlock>
            <CaseBlock no="02" title="שאלות"><PlainText text={c.questions} /></CaseBlock>
            <CaseBlock no="03" title="מה קרה"><RichText html={c.whatHappenedHtml} /></CaseBlock>
            <CaseBlock no="04" title="מה תוכנן"><RichText html={c.whatPlannedHtml} /></CaseBlock>
            <CaseBlock no="05" title="מסקנות"><RichText html={c.conclusionsHtml} /></CaseBlock>
            <CaseBlock no="06" title={`המלצות · ${c.recommendations?.length ?? 0}`}>
              {c.recommendations?.length ? (
                <Box component="ol" className={classes.list}>
                  {c.recommendations.map((r, i) => (
                    <Box component="li" key={r.id ?? i} className={classes.rec}>
                      <Lcd size="sm">R{i + 1}</Lcd>
                      <Typography className={classes.recText}>{r.text}</Typography>
                      <ImplementButton
                        lessonId={r.lessonId ?? null}
                        pending={sendRec.isPending && sendRec.variables === r.id}
                        onSend={() => {
                          if (r.id == null) return;
                          sendRec.mutate(r.id, { onSuccess: (saved) => saved.lessonId != null && onGoToLesson(saved.lessonId) });
                        }}
                        onGoToLesson={onGoToLesson}
                        className={classes.recAction}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <EmptyValue />
              )}
            </CaseBlock>
          </Box>
        </Plate>

        <Box className={classes.side}>
          <InfoCard title="נתוני תחקיר">
            <Box className={classes.fields}>
              <InfoField label="מספר מזהה"><Typography component="span" variant="inherit" dir="ltr">{c.id}</Typography></InfoField>
              <InfoField label="תאריך">{fmtDate(c.date)}</InfoField>
              <InfoField label="סוג">{c.type}</InfoField>
              <InfoField label="סיווג"><Annunciator cls={c.cls} /></InfoField>
              <InfoField label="מסגרות" wide><UnitChips units={c.units} /></InfoField>
              <InfoField label="מפרסם" wide>{c.by}</InfoField>
            </Box>
          </InfoCard>
          <InfoCard title="מיקום ומקורות">
            <Box className={classes.fieldsOne}>
              <InfoField label="מיקום"><TextOrFileValue v={c.location} /></InfoField>
              <InfoField label='נ"צ'><TextOrFileValue v={c.coordinates} ltr /></InfoField>
              <InfoField label="מקורות מידע"><TextOrFileValue v={c.sources} /></InfoField>
              <InfoField label="בעלי התפקידים">
                {c.roles?.trim() ? <Typography className={classes.roles}>{c.roles}</Typography> : <Typography color="text.secondary">לא הוזן</Typography>}
              </InfoField>
            </Box>
          </InfoCard>
          <InfoCard title="מצב יישום">
            <Box className={classes.stats}>
              {[["לקחים", String(lessons.length)], ["משימות שהושלמו", `${doneTasks}/${allTasks.length}`]].map(([k, val]) => (
                <Box key={k} className={classes.stat}>
                  <Typography>{k}</Typography>
                  <Typography className={classes.statValue}>{val}</Typography>
                </Box>
              ))}
              {allTasks.length > 0 && <Box className={classes.statBar}><Segments on={doneTasks} total={allTasks.length} /></Box>}
            </Box>
          </InfoCard>
        </Box>
      </Box>

      <Plate className={classes.lessonsPanel}>
        <Box className={classes.lessonsHead}>
          <Typography variant="h3" component="h2">לקחים ומשימות</Typography>
          <Typography variant="mono" color="text.secondary" dir="ltr">{lessons.length} LESSONS · {allTasks.length} TASKS</Typography>
        </Box>
        {lessons.length === 0 ? (
          <Typography color="text.secondary">עדיין לא נרשמו לקחים לתחקיר הזה.</Typography>
        ) : (
          <Box className={classes.lessonsGrid}>
            {lessons.map((l, i) => {
              const done = l.tasks.filter((t) => t.status === "done").length;
              return (
                <Box key={l.id} className={classes.lesson}>
                  <Box className={classes.lessonHead}>
                    <Lcd size="sm">L{i + 1}</Lcd>
                    <Typography className={classes.lessonTitle}>{l.title}</Typography>
                    <StatusPill lesson={l.status} />
                  </Box>
                  {l.resources && <Typography variant="body2"><Typography component="span" variant="label" color="text.secondary">משאבים </Typography>{l.resources}</Typography>}
                  {l.notes && <Typography variant="body2"><Typography component="span" variant="label" color="text.secondary">הערות </Typography>{l.notes}</Typography>}
                  <Box className={classes.row}>
                    <Typography variant="label" color="text.secondary">משימות</Typography>
                    <Typography variant="label" color="text.secondary">{done}/{l.tasks.length}</Typography>
                  </Box>
                  {l.tasks.length ? (
                    <Box className={classes.tasks}>
                      {l.tasks.map((t) => (
                        <Box key={t.id} className={classes.task}>
                          <Box className={classes.taskBody}>
                            <Typography className={cx(t.status === "done" && classes.taskDone)}>{t.name}</Typography>
                            {t.parameters.length > 0 && (
                              <Box className={classes.params}>
                                {t.parameters.map((p) => <Chip key={p.id} size="small" variant="outlined" label={`${p.name}${p.value ? `: ${p.value}` : ""}`} />)}
                              </Box>
                            )}
                          </Box>
                          <StatusPill task={t.status} />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">אין משימות עדיין.</Typography>
                  )}
                  <ImplementButton
                    lessonId={l.inImplementation ? l.id : null}
                    pending={sendLesson.isPending && sendLesson.variables === l.id}
                    onSend={() => sendLesson.mutate(l.id, { onSuccess: () => onGoToLesson(l.id) })}
                    onGoToLesson={onGoToLesson}
                    className={classes.manage}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </Plate>
    </Box>
  );
}