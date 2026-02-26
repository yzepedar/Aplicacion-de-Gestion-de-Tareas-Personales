import { Module } from '@nestjs/common';
import { TableroService } from './tablero.service';
import { TableroController } from './tablero.controller';

@Module({
  controllers: [TableroController],
  providers: [TableroService],
})
export class TableroModule {}
