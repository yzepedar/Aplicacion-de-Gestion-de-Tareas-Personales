interface StatCardsProps {
    tablero: any; // El objeto del tablero que viene de tu API
}

export const StatCards = ({ tablero }: StatCardsProps) => {
    // --- LÓGICA DE CÁLCULO ---
    // Extraemos los cálculos aquí para no tener "código espagueti" dentro del JSX

    const total = tablero?.columna?.reduce(
        (acc: number, col: any) => acc + (col.tarea?.length || 0), 0
    ) || 0;

    const enProgreso = tablero?.columna?.find(
        (c: any) => c.nombre.toUpperCase().includes('PROGRESS')
    )?.tarea?.length || 0;

    const completadas = tablero?.columna?.find(
        (c: any) => c.nombre.toUpperCase().includes('DONE')
    )?.tarea?.length || 0;

    // Definimos la estructura de las tarjetas
    const stats = [
        { label: 'Total', count: total, icon: '📝', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'En progreso', count: enProgreso, icon: '🔄', color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Completadas', count: completadas, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' }
    ];

    return (
        <div className="px-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all"
                >
                    <div className="flex flex-col">
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                            {stat.label}
                        </p>
                        <p className={`text-2xl font-black ${stat.color}`}>
                            {stat.count}
                        </p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-lg shadow-inner`}>
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};