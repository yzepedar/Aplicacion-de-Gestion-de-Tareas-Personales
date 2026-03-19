import { IsString, IsNotEmpty, IsISO8601, IsNumber, IsOptional, isString } from 'class-validator';

export class CreateTareaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsISO8601()
  fechaLimite: string;

  @IsString()
  @IsOptional() // ESTO QUITA EL ERROR DE PRIORIDAD
  prioridad?: string;

  @IsNumber()
  tableroId: number;

  @IsNumber()
  columnaId: number;

  @IsOptional()
@IsString()
estado?: string;
}