import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from 'service/user.service';

export class AuthController {

    public constructor(
        private readonly userService: UserService
    ) {}
    
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '8h',
    });
    
    res.json({ token });
  }
}