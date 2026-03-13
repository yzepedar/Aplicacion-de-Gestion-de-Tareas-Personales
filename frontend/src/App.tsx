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