// src/controller/userController.ts

import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import jwt, { JwtPayload } from 'jsonwebtoken';  // Importa o jsonwebtoken
import { TaskService } from 'service/task.service';
import { BoardService } from 'service/Board.service';
import { User } from 'entity/user.entity';


interface CustomJwtPayload extends JwtPayload {
  userId: number;
}

export class UserController {
  public constructor(private readonly userService: UserService, private readonly taskService: TaskService, private readonly boardService: BoardService) { }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.json(users);
  }

  // Modifica o getUserById para pegar o usuário pelo JWT
  async getUserById(req: Request, res: Response) {
    try {
      // Extrai o token JWT do header de autorização
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];



      if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
      }

      // Decodifica o token JWT
      const secret = process.env.JWT_SECRET

      if (secret === undefined) {
        throw new Error('JWT_SECRET not defined');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;

      // Verifica se o token decodificado contém a propriedade userId
      if (!decoded.userId) {
        return res.status(403).json({ message: 'Token inválido: ID de usuário não encontrado' });
      }

      const user = await this.userService.getUserById(decoded?.userId);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
    } catch (error: any) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const { userEmail } = req.params;
      if (!userEmail) {
        return res.status(400).json({ message: 'Email não fornecido' });
      }

      const user = await this.userService.getUserByEmail(userEmail);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: 'Erro ao buscar usuário por email' });
    }
  }

  async createUser(req: Request, res: Response) {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  }

  async updateUser(req: Request, res: Response) {
    const user = await this.userService.updateUser(Number(req.params.id), req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const userId = Number(req.params.id);

    // Verificar se o usuário existe
    const user = await this.userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }


    try {
      this.removeUserFromTask(user);

      // Deletar o usuário
      await this.userService.deleteUser(userId);
      res.status(204).send();
    } catch (error: any) {
      console.error(`Erro ao excluir usuário ${userId}:`, error.message);
      res.status(500).json({ message: 'Erro interno ao tentar excluir o usuário.' });
    }
  }



  async removeUserFromTask(user: Omit<User, "password">) {
    try {
      // Remover o usuário das tasks
      if (user.tasks.length > 0) {
        await Promise.all(
          user.tasks.map(async (task) => {
            await this.taskService.deleteUserFromTask(task.id, user.id);
          })
        );
      }
    }
    catch (error: any) {
      console.error(`Erro ao excluir hete ${user.id}:`, error.message);

    }
  }
}
