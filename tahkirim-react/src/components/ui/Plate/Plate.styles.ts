import { tss } from "tss-react/mui";

export const useStyles = tss.withParams<{ hot: boolean; noScrews: boolean }>().create(({ theme, hot, noScrews }) => {
  const bb = theme.vars.palette.bb;
  const cap = hot ? theme.vars.palette.primary.main : bb.capMetal;
  const fill = `linear-gradient(${cap}, ${cap})`;
  const corner = (pos: string) => [`${fill} ${pos} / 1.375rem 0.25rem no-repeat`, `${fill} ${pos} / 0.25rem 1.375rem no-repeat`];
  const screw = {
    content: '""',
    position: "absolute" as const,
    top: theme.spacing(1.5),
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "50%",
    background: `radial-gradient(circle at 35% 35%, ${bb.screwHi}, ${bb.screwLo})`,
    boxShadow: `inset 0 0 0 ${theme.hairline} ${bb.screwEdge}`,
    pointerEvents: "none" as const,
  };
  return {
    root: {
      position: "relative",
      border: `${theme.hairline} solid ${bb.rule}`,
      borderRadius: theme.radius.lg,
      color: theme.vars.palette.text.primary,
      background: [...corner("top right"), ...corner("top left"), ...corner("bottom right"), ...corner("bottom left"), `linear-gradient(180deg, ${bb.panel2}, ${bb.panel})`].join(", "),
      boxShadow: theme.shadows[1],
      ...(!noScrews && {
        "&::before": { ...screw, right: theme.spacing(1.5) },
        "&::after": { ...screw, left: theme.spacing(1.5) },
      }),
    },
  };
});
