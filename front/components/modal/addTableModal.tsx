import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddTableModal({ closeModal, user }: { closeModal: () => void, user: any }) {
    const [boardName, setBoardName] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [members, setMembers] = useState<any[]>([user]); 

    async function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();

        const BoardData = {
            title: boardName,
            userId: user.id,
            members: members,
        };
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/board`, BoardData);
        console.log('Data sent successfully:', response.data);

        closeModal();
    }

    function addMember() {
        const userToAdd = users.find(u => u.id == selectedUserId);
        if (userToAdd && !members.some(m => m.id === userToAdd.id)) { 
            setMembers([...members, userToAdd]);
        }
    }

    function removeMember(id: string) {
        setMembers(members.filter(member => member.id !== id));
    }

    useEffect(() => {
        async function getUsersData() {
            const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/`);
            if (usersResponse) {
                setUsers(usersResponse.data);
            }
        }
        getUsersData();
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-slate-200 p-6 rounded-xl w-full max-w-md filter brightness-125 flex flex-col justify-start items-start border-1 border-slate-500">
                <div className="flex justify-end w-full">
                    <button className="text-red-500 hover:text-red-600" onClick={closeModal}>
                        <IoMdClose size={30} />
                    </button>
                </div>
                <div className="w-full flex justify-center items-center mb-4">
                    <h3 className="font-medium text-xl">Nova Board</h3>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-white">
                    <input
                        type="text"
                        className="w-full border border-gray-500 text-black placeholder-gray-500 p-2 rounded-lg"
                        placeholder="Nome da Board"
                        onChange={(e) => setBoardName(e.target.value)}
                        required
                    />

                    {/* Selecionar e adicionar membros */}
                    <div className="flex items-center gap-2">
                        <select
                            className="border border-gray-500 text-black p-2 rounded-lg w-full"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="" disabled>Selecione um usuário</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                        <button type="button" onClick={addMember} className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700">
                            Adicionar
                        </button>
                    </div>

                    {/* Exibir membros selecionados */}
                    <div className="flex flex-wrap gap-2">
                        {members.map((m) => (
                            <div key={m.id} className="bg-gray-300 text-black px-3 py-1 rounded-lg flex items-center">
                                {m.name}
                                <button
                                    onClick={() => removeMember(m.id)}
                                    className="ml-2 text-red-500 hover:text-red-600"
                                >
                                    <IoMdClose size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="bg-teal-600 px-4 py-2 rounded-lg mt-4 hover:bg-teal-700 transition duration-300"
                    >
                        Adicionar Board
                    </button>
                </form>
            </div>
        </div>
    );
}
