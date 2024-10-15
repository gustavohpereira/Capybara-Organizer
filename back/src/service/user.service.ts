import { Repository } from 'typeorm/repository/Repository';

import bcrypt from 'bcrypt';
import { User } from 'entity/user.entity';

export class UserService {

    public constructor(
        private userRepository : Repository<User>
    ) {}
    

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id: id });
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
        await this.userRepository.delete(id);
    }

}