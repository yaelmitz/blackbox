import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

/** פרמטר – linked to a task */
@Entity('task_parameters')
export class TaskParameter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text', { default: '' })
  value!: string;

  @Column('integer')
  taskId!: number;

  @ManyToOne(() => Task, (t) => t.parameters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task!: Task;
}
