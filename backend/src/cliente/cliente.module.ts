import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { PrismaService } from '../prisma.service'; // <-- Importante

@Module({
  controllers: [ClienteController],
  providers: [ClienteService, PrismaService], // <-- Agrégalo aquí
})
export class ClienteModule { }