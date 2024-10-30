import { Repository } from 'typeorm/repository/Repository';

import bcrypt from 'bcrypt';
import { User } from 'entity/user.entity';
import { Board } from 'entity/Board';

export class UserService {

    public constructor(
        private userRepository: Repository<User>,
        private boardRepository: Repository<Board>
    ) { }


    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find({
            relations: ['boards'],
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
        const user = await this.userRepository.findOneBy({ id: id });
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email: email });
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
        // Carregar o usuário com suas boards e os membros
        const user = await this.userRepository.findOne({
            where: { id: id },
            relations: ['boards', 'boards.members'] // Carregar membros das boards
        });

        if (user) {
            // Remover o usuário das boards
            user.boards.forEach(board => {
                board.members = board.members.filter(member => member.id !== id);
            });

            // Salvar as mudanças nas boards
            await this.boardRepository.save(user.boards);

            // Agora você pode excluir o usuário
            await this.userRepository.delete(id);
        }
    }
}