import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { User } from "../../entity/user.entity";

dotenv.config();

export async function createAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({ where: { role: "admin" } });
  if (existingAdmin) {
    return;
  }


  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

  const adminUser = userRepository.create({
    name: process.env.ADMIN_NAME!,
    email: process.env.ADMIN_EMAIL!,
    password: hashedPassword,
    role: "admin",
  });

  await userRepository.save(adminUser);
}
