import { PartialType } from '@nestjs/swagger';
import { CreateColumnaDto } from './create-columna.dto';

export class UpdateColumnaDto extends PartialType(CreateColumnaDto) {}
