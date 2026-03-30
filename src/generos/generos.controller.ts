import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@ApiTags('Gêneros')
@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo gênero' })
  @ApiResponse({ status: 201, description: 'Gênero criado com sucesso.' })
  create(@Body() createGeneroDto: CreateGeneroDto) {
    return this.generosService.create(createGeneroDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os gêneros' })
  @ApiResponse({ status: 200, description: 'Lista de gêneros retornada com sucesso.' })
  findAll() {
    return this.generosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um gênero pelo ID' })
  @ApiResponse({ status: 200, description: 'Gênero retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.generosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um gênero pelo ID' })
  @ApiResponse({ status: 200, description: 'Gênero atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado.' })
  update(@Param('id') id: string, @Body() updateGeneroDto: UpdateGeneroDto) {
    return this.generosService.update(id, updateGeneroDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um gênero pelo ID' })
  @ApiResponse({ status: 200, description: 'Gênero removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado.' })
  remove(@Param('id') id: string) {
    return this.generosService.remove(id);
  }
}
