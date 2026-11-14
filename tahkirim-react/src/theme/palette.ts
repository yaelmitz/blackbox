/**
 * BLACKBOX colour tokens (palette.bb.*), dark and light.
 * Dark: a flight-recorder readout at night. Light: the same instruments on an inspection bench.
 */
export interface BbPalette {
  void: string; // page ground
  panel: string; // instrument panels
  panel2: string;
  rule: string; // hairlines
  well: string; // inset fields
  rowOpen: string; // expanded table row
  hover: string;
  dash: string; // dashed outlines, grips
  placeholder: string;
  gridLine: string; // page grid
  sheen: string; // top highlight on panels
  shadow: string; // drop shadow colour
  backdrop: string;
  headerBg: string;
  footBg: string;
  btnShade: string;
  capMetal: string; // corner caps
  screwHi: string;
  screwLo: string;
  screwEdge: string;
  gripLo: string;
  gripHi: string;
  boltHi: string;
  boltLo: string;
  plateEdge: string; // label plate
  plateHi: string;
  plateLo: string;
  plateText: string;
  plateEmboss: string;
  lcd: string; // number displays and index badges (dark: orange on black; light: orange on white)
  lcdEdge: string;
  lcdGlow: string;
  tipBg: string; // tooltips
  tipText: string;
  tipEdge: string;
  annBg: string; // annunciator lights
  ann0: string;
  ann0Edge: string;
  orangeWash: string;
  orangeWash2: string;
  orangeFill: string;
  warnWash: string;
  warnGlow: string;
  alertWash: string;
  alertGlow: string;
  gaugeTrack: string;
  gaugeTick: string;
  traceGrid: string;
  trace1: string;
  trace2: string;
  trace3: string;
  logoTop: string;
  logoLeft: string;
  logoRight: string;
}

export const darkBb: BbPalette = {
  void: "#0b0c0d", panel: "#151719", panel2: "#1d2023", rule: "#2c3034", well: "#0e0f11", rowOpen: "#090a0b",
  hover: "#2a2e33", dash: "#4a5057", placeholder: "#5d656d",
  gridLine: "rgba(255,255,255,.018)", sheen: "rgba(255,255,255,.05)", shadow: "rgba(0,0,0,.35)", backdrop: "rgba(0,0,0,.75)",
  headerBg: "rgba(11,12,13,.92)", footBg: "rgba(21,23,25,.94)", btnShade: "rgba(0,0,0,.2)",
  capMetal: "#3a3f45", screwHi: "#6a7077", screwLo: "#25282b", screwEdge: "rgba(0,0,0,.55)",
  gripLo: "#24282c", gripHi: "#4a5057", boltHi: "#ffb27f", boltLo: "#7a2e00",
  plateEdge: "#3a3f45", plateHi: "#2a2e33", plateLo: "#1b1e21", plateText: "#b9c0c7", plateEmboss: "#000",
  lcd: "#000", lcdEdge: "#3a2414", lcdGlow: "rgba(255,106,19,.55)",
  tipBg: "#1d2023", tipText: "#e9ecef", tipEdge: "#3a3f45",
  annBg: "#000", ann0: "#9aa3ab", ann0Edge: "#3a4046",
  orangeWash: "rgba(255,106,19,.04)", orangeWash2: "rgba(255,106,19,.1)", orangeFill: "rgba(255,106,19,.12)",
  warnWash: "rgba(255,176,32,.1)", warnGlow: "rgba(255,176,32,.25)", alertWash: "rgba(255,77,79,.1)", alertGlow: "rgba(255,77,79,.3)",
  gaugeTrack: "#24282c", gaugeTick: "#5b6167", traceGrid: "rgba(255,255,255,.06)",
  trace1: "#ff6a13", trace2: "#4fd1c5", trace3: "#c3cbd3",
  logoTop: "#2c3035", logoLeft: "#17191c", logoRight: "#0b0c0d",
};

/*
 * Light: the recorder on an inspection bench. A warm concrete ground so the white instrument
 * panels stand off it, visible hairlines, inset wells that read as recessed, graphite hardware
 * (caps, screws, LCDs) and a deeper orange that keeps small labels readable on white.
 */
export const lightBb: BbPalette = {
  void: "#e6e3dd", panel: "#fbfaf8", panel2: "#ffffff", rule: "#d6d2ca", well: "#f3f1ec", rowOpen: "#f6f4ef",
  hover: "#efece6", dash: "#a8a39a", placeholder: "#8c877f",
  gridLine: "rgba(60,45,25,.05)", sheen: "rgba(255,255,255,1)", shadow: "rgba(45,35,20,.10)", backdrop: "rgba(25,22,18,.45)",
  headerBg: "rgba(251,250,248,.94)", footBg: "rgba(251,250,248,.96)", btnShade: "rgba(0,0,0,.18)",
  capMetal: "#8f8a82", screwHi: "#ffffff", screwLo: "#8f8a82", screwEdge: "rgba(40,30,20,.35)",
  gripLo: "#cdc8bf", gripHi: "#f6f4ef", boltHi: "#ffc9a3", boltLo: "#9a3412",
  plateEdge: "#bdb7ad", plateHi: "#fbfaf8", plateLo: "#e3dfd8", plateText: "#3b3833", plateEmboss: "#fff",
  // no black fills in light mode: displays are white with an orange edge, tooltips white with a dark edge
  lcd: "#ffffff", lcdEdge: "#c2410c", lcdGlow: "transparent",
  tipBg: "#ffffff", tipText: "#1c1a17", tipEdge: "#1c1a17",
  annBg: "#ffffff", ann0: "#5b5750", ann0Edge: "#c4bfb6",
  orangeWash: "rgba(194,65,12,.05)", orangeWash2: "rgba(194,65,12,.1)", orangeFill: "rgba(194,65,12,.12)",
  warnWash: "rgba(161,98,7,.09)", warnGlow: "rgba(161,98,7,.14)", alertWash: "rgba(190,30,45,.07)", alertGlow: "rgba(190,30,45,.16)",
  gaugeTrack: "#e8e4dd", gaugeTick: "#a8a39a", traceGrid: "rgba(60,45,25,.08)",
  trace1: "#c2410c", trace2: "#0f766e", trace3: "#7c776f",
  logoTop: "#f6f4ef", logoLeft: "#d9d4cc", logoRight: "#bdb7ad",
};

/** Standard MUI palette roles per scheme */
export const darkRoles = {
  primary: { main: "#ff6a13", contrastText: "#140800" },
  success: { main: "#3ddc84" },
  warning: { main: "#ffb020" },
  error: { main: "#ff4d4f", contrastText: "#ffffff" },
  info: { main: "#5aa9ff" },
  text: { primary: "#e9ecef", secondary: "#8c949c" },
  background: { default: "#0b0c0d", paper: "#151719" },
  divider: "#2c3034",
};

/** every role is at least 4.5:1 on white panels, so small orange labels and status text stay readable */
export const lightRoles = {
  primary: { main: "#c2410c", contrastText: "#ffffff" },
  success: { main: "#15803d" },
  warning: { main: "#a16207" },
  error: { main: "#be1e2d", contrastText: "#ffffff" },
  info: { main: "#1d4ed8" },
  text: { primary: "#1c1a17", secondary: "#5b5750" },
  background: { default: "#e6e3dd", paper: "#fbfaf8" },
  divider: "#d6d2ca",
};
