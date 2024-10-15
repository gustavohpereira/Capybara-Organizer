"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "@/components/boardColumn";

export default function Home() {
  const [boards, setBoards] = useState<any>([]);

  useEffect(() => {
    async function getBoards() {
      const response = await axios.get("http://localhost:8080/board");
      setBoards(response.data);
    }
    getBoards();
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // Handling reordering within the same column
    if (source.droppableId === destination.droppableId) {
      const column: any = boards.find((board: any) => board.id === parseInt(source.droppableId));
      const reorderedTasks = Array.from(column.tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      const newBoards = boards.map((board: any) => {
        if (board.id === parseInt(source.droppableId)) {
          return { ...board, tasks: reorderedTasks };
        }
        return board;
      });
      setBoards(newBoards);
    } else {
      // Handling moving tasks between columns
      const sourceBoard: any = boards.find((board: any) => board.id === parseInt(source.droppableId));
      const destinationBoard: any = boards.find((board: any) => board.id === parseInt(destination.droppableId));

      const sourceTasks = Array.from(sourceBoard.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      const destinationTasks = Array.from(destinationBoard.tasks);
      destinationTasks.splice(destination.index, 0, movedTask);

      const newBoards:any = boards.map((board: any) => {
        if (board.id === parseInt(source.droppableId)) {
          return { ...board, tasks: sourceTasks };
        }
        if (board.id === parseInt(destination.droppableId)) {
          return { ...board, tasks: destinationTasks };
        }
        return board;
      });
      setBoards(newBoards);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-start justify-start">
      <div className="p-4 w-full">
        <h1 className="font-bold text-4xl my-8">Suas Tabelas</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4">
            {boards.map((board: { id: number; title: string; tasks: any[] }) => (
              <Column key={board.id} id={board.id} title={board.title} tasks={board.tasks} />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
