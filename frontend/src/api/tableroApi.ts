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
            columnaId: Number(tarea.columnaId), 
            tableroId: Number(tarea.tableroId)
        };

        const response = await api.post('/tarea', dataLimpia);
        return response.data;
    } catch (error) {
        console.error("Error detallado:", error);
        throw error;
    }
};