"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "@/components/boardColumn";
import BoardCard from "@/components/cards/boardCards";
import { getUserInfo } from "@/functions/authFunctions";
import Cookies from "js-cookie";
import AddTableModal from "@/components/modal/addTableModal";

export default function Home() {
  const [boards, setBoards] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function getBoards() {
      const response = await axios.get("http://localhost:8080/board");
      setBoards(response.data);
    }

    getBoards();

    async function fetchUser(){
      const token = Cookies.get('token');
      if (!token) {
        return;
      }
      const userInfo = await getUserInfo(token);
      if(userInfo) {
        setUserInfo(userInfo);
      }
    }

    fetchUser();

  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  console.log(userInfo);
  return (
    <div className="p-8">
        {isModalOpen && (
          <div className='absolute top-[50%] left-[50%]  w-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <AddTableModal closeModal={closeModal} userId={userInfo?.id} />
          </div>
        )}
      <div className="my-8 ">
        
        <h1 className="font-extrabold text-5xl my-12">Ola {userInfo?.name}</h1>
        <button
          onClick={openModal}
          className="bg-teal-500 my-8 p-2 rounded-md text-white hover:text-black">
          Criar Board
        </button>
        <h1 className="font-semibold text-3xl">Suas boards</h1>
      </div>
      <div className="flex gap-8 w-[80%] flex-wrap">
        {boards.map((board: any) => (
          <BoardCard key={board.id} title={board.title} numberOfTasks={board.tasks.length} id={board.id}></BoardCard>
        ))}
      </div>
    </div>
  )
}
