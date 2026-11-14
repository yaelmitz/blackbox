import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../common/enums';
import { Lesson } from './lesson.entity';
import { TaskParameter } from './task-parameter.entity';

/** משימה – linked to a lesson */
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  /** שם */
  @Column()
  name!: string;

  /** סטטוס (the spec asks for a status per task) */
  @Column({ type: 'simple-enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status!: TaskStatus;

  @Column('integer')
  lessonId!: number;

  @ManyToOne(() => Lesson, (l) => l.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson!: Lesson;

  /** פרמטרים – each linked to this task */
  @OneToMany(() => TaskParameter, (p) => p.task, { cascade: true })
  parameters!: TaskParameter[];
}
