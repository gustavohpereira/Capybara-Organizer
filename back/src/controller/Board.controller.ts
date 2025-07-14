import { Request, Response } from 'express';
import { BoardService } from 'service/Board.service';
import { UserService } from 'service/user.service';

export class BoardController {

    public constructor(
        private readonly boardService: BoardService,
        private readonly userService: UserService
    ){}
  async getAllBoards(req: Request, res: Response) {
    const boards = await this.boardService.getAllBoards();
    res.json(boards);
  }

  async getBoardById(req: Request, res: Response) {
    const board = await this.boardService.getBoardById(Number(req.params.id));
    if (board) {
      res.json(board);
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  }

  async createBoard(req: Request, res: Response) {
    const user = await this.userService.getUserById(Number(req.body.userId));

    console.log(req.body)

    if (user) {
      const board = await this.boardService.createBoard(req.body, user);
      res.status(201).json(board);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }

  async updateBoard(req: Request, res: Response) {
    const board = await this.boardService.updateBoard(Number(req.params.id), req.body);
    if (board) {
      res.json(board);
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  }

  async deleteBoard(req: Request, res: Response) {
    await this.boardService.deleteBoard(Number(req.params.id));
    res.status(204).send();
  }

  async addMemberToBoard(req: Request, res: Response) {
    const board = await this.boardService.addMemberToBoard(Number(req.params.boardId), Number(req.body.userId));
    if (board) {
      res.json(board);
    } else {
      res.status(404).json({ message: 'Board or user not found' });
    }
  }

  async removeMemberFromBoard(req: Request, res: Response) {
    const board = await this.boardService.removeMemberFromBoard(Number(req.params.boardId), Number(req.body.userId));

    
    if (board) {
      await this.boardService.deleteUserFromAllBoardTasks(Number(req.body.userId),Number(req.params.boardId));
      res.json(board);
    } else {
      res.status(404).json({ message: 'Board or user not found' });
    }
  }
}