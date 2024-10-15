import { Request, Response } from 'express';
import { TaskService } from 'service/task.service';

export class TaskController {
    public constructor(
        private readonly taskService: TaskService
    ) {}
  async getAllTasks(req: Request, res: Response) {
    const tasks = await this.taskService.getAllTasks();
    res.json(tasks);
  }

  async createTask(req: Request, res: Response) {
    console.log("response", req.body)
    const task = await this.taskService.createTask(req.body);
    res.status(201).json(task);
  }

  async updateTask(req: Request, res: Response) {
    console.log("atualizando", req.body)
    const task = await this.taskService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  }

  async deleteTask(req: Request, res: Response) {
    await this.taskService.deleteTask(Number(req.params.id));
    res.status(204).send();
  }
}