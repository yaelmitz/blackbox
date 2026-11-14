export const routes = {
  cases: "/",
  newCase: "/new",
  case: (id: number | string) => `/case/${id}`,
  editCase: (id: number | string) => `/case/${id}/edit`,
  lessons: "/lessons",
  dashboard: "/dashboard",
};

/** Heading shown above each page: [eyebrow, title, lede] */
export const PAGE_HEADINGS: Record<string, [string, string, string]> = {
  "/": ["CH-01 · תיקים פתוחים", "תחקירים", "לחצו על החץ לצפייה בלקחים, או על נושא התחקיר לקריאת התחקיר המלא."],
  "/lessons": ["CH-02 · קריאת לקחים", "ניהול לקחים", "לקחים שהועברו ליישום מתוך התחקירים. בחרו לקח כדי לראות את פרטיו, את המשימות שלו ואת תחקיר המקור."],
  "/dashboard": ["CH-03 · לוח מכשירים", "דשבורד", "תמונת מצב של התיקים, הלקחים והמשימות. אפשר לסנן לפי יחידה, סוג וטווח תאריכים."],
  "/new": ["CH-01 · הקלטה חדשה", "תחקיר חדש", "מלאו את פרטי התחקיר. שדות עם * הם חובה, השאר אפשר להשלים מאוחר יותר."],
};
