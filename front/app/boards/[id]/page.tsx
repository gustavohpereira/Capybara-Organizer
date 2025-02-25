"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "@/components/boardColumn";
import { Task } from "@/types";
import AddTaskModal from "@/components/modal/addTaskModal";
import { CiEdit } from "react-icons/ci";
import { FaPlus, FaUsers } from "react-icons/fa6";
import { table } from "console";
import AddTaskMemberModal from "@/components/modal/addTaskMemberMotal";
import ConfirmDeleteMemberFromTask from "@/components/modal/confirmModal/confirmDeleteMemberFromTask";

interface Board {
  id: string;
  title: string;
  tasks: Task[];
  members: any[];
  admin: { id: number };
}

export default function BoardPage({ params }: any) {
  const [board, setBoard] = useState<Board | null>(null);
  const [isMemberModalOpen, SetIsMemberModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmMemberDeleteModalOpen, setIsConfirmMemberDeleteModalOpen] = useState(false);
  const [confirmMemberDeleteMember,setconfirmMemberDeleteMember] = useState<any>();
  const [isEditing, setIsEditing] = useState(false); // Estado de edição
  const [editedTitle, setEditedTitle] = useState(""); // Estado para armazenar o título editado
  const [columns, setColumns] = useState<{ [key: string]: any }>({
    todo: { name: 'A fazer', id: 'todo', list: [] },
    doing: { name: 'Em progresso', id: 'doing', list: [] },
    done: { name: 'Finalizado', id: 'done', list: [] }
  });


  async function fetchBoardInfo() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/board/${params.id}`);
    console.log('Data received:', response.data);
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


  async function attBoard(newTitle: string) {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/board/${params.id}`, {
        title: newTitle
      });
      setBoard(response.data);
    } catch (error) {
      console.error(error);
    }
  }


  async function att_tasks(tasks: Task[]) {
    try {
      const updateTasksPromises = tasks.map(async (task) => {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/task/${task.id}`,
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


  const handleTitleEdit = () => {
    setIsEditing(true); // Ativa o modo de edição
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value); // Atualiza o título enquanto digita
  };

  const handleTitleBlur = () => {
    setIsEditing(false); // Sai do modo de edição
    if (editedTitle !== board?.title) {
      attBoard(editedTitle); // Atualiza o título no back-end
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false); // Sai do modo de edição quando pressionar Enter
      attBoard(editedTitle); // Atualiza o título no back-end
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectMemberToDelete = (member: any) => {
    setconfirmMemberDeleteMember(member);
    setIsConfirmMemberDeleteModalOpen(true);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {isModalOpen && (

        <AddTaskModal closeModal={closeModal} Columns={columns} boardId={params.id} />

      )}

      {isMemberModalOpen && (
        <AddTaskMemberModal closeModal={() => SetIsMemberModalOpen(false)} boardId={Number(board.id)} />
      )
      }

      {isConfirmMemberDeleteModalOpen && (
        <ConfirmDeleteMemberFromTask closeModal={() => setIsConfirmMemberDeleteModalOpen(false)} member={confirmMemberDeleteMember} boardId={Number(board.id)} />
      )

      }
      <div className="flex flex-col items-start p-6 w-full h-full ">
        <div className="flex justify-start gap-4 items-start">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyPress={handleTitleKeyPress}
              className="border border-gray-300 p-2 text-4xl font-bold"
              autoFocus
            />
          ) : (
            <div className="pl-6 flex gap-4 items-center">
              <h2 className="text-4xl font-bold">{board.title}</h2>
              <CiEdit size={30} className="hover:text-teal-500 cursor-pointer" onClick={handleTitleEdit} />
            </div>
          )}

          <div className="flex flex-col items-start ml-64 gap-4">
            <div className="flex gap-4 items-center ">
              <FaUsers size={30} />
              <h1 className="text-4xl font-bold">Membros</h1>
              <button onClick={() => SetIsMemberModalOpen(true)} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-1 px-4 rounded">
                <FaPlus size={26} />
              </button>
            </div>
            {board.members.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <li className="text-md font-bold">{member.name} {member.id == board.admin?.id ? "(admin)" : 
                  
                  <button onClick={() => selectMemberToDelete(member)} className="bg-red-500 text-white p-2 rounded-lg">Remover</button>
                  
                  }	</li>
              </div>
            ))}
          </div>

        </div>
        <button
          onClick={openModal}
          className="bg-teal-500 my-8 ml-6 p-2 rounded-md text-white hover:text-black">
          Criar Tarefa
        </button>




        <hr />
        <div className="flex justify-center gap-10 overflow-x-auto w-full  p-6">
          {Object.values(columns).map((col) => (
            <div key={col.id} className="flex-1">
              <Column col={col} boardMembers={board.members} />
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}