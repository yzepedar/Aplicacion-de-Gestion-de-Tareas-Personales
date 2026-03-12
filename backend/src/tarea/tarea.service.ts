import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Ruta corregida según tu estructura
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';

@Injectable()
export class TareaService {
  constructor(private prisma: PrismaService) { }

  // 1. Crear Tarea (US-01)
  async create(createTareaDto: CreateTareaDto) {
    return this.prisma.tarea.create({
      data: {
        titulo: createTareaDto.titulo,
        descripcion: createTareaDto.descripcion,
        prioridad: createTareaDto.prioridad || 'Media',
        // Mapeo exacto a tu schema.prisma
        fecha_limite: createTareaDto.fechaLimite ? new Date(createTareaDto.fechaLimite) : null,
        columna_id: Number(createTareaDto.columnaId),
      },
    });
  }

  // 2. Obtener todas (US-02)
  async findAll() {
    return this.prisma.tarea.findMany({
      include: { columna: true } // Para saber a qué columna pertenece
    });
  }

  // 3. Obtener una sola
  async findOne(id: number) {
    const tarea = await this.prisma.tarea.findUnique({ where: { id } });
    if (!tarea) throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    return tarea;
  }

  // 4. ACTUALIZAR (Este es el que te daba el error de compilación)
  async update(id: number, updateTareaDto: UpdateTareaDto) {
    return this.prisma.tarea.update({
      where: { id },
      data: {
        titulo: updateTareaDto.titulo,
        descripcion: updateTareaDto.descripcion,
        prioridad: updateTareaDto.prioridad,
        // Si se cambia de columna, actualizamos el ID
        ...(updateTareaDto.columnaId && { columna_id: Number(updateTareaDto.columnaId) }),
      },
    });
  }

  // 5. Eliminar (US-04)
  async remove(id: number) {
    return this.prisma.tarea.delete({ where: { id } });
  }
}