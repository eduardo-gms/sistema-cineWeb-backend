import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateFilmeDto {
    @ApiProperty({ description: 'O título do filme', example: 'O Senhor dos Anéis: A Sociedade do Anel' })
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @ApiProperty({ description: 'Duração do filme em minutos', example: 178 })
    @IsInt()
    @IsNotEmpty()
    duracao: number;

    @ApiProperty({ description: 'A sinopse do filme', example: 'Um humilde hobbit recebe a tarefa de destruir o Um Anel...' })
    @IsString()
    @IsNotEmpty()
    sinopse: string;

    @ApiProperty({ description: 'Gênero do filme', example: 'Aventura/Fantasia' })
    @IsString()
    @IsNotEmpty()
    genero: string;

    @ApiProperty({ description: 'Atores principais', example: 'Elijah Wood, Ian McKellen, Orlando Bloom' })
    @IsString()
    @IsNotEmpty()
    elenco: string;

    @ApiProperty({ description: 'Data de início da exibição no cinema', example: '2026-04-01T00:00:00.000Z' })
    @IsDateString()
    @IsNotEmpty()
    dataInicioExibicao: string;

    @ApiProperty({ description: 'Data de fim da exibição no cinema', example: '2026-05-01T00:00:00.000Z' })
    @IsDateString()
    @IsNotEmpty()
    dataFimExibicao: string;

    @ApiProperty({ description: 'Status de exibição (ex: EM_CARTAZ, BREVE)', example: 'EM_CARTAZ' })
    @IsString()
    @IsNotEmpty()
    status: string;
}
