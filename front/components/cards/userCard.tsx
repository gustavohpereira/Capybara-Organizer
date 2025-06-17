import { IoMdClose } from "react-icons/io";

export default function UserCard({ user }: { user: { id: number; name: string; email: string; role: string, boards: { id: number; title: string, createdAt: Date }[]; } }) {

    const handleUserDelete = async () => {
        const isConfirmed = window.confirm('Tem certeza que deseja remover este usuario?');

        if (!isConfirmed) {
            return;
        }

        const response = await fetch(`/user/${user.id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            window.location.reload();
        }

    }




    return (
        <div className="w-1/3 p-8 bg-white rounded-lg shadow-md">
            <div className="flex justify-end">

                <button
                    className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full duration-300"
                    onClick={(e) => {
                        handleUserDelete();
                    }}
                >
                    <IoMdClose size={20} />
                </button>
            </div>
            <div className="flex flex-col items-center justify-center mb-4">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500 font-light">{user.email}</p>
            </div>
            <p>Role: {user.role}</p>
            <p>Boards: {user.boards.length}</p>
        </div>
    )
}