import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  actualizarEstadoTarea,
  crearTarea,
  getTableroData,
  eliminarTarea,
  actualizarTarea
} from './api/tableroApi';
import Swal from 'sweetalert2';

// 1. Definimos el estado inicial 
const ESTADO_INICIAL_TAREA = {
  titulo: '',
  descripcion: '',
  fechaLimite: '',
  prioridad: 'Media'
};

function App() {
  const [tablero, setTablero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<'Todas' | 'Pendiente' | 'Completada'>('Todas');
  const [busqueda, setBusqueda] = useState('');

  // Estado de la tarea
  const [nuevaTarea, setNuevaTarea] = useState(ESTADO_INICIAL_TAREA);

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

  // --- LÓGICA DE ARRASTRE ---
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    try {
      await actualizarEstadoTarea(parseInt(draggableId), parseInt(destination.droppableId));
      await cargarDatos();
    } catch (err) {
      alert("Error al mover la tarea.");
      await cargarDatos();
    }
  };

  // --- US-05: ALTERNAR ESTADO (CHECK) ---
  const toggleCompletada = async (tarea: any) => {
    const colToDo = tablero?.columna?.find((c: any) => c.nombre.toUpperCase().includes('TO DO'));
    const colDone = tablero?.columna?.find((c: any) => c.nombre.toUpperCase().includes('DONE'));

    if (!colToDo || !colDone) return;

    const destinoId = tarea.columnaId === colDone.id ? colToDo.id : colDone.id;

    try {
      await actualizarEstadoTarea(tarea.id, destinoId);
      await cargarDatos(); // Reflejo inmediato
    } catch (err) {
      console.error("Error al alternar estado:", err);
    }
  };

  const handleGuardar = async () => {
    if (!nuevaTarea.titulo || !nuevaTarea.descripcion || !nuevaTarea.fechaLimite) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const fechaSeleccionada = new Date(nuevaTarea.fechaLimite + "T12:00:00");
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Solo comparamos días, no horas

    if (fechaSeleccionada < hoy) {
      alert("La fecha límite no puede ser un día anterior a hoy.");
      return;
    }

    try {
      const fechaLimpia = nuevaTarea.fechaLimite.split('T')[0];

      let colIdFinal = 5;
      if (editandoId) {
        const todasLasTareas = (tablero?.columna || []).flatMap((c: any) => c.tarea || []);
        const encontrada = todasLasTareas.find((tarea: any) => tarea.id === editandoId);
        if (encontrada) colIdFinal = encontrada.columna_id;
      } else {
        colIdFinal = tablero?.columna?.[0]?.id || 5;
      }

      const tareaParaAPI = {
        titulo: nuevaTarea.titulo,
        descripcion: nuevaTarea.descripcion,
        prioridad: nuevaTarea.prioridad || 'Media',
        fechaLimite: fechaLimpia,
        columnaId: Number(colIdFinal),
        tableroId: 2
      };

      if (editandoId) {
        await actualizarTarea(editandoId, tareaParaAPI);
        // ALERTA DE ACTUALIZACIÓN
        Swal.fire({
          title: '¡Actualizado!',
          text: 'La tarea se ha modificado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await crearTarea(tareaParaAPI);
        // ALERTA DE CREACIÓN
        Swal.fire({
          title: '¡Creado!',
          text: 'Nueva tarea añadida al tablero.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }

      cerrarModal();
      await cargarDatos();

    } catch (err) {
      console.error("Error:", err);
      alert("No se pudo guardar la tarea.");
    }
  };

  // US-04: ELIMINAR TAREA CON CONFIRMACIÓN
  const handleEliminar = async (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarTarea(id);
          await cargarDatos();
          Swal.fire('¡Eliminado!', 'La tarea ha sido borrada.', 'success');
        } catch (err) {
          Swal.fire('Error', 'No se pudo eliminar.', 'error');
        }
      }
    });
  };


  // --- MANEJO DE MODAL ---
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

  const abrirNuevo = () => {
    setEditandoId(null);
    setNuevaTarea(ESTADO_INICIAL_TAREA); 
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditandoId(null);
    setNuevaTarea(ESTADO_INICIAL_TAREA); 
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Cargando Tablero...</div>;

  return (
    <div className="flex h-screen bg-[#f4f7fe] overflow-hidden font-sans">
      {/* Sidebar */}
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
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-8 flex-1">
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

          <button onClick={ abrirNuevo } className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg active:scale-95 transition-all">
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
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-lg shadow-inner`}>{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Filtros (US-06) */}
        <div className="px-8 mt-6 flex gap-2 shrink-0">
          {['Todas', 'Pendiente', 'Completada'].map((op) => (
            <button
              key={op}
              onClick={() => setFiltro(op as any)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${filtro === op ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'
                }`}
            >
              {op}
            </button>
          ))}
        </div>

        {/* KANBAN */}
        <div className="flex-1 overflow-y-auto p-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {tablero?.columna
                ?.filter((col: any) => {
                  if (filtro === 'Todas') return true;
                  if (filtro === 'Pendiente') return !col.nombre.toUpperCase().includes('DONE');
                  if (filtro === 'Completada') return col.nombre.toUpperCase().includes('DONE');
                  return true;
                })
                .map((col: any) => {
                  // Filtrar tareas por descripción (US-07)
                  const tareasFiltradas = col.tarea?.filter((t: any) =>
                    t.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
                  );

                  return (
                    <div key={col.id} className="bg-slate-100/40 rounded-[2rem] flex flex-col min-h-[500px] border border-slate-200/50">
                      <div className="flex justify-between items-center p-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${col.nombre.toUpperCase().includes('DONE') ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                          <h3 className="font-black text-slate-600 text-[10px] uppercase tracking-tighter">{col.nombre}</h3>
                        </div>
                        <span className="bg-white text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-lg shadow-sm">{tareasFiltradas?.length || 0}</span>
                      </div>

                      <Droppable droppableId={col.id.toString()}>
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 px-4 pb-4 space-y-3">
                            {tareasFiltradas && tareasFiltradas.length > 0 ? (
                              tareasFiltradas.map((t: any, index: number) => (
                                <Draggable key={t.id.toString()} draggableId={t.id.toString()} index={index}>
                                  {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-slate-200/60 transition-all group hover:shadow-md">
                                      <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-800 text-sm leading-tight flex-1">{t.titulo}</h4>
                                        <div className="flex gap-1 ml-2">
                                          <button onClick={() => toggleCompletada(t)} className={`p-1 rounded-md transition-all ${col.nombre.toUpperCase().includes('DONE') ? 'text-green-500 bg-green-50 opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-green-500 hover:bg-green-50'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                          </button>
                                          <button onClick={() => abrirEditar(t)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-md transition-all">✏️</button>
                                          <button onClick={() => handleEliminar(t.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all">🗑️</button>
                                        </div>
                                      </div>
                                      <p className="text-slate-400 text-[11px] mb-4 line-clamp-1">{t.descripcion}</p>
                                      <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                        <span className="text-[10px] text-slate-400 font-bold">🗓️ {t.fecha_limite ? t.fecha_limite.toString().split('T')[0] : 'Sin fecha' }</span>
                                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${t.prioridad === 'Alta' ? 'bg-red-50 text-red-500' : t.prioridad === 'Baja' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                                          {t.prioridad || 'Media'}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            ) : (
                              // 3) Mensaje si no hay resultados (US-07)
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
        </div>
      </main>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-slate-800">{editandoId ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Título" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" value={nuevaTarea.titulo} onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })} />
              <textarea placeholder="Descripción" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-28 outline-none resize-none font-semibold" value={nuevaTarea.descripcion} onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })} />
              <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" value={nuevaTarea.fechaLimite} onChange={(e) => setNuevaTarea({ ...nuevaTarea, fechaLimite: e.target.value })} />
              <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold cursor-pointer" value={nuevaTarea.prioridad} onChange={(e) => setNuevaTarea({ ...nuevaTarea, prioridad: e.target.value })}>
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