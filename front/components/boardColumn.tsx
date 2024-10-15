import { Task } from "@/types";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "@/components/cards/taskCard";

interface ColumnProps {
  col: {
    name: string;
    id: string;
    list: Task[];
  };
}

export const Column: React.FC<ColumnProps> = (props) => {
  return (
    <div className="flex flex-col items-center  border border-slate-500 rounded-lg w-[90%] p-5 h-[65vh] max-h-[80vh] overflow-y-auto transition-all duration-300">
      <section className="flex flex-row items-center justify-between w-full h-[4vh] mb-[0.5vh]">
        <h4 className="text-[#53C4CD] font-extrabold text-left">{props.col.name}</h4>
      </section>
      <hr className="w-full my-0" />
      <Droppable droppableId={props.col.id}>
        {(provided) => (
          <div
            className=" w-full min-h-[100px]" // Certifique-se de definir uma altura mínima para a coluna
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
                />
              ))
            ) : (
              <p className="text-center text-gray-500">Sem tarefas</p> // Mensagem quando não houver tarefas
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
