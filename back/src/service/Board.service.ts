import { Board } from 'entity/Board';
import { User } from 'entity/user.entity';
import { getRepository } from 'typeorm';
import { Repository } from "typeorm/repository/Repository"


type UserWithoutPassword = Omit<User, 'password'>;
export class BoardService {

    public constructor(
        private readonly boardRepository: Repository<Board>
        , private readonly userRepository: Repository<User>
    ) { }




    async getAllBoards(): Promise<Board[]> {
        return this.boardRepository.find({
            relations: ['tasks', 'user', 'members'],
            order: { createdAt: 'ASC' },
            select: {
                user: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    role: true,
                },
                members: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    role: true,
                },
            },
        });
    }
    async getBoardById(id: number): Promise<Board | null> {
        return this.boardRepository.findOne({ relations: ['tasks', 'user', 'members'], where: { id: id } });
    }

    async createBoard(boardData: Partial<Board>, user: Omit<User, 'password'>): Promise<Board> {
        const board = this.boardRepository.create({ ...boardData, user });
        return this.boardRepository.save(board);
    }

    async updateBoard(id: number, boardData: Partial<Board>): Promise<Board | null> {
        await this.boardRepository.update(id, boardData);
        return this.boardRepository.findOne({ relations: ['tasks', 'user', 'members'], where: { id: id } });
    }

    async deleteBoard(id: number): Promise<void> {
        await this.boardRepository.delete(id);
    }
    async addMemberToBoard(boardId: number, userId: number): Promise<Board | undefined> {
        const board = await this.boardRepository.findOne({ relations: ['members'], where: { id: boardId } });
        const user = await this.userRepository.findOneBy({ id: userId });

        if (board && user) {
            board.members.push(user);
            return this.boardRepository.save(board);
        }

        return undefined;
    }

    async removeMemberFromBoard(boardId: number, userId: number): Promise<Board | undefined> {
        const board = await this.boardRepository.findOne({ relations: ['members'], where: { id: boardId } });
        const user = await this.userRepository.findOneBy({ id: userId });

        if (board && user) {
            board.members = board.members.filter(member => member.id !== user.id);
            return this.boardRepository.save(board);
        }

        return undefined;
    }
}