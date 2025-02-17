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

  // Usuário administrador da board
  @ManyToOne(() => User, (user) => user.adminBoards, { nullable: true })
  admin!: User | null;

  // Tasks associadas à board
  @OneToMany(() => Task, (task) => task.board)
  tasks!: Task[];

  // Membros da board
  @ManyToMany(() => User, (user) => user.boards)
  @JoinTable()
  members!: User[];
}
