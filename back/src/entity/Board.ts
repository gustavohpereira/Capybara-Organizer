// src/entities/board.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.boards)
  user!: User;

  @OneToMany(() => Task, (task) => task.board)
  tasks!: Task[];
  
  @ManyToMany(() => User)
  @JoinTable()
  members!: User[];
}