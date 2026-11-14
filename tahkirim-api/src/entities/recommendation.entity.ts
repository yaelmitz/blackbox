import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Investigation } from './investigation.entity';
import { Lesson } from './lesson.entity';

/** המלצה – linked to an investigation */
@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  text!: string;

  /** Display order inside the investigation */
  @Column('integer', { default: 0 })
  position!: number;

  @Column('integer')
  investigationId!: number;

  @ManyToOne(() => Investigation, (i) => i.recommendations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'investigationId' })
  investigation!: Investigation;

  /**
   * The lesson this recommendation became when "ליישום" was clicked (POST /recommendations/:id/implement).
   * null = not sent yet. Deleting that lesson clears it, so the recommendation can be sent again.
   */
  @Column('integer', { nullable: true })
  lessonId!: number | null;

  @ManyToOne(() => Lesson, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'lessonId' })
  lesson?: Lesson | null;
}
