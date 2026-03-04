import { Injectable } from '@nestjs/common';
import { CreateTableroDto } from './dto/create-tablero.dto';
import { UpdateTableroDto } from './dto/update-tablero.dto';

@Injectable()
export class TableroService {
  create(createTableroDto: CreateTableroDto) {
    return 'This action adds a new tablero';
  }

  findAll() {
    return `This action returns all tablero`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tablero`;
  }

  update(id: number, updateTableroDto: UpdateTableroDto) {
    return `This action updates a #${id} tablero`;
  }

  remove(id: number) {
    return `This action removes a #${id} tablero`;
  }
}
