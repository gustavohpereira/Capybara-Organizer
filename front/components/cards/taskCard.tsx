import { IUser, Task } from "@/types";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import DetailTaskModal from "../modal/detailTaskModal";
import { IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";

type TaskCardProps = {
  text: string
  index: number
  task: Task
  members: IUser[]
};

export default function TaskCard(props: TaskCardProps) {
  const [openModal, setOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTaskDelete = async () => {
    const isConfirmed = window.confirm('Tem certeza que deseja remover esta tarefa?');
    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/${props.task.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Tarefa removida com sucesso!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      } else {
        throw new Error('Erro ao remover tarefa');
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      toast.error('Erro ao remover tarefa. Tente novamente.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleTaskClick = () => {
    setOpenModal(true);
  }

  return (
    <>
      <Draggable draggableId={props.task.id.toString()} key={props.task.id.toString()} index={props.index}>

        {(provided, snapshot) => (
          <div
            onClick={handleTaskClick}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.5 : 1,
              margin: "8px 0",
              border: "1px solid #ddd",
              cursor: "move",
            }}
            className="shadow-md rounded-lg bg-white p-4 w-full"
          >
            <button
              onClick={e => {
                e.stopPropagation();
                handleTaskDelete();
              }}
              disabled={isDeleting}
              className={`absolute top-2 right-2 p-1 rounded-full transition ${isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-500 hover:text-white'}`}
              aria-label="Remover tarefa"
              tabIndex={-1}
            >
              <IoMdClose size={20} />
            </button>
            <h3 className="font-bold text-lg mb-1 truncate" title={props.task.title}>
              {props.task.title}
            </h3>
            {props.task.description && (
              <p className="text-gray-600 text-sm line-clamp-2" title={props.task.description}>
                {props.task.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Data de criação:{" "}
              {props.task.createdAt
                ? new Date(props.task.createdAt).toLocaleDateString("pt-BR")
                : "Desconhecida"}
            </p>
          </div>
        )}
      </Draggable>
      {openModal && <DetailTaskModal taskData={props.task} closeModal={() => setOpenModal(false)} boardMembers={props.members} />}
      <ToastContainer />
    </>
  );
}
