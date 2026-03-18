import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SessoesService } from './sessoes.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Sessões')
@Controller('sessoes')
export class SessoesController {
    constructor(private readonly sessoesService: SessoesService) { }

    @Post()
    @ApiOperation({ summary: 'Cria uma nova sessão' })
    @ApiResponse({ status: 201, description: 'A sessão foi criada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() createSessaoDto: CreateSessaoDto) {
        return this.sessoesService.create(createSessaoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todas as sessões' })
    @ApiResponse({ status: 200, description: 'Lista de sessões retornada com sucesso.' })
    findAll() {
        return this.sessoesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma sessão pelo ID' })
    @ApiResponse({ status: 200, description: 'Sessão retornada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
    findOne(@Param('id') id: string) {
        return this.sessoesService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza uma sessão pelo ID' })
    @ApiResponse({ status: 200, description: 'Sessão atualizada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
    update(@Param('id') id: string, @Body() updateSessaoDto: UpdateSessaoDto) {
        return this.sessoesService.update(id, updateSessaoDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove uma sessão pelo ID' })
    @ApiResponse({ status: 200, description: 'Sessão removida com sucesso.' })
    @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
    remove(@Param('id') id: string) {
        return this.sessoesService.remove(id);
    }
}
