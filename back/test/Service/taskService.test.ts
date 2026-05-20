import { TaskService } from '../../src/service/task.service';
import { Task } from '../../src/entity/task.entity';
import { User } from '../../src/entity/user.entity';

describe('TaskService', () => {
  let taskRepository: any;
  let userRepository: any;
  let taskService: TaskService;

  beforeEach(() => {
    jest.clearAllMocks();
    taskRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    userRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };
    taskService = new TaskService(taskRepository, userRepository);
  });

  describe('updateTask', () => {
    it('should update an existing task and return the saved task', async () => {
      const storedTask = { id: 1, title: 'Old title', description: 'Old description', createdAt: new Date(), state: 'todo', list_index: 0, users: [], board: { id: 1 } } as unknown as Task;
      const updatedTask = { ...storedTask, title: 'New title' } as unknown as Task;
      taskRepository.findOne.mockResolvedValue(storedTask);
      taskRepository.save.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(1, { title: 'New title' });

      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['users', 'board'] });
      expect(taskRepository.save).toHaveBeenCalledWith(expect.objectContaining({ title: 'New title' }));
      expect(result).toEqual(updatedTask);
    });

    it('should return null when the task does not exist', async () => {
      taskRepository.findOne.mockResolvedValue(null);

      const result = await taskService.updateTask(1, { title: 'New title' });

      expect(result).toBeNull();
      expect(taskRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('addUserToTask', () => {
    it('should add an existing user to an existing task', async () => {
      const task = { id: 1, title: 'Task', description: 'Desc', createdAt: new Date(), state: 'todo', list_index: 0, users: [] } as unknown as Task;
      const user = { id: 2, name: 'User', email: 'u@example.com', password: 'secret', createdAt: new Date(), role: 'user', tasks: [] } as unknown as User;
      taskRepository.findOne.mockResolvedValue(task);
      userRepository.findOne.mockResolvedValue(user);
      taskRepository.save.mockResolvedValue({ ...task, users: [user] });

      const result = await taskService.addUserToTask(1, 2);

      expect(result).toEqual({ ...task, users: [user] });
      expect(taskRepository.save).toHaveBeenCalledWith(task);
      expect(task.users).toEqual([user]);
    });

    it('should return null when the task does not exist', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue({ id: 2 } as unknown as User);

      const result = await taskService.addUserToTask(1, 2);

      expect(result).toBeNull();
      expect(taskRepository.save).not.toHaveBeenCalled();
    });

    it('should return null when the user does not exist', async () => {
      taskRepository.findOne.mockResolvedValue({ id: 1, title: 'Task', description: 'Desc', createdAt: new Date(), state: 'todo', list_index: 0, users: [] } as unknown as Task);
      userRepository.findOne.mockResolvedValue(null);

      const result = await taskService.addUserToTask(1, 2);

      expect(result).toBeNull();
      expect(taskRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteUserFromTask', () => {
    it('should remove a user from a task when both task and user exist', async () => {
      const task = { id: 1, title: 'Task', description: 'Desc', createdAt: new Date(), state: 'todo', list_index: 0, users: [{ id: 2 }, { id: 3 }] } as unknown as Task;
      taskRepository.findOne.mockResolvedValue(task);
      userRepository.findOneBy.mockResolvedValue({ id: 2 } as unknown as User);
      taskRepository.save.mockResolvedValue({ ...task, users: [{ id: 3 }] });

      const result = await taskService.deleteUserFromTask(1, 2);

      expect(result).toEqual({ ...task, users: [{ id: 3 }] });
      expect(taskRepository.save).toHaveBeenCalledWith(expect.objectContaining({ users: [{ id: 3 }] }));
    });

    it('should return null when the task does not exist', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      userRepository.findOneBy.mockResolvedValue({ id: 2 } as unknown as User);

      const result = await taskService.deleteUserFromTask(1, 2);

      expect(result).toBeNull();
      expect(taskRepository.save).not.toHaveBeenCalled();
    });

    it('should return null when the user does not exist', async () => {
      taskRepository.findOne.mockResolvedValue({ id: 1, title: 'Task', description: 'Desc', createdAt: new Date(), state: 'todo', list_index: 0, users: [{ id: 2 }] } as unknown as Task);
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await taskService.deleteUserFromTask(1, 2);

      expect(result).toBeNull();
      expect(taskRepository.save).not.toHaveBeenCalled();
    });
  });
});
