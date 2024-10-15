
import { Repository } from 'typeorm/repository/Repository';
import { Task } from '../entity/task.entity';

export class TaskService {

    public constructor(
        private taskRepository : Repository<Task>
    ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find({relations: ['board']});
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    console.log('RESPONSE', taskData)
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | null>  {
    await this.taskRepository.update(id, taskData);
    return this.taskRepository.findOneBy({id:id});
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}