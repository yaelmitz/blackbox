import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { MonthPoint } from "../../../types/models";
import { paletteRef as pv } from "../../../utils/cssVar";
import { monthLabel } from "../../../utils/format";
import { useStyles } from "./MonthTrace.styles";

/** FDR-style line chart of investigations per month; time runs left → right like an instrument */
export function MonthTrace({ data }: { data: MonthPoint[] }) {
  const { classes } = useStyles();
  if (data.length < 2) return <Typography color="text.secondary">צריך תחקירים משני חודשים לפחות כדי להציג מגמה.</Typography>;
  const values = data.map((d) => d.investigations);
  const W = 520, H = 190, pl = 30, pr = 14, pt = 14, pb = 28;
  const top = Math.max(4, ...values);
  const x = (i: number) => pl + ((W - pl - pr) * i) / (values.length - 1);
  const y = (v: number) => pt + (H - pt - pb) * (1 - v / top);
  const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const last = values.length - 1;
  return (
    <Box component="svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="תחקירים לפי חודש" className={classes.root}>
      <g className={classes.text}>
        {Array.from({ length: top + 1 }, (_, v) => (
          <g key={v}>
            <line x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} stroke={pv("bb.rule")} />
            <text x={pl - 8} y={y(v) + 4} textAnchor="end" fill={pv("text.secondary")} fontSize="10">{v}</text>
          </g>
        ))}
        <polygon points={`${pl},${y(0)} ${pts} ${W - pr},${y(0)}`} fill={pv("bb.orangeFill")} />
        <polyline points={pts} fill="none" stroke={pv("primary.main")} strokeWidth="2.5" strokeLinejoin="round" />
        {values.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === last ? 5 : 3.5} fill={i === last ? pv("primary.main") : pv("bb.void")} stroke={pv("primary.main")} strokeWidth="2" />
        ))}
        {data.map((d, i) => (
          <text key={d.month} x={x(i)} y={H - 8} textAnchor="middle" fill={pv("text.secondary")} fontSize="10">{monthLabel(d.month)}</text>
        ))}
      </g>
    </Box>
  );
}