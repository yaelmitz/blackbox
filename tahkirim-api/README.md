# BLACKBOX API

שרת NestJS + TypeORM למערכת התחקירים והלקחים, לפי הטבלאות שבמסמך האפיון.

## הרצה

צריך Node.js 18 ומעלה.

```bash
npm install
npm run start:dev
```

- ה-API: http://localhost:4000/api
- תיעוד ובדיקה של כל ה-endpoints (Swagger): http://localhost:4000/api/docs

בהרצה הראשונה נוצר קובץ מסד נתונים `data/blackbox.sqlite` ומתמלא ב-12 תחקירי הדוגמה. כדי להתחיל ממסד ריק: מוחקים את התיקייה `data` ומריצים עם `SEED=false`.

## טבלאות

| טבלה | שדות | קשרים |
|---|---|---|
| `investigations` (תחקיר) | `id` מספר מזהה, `subject` נושא, `date` תאריך, `type` סוג, `background` רקע, `classification` סיווג, `questions` שאלות, `locationText`/`locationFile` מיקום, `coordinatesText`/`coordinatesFile` נ"צ, `publisher` מפרסם, `whatHappened` מה קרה, `whatPlanned` מה תוכנן, `conclusions` מסקנות, `sourcesText`/`sourcesFile` מקורות מידע, `roles` בעלי התפקידים | ↔ מסגרות (many-to-many), ← המלצות, ← לקחים |
| `units` (מסגרת) | `id`, `name` (ייחודי) | ↔ תחקירים, דרך טבלת הקישור `investigation_units` |
| `recommendations` (המלצה) | `text`, `position`, `lessonId` הלקח שנוצר ממנה ב"ליישום" | → תחקיר, → לקח |
| `lessons` (לקח) | `name` שם, `notes` הערות, `status` סטטוס, `resources` משאבים, `inImplementation` הועבר ליישום | → תחקיר, ← משימות |
| `tasks` (משימה) | `name` שם, `status` סטטוס | → לקח, ← פרמטרים |
| `task_parameters` (פרמטר) | `name`, `value` | → משימה |
| `attachments` (קובץ) | `originalName`, `mimeType`, `size` | לשדות "טקסט או קובץ" |

שדות "טקסט חופשי" (מה קרה, מה תוכנן, מסקנות) נשמרים כ-HTML מהעורך.
שדה "טקסט או קובץ" מחזיק אחד מהשניים: מעלים קובץ ל-`POST /api/attachments` ושולחים את ה-`id` שחזר כ-`locationFileId` / `coordinatesFileId` / `sourcesFileId`.

## ערכים קבועים

- סוג: `OPERATIONAL` מבצעי · `SAFETY` בטיחות · `TRAINING` הדרכה · `LOGISTICS` לוגיסטי · `TECHNOLOGY` טכנולוגי · `ORGANIZATIONAL` ארגוני
- סיווג: `UNCLASSIFIED` בלמ"ס · `RESTRICTED` שמור · `SECRET` סודי
- סטטוס לקח: `NEW` חדש · `IN_PROGRESS` בטיפול · `IMPLEMENTED` יושם · `CLOSED` נסגר
- סטטוס משימה: `OPEN` פתוחה · `IN_PROGRESS` בביצוע · `DONE` הושלמה · `BLOCKED` חסומה

## Endpoints

| מה | בקשה |
|---|---|
| טבלת תחקירים (חיפוש, סינון, דפדוף) | `GET /api/investigations?q=&type=&classification=&unitId=&sort=date&order=DESC&page=1&pageSize=20` |
| מסגרות | `GET` / `POST /api/units`, `GET` / `PATCH` / `DELETE /api/units/:id` |
| קריאת תחקיר מלא (כולל לקחים, משימות, פרמטרים) | `GET /api/investigations/:id` |
| יצירת תחקיר (עם המלצות ולקחים) | `POST /api/investigations` |
| עדכון / מחיקה | `PATCH` / `DELETE /api/investigations/:id` |
| המלצות | `POST /api/investigations/:id/recommendations`, `PATCH`/`DELETE /api/recommendations/:id` |
| "ליישום" על המלצה – הופכת ללקח בניהול הלקחים | `POST /api/recommendations/:id/implement` |
| ניהול לקחים (רק לקחים שהועברו ליישום) | `GET /api/lessons?inImplementation=true&status=&investigationId=`, `GET`/`PATCH`/`DELETE /api/lessons/:id` |
| "ליישום" – העברת לקח לניהול הלקחים | `POST /api/lessons/:id/implement` |
| לקח חדש לתחקיר | `POST /api/investigations/:id/lessons` |
| משימות | `POST /api/lessons/:id/tasks` (אפשר עם פרמטרים), `GET`/`PATCH`/`DELETE /api/tasks/:id` |
| פרמטרים | `POST /api/tasks/:id/parameters`, `PATCH`/`DELETE /api/parameters/:id` |
| קבצים | `POST /api/attachments` (multipart, שדה `file`, עד 20MB), `GET /api/attachments/:id` |
| דשבורד (אפשר לסנן: `unitId` יחידה/מסגרת, `type` סוג, `from`/`to` טווח תאריכים YYYY-MM-DD) | `GET /api/dashboard?unitId=&type=&from=&to=` |

מחיקת תחקיר מוחקת גם את ההמלצות, הלקחים, המשימות והפרמטרים שלו, ומנתקת אותו מהמסגרות (המסגרות עצמן נשארות). מחיקת מסגרת מנתקת אותה מהתחקירים.

בתחקיר שולחים `unitIds: number[]` (מזהים מ-`/api/units`). ב-`PATCH`, `unitIds` מחליף את כל רשימת המסגרות, ובלעדיו המסגרות לא משתנות.

**מעבר נתונים:** עמודת הטקסט הישנה `unit` הועברה בהפעלה לטבלת `units` וקושרה לתחקירים (`UnitMigrationService`). העמודה נשארת ריקה במסד רק כדי שהסנכרון האוטומטי לא ימחק נתונים, ואפשר להסיר אותה כשעוברים ל-migrations.

## הגדרות (משתני סביבה)

| משתנה | ברירת מחדל |
|---|---|
| `PORT` | `4000` |
| `DB_FILE` | `data/blackbox.sqlite` |
| `UPLOAD_DIR` | `uploads` |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:4173` |
| `SEED` | `true` (ממלא מסד ריק בדוגמאות) |

## מעבר ל-PostgreSQL

כברירת מחדל השרת רץ על SQLite בקובץ (`data/blackbox.sqlite`), בלי התקנות. אחרי שמתקינים PostgreSQL:

1. בקובץ `.env` משנים ל-`DB_TYPE=postgres` וממלאים את `PGPASSWORD` (הסיסמה שבחרתם למשתמש `postgres` בהתקנה).
2. יוצרים את מסד הנתונים:
   ```bash
   npm run db:create
   ```
3. מפעילים מחדש את השרת. הטבלאות נוצרות אוטומטית, ומסד ריק מתמלא בתחקירי הדוגמה.

לפרודקשן: `DB_SYNC=false` ו-migrations במקום יצירה אוטומטית של טבלאות.

## חיבור לפרונט

הפרונט (`tahkirim-react`) שולח בקשות ל-`/api`, ו-Vite מעביר אותן לשרת ב-`http://localhost:4000`. מריצים את שניהם במקביל:

- `tahkirim-api` → `npm run start:dev` (או לחיצה כפולה על `start.cmd`)
- `tahkirim-react` → `npm run dev` (או לחיצה כפולה על `start.cmd`)
