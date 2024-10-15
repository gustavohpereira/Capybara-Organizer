import { Task } from "@/types";
import { Draggable } from "react-beautiful-dnd";

type TaskCardProps = {
  text: string
  index: number
  task: Task
};

export default function TaskCard(props: TaskCardProps) {

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




  return (
    <Draggable draggableId={props.task.id.toString()} key={props.task.id.toString()} index={props.index}>

      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
            padding: "16px",
            margin: "8px 0",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "move",
          }}
        >
          <div className="w-full flex justify-end">
            <button onClick={handleTaskDelete} className="mt-2 font-light text-red-500" >remover</button>
          </div>
          <h3 className="font-bold text-xl">{props.task.title}</h3>
          <p className="mt-2 font-light">{props.task.description}</p>

        </div>
      )}
    </Draggable>
  );
}
