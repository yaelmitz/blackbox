import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LessonStatus } from '../common/enums';
import { Lesson } from '../entities/lesson.entity';
import { Task } from '../entities/task.entity';

/**
 * One-time data migration for the "ליישום" flag (lesson.inImplementation).
 * Before the flag existed every lesson appeared in lessons management. Lessons that were already
 * being worked on there – status other than NEW, or with tasks – are marked as sent, so they stay.
 * Runs only while no lesson has the flag yet; after that, only the "ליישום" button sets it.
 */
@Injectable()
export class ImplementationMigrationService implements OnApplicationBootstrap {
  private readonly log = new Logger('ImplementationMigration');
  constructor(private readonly ds: DataSource) {}

  async onApplicationBootstrap() {
    const repo = this.ds.getRepository(Lesson);
    if ((await repo.count()) === 0 || (await repo.existsBy({ inImplementation: true }))) return;

    const withTasks = await this.ds
      .getRepository(Task)
      .createQueryBuilder('t')
      .select('DISTINCT t.lessonId', 'lessonId')
      .getRawMany<{ lessonId: number }>();
    const ids = new Set(withTasks.map((r) => Number(r.lessonId)));
    const all = await repo.find({ select: { id: true, status: true } });
    const sent = all.filter((l) => l.status !== LessonStatus.NEW || ids.has(l.id)).map((l) => l.id);
    if (!sent.length) return;

    await repo.createQueryBuilder().update().set({ inImplementation: true }).whereInIds(sent).execute();
    this.log.log(`Marked ${sent.length} existing lessons as sent to implementation`);
  }
}
