
import appDataSource from '../data-source';
import { Board } from "../entity/Board";
import { User } from "../entity/user.entity";
import { Router } from "express";
import { BoardService } from "../service/Board.service";
import { UserService } from "../service/user.service";
import { BoardController } from "../controller/Board.controller";

const boardRouter = Router();
const boardService = new BoardService(
    appDataSource.getRepository(Board),
    appDataSource.getRepository(User)
);
const userService = new UserService(appDataSource.getRepository(User), appDataSource.getRepository(Board));
const boardController = new BoardController(boardService, userService);


boardRouter.get('/', async (req, res) => {
    await boardController.getAllBoards(req,res)
});

boardRouter.get('/:id',async (req, res) => {
    await boardController.getBoardById(req,res)
} );

boardRouter.post('/',async (req, res) => {
    await boardController.createBoard(req,res)
} );

boardRouter.put('/:id',async (req, res) => {
    await boardController.updateBoard(req,res)
} );

boardRouter.delete('/:id',async (req, res) => {
    await boardController.deleteBoard(req,res)
} );

boardRouter.post('/:boardId/members',async (req, res) => {
    await boardController.addMemberToBoard(req, res);
} );

boardRouter.delete('/:boardId/members',async (req, res) => {
    await boardController.removeMemberFromBoard(req, res);
} );

export default boardRouter