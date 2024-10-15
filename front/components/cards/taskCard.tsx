import { Task } from "@/types";
import { Draggable } from "react-beautiful-dnd";

type TaskCardProps = {
  text: string
  index: number
  task: Task
};

export default function TaskCard(props: TaskCardProps) {
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
          <h3 className="font-bold text-xl">{props.task.title}</h3>
          <p className="mt-2 font-light">{props.task.description}</p>
        </div>
      )}
    </Draggable>
  );
}
