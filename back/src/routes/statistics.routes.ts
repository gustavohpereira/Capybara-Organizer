import { StatisticsController } from "../controller/statistics.controller";
import appDataSource from "../data-source";
import { Task } from "../entity/task.entity";
import { Router } from "express";
import { StatisticsService } from "../service/statistics.service";



const statisticsRouter = Router();
const statisticsService = new StatisticsService(appDataSource.getRepository(Task),);
const boardController = new StatisticsController(statisticsService);

statisticsRouter.get('/getTaskGlobalNumbers/:user_id',async (req,res) => {
    await boardController.getTaskGlobalNumbers(req,res)
})


export default statisticsRouter