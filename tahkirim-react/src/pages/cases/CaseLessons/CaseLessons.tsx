import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { ImplementButton } from "../../../components/ui/ImplementButton";
import { Lcd } from "../../../components/ui/Lcd";
import { StatusPill } from "../../../components/ui/StatusPill";
import { useInvestigation } from "../../../hooks/useInvestigations";
import { useCaseLessons, useSendRecommendationToImplementation, useSendToImplementation } from "../../../hooks/useLessons";
import type { Case } from "../../../types/models";
import { recStamp } from "../../../utils/format";
import { useStyles } from "./CaseLessons.styles";

/**
 * Expanded row: the investigation's lessons, then its recommendations, as a recorder transcript.
 * Each has "ליישום", which moves it to lessons management (a recommendation becomes a lesson there).
 */
export function CaseLessons({ c, onGoToLesson }: { c: Case; onGoToLesson: (lessonId: number) => void }) {
  const { classes, cx } = useStyles();
  const { data: lessons, isLoading, isError } = useCaseLessons(c.id);
  const full = useInvestigation(c.id);
  const recs = full.data?.case.recommendations;
  const sendLesson = useSendToImplementation();
  const sendRec = useSendRecommendationToImplementation();

  return (
    <Box className={classes.root}>
      <Box className={classes.head}>
        <Typography variant="mono" color="primary">לקחים · {lessons?.length ?? "…"}</Typography>
      </Box>
      {isLoading && <CircularProgress size="1rem" />}
      {isError && <Typography color="error">לא הצלחנו לטעון את הלקחים.</Typography>}
      {lessons?.length === 0 && <Typography variant="body2" color="text.secondary">עדיין לא נרשמו לקחים לתיק הזה.</Typography>}
      <Box component="ol" className={classes.list}>
        {lessons?.map((l, j) => (
          <Box component="li" key={l.id} className={classes.item}>
            <Typography dir="ltr" className={classes.stamp}>
              {recStamp(c.date)}·{String(j + 1).padStart(2, "0")}
            </Typography>
            <Typography className={classes.title}>{l.title}</Typography>
            <Box component="span" className={classes.actions}>
              <StatusPill lesson={l.status} />
              <ImplementButton
                lessonId={l.inImplementation ? l.id : null}
                pending={sendLesson.isPending && sendLesson.variables === l.id}
                onSend={() => sendLesson.mutate(l.id, { onSuccess: () => onGoToLesson(l.id) })}
                onGoToLesson={onGoToLesson}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Box className={cx(classes.head, classes.section)}>
        <Typography variant="mono" color="primary">המלצות · {recs?.length ?? "…"}</Typography>
      </Box>
      {full.isLoading && <CircularProgress size="1rem" />}
      {full.isError && <Typography color="error">לא הצלחנו לטעון את ההמלצות.</Typography>}
      {recs?.length === 0 && <Typography variant="body2" color="text.secondary">אין המלצות בתחקיר הזה.</Typography>}
      <Box component="ol" className={classes.list}>
        {recs?.map((r, j) => (
          <Box component="li" key={r.id ?? j} className={classes.item}>
            <Box className={classes.badge}><Lcd size="sm">R{j + 1}</Lcd></Box>
            <Typography className={classes.title}>{r.text}</Typography>
            <Box component="span" className={classes.actions}>
              <ImplementButton
                lessonId={r.lessonId ?? null}
                pending={sendRec.isPending && sendRec.variables === r.id}
                onSend={() => {
                  if (r.id == null) return;
                  sendRec.mutate(r.id, { onSuccess: (saved) => saved.lessonId != null && onGoToLesson(saved.lessonId) });
                }}
                onGoToLesson={onGoToLesson}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
