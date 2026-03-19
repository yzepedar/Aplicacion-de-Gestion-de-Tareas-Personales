import { useEffect, useState } from 'react';
import {
  actualizarEstadoTarea,
  crearTarea,
  getTableroData,
  eliminarTarea,
  actualizarTarea
} from './api/tableroApi';
import Swal from 'sweetalert2';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TareaModal } from './components/TareaModal';

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

  const cargarDatos = async (mostrarCarga = false) => {
  if (mostrarCarga) setLoading(true);

  try {
    const data = await getTableroData(2);
    setTablero(data);
  } catch (err) {
    console.error("Error al cargar:", err);
  } finally {
    if (mostrarCarga) setLoading(false);
  }
};

  useEffect(() => {
    cargarDatos(true);
  }, []);

  // --- LÓGICA DE ARRASTRE ---
const onDragEnd = async (result: any) => {
  const { destination, source, draggableId } = result;

  if (
    !destination ||
    (destination.droppableId === source.droppableId &&
      destination.index === source.index)
  ) return;

  try {
    let estado = '';

    if (destination.droppableId == 5) estado = 'TO-DO';
    else if (destination.droppableId == 6) estado = 'IN PROGRESS';
    else if (destination.droppableId == 7) estado = 'DONE';

    await actualizarEstadoTarea(parseInt(draggableId), {
      columnaId: parseInt(destination.droppableId),
      estado: estado,
    });

    await cargarDatos();
  } catch (err) {
    alert("Error al mover la tarea.");
    await cargarDatos();
  }
};
  // --- US-05: ALTERNAR ESTADO (CHECK) ---
const toggleCompletada = async (tarea: any) => {
  try {
    let nuevoEstado = '';
    let nuevaColumna = tarea.columna_id;

    if (tarea.estado === 'TO-DO') {
      nuevoEstado = 'IN PROGRESS';
    } else if (tarea.estado === 'IN PROGRESS') {
      nuevoEstado = 'DONE';
    } else if (tarea.estado === 'DONE') {
      nuevoEstado = 'IN PROGRESS';
    }

    const columnaDestino = tablero.columna.find((c: any) =>
      c.nombre.toUpperCase().includes(nuevoEstado)
    );

    if (!columnaDestino) return;

    nuevaColumna = columnaDestino.id;

    await actualizarEstadoTarea(tarea.id, {
      columnaId: nuevaColumna,
      estado: nuevoEstado,
    });

    await cargarDatos();
  } catch (err) {
    console.error('Error:', err);
  }
};

  const handleGuardar = async () => {
    if (!nuevaTarea.titulo.trim() || !nuevaTarea.descripcion.trim() || !nuevaTarea.fechaLimite.trim()) {
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
      < Sidebar />
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <Header
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          onNuevo={abrirNuevo}
        />

        {/* Estadísticas */}
        <StatCards tablero={tablero} />

        {/* Filtros (US-06) */}
        <FilterBar filtro={filtro} setFiltro={setFiltro} />

        {/* KANBAN */}
        <div className="flex-1 overflow-y-auto p-8">
          <KanbanBoard
            tablero={tablero}
            filtro={filtro}
            busqueda={busqueda}
            onDragEnd={onDragEnd}
            onToggle={toggleCompletada}
            onEdit={abrirEditar}
            onDelete={handleEliminar}
          />
        </div>
      </main>

      {/* Modal */}
      <TareaModal
        show={showModal}
        editandoId={editandoId}
        tarea={nuevaTarea}
        setTarea={setNuevaTarea}
        onClose={cerrarModal}
        onSave={handleGuardar}
      />
    </div>
  );
}

export default App;