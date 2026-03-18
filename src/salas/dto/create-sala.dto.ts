import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSalaDto {
    @ApiProperty({ description: 'O número da sala', example: 1 })
    @IsInt()
    @IsNotEmpty()
    numero: number;

    @ApiProperty({ description: 'A capacidade máxima de pessoas na sala', example: 150 })
    @IsInt()
    @IsNotEmpty()
    capacidade: number;
}
