import { IoMdClose } from "react-icons/io";
import { FaPlus, FaUsers } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { Task } from "@/types";

interface IDetailTaskProps {
  taskData: Task;
  closeModal: () => void;
}

export default function DetailTaskModal({ closeModal, taskData }: IDetailTaskProps) {
  const [editedTitle, setEditedTitle] = useState(taskData.title);
  const [editedDescription, setEditedDescription] = useState(taskData.description);

  const [taskTitle, setTaskTitle] = useState(taskData.title);
  const [taskDescription, setTaskDescription] = useState(taskData.description);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function att_tasks(tasks: Task) {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/task/${tasks.id}`,
        tasks
      );
      console.log("Data sent successfully:", response.data);
      alert("Tarefa atualizada com sucesso!");
      setTaskTitle(tasks.title);
      setTaskDescription(tasks.description);
      return response.data;
    } catch (error) {
      console.error("Error updating tasks:", error);
      alert("Erro ao atualizar a tarefa.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-slate-200 rounded-xl mt-12 w-full max-w-4xl flex flex-col justify-start items-start border border-slate-500 p-4 md:p-6">
        {/* Modal Header */}
        <div className="flex justify-between w-full border-b border-slate-500 pb-4">
          <h3 className="font-medium text-lg md:text-xl">Inspecionar Tarefa</h3>
          <button
            aria-label="Fechar modal"
            className="text-red-500 hover:text-red-600"
            onClick={closeModal}
          >
            <IoMdClose size={30} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="w-full flex flex-col justify-start items-center mb-4">
          <section className="text-start w-full">
            <div className="pt-4 flex gap-4 items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border border-gray-300 p-2 text-4xl font-bold w-full rounded-md"
                  placeholder="Digite o título da tarefa"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-4xl font-bold cursor-pointer"
                  onClick={() => {
                    setEditedTitle(taskTitle);
                    setIsEditing(true);
                  }}
                >
                  {taskTitle}
                </h2>
              )}
            </div>
            <div className="mt-4">
              {isEditing ? (
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="border border-gray-300 p-2 text-lg w-full rounded-md"
                  placeholder="Digite a descrição da tarefa"
                />
              ) : (
                <p className="text-sm text-gray-500 ml-2">{taskDescription}</p>
              )}
            </div>
          </section>

          <section className="text-start w-full mt-10">
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="flex items-center gap-2">
                <FaUsers size={25} />
                <h1 className="text-xl">Membros da tarefa</h1>
              </div>

              <button
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-1 px-4 rounded"
                aria-label="Adicionar Membro"
              >
                <FaPlus size={20} />
                <h2 className="text-md">Adicionar Membro</h2>
              </button>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="w-full flex justify-end items-center border-t border-slate-500 py-6 px-2 gap-4">
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  onClick={() => {
                    if (!editedTitle.trim() || !editedDescription.trim()) {
                      alert("Título e descrição não podem estar vazios!");
                      return;
                    }
                    const updatedTask = {
                      ...taskData,
                      title: editedTitle,
                      description: editedDescription,
                    };
                    att_tasks(updatedTask);
                    setIsEditing(false);
                  }}
                >
                  Salvar
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                className="text-teal-500 hover:text-teal-600"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
            )}
          </div>
          <button
            className="text-red-500 hover:text-red-600"
            onClick={() => {
              if (confirm("Tem certeza de que deseja remover esta tarefa?")) {
                // Lógica de remoção
              }
            }}
          >
            Remover
          </button>
        </div>

        {isSaving && <p className="text-gray-500 text-center">Salvando...</p>}
      </div>
    </div>
  );
}
