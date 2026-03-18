import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FilmesService } from './filmes.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Filmes')
@Controller('filmes')
export class FilmesController {
    constructor(private readonly filmesService: FilmesService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo filme' })
    @ApiResponse({ status: 201, description: 'O filme foi criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() createFilmeDto: CreateFilmeDto) {
        return this.filmesService.create(createFilmeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os filmes' })
    @ApiResponse({ status: 200, description: 'Lista de filmes retornada com sucesso.' })
    findAll() {
        return this.filmesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um filme pelo ID' })
    @ApiResponse({ status: 200, description: 'Filme retornado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
    findOne(@Param('id') id: string) {
        return this.filmesService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza um filme pelo ID' })
    @ApiResponse({ status: 200, description: 'Filme atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
    update(@Param('id') id: string, @Body() updateFilmeDto: UpdateFilmeDto) {
        return this.filmesService.update(id, updateFilmeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um filme pelo ID' })
    @ApiResponse({ status: 200, description: 'Filme removido com sucesso.' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado.' })
    remove(@Param('id') id: string) {
        return this.filmesService.remove(id);
    }
}
