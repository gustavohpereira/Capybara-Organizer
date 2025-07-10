import { Task } from "@/types";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import DetailTaskModal from "../modal/detailTaskModal";
import { IoMdClose } from "react-icons/io";

type TaskCardProps = {
  text: string
  index: number
  task: Task
  members: any[]
};

export default function TaskCard(props: TaskCardProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleTaskDelete = async () => {
    const isConfirmed = window.confirm('Tem certeza que deseja remover esta tarefa?');
    console.log("is confirmed", isConfirmed)
    if (!isConfirmed) {
      return;
    }
    console.log("deletando task")
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/${props.task.id}`, {
      method: 'DELETE',
    });


    console.log("response",response);

    if (response.ok) {
      window.location.reload();
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
              className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition"
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
    </>
  );
}
