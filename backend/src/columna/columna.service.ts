import { Injectable } from '@nestjs/common';
import { CreateColumnaDto } from './dto/create-columna.dto';
import { UpdateColumnaDto } from './dto/update-columna.dto';

@Injectable()
export class ColumnaService {
  create(createColumnaDto: CreateColumnaDto) {
    return 'This action adds a new columna';
  }

  findAll() {
    return `This action returns all columna`;
  }

  findOne(id: number) {
    return `This action returns a #${id} columna`;
  }

  update(id: number, updateColumnaDto: UpdateColumnaDto) {
    return `This action updates a #${id} columna`;
  }

  remove(id: number) {
    return `This action removes a #${id} columna`;
  }
}
