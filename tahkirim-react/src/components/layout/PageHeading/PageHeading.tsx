import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { MonthPoint } from "../../../types/models";
import { FdrTrace } from "../FdrTrace";
import { useStyles } from "./PageHeading.styles";

interface Props {
  eyebrow: string;
  title: string;
  lede: string;
  monthly?: MonthPoint[];
}

/** Page title and the monthly trace */
export function PageHeading({ eyebrow, title, lede, monthly }: Props) {
  const { classes } = useStyles();
  return (
    <Container maxWidth="lg">
      <Box className={classes.grid}>
        <Box className={classes.text}>
          <Typography variant="eyebrow" color="primary">{eyebrow}</Typography>
          <Typography variant="h1" className={classes.title}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" className={classes.lede}>{lede}</Typography>
        </Box>
        <FdrTrace data={monthly ?? []} />
      </Box>
    </Container>
  );
}
