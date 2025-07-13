"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column } from "@/components/boardColumn";
import { Board, IUser, Task } from "@/types";
import AddTaskModal from "@/components/modal/addTaskModal";
import { CiEdit } from "react-icons/ci";
import { FaPlus, FaUsers } from "react-icons/fa6";
import AddTaskMemberModal from "@/components/modal/addTaskMemberMotal";
import ConfirmDeleteMemberFromTask from "@/components/modal/confirmModal/confirmDeleteMemberFromTask";
import { IoMdClose } from "react-icons/io";
import { socket } from "@/functions/socket";

type BoardPageProps = {
  params: {
    id: number;
  };
};

export default function BoardPage({ params }: BoardPageProps) {
  const [board, setBoard] = useState<Board | null>(null);
  const [isMemberModalOpen, SetIsMemberModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmMemberDeleteModalOpen, setIsConfirmMemberDeleteModalOpen] = useState(false);
  const [confirmMemberDeleteMember, setconfirmMemberDeleteMember] = useState<IUser>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [columns, setColumns] = useState<{ [key: string]: any }>({
    todo: { name: 'A fazer', id: 'todo', list: [] },
    doing: { name: 'Em progresso', id: 'doing', list: [] },
    done: { name: 'Finalizado', id: 'done', list: [] }
  });
  const [loading, setLoading] = useState(true);

  async function fetchBoardInfo() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/board/${params.id}`);
    setEditedTitle(response.data.title);
    return response.data;
  }

  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLoading(true);

        if (!socket.connected) {
          socket.connect();
        }

        socket.emit("join_board", params.id);

        const data = await fetchBoardInfo();
        setBoard(data);

        const initialColumns = {
          todo: {
            id: 'todo',
            name: 'A fazer',
            list: data.tasks.filter((t: Task) => t.state === 'todo').sort((a: { list_index: number; }, b: { list_index: number; }) => a.list_index - b.list_index),
          },
          doing: {
            id: 'doing',
            name: 'Em progresso',
            list: data.tasks.filter((t: Task) => t.state === 'doing').sort((a: { list_index: number; }, b: { list_index: number; }) => a.list_index - b.list_index),
          },
          done: {
            id: 'done',
            name: 'Finalizado',
            list: data.tasks.filter((t: Task) => t.state === 'done').sort((a: { list_index: number; }, b: { list_index: number; }) => a.list_index - b.list_index),
          },
        };

        setColumns(initialColumns);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    socket.on("task_moved", (updatedTasks: Task[]) => {
      console.log("atualizando tasks no front", updatedTasks);

      setColumns(prevColumns => {
        const newColumns = { ...prevColumns };

        // 1. Crie um mapa com os IDs das tarefas atualizadas
        const updatedTaskMap = new Map(updatedTasks.map(task => [task.id, task]));

        // 2. Atualize cada coluna mantendo as tarefas que não foram atualizadas
        Object.keys(newColumns).forEach(colId => {
            newColumns[colId].list = newColumns[colId].list
            .filter((task: Task) => !updatedTaskMap.has(task.id)); // remove se for atualizada
        });

        // 3. Insira as tasks atualizadas na coluna correta
        updatedTasks.forEach(task => {
          if (newColumns[task.state]) {
            newColumns[task.state].list.push(task);
          }
        });

        // 4. Reordene por list_index
        Object.values(newColumns).forEach(col => {
          col.list.sort((a: { list_index: number; }, b: { list_index: number; }) => a.list_index - b.list_index);
        }); 

        return newColumns;
      });
    });

    loadBoard();

    return () => {
      socket.disconnect();
    };
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
        return response.data;
      });

      await Promise.all(updateTasksPromises);
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
      socket.emit("move_task", {
        boardId: params.id,
        tasks: [...startList, ...endList],
      });

      setColumns(prevState => ({
        ...prevState,
        [start.id]: { ...start, list: startList },
        [end.id]: { ...end, list: endList }
      }));
    }
  };

  const handleTitleEdit = () => setIsEditing(true);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditedTitle(e.target.value);
  const handleTitleBlur = () => {
    setIsEditing(false);
    if (editedTitle !== board?.title) attBoard(editedTitle);
  };
  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      attBoard(editedTitle);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const selectMemberToDelete = (member: IUser) => {
    setconfirmMemberDeleteMember(member);
    setIsConfirmMemberDeleteModalOpen(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {isModalOpen && (
        <AddTaskModal closeModal={closeModal} boardMembers={board?.members ?? []} Columns={columns} boardId={params.id} />
      )}
      {isMemberModalOpen && board && (
        <AddTaskMemberModal closeModal={() => SetIsMemberModalOpen(false)} boardId={Number(board.id)} />
      )}
      {isConfirmMemberDeleteModalOpen && board && confirmMemberDeleteMember !== undefined && (
        <ConfirmDeleteMemberFromTask closeModal={() => setIsConfirmMemberDeleteModalOpen(false)} member={confirmMemberDeleteMember} boardId={Number(board.id)} />
      )}

      <div className="flex flex-col items-start w-full h-full bg-gray-50 min-h-screen">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 w-full bg-white/90 backdrop-blur border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div className="flex items-center gap-4">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyPress={handleTitleKeyPress}
                className="border border-gray-300 p-2 text-3xl font-bold rounded-md focus:outline-teal-500"
                autoFocus
              />
            ) : (
              <div className="flex gap-2 items-center">
                <h2 className="text-3xl md:text-4xl font-bold">{board?.title}</h2>
                <button
                  className="hover:text-teal-500 transition"
                  onClick={handleTitleEdit}
                  aria-label="Editar título"
                >
                  <CiEdit size={28} />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <FaUsers size={22} className="text-gray-600" />
              <span className="text-lg font-semibold">Membros</span>
              <button
                onClick={() => SetIsMemberModalOpen(true)}
                className="flex items-center gap-1 bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded transition"
                aria-label="Adicionar membro"
              >
                <FaPlus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              {board?.members.map((member) => (
                <div key={member.id} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded shadow-sm">
                  <span
                    className="w-7 h-7 rounded-full bg-teal-200 flex items-center justify-center text-teal-800 font-bold text-sm"
                    title={member.name}
                  >
                    {member.name[0]}
                  </span>
                  <span className="text-sm font-medium">{member.name} {member.id == board.admin?.id ? "(admin)" : null}</span>

                  <button
                    onClick={() => selectMemberToDelete(member)}
                    className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition"
                    aria-label="Remover membro"
                  >
                    <IoMdClose size={16} />
                  </button>

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-end px-6">
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-teal-500 to-teal-400 my-8 px-6 p-2 rounded-lg text-white font-semibold text-lg shadow hover:from-teal-600 hover:to-teal-500 transition"
          >
            <FaPlus className="inline mr-2" /> Criar Tarefa
          </button>

          <hr className="w-full border-gray-200 mb-4" />

          {loading ? (
            <div className="flex justify-center items-center w-full h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              <span className="ml-4 text-teal-700 font-semibold">Carregando...</span>
            </div>
          ) : (
            <div className="flex justify-center gap-6 overflow-x-auto w-full p-2 md:p-6">
              {Object.values(columns).map((col) => (
                <div key={col.id} className="flex-1 min-w-[320px] max-w-[600px]">
                  <Column col={col} boardMembers={board?.members ?? []} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}
