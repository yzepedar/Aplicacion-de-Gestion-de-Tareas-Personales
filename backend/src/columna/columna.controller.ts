import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColumnaService } from './columna.service';
import { CreateColumnaDto } from './dto/create-columna.dto';
import { UpdateColumnaDto } from './dto/update-columna.dto';

@Controller('columna')
export class ColumnaController {
  constructor(private readonly columnaService: ColumnaService) {}

  @Post()
  create(@Body() createColumnaDto: CreateColumnaDto) {
    return this.columnaService.create(createColumnaDto);
  }

  @Get()
  findAll() {
    return this.columnaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnaDto: UpdateColumnaDto) {
    return this.columnaService.update(+id, updateColumnaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnaService.remove(+id);
  }
}
