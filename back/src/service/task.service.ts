
import { Repository } from 'typeorm/repository/Repository';
import { Task } from '../entity/task.entity';
import { User } from 'entity/user.entity';

export class TaskService {

  public constructor(
    private taskRepository: Repository<Task>,
    private userRepository: Repository<User>
  ) { }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({ relations: ['board', 'users'] });
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    console.log('RESPONSE', taskData)
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | null> {
    await this.taskRepository.update(id, taskData);
    return this.taskRepository.findOneBy({ id: id });
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
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

    console.log(task, user)

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

    console.log("usuario removido", task)
    return this.taskRepository.save(task);
  }

}