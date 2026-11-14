# BLACKBOX – פרונט

React + TypeScript + Vite, עם MUI, tss-react, TanStack Query, TanStack Table ו-react-hook-form. מתחבר לשרת `tahkirim-api`.

## הרצה

```bash
npm install
npm run dev
```

השרת (`tahkirim-api`) צריך לרוץ במקביל. בקשות ל-`/api` מועברות אליו דרך Vite, לפורט 4000 (כמו `PORT` ב-`tahkirim-api/.env`). אפשר לשנות עם `API_URL=http://localhost:3000`.

## מבנה

```
src/
  api/          קריאות לשרת, קובץ לכל משאב + http.ts
  hooks/        TanStack Query: useInvestigations, useLessons, useDashboard, useInvalidate + hooks כלליים
  types/        ממשקים: models (מסך), api (שרת), forms (טופס)
  constants/    תוויות, מיפוי enum-ים, מפתחות query, נתיבים
  utils/        פורמט, המרות שרת↔מסך, טופס
  theme/        AppTheme של MUI: צבעים (palette.ts), צללים, ריווח, גופן, RTL
  components/   ui (Plate, Lcd, StatusPill…), layout (Header, PageHeading, FdrTrace), form (RichTextEditor, TextOrFileInput)
  pages/        cases (טבלה), case (קריאה), caseForm (יצירה/עריכה), lessons, dashboard
```

## מוסכמות

- **תיקייה לכל קומפוננטה**: `Name/Name.tsx` (הקומפוננטה), `Name/Name.styles.ts` (הסגנונות), `Name/index.ts` (ייצוא, כך שמייבאים מ-`./Name`).
- **עיצוב**: בלי `sx`. ב-`Name.styles.ts`: `export const useStyles = tss.create(({ theme }) => ({ ... }))`, ובקומפוננטה `const { classes, cx } = useStyles()`. ערכים תלויי props דרך `tss.withParams<...>().create(...)`.
- **ערכים מהתימה בלבד**: צבעים מ-`theme.vars.palette` (כולל `bb.*`), ריווח מ-`theme.spacing` (rem), רדיוסים מ-`theme.radius`, צללים מ-`theme.shadows`.
- **גופן אחד**: Rubik בכל האפליקציה (`theme.font`).
- **נתונים**: רק דרך TanStack Query. קריאה ב-`useQuery` / `useInfiniteQuery`, כתיבה ב-`useMutation`, ואחרי הצלחה `invalidateQueries` (`hooks/useInvalidate.ts`). אין עדכון ידני של ה-cache.
- **סינון, מיון, דפדוף וסיכומים** נעשים בשרת. הפרונט רק שולח פרמטרים ומציג את התוצאה.
- **רכיבי MUI בלבד, בלי HTML גולמי**: `Box` במקום `div`, ובמקום אלמנטים סמנטיים `Box` עם `component` (`nav`, `form`, `section`, `ol`, `li`, `legend`, `canvas`). טקסט ב-`Typography`, הלוגו ב-`SvgIcon`. יוצאי הדופן היחידים הם צורות ה-SVG בתוך הגרפים והלוגו (`path`, `line`, `circle`, `text`), שאין להן מקבילה ב-MUI.
