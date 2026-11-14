import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LessonStatus } from '../common/enums';
import { Investigation } from './investigation.entity';
import { Task } from './task.entity';

/** לקח – linked to an investigation */
@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  /** שם */
  @Column()
  name!: string;

  /** הערות */
  @Column('text', { default: '' })
  notes!: string;

  /** סטטוס */
  @Column({ type: 'simple-enum', enum: LessonStatus, default: LessonStatus.NEW })
  status!: LessonStatus;

  /** משאבים */
  @Column('text', { default: '' })
  resources!: string;

  /**
   * הועבר ליישום – set by the "ליישום" button (POST /lessons/:id/implement).
   * Only lessons with this flag appear in lessons management.
   */
  @Column({ default: false })
  inImplementation!: boolean;

  @Column('integer')
  investigationId!: number;

  @ManyToOne(() => Investigation, (i) => i.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investigationId' })
  investigation!: Investigation;

  /** משימות – each linked to this lesson */
  @OneToMany(() => Task, (t) => t.lesson, { cascade: true })
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
