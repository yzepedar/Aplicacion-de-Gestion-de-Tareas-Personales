import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { actualizarEstadoTarea, crearTarea, getTableroData, eliminarTarea, actualizarTarea } from './api/tableroApi';

function App() {
  const [tablero, setTablero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    prioridad: 'Media'
  });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await getTableroData(2);
      setTablero(data);
    } catch (err) {
      console.error("Error al cargar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    try {
      await actualizarEstadoTarea(parseInt(draggableId), parseInt(destination.droppableId));
      await cargarDatos();
    } catch (err) {
      alert("No se pudo mover la tarea.");
      await cargarDatos();
    }
  };

  // --- LÓGICA US-05: ALTERNAR ESTADO ---
  const toggleCompletada = async (tarea: any) => {
    const colToDo = tablero?.columna?.find((c: any) => c.nombre.toUpperCase().includes('TO DO'));
    const colDone = tablero?.columna?.find((c: any) => c.nombre.toUpperCase().includes('DONE'));

    if (!colToDo || !colDone) return;

    // Si ya está en Done, el destino es To Do. Si no, es Done.
    const destinoId = tarea.columnaId === colDone.id ? colToDo.id : colDone.id;

    try {
      await actualizarEstadoTarea(tarea.id, destinoId);
      await cargarDatos(); // Reflejo inmediato
    } catch (err) {
      console.error("Error al alternar:", err);
    }
  };

  const handleGuardar = async () => {
    if (!nuevaTarea.titulo || !nuevaTarea.descripcion || !nuevaTarea.fechaLimite) {
      alert("Campos obligatorios");
      return;
    }
    try {
      if (editandoId) {
        await actualizarTarea(editandoId, nuevaTarea);
      } else {
        const firstColId = tablero?.columna?.[0]?.id || 5;
        await crearTarea({ ...nuevaTarea, tableroId: 2, columnaId: firstColId });
      }
      cerrarModal();
      await cargarDatos();
    } catch (err) {
      alert("Error al guardar.");
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm("¿Eliminar tarea?")) {
      try {
        await eliminarTarea(id);
        await cargarDatos();
      } catch (err) {
        alert("Error al eliminar.");
      }
    }
  };

  const abrirEditar = (t: any) => {
    setEditandoId(t.id);
    setNuevaTarea({
      titulo: t.titulo,
      descripcion: t.descripcion,
      fechaLimite: t.fecha_limite ? t.fecha_limite.split('T')[0] : '',
      prioridad: t.prioridad || 'Media'
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditandoId(null);
    setNuevaTarea({ titulo: '', descripcion: '', fechaLimite: '', prioridad: 'Media' });
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Cargando...</div>;

  return (
    <div className="flex h-screen bg-[#f4f7fe] overflow-hidden font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold shadow-lg shadow-blue-200">TB</div>
          <span className="text-xl font-bold text-slate-800">TaskBoard Pro</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-200">📊 Dashboard</button>
          <button className="w-full flex items-center gap-3 text-slate-400 p-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">📁 Mis tareas</button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Dashboard</h2>
            <p className="text-[11px] text-slate-400 font-medium">Gestiona tus tareas</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg active:scale-95 transition-all">
            + Nueva Tarea
          </button>
        </header>

        {/* Estadísticas */}
        <div className="px-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
          {[
            { label: 'Total', count: tablero?.columna?.reduce((acc: number, col: any) => acc + (col.tarea?.length || 0), 0) || 0, icon: '📝', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'En progreso', count: tablero?.columna?.find((c: any) => c.nombre.toUpperCase().includes('PROGRESS'))?.tarea?.length || 0, icon: '🔄', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Completadas', count: tablero?.columna?.find((c: any) => c.nombre.toUpperCase().includes('DONE'))?.tarea?.length || 0, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all">
              <div className="flex flex-col">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.count}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-lg`}>{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <div className="flex-1 overflow-y-auto p-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {tablero?.columna?.map((col: any) => (
                <div key={col.id} className="bg-slate-100/40 rounded-[2rem] flex flex-col min-h-[500px] border border-slate-200/50">
                  <div className="flex justify-between items-center p-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.nombre.toUpperCase().includes('DONE') ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <h3 className="font-black text-slate-600 text-[10px] uppercase tracking-tighter">{col.nombre}</h3>
                    </div>
                    <span className="bg-white text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-lg shadow-sm">{col.tarea?.length || 0}</span>
                  </div>

                  <Droppable droppableId={col.id.toString()}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 px-4 pb-4 space-y-3">
                        {col.tarea?.map((t: any, index: number) => (
                          <Draggable key={t.id.toString()} draggableId={t.id.toString()} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-slate-200/60 transition-all group">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-slate-800 text-sm leading-tight flex-1">{t.titulo}</h4>
                                  <div className="flex gap-1 ml-2">
                                    {/* BOTÓN */}
                                    <button onClick={() => toggleCompletada(t)} className={`p-1 rounded-md transition-all ${col.nombre.toUpperCase().includes('DONE') ? 'text-green-500 bg-green-50 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-green-500 hover:bg-green-50'}`}>
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                    <button onClick={() => abrirEditar(t)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-md transition-all">✏️</button>
                                    <button onClick={() => handleEliminar(t.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all">🗑️</button>
                                  </div>
                                </div>
                                <p className="text-slate-400 text-[11px] mb-4 line-clamp-1">{t.descripcion}</p>
                                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                  <span className="text-[10px] text-slate-400 font-bold">🗓️ {t.fecha_limite ? new Date(t.fecha_limite).toLocaleDateString() : 'S/F'}</span>
                                  <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${t.prioridad === 'Alta' ? 'bg-red-50 text-red-500' : t.prioridad === 'Baja' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                                    {t.prioridad || 'Media'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-slate-800">{editandoId ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Título" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={nuevaTarea.titulo} onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })} />
              <textarea placeholder="Descripción" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-28 outline-none resize-none" value={nuevaTarea.descripcion} onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })} />
              <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={nuevaTarea.fechaLimite} onChange={(e) => setNuevaTarea({ ...nuevaTarea, fechaLimite: e.target.value })} />
              <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none cursor-pointer" value={nuevaTarea.prioridad} onChange={(e) => setNuevaTarea({ ...nuevaTarea, prioridad: e.target.value })}>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
              <div className="flex gap-4 mt-6">
                <button onClick={cerrarModal} className="flex-1 p-4 bg-slate-100 text-slate-500 rounded-2xl font-black">CANCELAR</button>
                <button onClick={handleGuardar} className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg">GUARDAR</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;