"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "@/components/boardColumn";
import BoardCard from "@/components/cards/boardCards";
import { getUserInfo } from "@/functions/authFunctions";
import Cookies from "js-cookie";
import AddTableModal from "@/components/modal/addTableModal";
import { useAuth } from "@/Providers/AuthProvider";
import { useUser } from "@/Providers/UserProvider";

export default function Home() {
  const [boards, setBoards] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { auth } = useAuth();
  const { user } = useUser();


  useEffect(() => {
    async function verifyUser() {
      const userData = await auth();
      if (userData) {
        setLoading(false);
      }
    }

    async function getBoards() {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/board`);
      setBoards(response.data);
    }
    verifyUser();
    getBoards();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  if (loading) {
    return <div>Carregando...</div>;
  }

  console.log(boards.map((board: any) => board.members));
  console.log(user);
  return (
    <div className="p-8">
      {isModalOpen && (
        <AddTableModal closeModal={closeModal} user={user} />
      )}
      <div className="my-8 ">

        <h1 className="font-extrabold text-5xl my-12">Ola {user?.name}</h1>
        <button
          onClick={openModal}
          className="bg-teal-500 my-8 p-2 rounded-md text-white hover:text-black">
          Criar Board
        </button>
        <h1 className="font-semibold text-3xl">Suas boards</h1>
      </div>
      <div className="flex gap-8 w-[80%] flex-wrap">
        {boards
          .filter((board: any) => board.members.some((member: any) => member.id === user?.id)) // Filtro aqui
          .map((board: any) => (
            <BoardCard key={board.id} title={board.title} numberOfTasks={board.tasks.length} id={board.id} />
          ))}
      </div>
    </div>
  )
}
