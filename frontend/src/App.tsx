import { useEffect, useState } from 'react';
import { crearTarea, getTableroData } from './api/tableroApi';

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

  const handleGuardar = async () => {
    if (!nuevaTarea.titulo || !nuevaTarea.descripcion || !nuevaTarea.fechaLimite) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const targetColumnaId = tablero?.columna?.[0]?.id || 5;

      await crearTarea({
        titulo: nuevaTarea.titulo,
        descripcion: nuevaTarea.descripcion,
        fechaLimite: nuevaTarea.fechaLimite,
        prioridad: nuevaTarea.prioridad, 
        tableroId: 2,
        columnaId: targetColumnaId
      });

      alert("¡Tarea creada con éxito!");
      setShowModal(false);
      setNuevaTarea({ titulo: '', descripcion: '', fechaLimite: '', prioridad: 'Media' });
      await cargarDatos();
    } catch (err) {
      alert("Error al guardar la tarea.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600 animate-pulse">Cargando Dashboard...</div>;

  return (
    <div className="flex h-screen bg-[#f4f7fe] font-sans text-slate-700 overflow-hidden">
      {/* Sidebar Detallado */}
      <aside className="w-64 bg-white p-6 flex flex-col border-r border-slate-200 hidden lg:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">TB</div>
          <span className="text-xl font-bold text-slate-800">TaskBoard Pro</span>
        </div>
        <nav className="flex-1 space-y-2">
          {['Dashboard', 'Mis tareas', 'Crear tarea', 'Estadísticas', 'Configuración'].map((item) => (
            <button key={item} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${item === 'Dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}>
              {item === 'Dashboard' ? '📋' : '📁'} {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        {/* buscador superior */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input type="text" placeholder="Buscar tareas..." className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center gap-2">
            <span className="text-xl">+</span> Nueva Tarea
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total', count: tablero?.columna?.reduce((a: any, c: any) => a + (c.tarea?.length || 0), 0), color: 'blue', icon: '📝' },
              { label: 'En progreso', count: tablero?.columna?.find((c: any) => c.nombre.includes('PROGRESS'))?.tarea?.length || 0, color: 'orange', icon: '🔄' },
              { label: 'Completadas', count: tablero?.columna?.find((c: any) => c.nombre.includes('DONE'))?.tarea?.length || 0, color: 'green', icon: '✅' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center transition-all hover:translate-y-[-4px]">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800">{stat.count || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shadow-inner">{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* Kanban Board */}
          <div className="flex gap-8 pb-10 overflow-x-auto">
            {tablero?.columna?.map((col: any) => (
              <div key={col.id} className="bg-slate-100/40 rounded-[2.5rem] w-85 shrink-0 flex flex-col p-4 border border-slate-200/50">
                <div className="flex justify-between items-center px-4 py-3 mb-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <h3 className="font-black text-slate-700 text-[10px] uppercase tracking-widest">{col.nombre}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-slate-50">{col.tarea?.length || 0}</span>
                </div>

                <div className="space-y-4 px-1">
                  {col.tarea?.map((t: any) => (
                    <div key={t.id} className="bg-white p-5 rounded-[1.8rem] shadow-sm border border-slate-200/60 hover:shadow-xl transition-all">
                      <h4 className="font-bold text-slate-800 mb-2 leading-tight">{t.titulo}</h4>
                      <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-4 line-clamp-2">{t.descripcion}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400 font-bold">🗓️ {t.fecha_limite ? new Date(t.fecha_limite).toLocaleDateString() : 'S/F'}</span>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase ${t.prioridad === 'Alta' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                          {t.prioridad || 'Media'}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setShowModal(true)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[1.8rem] text-slate-400 text-xs font-bold hover:bg-white transition-all">+ Nueva Tarjeta</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de Prioridad */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-slate-800">Nueva Tarea</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Título" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" value={nuevaTarea.titulo} onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })} />
              <textarea placeholder="Descripción" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-28 outline-none resize-none font-semibold" value={nuevaTarea.descripcion} onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })} />
              <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" value={nuevaTarea.fechaLimite} onChange={(e) => setNuevaTarea({ ...nuevaTarea, fechaLimite: e.target.value })} />

              {/* SELECTOR DE PRIORIDAD: dentro del modal */}
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