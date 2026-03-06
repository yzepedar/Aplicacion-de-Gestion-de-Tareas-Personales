import { Module } from '@nestjs/common';
import { TableroService } from './tablero.service';
import { TableroController } from './tablero.controller';
import { PrismaService } from '../prisma.service'; 

@Module({
  controllers: [TableroController],
  providers: [
    TableroService, 
    PrismaService 
  ],
})
export class TableroModule {}
