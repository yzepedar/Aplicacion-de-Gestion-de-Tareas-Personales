import { PartialType } from '@nestjs/swagger';
import { CreateTableroDto } from './create-tablero.dto';

export class UpdateTableroDto extends PartialType(CreateTableroDto) {}
