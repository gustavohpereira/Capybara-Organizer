import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

export default function AddTaskModal({ closeModal, boardId, Columns }: { closeModal: () => void, boardId: number, Columns: any }) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [taskState, setTaskState] = useState('todo');

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    const selectedColumn = Columns[taskState];

    const taskData = {
      title: taskName,
      description: description,
      state: taskState,
      board: boardId,
      list_index: selectedColumn?.list.length || 0,
    };

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/task`, taskData);
    console.log('Data sent successfully:', response.data);

    closeModal();
    window.location.reload();
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
