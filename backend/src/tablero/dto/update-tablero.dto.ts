import { PartialType } from '@nestjs/mapped-types';
import { CreateTableroDto } from './create-tablero.dto';

export class UpdateTableroDto extends PartialType(CreateTableroDto) {}
