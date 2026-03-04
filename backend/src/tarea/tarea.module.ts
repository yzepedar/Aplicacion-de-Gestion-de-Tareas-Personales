import { Module } from '@nestjs/common';
import { TareaService } from './tarea.service';
import { TareaController } from './tarea.controller';
import { PrismaService } from '../prisma.service'; 

@Module({
  controllers: [TareaController],
  providers: [
    TareaService,
    PrismaService 
  ],
})
export class TareaModule { }