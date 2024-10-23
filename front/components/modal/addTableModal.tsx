import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

export default function AddTableModal({ closeModal,userId}: { closeModal: () => void,userId:number }) {
    const [boardName, setBoardName] = useState('');

    async function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();

        const BoardData = {
            title: boardName,
            userId: userId,
            members: [userId],
        };


        const response = await axios.post(`http://localhost:8080/board`, BoardData);
        console.log('Data sent successfully:', response.data);

        closeModal();
        window.location.reload();

    }

    return (
        <div className="bg-gray-800  p-8 rounded-xl w-full  filter brightness-125 flex flex-col justify-start items-start">
            <div className="w-full flex justify-between items-center mb-4">
                <h3 className="text-white font-medium text-xl">Nova Board</h3>
                <button className="text-white" onClick={closeModal}>
                    <IoMdClose size={35} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-white">
                <input
                    type="text"
                    className="w-full bg-gray-600 text-white p-2 rounded-lg"
                    placeholder="Nome da Board"
                    onChange={(e) => setBoardName(e.target.value)}
                    required
                />



                <button
                    type="submit"
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-gray-500 transition duration-300"
                >
                    Adicionar Board
                </button>
            </form>
        </div>
    );
}
