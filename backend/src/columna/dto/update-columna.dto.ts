import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnaDto } from './create-columna.dto';

export class UpdateColumnaDto extends PartialType(CreateColumnaDto) {}
