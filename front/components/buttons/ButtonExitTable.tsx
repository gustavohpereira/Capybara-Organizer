import axios from "axios";
import { toast } from "react-toastify";

interface IButtonExitTableProps {
    id_usuario: string;
    id_table: string;
}

export default function ButtonExitTable({ id_usuario, id_table }: IButtonExitTableProps) {

    async function deleteMemberFromBoard() {
        try {
            const data = {
                userId: id_usuario
            };
            if (!window.confirm("Tem certeza que deseja sair da mesa?")) {
                return;
            }

            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/board/${id_table}/members`,
                { data }
            );
            toast.success('Você saiu da mesa com sucesso!');
            window.location.reload();
        } catch (error) {
            toast.error('Erro ao sair da mesa.');
            console.error('Error deleting member:', error);
        }
    }

    function handleClick() {
        toast.info(
            <div>
                Tem certeza que deseja sair da mesa?
                <div style={{ marginTop: 8 }}>
                    <button onClick={deleteMemberFromBoard} style={{ marginRight: 8 }}>Sim</button>
                    <button onClick={() => toast.dismiss()}>Não</button>
                </div>
            </div>,
            { autoClose: false }
        );
    }

    return (
        <button onClick={handleClick}>
            Sair da Mesa
        </button>
    );
}