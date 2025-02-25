import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Board } from '../entity/Board';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // Boards em que o usuário é administrador
  @OneToMany(() => Board, (board) => board.admin)
  adminBoards!: Board[]; 
  
  // Boards em que o usuário é membro
  @ManyToMany(() => Board, (board) => board.members)
  boards!: Board[];

  // Tasks associadas ao usuário
  @ManyToMany(() => Task, (task) => task.users)
  tasks!: Task[];
  
  @Column({ default: "user", update: false })
  role!: string;
  
}
