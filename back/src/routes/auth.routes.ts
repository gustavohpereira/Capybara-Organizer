// src/routes/auth.routes.ts
import { AuthController } from '../controller/auth.controller';
import appDataSource from '../data-source';
import { User } from '../entity/user.entity';
import { Router } from 'express';
import { UserService } from '../service/user.service';

const router = Router();

const userService = new UserService(appDataSource.getRepository(User));
const authController = new AuthController(userService);

router.post('/login', async (req, res) => {
    await authController.login(req,res)
});

export default router;