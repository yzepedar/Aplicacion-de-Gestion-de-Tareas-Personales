import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { actualizarEstadoTarea, crearTarea, getTableroData } from './api/tableroApi';

function App() {
  const [tablero, setTablero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  // Función para manejar el final del arrastre (Actualización de Estado/Base de Datos)
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // 1. Si se soltó fuera de una columna o en el mismo lugar, no hacemos nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // 2. Extraemos los IDs (convertimos a número porque vienen como string del dnd)
    const tareaId = parseInt(draggableId);
    const nuevaColumnaId = parseInt(destination.droppableId);

    try {
      // 3. Llamada optimista (Actualizamos en el servidor)
      await actualizarEstadoTarea(tareaId, nuevaColumnaId);

      // 4. Recargamos los datos para que el frontend refleje el cambio real del backend
      await cargarDatos();

      console.log(`✅ Tarea ${tareaId} movida con éxito a columna ${nuevaColumnaId}`);
    } catch (err) {
      alert("No se pudo mover la tarea. Intenta de nuevo.");
      await cargarDatos();
    }
  };

  const handleGuardar = async () => {
    if (!nuevaTarea.titulo || !nuevaTarea.descripcion || !nuevaTarea.fechaLimite) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    try {
      const targetColumnaId = tablero?.columna?.[0]?.id || 5;
      await crearTarea({
        ...nuevaTarea,
        tableroId: 2,
        columnaId: targetColumnaId
      });
      setShowModal(false);
      setNuevaTarea({ titulo: '', descripcion: '', fechaLimite: '', prioridad: 'Media' });
      await cargarDatos();
    } catch (err) {
      alert("Error al guardar.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Cargando Tablero...</div>;

  return (
    <div className="flex h-screen bg-[#f4f7fe] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold shadow-lg shadow-blue-200">TB</div>
          <span className="text-xl font-bold text-slate-800">TaskBoard Pro</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-transform active:scale-95">📊 Dashboard</button>
          <button className="w-full flex items-center gap-3 text-slate-400 p-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">📁 Mis tareas</button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Dashboard</h2>
            <p className="text-[11px] text-slate-400 font-medium">Gestiona tus tareas arrastrándolas entre columnas</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center gap-2 active:scale-95">
            <span className="text-xl">+</span> Nueva Tarea
          </button>
        </header>

        {/* SECCIÓN DE ESTADÍSTICAS */}
        <div className="px-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
          {[
            { label: 'Total', count: tablero?.columna?.reduce((acc: number, col: any) => acc + (col.tarea?.length || 0), 0) || 0, icon: '📝', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'En progreso', count: tablero?.columna?.find((c: any) => c.nombre.toUpperCase().includes('PROGRESS'))?.tarea?.length || 0, icon: '🔄', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Completadas', count: tablero?.columna?.find((c: any) => c.nombre.toUpperCase().includes('DONE'))?.tarea?.length || 0, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
              <div className="flex flex-col">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.count}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-lg shadow-inner`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ÁREA KANBAN */}
        <div className="flex-1 overflow-y-auto p-8">
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Cambiamos de 'flex' a 'grid' con 3 columnas iguales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
              {tablero?.columna?.map((col: any) => (
                <div key={col.id} className="bg-slate-100/40 rounded-[2rem] flex flex-col min-h-[500px] border border-slate-200/50">

                  {/* Header de Columna */}
                  <div className="flex justify-between items-center p-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.nombre.toUpperCase().includes('DONE') ? 'bg-green-500' :
                        col.nombre.toUpperCase().includes('PROGRESS') ? 'bg-blue-500' : 'bg-blue-400'
                        }`}></div>
                      <h3 className="font-black text-slate-600 text-[10px] uppercase tracking-tighter">{col.nombre}</h3>
                    </div>
                    <span className="bg-white text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-lg shadow-sm">
                      {col.tarea?.length || 0}
                    </span>
                  </div>

                  {/* Área de soltado (Droppable) */}
                  <Droppable droppableId={col.id.toString()}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 px-4 pb-4 space-y-3"
                      >
                        {col.tarea?.map((t: any, index: number) => (
                          <Draggable key={t.id.toString()} draggableId={t.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-slate-200/60 transition-all hover:shadow-md"
                              >
                                <h4 className="font-bold text-slate-800 text-sm mb-1">{t.titulo}</h4>
                                <p className="text-slate-400 text-[11px] mb-4 line-clamp-1">{t.descripcion}</p>

                                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                  <span className="text-[10px] text-slate-400 font-bold">🗓️ {t.fecha_limite ? new Date(t.fecha_limite).toLocaleDateString() : 'S/F'}</span>
                                  <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${t.prioridad === 'Alta' ? 'bg-red-50 text-red-500' :
                                    t.prioridad === 'Baja' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'
                                    }`}>
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
            <h3 className="text-2xl font-black mb-6 text-slate-800">Nueva Tarea</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Título" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" value={nuevaTarea.titulo} onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })} />
              <textarea placeholder="Descripción" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-28 outline-none resize-none font-semibold" value={nuevaTarea.descripcion} onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })} />
              <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" value={nuevaTarea.fechaLimite} onChange={(e) => setNuevaTarea({ ...nuevaTarea, fechaLimite: e.target.value })} />

              {/* SELECTOR DE PRIORIDAD */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Prioridad</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold cursor-pointer" value={nuevaTarea.prioridad} onChange={(e) => setNuevaTarea({ ...nuevaTarea, prioridad: e.target.value })}>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 p-4 bg-slate-100 text-slate-500 rounded-2xl font-black">CANCELAR</button>
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