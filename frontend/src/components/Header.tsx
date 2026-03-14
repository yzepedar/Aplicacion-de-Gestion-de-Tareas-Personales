interface HeaderProps {
    busqueda: string;
    setBusqueda: (valor: string) => void;
    onNuevo: () => void;
}

export const Header = ({ busqueda, setBusqueda, onNuevo }: HeaderProps) => {
    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-8 flex-1">
                {/* Título y Subtítulo */}
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Dashboard</h2>
                    <p className="text-[11px] text-slate-400 font-medium">Gestiona tus tareas arrastrándolas</p>
                </div>

                {/* BARRA DE BÚSQUEDA */}
                <div className="relative w-full max-w-md hidden md:block">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por descripción..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* Botón de Acción */}
            <button
                onClick={onNuevo}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
            >
                + Nueva Tarea
            </button>
        </header>
    );
};