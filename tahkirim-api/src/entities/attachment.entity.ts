import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** A file uploaded for a "text or file" field (מיקום, נ"צ, מקורות מידע). */
@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  originalName!: string;

  @Column()
  mimeType!: string;

  @Column('integer')
  size!: number;

  /** File name on disk inside the uploads folder. */
  @Column()
  storedName!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
