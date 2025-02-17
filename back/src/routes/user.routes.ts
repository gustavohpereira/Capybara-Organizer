// src/routes/user.routes.ts

import { User } from '../entity/user.entity';
import { Router } from 'express';
import appDataSource from '../data-source';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/userController';
import { Board } from '../entity/Board';
import { Task } from '../entity/task.entity';
import { TaskService } from '../service/task.service';
import { BoardService } from '../service/Board.service';

const userRepository = appDataSource.getRepository(User);
const boardRepository = appDataSource.getRepository(Board);
const boardService = new BoardService(boardRepository, userRepository);


const taskRepository = appDataSource.getRepository(Task);
const taskService = new TaskService(taskRepository, userRepository);


const userService = new UserService(userRepository, boardRepository);
const userController = new UserController(userService,taskService,boardService);
const userRoutes = Router();


userRoutes.get('/', async (req, res) => {
    await userController.getAllUsers(req, res);
});

userRoutes.get('/getUser', async (req, res) => {
    await userController.getUserById(req, res)
});

userRoutes.post('/', async (req, res) => {
    await userController.createUser(req, res);
});

userRoutes.put('/:id', async (req, res) => {
    await userController.updateUser(req, res)
});

userRoutes.delete('/:id', async (req, res) => {
    await userController.deleteUser(req, res)
});

export default userRoutes;