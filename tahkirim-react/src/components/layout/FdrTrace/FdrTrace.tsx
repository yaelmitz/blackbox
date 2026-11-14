import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { MonthPoint } from "../../../types/models";
import { paletteVar } from "../../../utils/cssVar";
import { monthLabel } from "../../../utils/format";
import { Plate } from "../../ui/Plate";
import { useStyles } from "./FdrTrace.styles";

/** side padding inside the canvas (rem), keeps the end months clear of the corner screws */
const PAD_REM = 1.125;
const SERIES = [
  { key: "investigations", label: "תחקירים", color: "bb.trace1" },
  { key: "lessons", label: "לקחים", color: "bb.trace2" },
  { key: "tasks", label: "משימות", color: "bb.trace3" },
] as const;

const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

/**
 * Flight-data-recorder style trace of the real monthly counts (from GET /api/dashboard).
 * Hover or use the arrow keys to read a month; the cursor rests on the latest month.
 */
export function FdrTrace({ data }: { data: MonthPoint[] }) {
  const { classes, cx } = useStyles();
  const ref = useRef<HTMLCanvasElement>(null);
  const { colorScheme } = useColorScheme();
  const n = data.length;
  const [cursor, setCursor] = useState<number | null>(null);
  const cur = cursor ?? n - 1;
  const progress = useRef(0);
  const curRef = useRef(cur);
  curRef.current = cur;
  const drawRef = useRef<() => void>(() => {});
  const dataKey = JSON.stringify(data);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || n === 0) return;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // colours are read from the theme's CSS variables when drawing (they change with the colour scheme)
    let cols: string[] = [], grid = "", accent = "", ground = "";
    const readColours = () => {
      cols = SERIES.map((s) => paletteVar(s.color));
      grid = paletteVar("bb.traceGrid");
      accent = paletteVar("primary.main");
      ground = paletteVar("bb.panel");
    };
    const lines = SERIES.map((s) => data.map((d) => d[s.key]));
    const max = Math.max(1, ...lines.flat());

    const draw = () => {
      const w = cv.clientWidth, h = cv.clientHeight, dpr = window.devicePixelRatio || 1;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const pad = PAD_REM * remPx();
      const x = (i: number) => (n === 1 ? w / 2 : pad + ((w - 2 * pad) * i) / (n - 1));
      const y = (val: number) => h - 5 - (val / max) * (h - 12);

      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.round(x(i)) + 0.5, 0);
        ctx.lineTo(Math.round(x(i)) + 0.5, h);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, y(0) + 0.5);
      ctx.lineTo(w, y(0) + 0.5);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, n === 1 ? w : x(0) + (x(n - 1) - x(0)) * progress.current + 1, h);
      ctx.clip();
      [2, 1, 0].forEach((k) => {
        ctx.beginPath();
        ctx.strokeStyle = cols[k];
        ctx.lineWidth = k === 0 ? 2 : 1.4;
        ctx.lineJoin = "round";
        lines[k].forEach((val, i) => (i ? ctx.lineTo(x(i), y(val)) : ctx.moveTo(x(i), y(val))));
        if (n === 1) ctx.lineTo(x(0) + 0.1, y(lines[k][0]));
        ctx.stroke();
      });
      ctx.restore();

      if (progress.current * (n - 1) >= curRef.current - 0.001) {
        const cx = Math.round(x(curRef.current)) + 0.5;
        ctx.strokeStyle = accent;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, h);
        ctx.stroke();
        ctx.setLineDash([]);
        [2, 1, 0].forEach((k) => {
          ctx.beginPath();
          ctx.fillStyle = ground;
          ctx.strokeStyle = cols[k];
          ctx.lineWidth = 2;
          ctx.arc(cx, y(lines[k][curRef.current]), k === 0 ? 3.5 : 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      }
    };
    drawRef.current = draw;

    let raf = 0;
    // wait one frame so a colour-scheme switch has applied its CSS variables
    raf = requestAnimationFrame(() => {
      readColours();
      if (reduce || progress.current === 1) {
        progress.current = 1;
        draw();
        return;
      }
      const start = performance.now();
      const step = (t: number) => {
        progress.current = Math.min(1, (t - start) / 1100);
        draw();
        if (progress.current < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // redraw when the data or the colour scheme changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, colorScheme]);

  useEffect(() => drawRef.current(), [cur]);

  const pick = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    const pad = PAD_REM * remPx();
    const rel = (clientX - r.left - pad) / Math.max(1, r.width - 2 * pad);
    setCursor(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  };

  const onKey = (e: KeyboardEvent) => {
    const next = { ArrowLeft: Math.max(0, cur - 1), ArrowRight: Math.min(n - 1, cur + 1), Home: 0, End: null }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setCursor(next);
  };

  if (n === 0) {
    return (
      <Plate className={classes.empty}>
        <Typography variant="body2" color="text.secondary">אין עדיין תחקירים להצגה.</Typography>
      </Plate>
    );
  }

  const point = data[cur];
  const summary = `${monthLabel(point.month)}: ${point.investigations} תחקירים, ${point.lessons} לקחים, ${point.tasks} משימות`;

  return (
    <Plate title="לפי חודש התחקיר. העבירו את העכבר או השתמשו בחצים כדי לקרוא חודש." className={classes.root}>
      <Box component="canvas"
        ref={ref}
        tabIndex={0}
        role="img"
        aria-label={`מגמה חודשית ${monthLabel(data[0].month)} עד ${monthLabel(data[n - 1].month)}. ${summary}`}
        onMouseMove={(e) => pick(e.clientX)}
        onMouseLeave={() => setCursor(null)}
        onKeyDown={onKey}
        className={classes.canvas}
      />
      <Box className={classes.legend}>
        <Typography component="span" variant="inherit" dir="ltr" className={classes.month}>{monthLabel(point.month)}</Typography>
        {SERIES.map((s) => (
          <Box component="span" key={s.key} className={classes.item}>
            <Box component="i" className={cx(classes.swatch, classes[s.key])} />
            <Typography component="span" variant="inherit">{s.label}</Typography>
            <Typography component="b" variant="inherit" className={classes.value}>{point[s.key]}</Typography>
          </Box>
        ))}
        <Typography component="span" variant="inherit" dir="ltr" className={classes.range}>
          {monthLabel(data[0].month)} → {monthLabel(data[n - 1].month)}
        </Typography>
      </Box>
    </Plate>
  );
}

