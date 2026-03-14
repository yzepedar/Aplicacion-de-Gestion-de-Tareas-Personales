import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { TareaCard } from './TareaCard';

export const KanbanBoard = ({ tablero, filtro, busqueda, onDragEnd, onToggle, onEdit, onDelete }: any) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {tablero?.columna
                    ?.filter((col: any) => {
                        if (filtro === 'Todas') return true;
                        const esDone = col.nombre.toUpperCase().includes('DONE');
                        return filtro === 'Completada' ? esDone : !esDone;
                    })
                    .map((col: any) => {
                        const tareasFiltradas = col.tarea?.filter((t: any) =>
                            t.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
                        );
                        const isDone = col.nombre.toUpperCase().includes('DONE');

                        return (
                            <div key={col.id} className="bg-slate-100/40 rounded-[2rem] flex flex-col min-h-[500px] border border-slate-200/50">
                                <div className="flex justify-between items-center p-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                        <h3 className="font-black text-slate-600 text-[10px] uppercase tracking-tighter">{col.nombre}</h3>
                                    </div>
                                    <span className="bg-white text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-lg shadow-sm">
                                        {tareasFiltradas?.length || 0}
                                    </span>
                                </div>

                                <Droppable droppableId={col.id.toString()}>
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 px-4 pb-4 space-y-3">
                                            {tareasFiltradas && tareasFiltradas.length > 0 ? (
                                                tareasFiltradas.map((t: any, index: number) => (
                                                    <TareaCard
                                                        key={t.id}
                                                        tarea={t}
                                                        index={index}
                                                        isDone={isDone}
                                                        onToggle={onToggle}
                                                        onEdit={onEdit}
                                                        onDelete={onDelete}
                                                    />
                                                ))
                                            ) : (
                                                <div className="text-center py-10">
                                                    <p className="text-slate-400 text-[10px] font-medium uppercase italic">Sin resultados</p>
                                                </div>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
            </div>
        </DragDropContext>
    );
};