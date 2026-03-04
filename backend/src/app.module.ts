import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteModule } from './cliente/cliente.module';
import { TableroModule } from './tablero/tablero.module';
import { ColumnaModule } from './columna/columna.module';
import { TareaModule } from './tarea/tarea.module';

@Module({
  imports: [ClienteModule, TableroModule, ColumnaModule, TareaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
