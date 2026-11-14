import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Plate } from "../../../components/ui/Plate";
import { paletteRef as pv } from "../../../utils/cssVar";
import { useStyles } from "./Gauge.styles";

/** Round instrument dial: 240° sweep from lower-left to lower-right */
export function Gauge({ label, value, max, suffix = "", hot = false }: { label: string; value: number; max: number; suffix?: string; hot?: boolean }) {
  const { classes } = useStyles();
  const cx = 75, cy = 72, r = 56, a0 = 150, sweep = 240;
  const frac = Math.max(0, Math.min(1, value / max));
  const pt = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const arc = (from: number, to: number) => {
    const [x1, y1] = pt(from), [x2, y2] = pt(to);
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };
  const na = ((a0 + sweep * frac) * Math.PI) / 180;
  return (
    <Plate hot={hot} className={classes.root}>
      <Box component="svg" viewBox="0 0 150 130" role="img" aria-label={`${label}: ${value}${suffix}`} className={classes.svg}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = ((a0 + (sweep * i) / 10) * Math.PI) / 180, r1 = r + 7, r2 = r + (i % 5 ? 11 : 14);
          return <line key={i} x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)} x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)} stroke={pv("bb.gaugeTick")} strokeWidth="1.5" />;
        })}
        <path d={arc(a0, a0 + sweep)} fill="none" stroke={pv("bb.gaugeTrack")} strokeWidth="9" strokeLinecap="round" />
        {frac > 0 && <path d={arc(a0, a0 + sweep * frac)} fill="none" stroke={hot ? pv("primary.main") : pv("bb.trace2")} strokeWidth="9" strokeLinecap="round" />}
        <line x1={cx} y1={cy} x2={cx + (r - 14) * Math.cos(na)} y2={cy + (r - 14) * Math.sin(na)} stroke={pv("text.primary")} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill={pv("text.primary")} />
        <g className={classes.text}>
          <text x={cx} y={cy + 36} textAnchor="middle" fill={pv("text.primary")} fontWeight="700" fontSize="22">{value}{suffix}</text>
          <text x={cx + r - 2} y={cy + 46} textAnchor="middle" fill={pv("text.secondary")} fontSize="9">{max}</text>
          <text x={cx - r + 2} y={cy + 46} textAnchor="middle" fill={pv("text.secondary")} fontSize="9">0</text>
        </g>
      </Box>
      <Typography variant="label" color="text.secondary" className={classes.label}>{label}</Typography>
    </Plate>
  );
}