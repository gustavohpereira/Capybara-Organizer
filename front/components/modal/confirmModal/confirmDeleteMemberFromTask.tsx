import { IUser } from "@/types";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

export default function ConfirmDeleteMemberFromTask({closeModal,member,boardId}:{closeModal: () => void,member: IUser,boardId: number}) {

    async function deleteMemberFromBoard(){

        try{

            const data = {
                userId: member.id
            }
            

            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/board/${boardId}/members`, { data });
            console.log('Data sent successfully:', response.data);
            closeModal();
            window.location.reload();	
        }
        catch{

        }
    }




    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-slate-200 p-6 rounded-xl w-full max-w-md filter brightness-125 flex flex-col justify-start items-start border border-slate-500">
                <div className="flex justify-end w-full">
                    <button className="text-red-500 hover:text-red-600" onClick={closeModal}>
                        <IoMdClose size={30} />
                    </button>
                </div>
                <div className="w-full flex justify-start items-center mb-4">
                    <h3 className="font-medium text-xl">Remover membro</h3>
                </div>
                <div className="w-full flex justify-start items-center mb-4">
                    <p className="font-medium text-lg">Deseja remover o membro {member.name} da tarefa?</p>
                </div>
                <div className="w-full flex justify-start items-center mb-4">
                    <button className="bg-red-500 text-white p-2 rounded-lg" onClick={deleteMemberFromBoard}>Remover</button>
                </div>
            </div>
        </div>
    )   

}