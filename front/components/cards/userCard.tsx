import { IoMdClose } from "react-icons/io";
import { useState } from "react";

interface Board {
  id: number;
  title: string;
  createdAt: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  boards: Board[];
}

export default function UserCard({ user }: { user: User }) {
  const [deleting, setDeleting] = useState(false);

  const handleUserDelete = async () => {
    const isConfirmed = window.confirm("Tem certeza que deseja remover este usuário?");

    if (!isConfirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Usuário removido com sucesso.");
        // Você pode usar um callback de remoção em vez de reload
        window.location.reload();
      } else {
        alert("Erro ao remover usuário.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao remover usuário.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full sm:w-[300px] p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 relative">
      <button
        className="absolute top-4 right-4 text-red-500 hover:bg-red-100 p-1 rounded-full transition-colors"
        onClick={handleUserDelete}
        disabled={deleting}
        title="Remover usuário"
      >
        <IoMdClose size={18} />
      </button>

      <div className="flex flex-col items-center text-center gap-2">
        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
          {user.role}
        </span>
        <p className="text-sm text-gray-600">Boards: <strong>{user.boards.length}</strong></p>
      </div>

      {deleting && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl">
          <p className="text-gray-700 font-medium">Removendo...</p>
        </div>
      )}
    </div>
  );
}
