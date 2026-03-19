import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getTableroData = async (id: number) => {
  try {
    const response = await api.get(`/tablero/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error conectando al backend:", error);
    return null;
  }
};

export const crearTarea = async (tarea: any) => {
  try {
    const dataLimpia = {
      ...tarea,
      columnaId: Number(tarea.columnaId), // Aseguramos que sea número para Prisma
      tableroId: Number(tarea.tableroId)
    };

    // Usamos /tarea en singular como está en tus carpetas
    const response = await api.post('/tarea', dataLimpia);
    return response.data;
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

export const actualizarEstadoTarea = async (tareaId: number, nuevaColumnaId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/tarea/${tareaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        columnaId: nuevaColumnaId,
      }),
    });

    if (!response.ok) throw new Error('Error al actualizar estado');
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarEstadoTarea:", error);
    throw error;
  }
};

export const actualizarTarea = async (id: number, datos: any) => {
  const { data } = await api.patch(`/tarea/${id}`, datos);
  return data;
};

export const eliminarTarea = async (tareaId: number) => {
    try {
        const { data } = await api.delete(`/tarea/${tareaId}`);
        return data;
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        throw error;
    }
};