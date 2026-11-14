# BLACKBOX

מערכת לניהול תחקירים ולקחים: כל תחקיר מתועד, כל לקח נלמד.

- **תחקירים** – טבלה עם חיפוש, סינון לפי מסגרת / סוג / סיווג, מיון ודפדוף בצד השרת. פתיחת שורה מציגה את הלקחים וההמלצות של התחקיר.
- **ליישום** – לקח או המלצה עוברים לניהול הלקחים רק בלחיצה על "ליישום" (המלצה הופכת ללקח).
- **קריאה, יצירה ועריכה של תחקיר** – כולל עורך טקסט עשיר (כותרות, צבעים, מרקר, קישורים, רשימות משימות, טבלאות).
- **ניהול לקחים** – סטטוס, משאבים, הערות, משימות ופרמטרים.
- **דשבורד** – מדדים, פילוח לפי סוג וחודש וסטטוסים, עם סינון לפי יחידה, סוג וטווח תאריכים.
- מצב כהה ומצב בהיר, ממשק בעברית (RTL).

## מבנה

| תיקייה | מה יש בה |
|---|---|
| [`tahkirim-api`](tahkirim-api) | השרת: NestJS + TypeORM. SQLite כברירת מחדל (בלי התקנה), או PostgreSQL. |
| [`tahkirim-react`](tahkirim-react) | הפרונט: React + TypeScript + Vite, MUI, TanStack Query / Table, react-hook-form, TipTap. |

## הרצה מקומית

צריך Node.js 18 ומעלה.

**1. השרת** (בחלון טרמינל אחד):

```bash
cd tahkirim-api
cp .env.example .env
npm install
npm run start:dev
```

השרת עולה ב-http://localhost:4000/api (תיעוד Swagger ב-`/api/docs`). בהרצה הראשונה נוצר מסד נתונים `data/blackbox.sqlite` עם 12 תחקירים לדוגמה.

**2. הפרונט** (בחלון טרמינל שני):

```bash
cd tahkirim-react
npm install
npm run dev
```

ופותחים את הכתובת ש-Vite מדפיס (בדרך כלל http://localhost:5173).

פרטים נוספים: [README של השרת](tahkirim-api/README.md) · [README של הפרונט](tahkirim-react/README.md).
