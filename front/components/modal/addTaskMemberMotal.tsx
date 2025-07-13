import axios from "axios";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function AddTaskMemberModal({ closeModal, boardId }: { closeModal: () => void, boardId: number }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            // Get user by email
            const userRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/getUserByEmail/${encodeURIComponent(email)}`
            );
            const user = userRes.data;
            if (!user?.id) {
            setError("Usuário não encontrado.");
            setLoading(false);
            return;
            }

            // Add user to board
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/board/${boardId}/members`, {
            userId: user.id,
            });

            setSuccess(true);
            setTimeout(() => {
            closeModal();
            window.location.reload();
            }, 1000);
        } catch (err) {
            if (axios.isAxiosError(err)) {
            setError(
                err.response?.data?.message ||
                "Erro ao adicionar membro. Verifique o email e tente novamente."
            );
            } else {
            setError("Erro ao adicionar membro. Verifique o email e tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-slate-200 p-6 rounded-xl w-full max-w-md filter brightness-125 flex flex-col justify-start items-start border border-slate-500">
                <div className="flex justify-end w-full mb-4">
                    <button className="text-red-500 hover:text-red-600" onClick={closeModal}>
                        <IoMdClose size={30} />
                    </button>
                </div>
                <div className="w-full flex justify-start items-center mb-8">
                    <h3 className="font-medium text-xl">Adicionar membro por email</h3>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-black">
                    <label htmlFor="email" className="font-medium text-sm">
                        Email do membro:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full bg-slate-50 p-2 rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="exemplo@email.com"
                        disabled={loading}
                    />

                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">Membro adicionado com sucesso!</div>}

                    <button
                        type="submit"
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg mt-8 hover:bg-teal-700 transition duration-300 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Adicionando..." : "Adicionar Membro"}
                    </button>
                </form>
            </div>
        </div>
    );
}