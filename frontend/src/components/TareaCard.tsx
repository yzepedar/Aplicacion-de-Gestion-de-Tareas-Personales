import { Draggable } from '@hello-pangea/dnd';

export const TareaCard = ({ tarea, index, isDone, onToggle, onEdit, onDelete }: any) => {
    return (
        <Draggable draggableId={tarea.id.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-slate-200/60 transition-all group hover:shadow-md"
                >
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 text-sm leading-tight flex-1">{tarea.titulo}</h4>
                        <div className="flex gap-1 ml-2">
                            <button
                                onClick={() => onToggle(tarea)}
                                className={`p-1 rounded-md transition-all ${isDone ? 'text-green-500 bg-green-50 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-green-500 hover:bg-green-50'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                            <button onClick={() => onEdit(tarea)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-md transition-all">✏️</button>
                            <button onClick={() => onDelete(tarea.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all">🗑️</button>
                        </div>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-4 line-clamp-1">{tarea.descripcion}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400 font-bold">
                            🗓️ {tarea.fecha_limite ? tarea.fecha_limite.toString().split('T')[0] : 'Sin fecha'}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${tarea.prioridad === 'Alta' ? 'bg-red-50 text-red-500' :
                                tarea.prioridad === 'Baja' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'
                            }`}>
                            {tarea.prioridad || 'Media'}
                        </span>
                    </div>
                </div>
            )}
        </Draggable>
    );
};