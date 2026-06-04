import { IoMdClose } from "react-icons/io";
import { FaPlus, FaUsers } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { IUser, Task } from "@/types";
import { toast, ToastContainer } from "react-toastify";

interface IDetailTaskProps {
  taskData: Task;
  closeModal: () => void;
  boardMembers: IUser[];
}

export default function DetailTaskModal({ closeModal, taskData, boardMembers }: IDetailTaskProps) {

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editedTitle, setEditedTitle] = useState(taskData.title);
  const [editedDescription, setEditedDescription] = useState(taskData.description);

  const [taskTitle, setTaskTitle] = useState(taskData.title);
  const [taskDescription, setTaskDescription] = useState(taskData.description);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingMemberLoading, setIsAddingMemberLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  async function addMemberToTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAddingMemberLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const userId = formData.get('member');

      if (!userId) {
        notify_toasted("Selecione um usuário!", 'warning');
        setIsAddingMemberLoading(false);
        return;
      }

      const data = {
        taskId: taskData.id,
        userId: userId
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/task/addMember`, data);
      
      notify_toasted("Membro adicionado com sucesso!", 'success');
      setIsAddingMember(false);
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      notify_toasted("Erro ao adicionar membro. Tente novamente.", 'error');
    } finally {
      setIsAddingMemberLoading(false);
    }
  }

  async function att_tasks(tasks: Task) {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/task/${tasks.id}`,
        tasks
      );
      notify_toasted("Tarefa atualizada com sucesso!",'success');
      setTaskTitle(tasks.title);
      setTaskDescription(tasks.description);
      return response.data;
    } catch (error) {
      console.error("Error updating tasks:", error);
      notify_toasted("Erro ao atualizar a tarefa.",'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteTask() {
    const isConfirmed = window.confirm("Tem certeza de que deseja remover esta tarefa? Esta ação não pode ser desfeita.");
    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/task/${taskData.id}`);

      notify_toasted("Tarefa removida com sucesso!", 'success');
      closeModal();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      notify_toasted("Erro ao remover tarefa. Tente novamente.", 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  function notify_toasted(message: String, mode: String = 'default') {

    switch (mode) {
      case 'success':
        toast.success(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case 'warning':
        toast.warning(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      case 'error':
        toast.error(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        break;
      default:
        toast(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
    }
  }

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-slate-200 rounded-xl mt-12 w-full max-w-4xl flex flex-col justify-start items-start border border-slate-500 ">
        {/* Modal Header */}
        <div className="flex justify-between w-full border-b border-slate-500 pb-4 p-4">
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
        <div className="w-full flex flex-col justify-start items-center mb-4 p-4">
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
                <button className="text-teal-500 hover:text-teal-600" onClick={() => setIsAddingMember(true)} >
                  <FaPlus size={20} />
                </button>
              </div>

              <ul className="ml-8 list-disc text-gray-700">
                {taskData.users?.map((member: IUser, index: number) => (
                  <li key={index}>{member.name}</li>
                ))}

                {isAddingMember && (
                  <form onSubmit={addMemberToTask} className="flex gap-2 items-center">
                    <select className="border border-gray-300 p-2 text-lg w-full rounded-md" name="member" id="member" disabled={isAddingMemberLoading}>
                      <option value="">Selecione um usuário</option>
                      {boardMembers.map((member: IUser) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>

                    <button 
                      className={`${isAddingMemberLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white py-2 px-4 rounded mt-2`} 
                      type="submit"
                      disabled={isAddingMemberLoading}
                    >
                      {isAddingMemberLoading ? 'Adicionando...' : 'adicionar'}
                    </button>
                    <button 
                      className="py-2 px-4 rounded mt-2 hover:bg-gray-300" 
                      type="button"
                      onClick={() => setIsAddingMember(false)}
                      disabled={isAddingMemberLoading}
                    >
                      cancelar
                    </button>
                  </form>
                )}
              </ul>
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
                      notify_toasted("Título e descrição não podem estar vazios!",'warning');
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
          {
            isEditing == false && (

              <button
                className={`${isDeleting ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-600'}`}
                onClick={deleteTask}
                disabled={isDeleting}
              >
                {isDeleting ? 'Removendo...' : 'Remover'}
              </button>
            )
          }
        </div>

        {isSaving && <p className="text-gray-500 text-center">Salvando...</p>}
      </div>
      <ToastContainer />
    </div>
  );
}
