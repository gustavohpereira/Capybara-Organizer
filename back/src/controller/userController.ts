import { Request, Response } from 'express';
import { UserService } from 'service/user.service';



export class UserController {

  public constructor(
    private readonly userService: UserService
){}
  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.json(users);
  }

  async getUserById(req: Request, res: Response) {
    const user = await this.userService.getUserById(Number(req.params.id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
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
      res.status(404).json({ message: 'User not found' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    await this.userService.deleteUser(Number(req.params.id));
    res.status(204).send();
  }
}