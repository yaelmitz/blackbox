import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useToneStyles, type Tone } from "../../../components/ui/StatusPill";
import { useStyles } from "./StatusBar.styles";

/** Stacked bar + legend; each item has a tone (palette role) */
export function StatusBar({ items }: { items: { label: string; value: number; tone: Tone }[] }) {
  const { classes, cx } = useStyles();
  const { classes: tone } = useToneStyles();
  const total = items.reduce((a, x) => a + x.value, 0);
  return (
    <>
      <Box className={classes.bar} role="img" aria-label={items.map((x) => `${x.label} ${x.value}`).join(", ")}>
        {items.filter((x) => x.value).map((x) => (
          // flex share is data, not style: each segment's width is its count
          <Box component="span" key={x.label} title={`${x.label}: ${x.value}`} className={tone[`bg_${x.tone}`]} style={{ flex: x.value }} />
        ))}
      </Box>
      <Box className={classes.legend}>
        {items.map((x) => (
          <Box component="span" key={x.label} className={classes.item}>
            <Box component="span" className={cx(classes.dot, tone[`bg_${x.tone}`])} />
            <Typography variant="body2" color="text.secondary" component="span">{x.label}</Typography>
            <Typography variant="body2" component="span" className={classes.value}>{x.value}</Typography>
          </Box>
        ))}
        <Typography variant="body2" color="text.secondary" component="span">
          סה״כ <Typography component="b" variant="inherit" className={classes.total}>{total}</Typography>
        </Typography>
      </Box>
    </>
  );
}