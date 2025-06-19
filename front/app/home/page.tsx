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
import image from '../../images/capybaraError.png'

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


  return (
    <div className="p-8 bg-slate-100 h-screen flex flex-col items-center">
      {isModalOpen && (
        <AddTableModal closeModal={closeModal} user={user} />
      )}
      <div className="my-8 w-full ">
        <div className="flex w-full justify-start">

          <h1 className="font-extrabold text-4xl my-12">Dashboard</h1>
        </div>

        <div className="flex w-full justify-end">


        </div>

      </div>
      <div className="flex gap-8 w-[100%] flex-wrap bg-white shadow-lg p-4 rounded-lg min-h-[50vh]">
        <div className="flex justify-between w-full">
          <p className="font-semibold text-3xl">Suas boards</p>
            <button
            onClick={openModal}
            className="bg-teal-500 h-2/5 max-h-12 p-2 rounded-md text-white transition-colors duration-200 hover:bg-teal-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
            >
            Criar Board
            </button>
        </div>
        {boards.filter((board: any) => board.members.some((member: any) => member.id === user?.id)).length === 0 ? (
          <div className="w-full flex flex-col justify-center items-center py-16">
        <img src={image.src} alt="Nenhuma board encontrada" className="w-24 h-24 mb-4" />
        <span className="text-teal-500 text-lg">Nenhuma board encontrada.</span>
          </div>
        ) : (
          boards
        .filter((board: any) => board.members.some((member: any) => member.id === user?.id))
        .map((board: any) => (
          <BoardCard key={board.id} title={board.title} numberOfTasks={board.tasks.length} id={board.id} />
        ))
        )}
      </div>
    </div>
  )
}
