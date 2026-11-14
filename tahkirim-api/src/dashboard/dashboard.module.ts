import { Controller, Get, Injectable, Module, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TaskStatus } from '../common/enums';
import { Investigation } from '../entities/investigation.entity';
import { Lesson } from '../entities/lesson.entity';
import { Task } from '../entities/task.entity';
import { UNIT_JOIN_TABLE } from '../units/units.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

type Row = { key: string; count: number };
type RawRow = { key: string; count: string | number };

const MONTH = 'substr(CAST(i.date AS TEXT), 1, 7)'; // YYYY-MM, works on SQLite and Postgres

/**
 * Consecutive YYYY-MM months for the monthly series (the last 12 at most).
 * Starts at the `from` filter or the first month with data; ends at the `to` filter or this month.
 */
function monthRange(keys: string[], from?: string, to?: string): string[] {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const sorted = [...keys].sort();
  const start = from?.slice(0, 7) ?? sorted[0];
  if (!start) return [];
  const end = to?.slice(0, 7) ?? [sorted[sorted.length - 1] ?? thisMonth, thisMonth].sort()[1];
  let [y, m] = start.split('-').map(Number);
  const [ey, em] = end.split('-').map(Number);
  const out: string[] = [];
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return out.slice(-12);
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Investigation) private readonly investigations: Repository<Investigation>,
    @InjectRepository(Lesson) private readonly lessons: Repository<Lesson>,
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
  ) {}

  /** Restricts a query that has the investigation under alias `i` to the filtered investigations. */
  private scope<T extends object>(qb: SelectQueryBuilder<T>, f: DashboardQueryDto): SelectQueryBuilder<T> {
    if (f.unitId) {
      qb.andWhere(`EXISTS (SELECT 1 FROM "${UNIT_JOIN_TABLE}" iu WHERE iu."investigationId" = i.id AND iu."unitId" = :unitId)`, { unitId: f.unitId });
    }
    if (f.from) qb.andWhere('CAST(i.date AS TEXT) >= :from', { from: f.from });
    if (f.to) qb.andWhere('CAST(i.date AS TEXT) <= :to', { to: f.to });
    if (f.type) qb.andWhere('i.type = :type', { type: f.type });
    return qb;
  }

  /** filtered investigations (alias i) */
  private inv(f: DashboardQueryDto) {
    return this.scope(this.investigations.createQueryBuilder('i'), f);
  }
  /** lessons of the filtered investigations (aliases l, i) */
  private les(f: DashboardQueryDto) {
    return this.scope(this.lessons.createQueryBuilder('l').innerJoin('l.investigation', 'i'), f);
  }
  /** tasks of those lessons (aliases t, l, i) */
  private tsk(f: DashboardQueryDto) {
    return this.scope(this.tasks.createQueryBuilder('t').innerJoin('t.lesson', 'l').innerJoin('l.investigation', 'i'), f);
  }

  /** COUNT(*) grouped by `expr`, ordered by key, or by count (largest first) when byCount is set. */
  private async groupCount<T extends object>(qb: SelectQueryBuilder<T>, expr: string, byCount = false): Promise<Row[]> {
    qb.select(expr, 'key').addSelect('COUNT(*)', 'count').groupBy('key');
    if (byCount) qb.orderBy('count', 'DESC').addOrderBy('key', 'ASC');
    else qb.orderBy('key', 'ASC');
    const rows = await qb.getRawMany<RawRow>();
    return rows.map((r) => ({ key: r.key, count: Number(r.count) }));
  }

  async summary(f: DashboardQueryDto = {}) {
    const [investigations, lessons, tasks, lessonsInImplementation] = await Promise.all([
      this.inv(f).getCount(),
      this.les(f).getCount(),
      this.tsk(f).getCount(),
      this.les(f).andWhere('l.inImplementation = :impl', { impl: true }).getCount(), // sent with "ליישום"
    ]);
    const [byType, byMonth, lessonStatus, taskStatus, lessonsByMonth, tasksByMonth] = await Promise.all([
      this.groupCount(this.inv(f), 'i.type', true),
      this.groupCount(this.inv(f), MONTH),
      this.groupCount(this.les(f), 'l.status'),
      this.groupCount(this.tsk(f), 't.status'),
      // monthly series by the month of the investigation: its lessons, those lessons' tasks
      this.groupCount(this.les(f), MONTH),
      this.groupCount(this.tsk(f), MONTH),
    ]);
    const done = taskStatus.find((r) => r.key === TaskStatus.DONE)?.count ?? 0;

    const months = monthRange(byMonth.map((r) => r.key), f.from, f.to);
    const pick = (rows: Row[], m: string) => rows.find((r) => r.key === m)?.count ?? 0;
    const monthly = months.map((m) => ({
      month: m,
      investigations: pick(byMonth, m),
      lessons: pick(lessonsByMonth, m),
      tasks: pick(tasksByMonth, m),
    }));

    return {
      monthly,
      totals: {
        investigations,
        lessons,
        lessonsInImplementation,
        tasks,
        taskCompletionPct: tasks ? Math.round((done / tasks) * 100) : 0,
      },
      byType,
      byMonth,
      lessonStatus,
      taskStatus,
    };
  }
}

@ApiTags('dashboard – דשבורד')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  /** Totals and breakdowns for the dashboard page, optionally filtered by unit, type and date range */
  @Get()
  summary(@Query() query: DashboardQueryDto) {
    return this.service.summary(query);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Investigation, Lesson, Task])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
