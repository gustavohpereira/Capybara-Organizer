import { TaskController } from '../controller/task.controller';
import appDataSource from '../data-source';
import { Task } from '../entity/task.entity';
import { Router } from 'express';
import { TaskService } from '../service/task.service';
import { User } from '../entity/user.entity';


const taskRouter = Router();
const service = new TaskService(
    appDataSource.getRepository(Task),
    appDataSource.getRepository(User)
);
const taskController = new TaskController(service);

taskRouter.get('/', async (req, res) => {
    await taskController.getAllTasks(req, res)
});
taskRouter.post('/', async (req, res) => {
    await taskController.createTask(req, res)
});
taskRouter.put('/:id', async (req, res) => {
    await taskController.updateTask(req, res)
});
taskRouter.delete('/:id', async (req, res) => {
    await taskController.deleteTask(req, res)
});

taskRouter.post('/addMember', async (req, res) => {
    await taskController.addMemberToTask(req, res)
});

taskRouter.delete('/member/remove', async (req, res) => {
    await taskController.removeMemberFromTask(req, res);
});

export default taskRouter;