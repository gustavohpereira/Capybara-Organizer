import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL;


console.log(`${__dirname}/entitity/*.{ts,js}`)
const appDataSource = new DataSource({
    type: 'postgres', // Defina explicitamente o tipo do banco de dados
    url: DATABASE_URL, // Use a URL de conexão do PostgreSQL
    entities: [`${__dirname}/entity/*.{ts,js}`],
    migrations: [`${__dirname}/migrations/*.{ts,js}`],
    synchronize: true,
});

export default appDataSource;