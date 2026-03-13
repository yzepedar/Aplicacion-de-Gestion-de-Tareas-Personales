import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableroDto {
    @ApiProperty({ example: 'Mi Tablero de Trabajo' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsNotEmpty()
    cliente_id: number;
}