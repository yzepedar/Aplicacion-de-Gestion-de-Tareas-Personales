import { IsString, IsNotEmpty, IsISO8601, IsNumber, IsOptional } from 'class-validator';

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
    @IsOptional() // ayuda a quitar el error de prioridad
    prioridad?: string;

    @IsNumber()
    tableroId: number;

    @IsNumber()
    columnaId: number;
}