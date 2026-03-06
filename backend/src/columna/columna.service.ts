import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateColumnaDto } from './dto/create-columna.dto';
import { UpdateColumnaDto } from './dto/update-columna.dto';

@Injectable()
export class ColumnaService {
  constructor(private prisma: PrismaService) {}

  async create(createColumnaDto: CreateColumnaDto) {
    return await this.prisma.columna.create({
      data: {
        nombre: createColumnaDto.nombre,
        orden: createColumnaDto.orden, // <--- Ahora Prisma estará feliz
        tablero: {
          connect: { id: createColumnaDto.tablero_id }
        }
      }
    });
  }

  async findAll() {
    return await this.prisma.columna.findMany({
      include: { tablero: true }
    });
  }

  // --- AGREGA ESTOS MÉTODOS PARA QUITAR LOS ERRORES ---

  async findOne(id: number) {
    return await this.prisma.columna.findUnique({
      where: { id },
      include: { tablero: true }
    });
  }

  async update(id: number, updateColumnaDto: UpdateColumnaDto) {
    return await this.prisma.columna.update({
      where: { id },
      data: updateColumnaDto as any
    });
  }

  async remove(id: number) {
    return await this.prisma.columna.delete({
      where: { id }
    });
  }
}