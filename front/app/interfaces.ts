export interface ITask {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    state: 'todo' | 'doing' | 'done';
    board: IBoard;
    users: IUser[]; 
    list_index: number;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    adminBoards: IBoard[];
    boards: IBoard[];
    tasks: ITask[];
    role: string;
}

export interface IBoard {
  id: string;
  title: string;
  tasks: ITask[];
  members: IUser[];
  admin: { id: number };
}