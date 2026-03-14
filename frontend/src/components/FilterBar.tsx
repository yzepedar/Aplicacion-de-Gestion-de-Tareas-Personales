
// Definimos los tipos permitidos para el filtro
type TipoFiltro = 'Todas' | 'Pendiente' | 'Completada';

interface FilterBarProps {
    filtro: TipoFiltro;
    setFiltro: (filtro: TipoFiltro) => void;
}

export const FilterBar = ({ filtro, setFiltro }: FilterBarProps) => {
    const opciones: TipoFiltro[] = ['Todas', 'Pendiente', 'Completada'];

    // Función auxiliar para obtener el color dinámico
    const getButtonStyles = (op: TipoFiltro) => {
        if (filtro !== op) return 'bg-white text-slate-400 border border-slate-200';

        switch (op) {
            case 'Todas': return 'bg-gray-600 text-white shadow-lg';
            case 'Pendiente': return 'bg-orange-500 text-white shadow-lg';
            case 'Completada': return 'bg-green-600 text-white shadow-lg';
            default: return '';
        }
    };

    return (
        <div className="px-8 mt-6 flex gap-2 shrink-0">
            {opciones.map((op) => (
                <button
                    key={op}
                    onClick={() => setFiltro(op)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${getButtonStyles(op)}`}
                >
                    {op}
                </button>
            ))}
        </div>
    );
};