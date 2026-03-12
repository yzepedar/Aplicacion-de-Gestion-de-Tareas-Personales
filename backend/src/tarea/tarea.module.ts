import { Module } from '@nestjs/common';
import { TareaService } from './tarea.service';
import { TareaController } from './tarea.controller';
import { PrismaService } from '../prisma.service'; // <--- 1. Importar

@Module({
  controllers: [TareaController],
  providers: [
    TareaService, 
    PrismaService // <--- 2. Agregar a proveedores
  ],
})
export class TareaModule {}