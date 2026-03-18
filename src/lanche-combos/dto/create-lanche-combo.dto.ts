import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsNotEmpty } from 'class-validator';

export class CreateLancheComboDto {
    @ApiProperty({ description: 'Nome do lanche ou combo', example: 'Combo Pipoca Grande + 2 Refris' })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({ description: 'Valor unitário do lanche ou combo', example: 45.90 })
    @IsNumber()
    @IsNotEmpty()
    valorUnitario: number;

    @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
    @IsInt()
    @IsNotEmpty()
    estoque: number;
}
