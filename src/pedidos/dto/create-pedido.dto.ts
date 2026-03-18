import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsInt, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class IngressoItemDto {
    @ApiProperty({ description: 'ID da sessão', example: 'uuid-sessao' })
    @IsString()
    @IsNotEmpty()
    sessaoId: string;

    @ApiProperty({ description: 'Referência da poltrona', example: 'A1' })
    @IsString()
    @IsNotEmpty()
    poltrona: string;
}

class LancheItemDto {
    @ApiProperty({ description: 'ID do lanche ou combo', example: 'uuid-lanche' })
    @IsString()
    @IsNotEmpty()
    lancheComboId: string;

    @ApiProperty({ description: 'Quantidade do item', example: 2 })
    @IsInt()
    @IsNotEmpty()
    quantidade: number;

    @ApiProperty({ description: 'Preço unitário no momento da compra', example: 15.0 })
    @IsNumber()
    @IsNotEmpty()
    precoUnitario: number;
}

export class CreatePedidoDto {
    @ApiProperty({ description: 'Valor total do pedido', example: 50.0 })
    @IsNumber()
    @IsNotEmpty()
    valorTotal: number;

    @ApiProperty({ description: 'Quantidade de ingressos inteiros', example: 1 })
    @IsInt()
    @IsNotEmpty()
    qtdInteira: number;

    @ApiProperty({ description: 'Quantidade de ingressos meia-entrada', example: 0 })
    @IsInt()
    @IsNotEmpty()
    qtdMeia: number;

    @ApiProperty({ description: 'Lista de ingressos adquiridos no pedido', type: [IngressoItemDto], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngressoItemDto)
    @IsOptional()
    ingressos?: IngressoItemDto[];

    @ApiProperty({ description: 'Lista de lanches adquiridos no pedido', type: [LancheItemDto], required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LancheItemDto)
    @IsOptional()
    lanches?: LancheItemDto[];
}
