import Express, { NextFunction, Request, Response } from "express";
import appDataSource from "./data-source";
import cookieParser from 'cookie-parser';

import taskRouter from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import boardRouter from "./routes/Board.routes";


require('dotenv').config()
const app = Express()
const cors = require("cors");


app.use(Express.json())
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:3000', 'https://project-gerenciador.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Substitua pela origem do seu front-end
}))


appDataSource.initialize().then((connection) => {
    console.log("Database initialized")
    connection.runMigrations()
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`)
    })
})


app.get('/', async (req, res) => {
    res.send("Hello World!")
})

app.use('/task', taskRouter)
app.use('/user', userRoutes)
app.use('/auth', authRoutes);
app.use('/board',boardRouter)

