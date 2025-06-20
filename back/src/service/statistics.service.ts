import { Task } from "entity/task.entity";
import { Repository } from "typeorm";

export class StatisticsService{
    public constructor(
        private taskRepository: Repository<Task>,
    ){}



    async countGlobalTasks(user_id:number){
        const result = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoin("task.users", "user")
            .select("task.state", "state")
            .addSelect("COUNT(*)", "count")
            .where("user.id = :user_id", { user_id })
            .groupBy("task.state")
            .getRawMany();
            
        return result.map(row => ({
            ...row,
            count: Number(row.count)
        }));
    }
}