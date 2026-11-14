import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Check from "@mui/icons-material/Check";
import FormatColorReset from "@mui/icons-material/FormatColorReset";
import type { Swatch } from "../../../constants/richText";
import { useStyles } from "./RteColorMenu.styles";

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  title: string;
  colors: Swatch[];
  /** the colour of the current selection, if any */
  current?: string | null;
  onPick: (value: string) => void;
  resetLabel: string;
  onReset: () => void;
}

/** Swatch popover for text colour and highlight */
export function RteColorMenu({ anchorEl, onClose, title, colors, current, onPick, resetLabel, onReset }: Props) {
  const { classes, cx, css } = useStyles();
  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      classes={{ paper: classes.paper }}
      disableRestoreFocus
    >
      <Typography variant="label" color="text.secondary">{title}</Typography>
      <Box className={classes.grid} role="listbox" aria-label={title}>
        {colors.map((c) => {
          const on = current?.replace(/\s/g, "").toLowerCase() === c.value.replace(/\s/g, "").toLowerCase();
          return (
            <Tooltip key={c.value} title={c.label}>
              <ButtonBase
                role="option"
                aria-selected={on}
                aria-label={c.label}
                className={cx(classes.swatch, css({ backgroundColor: c.value }), on && classes.swatchOn)}
                onClick={() => onPick(c.value)}
              >
                {on && <Check fontSize="inherit" />}
              </ButtonBase>
            </Tooltip>
          );
        })}
      </Box>
      <Button size="small" color="inherit" startIcon={<FormatColorReset fontSize="small" />} onClick={onReset} className={classes.reset}>
        {resetLabel}
      </Button>
    </Popover>
  );
}
