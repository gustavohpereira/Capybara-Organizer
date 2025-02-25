import { Task } from "@/types";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import DetailTaskModal from "../modal/detailTaskModal";

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

    if(!isConfirmed) {
      return;
    }

    const response = await fetch(`http://localhost:8080/task/${props.task.id}`, {
      method: 'DELETE',
    });

    if(response.ok) {
      window.location.reload();
    }

  }

  const handleTaskClick = ()=> {
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
          <div className="w-full flex justify-end">
            <button onClick={handleTaskDelete} className="mt-2 font-light text-red-500" >remover</button>
          </div>
          <h3 className="font-bold text-xl">{props.task.title}</h3>
          <p className="mt-2 font-light">{props.task.description}</p>

        </div>
      )}
    </Draggable>
    {openModal && <DetailTaskModal taskData={props.task}  closeModal={() => setOpenModal(false)} boardMembers={props.members} />} 
    </>
  );
}
