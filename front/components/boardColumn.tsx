import { IUser, Task } from "@/types";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "@/components/cards/taskCard";

interface ColumnProps {
  col: {
    name: string;
    id: string;
    list: Task[];
  };
  boardMembers: IUser[];
}

const columnColors: Record<string, string> = {
  "A fazer": "bg-sky-400 ",
  "Em progresso": "bg-yellow-400",
  "Finalizado": "bg-emerald-400",
};

export const Column: React.FC<ColumnProps> = (props) => {
  const colorClass = columnColors[props.col.name] || "bg-gray-300";

  return (
    <div className="flex flex-col items-center bg-white border rounded-2xl shadow-md w-[90%] p-0 h-[65vh] max-h-[80vh] overflow-y-auto transition-all duration-300">
      {/* Colored bar at the top */}
      <div className={`w-full h-2 rounded-t-2xl ${colorClass}`} />
      <section className="flex flex-row items-center justify-between w-full px-5 h-[4vh] mt-2 mb-1">
        <h4 className="text-[#53C4CD] font-extrabold text-left">{props.col.name}</h4>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {props.col.list.length} tarefas
        </span>
      </section>
      <hr className="w-full my-0" />
      <Droppable droppableId={props.col.id}>
        {(provided) => (
          <div
            className="w-full min-h-[100px] px-3 pb-3"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.col.list.length > 0 ? (
              props.col.list.map((task, index) => (
                <TaskCard
                  key={task.id}
                  text={task.title}
                  index={index}
                  task={task}
                  members={props.boardMembers}
                />
              ))
            ) : (
              <p className="text-center text-gray-400 mt-4">Sem tarefas</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
