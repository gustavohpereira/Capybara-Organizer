import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

export default function AddTaskModal({ closeModal,boardId,Columns}: { closeModal: () => void ,boardId:number,Columns:any}) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [taskState, setTaskState] = useState('todo');

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    console.log(Columns[taskState].list)
    const selectedColumn = Columns[taskState]

    const taskData = {
      title: taskName,
      description: description,
      state: taskState,
      board: boardId,
      list_index: selectedColumn?.list.length || 0,
    };


    console.log(taskData)

    const response = await axios.post(`http://localhost:8080/task`, taskData);
    console.log('Data sent successfully:', response.data);

    closeModal();
    window.location.reload();
    
  }

  return (
    <div className="bg-gray-800  p-8 rounded-xl w-full  filter brightness-125 flex flex-col justify-start items-start">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-white font-medium text-xl">Nova Tarefa</h3>
        <button className="text-white" onClick={closeModal}>
          <IoMdClose size={35} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-white">
        <input
          type="text"
          className="w-full bg-gray-600 text-white p-2 rounded-lg"
          placeholder="Nome da tarefa"
          onChange={(e) => setTaskName(e.target.value)}
          required
        />

        <textarea
          className="w-full bg-gray-600 text-white p-2 rounded-lg"
          placeholder="Descrição"
          rows={5}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <select
          className="w-full bg-gray-400 text-black p-2 rounded-lg"
          onChange={(e) => setTaskState(e.target.value)}
        >
          <option value="todo">A fazer</option>
          <option value="doing">Fazendo</option>
          <option value="done">Concluída</option>
        </select>

        <button
          type="submit"
          className="bg-gray-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-500 transition duration-300"
        >
          Adicionar Tarefa
        </button>
      </form>
    </div>
  );
}
