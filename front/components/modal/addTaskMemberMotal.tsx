import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function AddTaskMemberModal({ closeModal, boardId }: { closeModal: () => void, boardId: number }) {

    const [members, setMembers] = useState<any[]>([]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const userId = formData.get('member');

        const data = {
            userId: userId
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/board/${boardId}/members`, data);
        console.log('Data sent successfully:', response.data);

        closeModal();
        window.location.reload();
    }

    useEffect(() => {
        async function getMembers() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/`);
                console.log('Data received:', response.data);
                setMembers(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        getMembers();
    }, []);



    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-slate-200 p-6 rounded-xl w-full max-w-md filter brightness-125 flex flex-col justify-start items-start border border-slate-500">
            <div className="flex justify-end w-full mb-4">
                <button className="text-red-500 hover:text-red-600" onClick={closeModal}>
                <IoMdClose size={30} />
                </button>
            </div>
            <div className="w-full flex justify-start items-center mb-8">
                <h3 className="font-medium text-xl">Adicionar membro</h3>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-black">
                <label htmlFor="member" className="font-medium text-sm">Selecione um membro:</label>
                <select
                name="member"
                id="member"
                className="w-full bg-slate-50 p-2 rounded-lg"
                >
                {members.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                ))}
                </select>

                <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg mt-8 hover:bg-teal-700 transition duration-300"
                >
                Adicionar Membro
                </button>
            </form>
            </div>
        </div>
    );
}