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
            relations: ['tasks', 'admin', 'members'],
            order: { createdAt: 'ASC' },
            select: {
                admin: {
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
        return this.boardRepository.findOne({
            relations: ['tasks', 'tasks.users', 'admin', 'members'],
            where: { id: id }
        });
    }

    async createBoard(boardData: Partial<Board>, user: Omit<User, 'password'>): Promise<Board> {
        const board = this.boardRepository.create({ ...boardData, admin: user });
        return this.boardRepository.save(board);
    }

    async updateBoard(id: number, boardData: Partial<Board>): Promise<Board | null> {
        console.log("update board", id, boardData);
        await this.boardRepository.update(id, boardData);
        return this.boardRepository.findOne({ relations: ['tasks', 'members'], where: { id: id } });
    }

    async deleteBoard(id: number): Promise<void> {
        console.log(id)
        await this.boardRepository.delete(id);
    }
    async addMemberToBoard(boardId: number, userId: number): Promise<Board | undefined> {
        const board = await this.boardRepository.findOne({ relations: ['members'], where: { id: boardId } });
        const user = await this.userRepository.findOneBy({ id: userId });

        if (board && user) {
            user.role = 'member';
            board.members.push(user);
            return this.boardRepository.save(board);
        }

        return undefined;
    }

    async removeMemberFromBoard(boardId: number, userId: number): Promise<Board | undefined> {
        const board = await this.boardRepository.findOne({ relations: ['members', 'admin'], where: { id: boardId } });
        const user = await this.userRepository.findOneBy({ id: userId });
        if (board && user) {
            if (board.admin && user.id == board.admin.id && board.members.length > 1) {
                board.members = board.members.filter(member => member.id !== user.id);
                const newAdmin = board.members[0];
                board.admin = newAdmin;
            } else {
                board.members = board.members.filter(member => member.id !== user.id);
            }
            return this.boardRepository.save(board);
        }

        return undefined;
    }

    async deleteUserFromAllBoardTasks(userId: number, boardId:number): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            return;
        }

        const board = await this.boardRepository.findOne({
            where: { id: boardId },
            relations: ['tasks', 'tasks.users'],
        });
        
        if (board && board.tasks.length > 0) {
            await this.boardRepository.manager.transaction(async transactionalEntityManager => {
                for (const task of board.tasks) {
                    task.users = task.users.filter(u => u.id !== userId);
                    await transactionalEntityManager.save(task);
                }
            });
        }


    }
}