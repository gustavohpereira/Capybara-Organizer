export type Task = {
  users: any;
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  state: string;
  list_index: number;
};

export type Board = {
  id: string;
  title: string;
  tasks: Task[];
  members: any[];
  admin: { id: number };
};


export type IUser =  {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  boards: Board[];
  tasks: Task[];
  role: string;
}
