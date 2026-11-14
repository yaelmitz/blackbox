import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { Lcd } from "../../../components/ui/Lcd";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { Lesson } from "../../../types/models";
import { useStyles } from "./LessonDrawer.styles";

/** A lesson in the list, styled as a drawer pulled out of the box */
export function LessonDrawer({ lesson: l, selected, onClick }: { lesson: Lesson; selected: boolean; onClick: () => void }) {
  const { classes, cx } = useStyles();
  return (
    <ButtonBase role="option" aria-selected={selected} onClick={onClick} className={cx(classes.root, selected && classes.selected)}>
      <Lcd size="sm">CH-{l.caseId}</Lcd>
      <Box className={classes.body}>
        <Typography className={classes.title}>{l.title}</Typography>
        <Box className={classes.meta}>
          <Typography variant="body2" color="text.secondary" noWrap className={classes.caseTitle}>{l.case?.title}</Typography>
          <StatusPill lesson={l.status} />
        </Box>
      </Box>
    </ButtonBase>
  );
}