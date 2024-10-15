"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "@/components/boardColumn";
import BoardCard from "@/components/cards/boardCards";

export default function Home() {
  const [boards, setBoards] = useState<any>([]);

  useEffect(() => {
    async function getBoards() {
      const response = await axios.get("http://localhost:8080/board");
      setBoards(response.data);
    }
    getBoards();
  }, []);

  return (
    <div className="p-8">

      <div className="my-8">
        <h1 className="font-bold text-3xl">Suas boards</h1>
      </div>
      <div className="flex">
        {boards.map((board: any) => (
          <BoardCard title={board.title} numberOfTasks={board.tasks.length} id={board.id}></BoardCard>
        ))}
      </div>
    </div>
  )
}
