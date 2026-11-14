import { tss } from "tss-react/mui";

export const useStyles = tss.create(({ theme }) => {
  const p = theme.vars.palette;
  return {
    root: { display: "flex", flexDirection: "column", gap: theme.spacing(1) },
    switch: {
      alignSelf: "flex-start",
      "& .Mui-selected, & .Mui-selected:hover": { backgroundColor: p.primary.main, color: p.primary.contrastText },
    },
    option: { paddingInline: theme.spacing(1.75), paddingBlock: theme.spacing(0.5) },
    file: {
      justifyContent: "flex-start",
      borderStyle: "dashed",
      borderColor: p.bb.dash,
      color: p.text.secondary,
      paddingBlock: theme.spacing(1.5),
      overflowWrap: "anywhere",
      textAlign: "start",
    },
    chosen: { color: p.text.primary },
  };
});
