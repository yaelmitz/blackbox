import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Investigation } from './investigation.entity';

/** מסגרת – an organisational unit. Linked to investigations many-to-many. */
@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn()
  id!: number;

  /** שם המסגרת (unique) */
  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Investigation, (i) => i.units)
  investigations!: Investigation[];
}
