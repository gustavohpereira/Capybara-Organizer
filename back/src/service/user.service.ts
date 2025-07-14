import { Repository } from 'typeorm/repository/Repository';

import bcrypt from 'bcrypt';
import { User } from 'entity/user.entity';
import { Board } from 'entity/Board';
import { Task } from 'entity/task.entity';

export class UserService {

  public constructor(
    private userRepository: Repository<User>,
    private boardRepository: Repository<Board>,
  ) { }


  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['boards', 'tasks'],
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true
      },
    });
  }

  async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { id: id }, relations: ['boards', 'tasks'] });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: email }, relations: ['boards', 'tasks'] });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password!, salt);

    const user = this.userRepository.create({ ...userData, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    await this.userRepository.update(id, userData);
    return this.userRepository.findOneBy({ id: id });
  }

  async deleteUser(id: number): Promise<void> {
    // Carregar o usuário com os relacionamentos necessários
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['adminBoards', 'boards', 'boards.members'], // Relacionamentos relevantes
    });

    if (!user) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }

    console.log('Excluindo usuário:', user);


    await this.removeAdminFromBoard(user);
    await this.removeUserFromBoardMembers(user)
 
    await this.userRepository.delete(id);
  }


  async removeAdminFromBoard(user: User) {
    try {
      if (user.adminBoards.length > 0) {
        for (const board of user.adminBoards) {
          console.log(`Limpando admin da board ${board}`);

          if (board.members && board.members.length > 0) {
            board.members = board.members.filter((member) => member.id !== user.id);
            board.admin = board.members[0];
          }
          else {
            board.admin = null;
          }

          await this.boardRepository.save(board);
        }
      }
    }
    catch (error: any) {
      console.error(`Erro ao excluir hete ${user.id}:`, error.message);
    }
  }


  async removeUserFromBoardMembers(user: User) {
    try {
      if (user.boards.length > 0) {
        for (const board of user.boards) {
          board.members = board.members.filter((member) => member.id !== user.id);

          console.log(`Removendo usuário ${user.id} da board ${board.id}`);
          await this.boardRepository.save(board);
        }
      }
    }
    catch (error: any) {
      console.error(`Erro ao excluir hete ${user.id}:`, error.message);
    }

  }

}