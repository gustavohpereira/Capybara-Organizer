import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Board } from './Board';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({enum: ['todo', 'doing', 'done'], default: 'todo'})
  state!: string;

  @ManyToOne(() => Board, (board) => board.tasks, { onDelete: 'CASCADE' })
  board!: Board;

  @Column( { default: 0 } )
  list_index!: number
}