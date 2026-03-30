import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGeneroDto {
  @ApiProperty({ description: 'Nome do gênero', example: 'Ação' })
  @IsString()
  @IsNotEmpty()
  nome: string;
}
