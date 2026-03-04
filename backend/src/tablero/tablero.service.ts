import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTableroDto } from './dto/create-tablero.dto';
import { UpdateTableroDto } from './dto/update-tablero.dto';

@Injectable()
export class TableroService {
  constructor(private prisma: PrismaService) { }

  async create(createTableroDto: CreateTableroDto) {
    return await this.prisma.tablero.create({
      data: {
        nombre: createTableroDto.nombre,
        cliente: {
          connect: { id: createTableroDto.cliente_id }
        }
      }
    });
  }

  async findAll() {
    return await this.prisma.tablero.findMany({
      include: { cliente: true } 
    });
  }

  async findOne(id: number) {
    const tablero = await this.prisma.tablero.findUnique({
      where: { id },
      include: {
        columna: {
          orderBy: { orden: 'asc' },
          include: {
            tarea: true,
          },
        },
      },
    });

    if (!tablero) return null;

    //  Logica de tablero
    let totalTareas = 0;
    let tareasCompletadas = 0;

    tablero.columna.forEach(col => {
      totalTareas += col.tarea.length;
      if (col.nombre.toLowerCase() === 'done' || col.nombre.toLowerCase() === 'finalizado') {
        tareasCompletadas += col.tarea.length;
      }
    });

    const progreso = totalTareas > 0
      ? Math.round((tareasCompletadas / totalTareas) * 100)
      : 0;

    return {
      ...tablero,
      estadisticas: {
        totalTareas,
        tareasCompletadas,
        porcentajeProgreso: progreso,
      },
    };
  }

  async update(id: number, updateTableroDto: UpdateTableroDto) {
    return await this.prisma.tablero.update({
      where: { id },
      data: updateTableroDto as any, 
    });
  }

  async remove(id: number) {
    return await this.prisma.tablero.delete({
      where: { id },
    });
  }
}