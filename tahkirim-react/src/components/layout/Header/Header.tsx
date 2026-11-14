import Box from "@mui/material/Box";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import LightbulbOutlined from "@mui/icons-material/LightbulbOutlined";
import SpeedOutlined from "@mui/icons-material/SpeedOutlined";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { APP_TAGLINE } from "../../../constants/labels";
import { routes } from "../../../constants/routes";
import { Logo } from "../Logo";
import { useStyles } from "./Header.styles";

const NAV = [
  { to: routes.cases, label: "תחקירים", icon: <FactCheckOutlined fontSize="small" /> },
  { to: routes.lessons, label: "ניהול לקחים", icon: <LightbulbOutlined fontSize="small" /> },
  { to: routes.dashboard, label: "דשבורד", icon: <SpeedOutlined fontSize="small" /> },
];

export function Header({ caseCount }: { caseCount?: number }) {
  const { classes } = useStyles();
  const { mode, systemMode, setMode } = useColorScheme();
  const active = (mode === "system" ? systemMode : mode) ?? "dark";

  return (
    <AppBar position="sticky" elevation={0} className={classes.bar}>
      <Container maxWidth="lg">
        <Box className={classes.row}>
          <ButtonBase component={RouterLink} to={routes.cases} aria-label="BLACKBOX – חזרה לעמוד התחקירים" className={classes.brand}>
            <Logo />
            <Box>
              <Typography dir="ltr" className={classes.name}>
                BLACK<Typography component="span" variant="inherit" className={classes.nameAccent}>BOX</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary" className={classes.tagline}>
                {APP_TAGLINE}
              </Typography>
            </Box>
          </ButtonBase>

          <Box component="nav" aria-label="ניווט ראשי" className={classes.nav}>
            {NAV.map((n) => (
              <Button key={n.to} component={NavLink} to={n.to} end startIcon={n.icon} size="small" className={classes.navLink}>
                {n.label}
              </Button>
            ))}
          </Box>

          <Box className={classes.end}>
            <Box className={classes.rec}>
              <Box component="span" className={classes.recLight} />
              <Typography variant="mono" color="error">REC · {caseCount ?? "–"} CASES</Typography>
            </Box>
            <Tooltip title={active === "dark" ? "מצב בהיר" : "מצב כהה"}>
              <IconButton
                onClick={() => setMode(active === "dark" ? "light" : "dark")}
                aria-label={active === "dark" ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
                className={classes.themeBtn}
              >
                {active === "dark" ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}
