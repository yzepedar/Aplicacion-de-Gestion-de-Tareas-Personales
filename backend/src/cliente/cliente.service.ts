import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    return await this.prisma.cliente.create({
      data: createClienteDto,
    });
  }

  async findAll() {
    return await this.prisma.cliente.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.cliente.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    return await this.prisma.cliente.update({
      where: { id },
      data: updateClienteDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.cliente.delete({
      where: { id },
    });
  }
}