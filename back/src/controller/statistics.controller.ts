
import { Request, Response } from 'express';
import { StatisticsService } from 'service/statistics.service';

export class StatisticsController {
    public constructor(
        private readonly statisticsService: StatisticsService
    ) { }


    async getTaskGlobalNumbers(req: Request,res: Response){
        try{
               const  user_id  = req.params.user_id;
               console.log(user_id)
               if (!user_id || Array.isArray(user_id)) {
                   return res.status(400).json({ message: 'user_id is required and must be a single value' });
               }
               const userIdNumber = Number(user_id);
               if (isNaN(userIdNumber)) {
                   return res.status(400).json({ message: 'user_id must be a valid number' });
               }
               const taskNumbers = await this.statisticsService.countGlobalTasks(userIdNumber);
               console.log(taskNumbers)
            const total = taskNumbers.reduce((sum, item) => sum + item.count, 0);
            taskNumbers.push({ state: 'total', count: total });

            res.status(200).json(taskNumbers)

            
        }catch(error){
            console.log(error)
            res.status(500).json({ message: 'Ocorreu algo de errado ao selecionar estatistica'});
        }
    }


}