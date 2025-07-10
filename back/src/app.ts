import Express, { NextFunction, Request, Response } from "express";
import appDataSource from "./data-source";
import cookieParser from 'cookie-parser';

import taskRouter from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import boardRouter from "./routes/Board.routes";
import statisticsRouter from "./routes/statistics.routes";

import { createAdminUser } from "./database/seeds/admin.seeds";

import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

require('dotenv').config();

const app = Express();
const cors = require("cors");

// Criação do servidor HTTP e integração com o Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://project-gerenciador.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middlewares
app.use(Express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'https://project-gerenciador.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Inicialização do banco de dados e start do servidor
appDataSource.initialize().then(async (connection) => {
    console.log("✅ Database initialized");
    await connection.runMigrations();
    await createAdminUser(appDataSource);

    // Aqui você inicia o servidor HTTP com WebSocket
    server.listen(process.env.PORT, () => {
        console.log(`🚀 Server + WebSocket running on http://localhost:${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("❌ Error initializing database", error);
});

// Rotas REST
app.get('/', async (req, res) => {
    res.send("Hello World!");
});

app.use('/task', taskRouter);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/board', boardRouter);
app.use('/statistics', statisticsRouter);

// Tipagem dos dados do WebSocket
interface MoveTaskData {
    boardId: string;
    tasks: any[]; // Substitua 'any' pelo tipo real da Task se tiver
}

// Lógica do WebSocket
io.on('connection', (socket) => {
    console.log('🟢 Novo cliente conectado');

    socket.on('join_board', (boardId: string) => {
        socket.join(boardId);
        console.log(`👤 Cliente entrou no board ${boardId}`);
    });

    socket.on('move_task', (data: MoveTaskData) => {
        const { boardId, tasks } = data;
        io.to(boardId).emit('task_moved', tasks);
        console.log(`🔄 Tarefas movidas no board ${boardId}`);
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
    });
});

export { io };
