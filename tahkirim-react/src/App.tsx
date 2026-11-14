import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useCallback, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { PageHeading } from "./components/layout/PageHeading";
import { PAGE_HEADINGS, routes } from "./constants/routes";
import { useDashboard } from "./hooks/useDashboard";
import { useInvestigation } from "./hooks/useInvestigations";
import CasePage from "./pages/case/CasePage";
import { EditCasePage, NewCasePage } from "./pages/caseForm/CaseFormPages";
import CasesPage from "./pages/cases/CasesPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LessonsPage from "./pages/lessons/LessonsPage";
import { fmtDate } from "./utils/format";
import { unitNames } from "./utils/units";
import { useStyles } from "./App.styles";

/** Heading for the current route; investigation pages use the investigation's own title */
function useHeading(pathname: string): [string, string, string] {
  const m = pathname.match(/^\/case\/(\d+)(\/edit)?/);
  const { data } = useInvestigation(m ? Number(m[1]) : NaN);
  if (m) {
    const c = data?.case;
    if (m[2]) return [`CH-${m[1]} · עריכת תחקיר`, c ? `עריכה: ${c.title}` : "עריכת תחקיר", "שנו את מה שצריך ולחצו על שמירת השינויים. מספר מזהה לא ניתן לשינוי."];
    return [`CH-${m[1]} · קריאת תחקיר`, c?.title ?? "קריאת תחקיר", c ? `${fmtDate(c.date)} · ${c.type} · ${unitNames(c.units)} · מפרסם: ${c.by}` : ""];
  }
  return PAGE_HEADINGS[pathname] ?? PAGE_HEADINGS["/"];
}

export default function App() {
  const { classes } = useStyles();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [eyebrow, title, lede] = useHeading(pathname);
  const dashboard = useDashboard();

  const openCase = useCallback(
    (id: number) => {
      navigate(routes.case(id));
      window.scrollTo(0, 0);
    },
    [navigate],
  );
  const goToLesson = useCallback(
    (id: number) => {
      setSelectedLesson(id);
      navigate(routes.lessons);
      window.scrollTo(0, 0);
    },
    [navigate],
  );

  return (
    <Box dir="rtl" className={classes.root}>
      <Header caseCount={dashboard.data?.totals.investigations} />
      <PageHeading
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        monthly={dashboard.data?.monthly}
      />
      <Container maxWidth="lg" component="main" className={classes.main}>
        <Routes>
          <Route path={routes.cases} element={<CasesPage onOpenCase={openCase} onGoToLesson={goToLesson} />} />
          <Route path="/case/:id" element={<CasePage onGoToLesson={goToLesson} />} />
          <Route path="/case/:id/edit" element={<EditCasePage />} />
          <Route path={routes.newCase} element={<NewCasePage />} />
          <Route path={routes.lessons} element={<LessonsPage selected={selectedLesson} onSelect={setSelectedLesson} onOpenCase={openCase} />} />
          <Route path={routes.dashboard} element={<DashboardPage />} />
          <Route path="*" element={<Navigate to={routes.cases} replace />} />
        </Routes>
      </Container>
    </Box>
  );
}
