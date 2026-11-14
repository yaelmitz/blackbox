import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Classification as C, InvestigationType as T, LessonStatus as L, TaskStatus as S } from '../common/enums';
import { Investigation } from '../entities/investigation.entity';
import { Unit } from '../entities/unit.entity';

/**
 * Fills an empty database with the example investigations from the design,
 * so the frontend has something to show on first run. Set SEED=false to skip.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly log = new Logger('Seed');
  constructor(private readonly ds: DataSource) {}

  async onApplicationBootstrap() {
    if (process.env.SEED === 'false') return;
    const repo = this.ds.getRepository(Investigation);
    if ((await repo.count()) > 0) return;

    const task = (name: string, done: boolean) => ({ name, status: done ? S.DONE : S.IN_PROGRESS, parameters: [] });
    const names = ['מינוי אחראי וקביעת לו״ז', 'ביצוע ובקרת עמידה', 'הטמעה בנוהל ותיעוד'];
    const lesson = (name: string, status: L, n: number, k: number) => ({
      name,
      status,
      inImplementation: status !== L.NEW || n > 0, // already sent with "ליישום"
      notes: '',
      resources: '',
      tasks: Array.from({ length: n }, (_, j) => task(names[j], j < k)),
    });

    const rows: (Partial<Investigation> & { unit?: string })[] = [
      { id: 1003, subject: 'השקת מערכת CRM חדשה', date: '2026-11-01', type: T.TECHNOLOGY, unit: 'מערכות מידע', classification: C.UNCLASSIFIED, publisher: 'נועה ברק',
        lessons: [lesson('תכנון הדרכות מוקדם', L.NEW, 0, 0)] as never },
      { id: 998, subject: 'קליטת עובדים חדשים', date: '2026-10-20', type: T.TRAINING, unit: 'משאבי אנוש', classification: C.UNCLASSIFIED, publisher: 'דנה שפירא',
        lessons: [lesson("צ'קליסט קליטה מחלקתי", L.IMPLEMENTED, 2, 1)] as never },
      { id: 1002, subject: 'אירוע בטיחות באתר בנייה', date: '2026-10-03', type: T.SAFETY, unit: 'חטיבת הנדסה', classification: C.UNCLASSIFIED, publisher: 'אבי כהן',
        lessons: [lesson('תדריך עבודה בגובה לפני כל משמרת', L.IMPLEMENTED, 1, 1)] as never },
      { id: 997, subject: 'השבתת קו ייצור 2', date: '2026-09-30', type: T.LOGISTICS, unit: 'מפעל ראשי', classification: C.RESTRICTED, publisher: 'רונן אברהם',
        lessons: [lesson('לוח תחזוקה מונעת ממוחשב', L.IN_PROGRESS, 3, 1), lesson('מלאי חלפים קריטיים', L.NEW, 0, 0)] as never },
      {
        id: 1001, subject: 'תקלה בשרשרת האספקה – מחסן מרכזי', date: '2026-09-14', type: T.LOGISTICS, unit: 'אגף לוגיסטיקה', classification: C.RESTRICTED, publisher: 'רונית לוי',
        background: 'המחסן המרכזי מספק חלפים לשלושה אתרי ייצור. ספק הרכיבים הקריטיים הודיע על עיכוב, והמלאי במחסן הספיק לחמישה ימי עבודה בלבד.',
        questions: 'למה העיכוב לא זוהה מוקדם יותר?\nמה מנע מעבר מהיר לספק חלופי?',
        locationText: 'מחסן מרכזי, אזור חלפים קריטיים (רציף 4)',
        coordinatesText: '31.8044, 34.6553',
        whatHappened: '<p>ב-<strong>14.9</strong> התקבלה הודעת עיכוב מהספק. ההודעה נשלחה לתיבת דוא"ל כללית ולא טופלה במשך יומיים.</p><ul><li>יום 3: המלאי ירד מתחת לסף הבטיחות.</li><li>יום 5: קו ייצור 2 עצר לשש שעות.</li></ul>',
        whatPlanned: '<p>לפי הנוהל, כל עיכוב של ספק קריטי מדווח <strong>תוך 4 שעות</strong> למנהל הלוגיסטיקה, ומופעל ספק גיבוי מאושר.</p>',
        conclusions: '<ul><li>אין ספק גיבוי מוגדר לרכיבים הקריטיים.</li><li>אין התראה אוטומטית כשהמלאי יורד מתחת לסף.</li></ul>',
        roles: 'רונית לוי – מנהלת אגף לוגיסטיקה\nאלון דוד – אחראי מחסן מרכזי\nמשה פרץ – רכש',
        recommendations: [
          'להגדיר ספק גיבוי מאושר לכל פריט קריטי',
          'להפעיל התראת מלאי אוטומטית בסף של 10 ימי עבודה',
          'לנתב הודעות ספקים לתור מטופל ולא לתיבה כללית',
        ].map((text, position) => ({ text, position })) as never,
        lessons: [
          {
            ...lesson('חובת ספק גיבוי לכל פריט קריטי', L.IN_PROGRESS, 0, 0),
            tasks: [
              { name: 'מיפוי פריטים קריטיים', status: S.DONE, parameters: [{ name: 'מספר פריטים', value: '42' }] },
              { name: 'אישור ספק גיבוי לכל פריט', status: S.IN_PROGRESS, parameters: [{ name: 'יעד', value: '31.12.2026' }, { name: 'אחראי', value: 'משה פרץ' }] },
            ],
          },
        ] as never,
      },
      { id: 996, subject: 'חריגה בתקציב הדרכות', date: '2026-08-28', type: T.TRAINING, unit: 'משאבי אנוש', classification: C.UNCLASSIFIED, publisher: 'דנה שפירא',
        lessons: [lesson('בקרת תקציב חודשית', L.CLOSED, 1, 1)] as never },
      { id: 995, subject: 'תרגיל מבצעי – צפון', date: '2026-08-15', type: T.OPERATIONAL, unit: 'יחידת שטח צפון', classification: C.SECRET, publisher: 'רס"ן עמית גל',
        lessons: [lesson('נוהל קשר חלופי', L.IN_PROGRESS, 2, 1), lesson('תדריך מקדים משותף', L.IMPLEMENTED, 1, 1)] as never },
      { id: 994, subject: 'כשל בהשקת מוצר דיגיטלי', date: '2026-07-30', type: T.TECHNOLOGY, unit: 'פיתוח מוצר', classification: C.RESTRICTED, publisher: 'נועה ברק',
        lessons: [lesson('בדיקות עומס לפני כל השקה', L.IMPLEMENTED, 2, 2), lesson('השקה בשלבים (Canary)', L.IN_PROGRESS, 1, 0)] as never },
      { id: 993, subject: 'תאונת מלגזה במחסן דרום', date: '2026-07-08', type: T.SAFETY, unit: 'אגף לוגיסטיקה', classification: C.UNCLASSIFIED, publisher: 'אבי כהן',
        lessons: [lesson('הסמכה מחודשת למפעילי מלגזה', L.IN_PROGRESS, 2, 1), lesson('התקנת מראות בצמתים', L.NEW, 1, 0)] as never },
      { id: 992, subject: 'עיכוב במסירת פרויקט ללקוח', date: '2026-06-20', type: T.ORGANIZATIONAL, unit: 'חטיבת פרויקטים', classification: C.RESTRICTED, publisher: 'מיכל רוזן',
        lessons: [lesson('נוהל ניהול שינויי דרישות', L.IN_PROGRESS, 2, 0), lesson('פגישת סטטוס שבועית עם הלקוח', L.IMPLEMENTED, 1, 1)] as never },
      { id: 991, subject: 'תרגיל פינוי חירום – בניין מטה', date: '2026-06-02', type: T.SAFETY, unit: 'מנהלה ובטיחות', classification: C.UNCLASSIFIED, publisher: 'שירה אדלר',
        lessons: [lesson('סימון מחדש של דרכי מילוט', L.IN_PROGRESS, 2, 1)] as never },
      { id: 990, subject: 'פריצת אבטחה במערכת הדוא"ל', date: '2026-05-12', type: T.TECHNOLOGY, unit: 'סייבר ומערכות מידע', classification: C.SECRET, publisher: 'יוסי מזרחי',
        lessons: [lesson('הדרכת פישינג רבעונית לכל העובדים', L.IN_PROGRESS, 2, 1), lesson('הפעלת אימות דו-שלבי', L.IMPLEMENTED, 1, 1)] as never },
    ];

    // the example rows name their unit; turn each name into a row of the units table
    const unitRepo = this.ds.getRepository(Unit);
    const byName = new Map<string, Unit>();
    for (const r of rows as (Partial<Investigation> & { unit?: string })[]) {
      const name = r.unit;
      delete r.unit;
      if (!name) continue;
      if (!byName.has(name)) byName.set(name, (await unitRepo.findOneBy({ name })) ?? (await unitRepo.save(unitRepo.create({ name }))));
      r.units = [byName.get(name)!];
    }
    await repo.save(rows.map((r) => repo.create(r)));
    this.log.log(`Seeded ${rows.length} example investigations`);
  }
}
