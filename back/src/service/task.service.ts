
import { Repository } from 'typeorm/repository/Repository';
import { Task } from '../entity/task.entity';
import { User } from 'entity/user.entity';
import appDataSource from '../data-source';

export class TaskService {

  public constructor(
    private taskRepository: Repository<Task>,
    private userRepository: Repository<User>
  ) { }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['board', 'users'] });
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | null> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['users', 'board'] });
    if (!task) {
      return null;
    }
    Object.assign(task, taskData);
    return this.taskRepository.save(task);
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }

  async getTaskById(id: number): Promise<Task | null> {
    return this.taskRepository.findOne({ where: { id }, relations: ['board'] });
  }

  async addUserToTask(taskId: number, userId: number): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['users'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['tasks'] });

    if (!task) {
      return null;
    }
    if (!user) {
      return null;
    }


    task.users.push(user);
    return this.taskRepository.save(task);
  }


  async deleteUserFromTask(taskId: number, userId: number): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['users'],
    });
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!task) {
      return null;
    }
    if (!user) {
      return null;
    }
    task.users = task.users.filter((user) => user.id !== userId);

    return this.taskRepository.save(task);
  }

}
