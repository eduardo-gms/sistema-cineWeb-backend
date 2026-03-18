import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateSessaoDto {
    @ApiProperty({ description: 'ID do filme que será exibido', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
    @IsString()
    @IsNotEmpty()
    filmeId: string;

    @ApiProperty({ description: 'ID da sala onde ocorrerá a sessão', example: '1122f1ee-6c54-4b01-90e6-d701748f1234' })
    @IsString()
    @IsNotEmpty()
    salaId: string;

    @ApiProperty({ description: 'Data da sessão', example: '2026-04-10T00:00:00.000Z' })
    @IsDateString()
    @IsNotEmpty()
    data: string;

    @ApiProperty({ description: 'Horário da sessão', example: '20:00' })
    @IsString()
    @IsNotEmpty()
    horario: string;

    @ApiProperty({ description: 'Valor do ingresso para esta sessão', example: 35.50 })
    @IsNumber()
    @IsNotEmpty()
    valorIngresso: number;
}
