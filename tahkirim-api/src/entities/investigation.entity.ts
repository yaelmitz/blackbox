import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Classification, InvestigationType } from '../common/enums';
import { Attachment } from './attachment.entity';
import { Lesson } from './lesson.entity';
import { Recommendation } from './recommendation.entity';
import { Unit } from './unit.entity';

/** תחקיר */
@Entity('investigations')
export class Investigation {
  /** מספר מזהה – chosen by the user, not auto-generated */
  @PrimaryColumn('integer')
  id!: number;

  /** נושא */
  @Column()
  subject!: string;

  /** תאריך (YYYY-MM-DD) */
  @Column('date')
  date!: string;

  /** סוג */
  @Column({ type: 'simple-enum', enum: InvestigationType })
  type!: InvestigationType;

  /** סיווג */
  @Column({ type: 'simple-enum', enum: Classification })
  classification!: Classification;

  /** מסגרות – many-to-many through the investigation_units join table */
  @ManyToMany(() => Unit, (u) => u.investigations)
  @JoinTable({
    name: 'investigation_units',
    joinColumn: { name: 'investigationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'unitId', referencedColumnName: 'id' },
  })
  units!: Unit[];

  /**
   * @deprecated The old free-text "unit" column. Kept only so existing rows can be moved into the
   * units table on startup (see UnitMigrationService); it is emptied afterwards and never returned by the API.
   */
  @Column({ name: 'unit', type: 'varchar', nullable: true, select: false })
  legacyUnit!: string | null;

  /** מפרסם */
  @Column()
  publisher!: string;

  /** רקע */
  @Column('text', { default: '' })
  background!: string;

  /** שאלות */
  @Column('text', { default: '' })
  questions!: string;

  /** מיקום – text or file */
  @Column('text', { nullable: true })
  locationText!: string | null;

  @ManyToOne(() => Attachment, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'locationFileId' })
  locationFile!: Attachment | null;

  /** נ"צ – text or file */
  @Column('text', { nullable: true })
  coordinatesText!: string | null;

  @ManyToOne(() => Attachment, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'coordinatesFileId' })
  coordinatesFile!: Attachment | null;

  /** מה קרה – rich text (HTML) */
  @Column('text', { default: '' })
  whatHappened!: string;

  /** מה תוכנן – rich text (HTML) */
  @Column('text', { default: '' })
  whatPlanned!: string;

  /** מסקנות – rich text (HTML) */
  @Column('text', { default: '' })
  conclusions!: string;

  /** מקורות מידע – text or file */
  @Column('text', { nullable: true })
  sourcesText!: string | null;

  @ManyToOne(() => Attachment, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sourcesFileId' })
  sourcesFile!: Attachment | null;

  /** בעלי התפקידים */
  @Column('text', { default: '' })
  roles!: string;

  /** המלצות – each linked to this investigation */
  @OneToMany(() => Recommendation, (r) => r.investigation, { cascade: true })
  recommendations!: Recommendation[];

  /** לקחים – each linked to this investigation */
  @OneToMany(() => Lesson, (l) => l.investigation, { cascade: true })
  lessons!: Lesson[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
