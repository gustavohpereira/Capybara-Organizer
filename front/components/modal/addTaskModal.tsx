import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import axios from "axios";
import { IUser } from "@/types";

export default function AddTaskModal({ closeModal, boardId, boardMembers, Columns }: { closeModal: () => void, boardId: number, boardMembers: IUser[], Columns: any }) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [taskState, setTaskState] = useState('todo');
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    const selectedColumn = Columns[taskState];

    const taskData = {
      title: taskName,
      description: description,
      state: taskState,
      board: boardId,
      list_index: selectedColumn?.list.length || 0,
      users: boardMembers.filter(member => assignedUserIds.includes(member.id)), 
    };

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/task`, taskData);

    closeModal();
    window.location.reload();
  }

  function handleUserSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
    setAssignedUserIds(selectedOptions);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-slate-200 p-6 rounded-xl w-full max-w-md filter brightness-125 flex flex-col justify-start items-start border border-slate-500">
        <div className="flex justify-end w-full">
          <button className="text-red-500 hover:text-red-600" onClick={closeModal}>
            <IoMdClose size={30} />
          </button>
        </div>
        <div className="w-full flex justify-center items-center mb-4">
          <h3 className="font-medium text-xl">Nova Tarefa</h3>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-black">
          <input
            type="text"
            className="w-full border border-gray-500 placeholder-gray-500 p-2 rounded-lg"
            placeholder="Nome da tarefa"
            onChange={(e) => setTaskName(e.target.value)}
            required
          />

          <textarea
            className="w-full border border-gray-500 placeholder-gray-500 p-2 rounded-lg"
            placeholder="Descrição"
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <select
            className="w-full border border-gray-500 text-black p-2 rounded-lg"
            onChange={(e) => setTaskState(e.target.value)}
          >
            <option value="todo">A fazer</option>
            <option value="doing">Fazendo</option>
            <option value="done">Concluída</option>
          </select>

          <label className="flex flex-col gap-1">
            <span>Atribuir membros</span>
            <select
              className="w-full border border-gray-500 text-black p-2 rounded-lg"
              multiple
              required
              value={assignedUserIds.map(String)}
              onChange={handleUserSelect}
              size={Math.min(4, boardMembers.length)}
            >
              {boardMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-500">Segure Ctrl (Windows) ou Cmd (Mac) para selecionar vários</span>
          </label>

          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-teal-700 transition duration-300"
          >
            Adicionar Tarefa
          </button>
        </form>
      </div>
    </div>
  );
}
