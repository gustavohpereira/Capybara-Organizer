
export default function EditingTaskDetail({ setIsEditing }: { setIsEditing: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <div className="">

            {/* modal body  */}
            <div className="w-full flex flex-col justify-start p-6 items-center mb-4">
                <section className=" flex flex-col gap-4 text-start w-full">
                    <div className="flex flex-col items-start justify-start gap-2">
                        <label htmlFor="editTitulo" className="font-bold text-2xl">Titulo</label>
                        <input type="text" id="editTitulo" className="border border-slate-500 rounded-md text-black p-2" />
                    </div>

                    <div className="flex flex-col items-start justify-start gap-2">
                        <label htmlFor="editDescricao" className="font-bold text-2xl">Descricao</label>
                        <input type="textArea" id="editDescricao" className="border border-slate-500 rounded-md text-black p-2" />
                    </div>
                </section>
            </div>


            {/* modal footer */}
            <div className="w-full flex justify-end items-center border-t border-slate-500 py-6 px-6 gap-4">

                <button onClick={() => setIsEditing(false)}>
                    <h1 className="text-red-500 hover:text-red-600" >Cancelar</h1>
                </button>
                <div className="flex gap-4">
                </div>
                <div className="flex gap-4">
                    <button>
                        <h1 className="text-teal-500 hover:text-teal-600">Editar</h1>
                    </button>
                </div>


            </div>
        </div>
    )
}