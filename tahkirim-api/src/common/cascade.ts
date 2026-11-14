import { EntityManager, In } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { Recommendation } from '../entities/recommendation.entity';
import { TaskParameter } from '../entities/task-parameter.entity';
import { Task } from '../entities/task.entity';

/*
 * Explicit cascade deletes. The schema also declares ON DELETE CASCADE, but the
 * file-based SQLite driver (sql.js) resets foreign-key enforcement every time it
 * saves the file, so the database cannot be trusted to cascade on its own.
 * Doing it here works the same on SQLite and Postgres.
 */

export async function deleteTasksCascade(m: EntityManager, taskIds: number[]) {
  if (!taskIds.length) return;
  await m.delete(TaskParameter, { taskId: In(taskIds) });
  await m.delete(Task, { id: In(taskIds) });
}

export async function deleteLessonsCascade(m: EntityManager, lessonIds: number[]) {
  if (!lessonIds.length) return;
  const taskIds = (await m.find(Task, { select: { id: true }, where: { lessonId: In(lessonIds) } })).map((t) => t.id);
  await deleteTasksCascade(m, taskIds);
  // recommendations that were sent as these lessons go back to "not sent"
  await m.update(Recommendation, { lessonId: In(lessonIds) }, { lessonId: null });
  await m.delete(Lesson, { id: In(lessonIds) });
}
