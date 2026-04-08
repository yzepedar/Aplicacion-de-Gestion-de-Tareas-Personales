import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
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
        estado: createTareaDto.estado || 'TO-DO',
        descripcion: createTareaDto.descripcion,
        prioridad: createTareaDto.prioridad || 'Media',
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


  // 4. Actualizar (US-03)
async update(id: number, updateTareaDto: UpdateTareaDto) {
  return this.prisma.tarea.update({
    where: { id: Number(id) },
    data: {
      titulo: updateTareaDto.titulo,
      descripcion: updateTareaDto.descripcion,
      prioridad: updateTareaDto.prioridad,
      fecha_limite: updateTareaDto.fechaLimite
        ? new Date(updateTareaDto.fechaLimite)
        : undefined,
      ...(updateTareaDto.columnaId !== undefined && {
        columna_id: Number(updateTareaDto.columnaId),
      }),
      ...(updateTareaDto.estado !== undefined && {
        estado: updateTareaDto.estado,
      }),
    },
  });
}
  // 5. Eliminar (US-04)
  async remove(id: number) {
    return this.prisma.tarea.delete({ where: { id } });
  }
}

