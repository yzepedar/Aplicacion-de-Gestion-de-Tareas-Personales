import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TableroService } from './tablero.service';
import { CreateTableroDto } from './dto/create-tablero.dto';
import { UpdateTableroDto } from './dto/update-tablero.dto';

@Controller('tablero')
export class TableroController {
  constructor(private readonly tableroService: TableroService) {}

  @Post()
  create(@Body() createTableroDto: CreateTableroDto) {
    return this.tableroService.create(createTableroDto);
  }

  @Get()
  findAll() {
    return this.tableroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableroService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableroDto: UpdateTableroDto) {
    return this.tableroService.update(+id, updateTableroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableroService.remove(+id);
  }
}