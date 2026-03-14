interface TareaModalProps {
    show: boolean;
    editandoId: number | null;
    tarea: {
        titulo: string;
        descripcion: string;
        fechaLimite: string;
        prioridad: string;
    };
    setTarea: (tarea: any) => void;
    onClose: () => void;
    onSave: () => void;
}

export const TareaModal = ({
    show,
    editandoId,
    tarea,
    setTarea,
    onClose,
    onSave
}: TareaModalProps) => {

    // Si show es false, no renderizamos nada
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
                <h3 className="text-2xl font-black mb-6 text-slate-800">
                    {editandoId ? 'Editar Tarea' : 'Nueva Tarea'}
                </h3>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Título"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold focus:ring-2 focus:ring-blue-500 transition-all"
                        value={tarea.titulo}
                        onChange={(e) => setTarea({ ...tarea, titulo: e.target.value })}
                    />

                    <textarea
                        placeholder="Descripción"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-28 outline-none resize-none font-semibold focus:ring-2 focus:ring-blue-500 transition-all"
                        value={tarea.descripcion}
                        onChange={(e) => setTarea({ ...tarea, descripcion: e.target.value })}
                    />

                    <input
                        type="date"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold focus:ring-2 focus:ring-blue-500 transition-all"
                        value={tarea.fechaLimite}
                        onChange={(e) => setTarea({ ...tarea, fechaLimite: e.target.value })}
                    />

                    <select
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all"
                        value={tarea.prioridad}
                        onChange={(e) => setTarea({ ...tarea, prioridad: e.target.value })}
                    >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 p-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-colors"
                        >
                            CANCELAR
                        </button>
                        <button
                            onClick={onSave}
                            className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            GUARDAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};