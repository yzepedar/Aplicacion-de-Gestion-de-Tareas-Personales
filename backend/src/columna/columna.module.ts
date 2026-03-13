import { Module } from '@nestjs/common';
import { ColumnaService } from './columna.service';
import { ColumnaController } from './columna.controller';
import { PrismaService } from '../prisma.service'; // Importa

@Module({
  controllers: [ColumnaController],
  providers: [ColumnaService, PrismaService], // Añade PrismaService aquí
})
export class ColumnaModule { }
