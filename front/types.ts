export type Task = {
    users: any;
    id: number;
    title: string;
    description: string;
    state: string;
    list_index: number;
  };
  
  export type Board = {
    id: number;
    title: string;
    tasks: Task[];
  };
  