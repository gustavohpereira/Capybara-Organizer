import { UserService } from '../../src/service/user.service';
import { User } from '../../src/entity/user.entity';
import { Board } from '../../src/entity/Board';
import { Repository } from 'typeorm/repository/Repository';

const bcrypt = require('bcrypt');

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UserService', () => {
  let userRepository: jest.Mocked<Repository<User>>;
  let boardRepository: jest.Mocked<Repository<Board>>;
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();

    userRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    boardRepository = {
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Board>>;

    userService = new UserService(userRepository, boardRepository);
  });

  describe('getAllUsers', () => {
    it('should return all users with relations and selected fields', async () => {
      const users: User[] = [{ id: 1, name: 'User', email: 'u@example.com', role: 'user', createdAt: new Date(), password: 'secret' } as User];
      userRepository.find.mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(userRepository.find).toHaveBeenCalledWith({
        relations: ['boards', 'tasks'],
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true,
        },
      });
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return user without password when found', async () => {
      const user = {
        id: 1,
        name: 'User',
        email: 'u@example.com',
        password: 'secret',
        createdAt: new Date(),
        role: 'user',
        adminBoards: [],
        boards: [],
        tasks: [],
      } as User;
      userRepository.findOne.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(result).toEqual({
        id: 1,
        name: 'User',
        email: 'u@example.com',
        createdAt: user.createdAt,
        role: 'user',
        adminBoards: [],
        boards: [],
        tasks: [],
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['boards', 'tasks'] });
    });

    it('should return null when user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(result).toBeNull();
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 }, relations: ['boards', 'tasks'] });
    });
  });

  describe('createUser', () => {
    it('should hash the password and save the new user', async () => {
      const userData = { email: 'u@example.com', password: 'password', name: 'User' } as Partial<User>;
      const createdUser = {
        ...userData,
        id: 1,
        password: 'hashedPassword',
        createdAt: new Date(),
        role: 'user',
        adminBoards: [],
        boards: [],
        tasks: [],
      } as User;
      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
      expect(userRepository.create).toHaveBeenCalledWith({ ...userData, password: 'hashedPassword' });
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should hash the password when provided and update the user', async () => {
      const updatedUser = { id: 1, name: 'User', email: 'u@example.com', password: 'hashedPassword' } as User;
      userRepository.findOneBy.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, { password: 'newPassword' });

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 'salt');
      expect(userRepository.update).toHaveBeenCalledWith(1, { password: 'hashedPassword' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(updatedUser);
    });

    it('should update the user without hashing when password is not provided', async () => {
      const updatedUser = {
        id: 1,
        name: 'New Name',
        email: 'u@example.com',
        password: 'secret',
        createdAt: new Date(),
        role: 'user',
        adminBoards: [],
        boards: [],
        tasks: [],
      } as User;
      userRepository.findOneBy.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, { name: 'New Name' });

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.update).toHaveBeenCalledWith(1, { name: 'New Name' });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should throw when user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(userService.deleteUser(999)).rejects.toThrow('Usuário com ID 999 não encontrado.');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['adminBoards', 'boards', 'boards.members'],
      });
    });

    it('should remove admin rights and delete the user when user exists', async () => {
      const user = {
        id: 1,
        adminBoards: [
          { id: 10, members: [{ id: 1 }, { id: 2 }], admin: { id: 1 } },
        ],
        boards: [
          { id: 20, members: [{ id: 1 }, { id: 2 }] },
        ],
      } as User;

      userRepository.findOne.mockResolvedValue(user);
      boardRepository.save.mockResolvedValue({} as Board);

      await userService.deleteUser(1);

      expect(boardRepository.save).toHaveBeenCalledTimes(2);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('removeAdminFromBoard', () => {
    it('should reassign admin when the admin user is removed from a board with other members', async () => {
      const admin = { id: 1 } as unknown as User;
      const member = { id: 2 } as unknown as User;
      const board = { id: 10, title: 'Board', createdAt: new Date(), admin, tasks: [], members: [admin, member] } as unknown as Board;
      const user = { id: 1, adminBoards: [board] } as unknown as User;

      await userService.removeAdminFromBoard(user);

      expect(board.admin).toEqual(member);
      expect(board.members).toEqual([member]);
      expect(boardRepository.save).toHaveBeenCalledWith(board);
    });

    it('should set admin to null when the removed admin had no other members', async () => {
      const admin = { id: 1 } as unknown as User;
      const board = { id: 10, title: 'Board', createdAt: new Date(), admin, tasks: [], members: [admin] } as unknown as Board;
      const user = { id: 1, adminBoards: [board] } as unknown as User;

      await userService.removeAdminFromBoard(user);

      expect(board.admin).toBeNull();
      expect(board.members).toEqual([]);
      expect(boardRepository.save).toHaveBeenCalledWith(board);
    });
  });

  describe('removeUserFromBoardMembers', () => {
    it('should remove the user from all boards where they are a member', async () => {
      const user = {
        id: 1,
        boards: [
          { id: 20, members: [{ id: 1 }, { id: 2 }] },
        ],
      } as User;

      await userService.removeUserFromBoardMembers(user);

      expect(boardRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        id: 20,
        members: [{ id: 2 }],
      }));
    });
  });
});
