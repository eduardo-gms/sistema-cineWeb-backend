import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIngressoDto {
    @ApiProperty({ description: 'ID do pedido associado a este ingresso', example: 'uuid-pedido' })
    @IsString()
    @IsNotEmpty()
    pedidoId: string;

    @ApiProperty({ description: 'ID da sessão', example: 'uuid-sessao' })
    @IsString()
    @IsNotEmpty()
    sessaoId: string;

    @ApiProperty({ description: 'Identificação da poltrona', example: 'J14' })
    @IsString()
    @IsNotEmpty()
    poltrona: string;

    @ApiProperty({ description: 'Tipo do ingresso', example: 'Inteira', enum: ['Inteira', 'Meia'] })
    @IsString()
    @IsNotEmpty()
    tipo: string;
}
