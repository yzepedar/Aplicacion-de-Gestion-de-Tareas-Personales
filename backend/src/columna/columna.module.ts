import { Module } from '@nestjs/common';
import { ColumnaService } from './columna.service';
import { ColumnaController } from './columna.controller';
import { PrismaService } from '../prisma.service'; 

@Module({
  controllers: [ColumnaController],
  providers: [ColumnaService, PrismaService], 
})
export class ColumnaModule { }
