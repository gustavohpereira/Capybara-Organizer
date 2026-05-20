import { BoardService } from '../../src/service/Board.service';
import { Board } from '../../src/entity/Board';
import { User } from '../../src/entity/user.entity';

describe('BoardService', () => {
  let boardRepository: any;
  let userRepository: any;
  let boardService: BoardService;

  beforeEach(() => {
    jest.clearAllMocks();
    boardRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };
    userRepository = {
      findOneBy: jest.fn(),
    };
    boardService = new BoardService(boardRepository, userRepository);
  });

  describe('addMemberToBoard', () => {
    it('should add a member to the board when both board and user exist', async () => {
      const board = { id: 1, members: [] } as unknown as Board;
      const user = { id: 2, role: 'member' } as unknown as User;
      boardRepository.findOne.mockResolvedValue(board);
      userRepository.findOneBy.mockResolvedValue(user);
      boardRepository.save.mockResolvedValue({ ...board, members: [user] });

      const result = await boardService.addMemberToBoard(1, 2);

      expect(user.role).toBe('member');
      expect(board.members).toEqual([user]);
      expect(boardRepository.save).toHaveBeenCalledWith(board);
      expect(result).toEqual({ ...board, members: [user] });
    });

    it('should return undefined when the board does not exist', async () => {
      boardRepository.findOne.mockResolvedValue(null);
      userRepository.findOneBy.mockResolvedValue({ id: 2 } as unknown as User);

      const result = await boardService.addMemberToBoard(1, 2);

      expect(result).toBeUndefined();
      expect(boardRepository.save).not.toHaveBeenCalled();
    });

    it('should return undefined when the user does not exist', async () => {
      boardRepository.findOne.mockResolvedValue({ id: 1, title: 'Board', createdAt: new Date(), admin: null, tasks: [], members: [] } as unknown as Board);
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await boardService.addMemberToBoard(1, 2);

      expect(result).toBeUndefined();
      expect(boardRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('removeMemberFromBoard', () => {
    it('should remove the admin and set a new admin when there are other members', async () => {
      const adminUser = { id: 1 } as unknown as User;
      const memberUser = { id: 2 } as unknown as User;
      const board = { id: 1, title: 'Board', createdAt: new Date(), admin: adminUser, tasks: [], members: [adminUser, memberUser] } as unknown as Board;
      boardRepository.findOne.mockResolvedValue(board);
      userRepository.findOneBy.mockResolvedValue(adminUser);
      boardRepository.save.mockResolvedValue({ ...board, members: [memberUser], admin: memberUser });

      const result = await boardService.removeMemberFromBoard(1, 1);

      expect(result).toEqual({ ...board, members: [memberUser], admin: memberUser });
      expect(boardRepository.save).toHaveBeenCalledWith(board);
      expect(board.admin).toEqual(memberUser);
      expect(board.members).toEqual([memberUser]);
    });

    it('should remove a non-admin member without changing the admin', async () => {
      const adminUser = { id: 1 } as unknown as User;
      const memberUser = { id: 2 } as unknown as User;
      const board = { id: 1, title: 'Board', createdAt: new Date(), admin: adminUser, tasks: [], members: [adminUser, memberUser] } as unknown as Board;
      boardRepository.findOne.mockResolvedValue(board);
      userRepository.findOneBy.mockResolvedValue(memberUser);
      boardRepository.save.mockResolvedValue({ ...board, members: [adminUser] });

      const result = await boardService.removeMemberFromBoard(1, 2);

      expect(result).toEqual({ ...board, members: [adminUser] });
      expect(boardRepository.save).toHaveBeenCalledWith(board);
      expect(board.admin).toEqual(adminUser);
      expect(board.members).toEqual([adminUser]);
    });

    it('should return undefined when the board does not exist', async () => {
      boardRepository.findOne.mockResolvedValue(null);
      userRepository.findOneBy.mockResolvedValue({ id: 2 } as unknown as User);

      const result = await boardService.removeMemberFromBoard(1, 2);

      expect(result).toBeUndefined();
      expect(boardRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteUserFromAllBoardTasks', () => {
    it('should remove the user from all tasks in a board and save the tasks inside a transaction', async () => {
      const user = { id: 1 } as unknown as User;
      const task = { id: 1, users: [{ id: 1 }, { id: 2 }] } as any;
      const board = { id: 1, title: 'Board', createdAt: new Date(), admin: null, tasks: [task], members: [] } as unknown as Board;
      userRepository.findOneBy.mockResolvedValue(user);
      boardRepository.findOne.mockResolvedValue(board);

      const saveMock = jest.fn().mockResolvedValue({ ...task, users: [{ id: 2 }] });
      boardRepository.manager.transaction.mockImplementation(async (cb: any) => await cb({ save: saveMock }));

      await boardService.deleteUserFromAllBoardTasks(1, 1);

      expect(saveMock).toHaveBeenCalledWith({ id: 1, users: [{ id: 2 }] });
      expect(boardRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should return early when the user does not exist', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await boardService.deleteUserFromAllBoardTasks(1, 1);

      expect(boardRepository.findOne).not.toHaveBeenCalled();
      expect(boardRepository.manager.transaction).not.toHaveBeenCalled();
    });
  });
});
