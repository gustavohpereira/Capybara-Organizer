export type Task = {
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
  