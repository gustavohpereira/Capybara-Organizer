import { Request, Response } from 'express';
import { TaskService } from '../service/task.service';
import { io } from '../app'; // Adjust the path if your io export is in a different file

export class TaskController {
  public constructor(
    private readonly taskService: TaskService
  ) { }
  async getAllTasks(req: Request, res: Response) {
    const tasks = await this.taskService.getAllTasks();
    res.json(tasks);
  }

  async createTask(req: Request, res: Response) {
    const task = await this.taskService.createTask(req.body);

    // 🔄 Emitir evento via WebSocket para os usuários do board
    io.to(String(task.board.id)).emit('task_created', task);

    res.status(201).json(task);
  }

  async updateTask(req: Request, res: Response) {
    const task = await this.taskService.updateTask(Number(req.params.id), req.body);

    if(task){
      io.to(String(task.board.id)).emit('task_updated', task);
    }

    res.json(task);
  }

  async deleteTask(req: Request, res: Response) {

    await this.taskService.deleteTask(Number(req.params.id));
    // 🔄 Emitir evento via WebSocket para os usuários do board
    io.to(String(req.body.boardId)).emit('task_deleted', { id: req.params.id });

    res.status(204).send();
  }

  async addMemberToTask(req: Request, res: Response) {
    const task = await this.taskService.addUserToTask(req.body.taskId, req.body.userId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task or user not found' });
    }
  }

  async removeMemberFromTask(req: Request, res: Response) {
    const task = await this.taskService.deleteUserFromTask(req.body.taskId, req.body.userId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task or user not found' });
    }
  }
}
