import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnaDto {
  @ApiProperty({ example: 'Pendientes' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tablero_id: number;

  @ApiProperty({ example: 1, description: 'Posición de la columna' })
  @IsInt()
  @IsNotEmpty()
  orden: number; // <--- Agregamos esto
}