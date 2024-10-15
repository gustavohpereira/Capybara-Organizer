import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Board } from './Board';

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
  
  @ManyToMany(() => Board, (board) => board.members)
  boards!: Board[];

  @Column()
  role!: string;
}