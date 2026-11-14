import Box from "@mui/material/Box";
import { Lcd } from "../../../components/ui/Lcd";
import { useStyles } from "./ChannelCell.styles";

/** Investigation number on a recorder display */
export function ChannelCell({ id }: { id: number }) {
  const { classes } = useStyles();
  return (
    <Box component="span" className={classes.root} dir="ltr">
      <Lcd size="lg" glow>{id}</Lcd>
    </Box>
  );
}
