import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useStyles } from "./ImplementButton.styles";

interface Props {
  /** the lesson in lessons management, once sent; null = not sent yet */
  lessonId: number | null;
  /** sends it with "ליישום" (the caller opens the lesson when the request succeeds) */
  onSend: () => void;
  /** the send request is running */
  pending?: boolean;
  /** opens a lesson in lessons management */
  onGoToLesson: (lessonId: number) => void;
  className?: string;
}

/**
 * "ליישום" for a lesson or a recommendation: only what was sent appears in lessons management.
 * Not sent yet → "טרם הועבר ליישום" + "ליישום ←". Already sent → "ניהול הלקח ←" opens it.
 */
export function ImplementButton({ lessonId, onSend, pending = false, onGoToLesson, className }: Props) {
  const { classes, cx } = useStyles();

  if (lessonId != null) {
    return (
      <Button size="small" variant="outlined" className={className} onClick={() => onGoToLesson(lessonId)}>
        ניהול הלקח ←
      </Button>
    );
  }

  return (
    <Box component="span" className={cx(classes.root, className)}>
      <Typography variant="label" className={classes.pending}>טרם הועבר ליישום</Typography>
      <Button
        size="small"
        variant="contained"
        disabled={pending}
        startIcon={pending ? <CircularProgress size="0.875rem" color="inherit" /> : undefined}
        onClick={onSend}
      >
        ליישום ←
      </Button>
    </Box>
  );
}
