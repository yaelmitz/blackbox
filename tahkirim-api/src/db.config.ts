import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { Investigation } from './entities/investigation.entity';
import { Lesson } from './entities/lesson.entity';
import { Recommendation } from './entities/recommendation.entity';
import { TaskParameter } from './entities/task-parameter.entity';
import { Task } from './entities/task.entity';
import { Unit } from './entities/unit.entity';

export const ENTITIES = [Investigation, Unit, Recommendation, Lesson, Task, TaskParameter, Attachment];

/**
 * DB_TYPE=postgres → PostgreSQL (DATABASE_URL, or PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE)
 * DB_TYPE=sqlite (default) → single-file SQLite through sql.js, nothing to install
 */
export function dbOptions(): TypeOrmModuleOptions {
  // Creates/updates tables from the entities. Fine for development; use migrations in production.
  const synchronize = (process.env.DB_SYNC ?? 'true') === 'true';

  if (process.env.DB_TYPE === 'postgres') {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL || undefined,
      host: process.env.PGHOST ?? 'localhost',
      port: Number(process.env.PGPORT ?? 5432),
      username: process.env.PGUSER ?? 'postgres',
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE ?? 'blackbox',
      entities: ENTITIES,
      synchronize,
    };
  }

  const file = resolve(process.env.DB_FILE ?? 'data/blackbox.sqlite');
  mkdirSync(dirname(file), { recursive: true });
  return { type: 'sqljs', location: file, autoSave: true, entities: ENTITIES, synchronize };
}
