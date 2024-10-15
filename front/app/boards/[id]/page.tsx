"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "@/components/boardColumn";
import { Task } from "@/types";

interface Board {
  id: string;
  title: string;
  tasks: Task[];
}

export default function BoardPage({ params }: any) {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<{ [key: string]: any }>({
    todo: { name: 'A fazer', id: 'todo', list: [] },
    doing: { name: 'Em progresso', id: 'doing', list: [] },
    done: { name: 'Finalizado', id: 'done', list: [] }
  });

  async function fetchBoardInfo() {
    const response = await axios.get(`http://localhost:8080/board/${params.id}`);
    return response.data;
  }

  useEffect(() => {
    const updateProcesses = async () => {
      try {
        const ProcessInfo = await fetchBoardInfo();
        setBoard(ProcessInfo);


        const initialColumns = {
          todo: {
            id: 'todo',
            name: 'A fazer',
            list: ProcessInfo.tasks
              .filter((task: Task) => task.state === 'todo')
              .sort((a: Task, b: Task) => a.list_index - b.list_index) || [],
          },
          doing: {
            id: 'doing',
            name: 'Em progresso',
            list: ProcessInfo.tasks
              .filter((task: Task) => task.state === 'doing')
              .sort((a: Task, b: Task) => a.list_index - b.list_index) || [],
          },
          done: {
            id: 'done',
            name: 'Finalizado',
            list: ProcessInfo.tasks
              .filter((task: Task) => task.state === 'done')
              .sort((a: Task, b: Task) => a.list_index - b.list_index) || [],
          },
        };
        
        setColumns(initialColumns);

      } catch (error) {
        console.error(error);
      }
    };

    updateProcesses();
  }, []);



  async function att_tasks(tasks: Task[]) {
    try {
      console.log("tasks para atualizar", tasks)
      const updateTasksPromises = tasks.map(async (task) => {
        const response = await axios.put(
          `http://localhost:8080/task/${task.id}`,
          task
        );
        console.log('Data sent successfully for task with ID', task.id, ':', response.data);
        return response.data;
      });

      await Promise.all(updateTasksPromises);
      console.log('All tasks updated successfully');
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  }

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;

    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    if (start === end) {
      const newList = [...start.list];
      const [movedItem] = newList.splice(source.index, 1);

      newList.splice(destination.index, 0, movedItem);
      newList.forEach((task, index) => task.list_index = index);

      att_tasks(newList);

      setColumns(prevState => ({
        ...prevState,
        [start.id]: { ...start, list: newList }
      }));
    } else {
      console.log("moveno colunas", source, destination)
      const startList = [...start.list];
      const [movedItem] = startList.splice(source.index, 1);

      const endList = [...end.list];
      endList.splice(destination.index, 0, movedItem);

      startList.forEach((task, index) => task.list_index = index);
      endList.forEach((task, index) => {
        task.state = end.id;
        task.list_index = index;
      });

      att_tasks([...startList, ...endList]);

      setColumns(prevState => ({
        ...prevState,
        [start.id]: { ...start, list: startList },
        [end.id]: { ...end, list: endList }
      }));
    }
  };

  if (!board) return <div>Loading...</div>;


  console.log(columns)
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col items-center w-full h-full ">
        <div className="title-wrapper">
          <h2 className="project-name">{board.title}</h2>
        </div>
        <hr />
        <div className="flex justify-center gap-10 overflow-x-auto w-full  p-6">
          {Object.values(columns).map((col) => (
            <div key={col.id} className="flex-1">
              <Column col={col} />
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}