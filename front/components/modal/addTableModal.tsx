import { IoMdClose } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IUser } from "@/types";

export default function AddTableModal({ closeModal, user }: { closeModal: () => void, user: IUser }) {
    const [boardName, setBoardName] = useState('');
    const [email, setEmail] = useState('');
    const [members, setMembers] = useState<IUser[]>([user]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [addingMember, setAddingMember] = useState(false);
    const [success, setSuccess] = useState(false);
    const boardNameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        boardNameRef.current?.focus();
    }, []);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!boardName.trim()) {
            setError("O nome da board é obrigatório.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const BoardData = {
                title: boardName.trim(),
                userId: user.id,
                members: members,
            };
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/board`, BoardData);
            setSuccess(true);
            setTimeout(() => {
                closeModal();
                if (response.status >= 200 && response.status < 300) {
                    window.location.reload();
                }
            }, 1000);
        } catch (err: any) {
            setError("Erro ao criar a board. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function addMemberByEmail() {
        setError(null);
        if (!email) return;
        setAddingMember(true);
        // Prevent adding the same member twice
        if (members.some(m => m.email === email)) {
            setError("Usuário já adicionado.");
            setAddingMember(false);
            return;
        }
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getUserByEmail/${encodeURIComponent(email)}`);
            const userToAdd = res.data;
            if (userToAdd && userToAdd.id && !members.some(m => m.id === userToAdd.id)) {
                setMembers([...members, userToAdd]);
                setEmail('');
            } else {
                setError("Usuário não encontrado ou já adicionado.");
            }
        } catch {
            setError("Usuário não encontrado.");
        } finally {
            setAddingMember(false);
        }
    }

    function removeMember(id: number) {
        setMembers(members.filter(member => member.id !== id));
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
        setError(null);
    }

    function handleBoardNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setBoardName(e.target.value);
        setError(null);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-slate-200 p-6 rounded-xl w-full max-w-md filter brightness-125 flex flex-col justify-start items-start border-1 border-slate-500 relative">
                <div className="flex justify-end w-full">
                    <button
                        className={`text-red-500 hover:text-red-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => !loading && closeModal()}
                        disabled={loading}
                        aria-label="Fechar modal"
                    >
                        <IoMdClose size={30} />
                    </button>
                </div>
                <div className="w-full flex justify-center items-center mb-4">
                    <h3 className="font-medium text-xl">Nova Board</h3>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-white">
                    <input
                        ref={boardNameRef}
                        type="text"
                        className="w-full border border-gray-500 text-black placeholder-gray-500 p-2 rounded-lg"
                        placeholder="Nome da Board"
                        value={boardName}
                        onChange={handleBoardNameChange}
                        required
                        disabled={loading}
                        autoFocus
                    />

                    {/* Adicionar membros por email */}
                    <div className="flex items-center gap-2">
                        <input
                            type="email"
                            className="border border-gray-500 text-black p-2 rounded-lg w-full"
                            placeholder="Digite o email do usuário"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={addingMember || loading}
                        />
                        <button
                            type="button"
                            onClick={addMemberByEmail}
                            className={`bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center ${addingMember || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={addingMember || loading}
                        >
                            {addingMember ? (
                                <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : null}
                            +
                        </button>
                    </div>
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">Board criada com sucesso!</div>}

                    {/* Exibir membros selecionados */}
                    <div className="flex flex-wrap gap-2">
                        {members.map((m) => (
                            <div key={m.id} className="bg-white border border-teal-600 text-black px-3 py-1 rounded-lg flex items-center shadow-sm">
                                <span className="font-medium">{m.name || m.email}</span>
                                {m.email && m.name && (
                                    <span className="ml-2 text-xs text-gray-500">{m.email}</span>
                                )}
                                {m.id !== user.id && (
                                    <button
                                        onClick={() => removeMember(m.id)}
                                        className="ml-2 text-red-500 hover:text-red-600"
                                        type="button"
                                        disabled={loading}
                                        aria-label="Remover membro"
                                    >
                                        <IoMdClose size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={`bg-teal-600 px-4 py-2 rounded-lg mt-4 hover:bg-teal-700 transition duration-300 flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        ) : null}
                        Adicionar Board
                    </button>
                </form>
            </div>
        </div>
    );
}
