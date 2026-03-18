import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SalasService } from './salas.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Salas')
@Controller('salas')
export class SalasController {
    constructor(private readonly salasService: SalasService) { }

    @Post()
    @ApiOperation({ summary: 'Cria uma nova sala' })
    @ApiResponse({ status: 201, description: 'A sala foi criada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() createSalaDto: CreateSalaDto) {
        return this.salasService.create(createSalaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todas as salas' })
    @ApiResponse({ status: 200, description: 'Lista de salas retornada com sucesso.' })
    findAll() {
        return this.salasService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma sala pelo ID' })
    @ApiResponse({ status: 200, description: 'Sala retornada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
    findOne(@Param('id') id: string) {
        return this.salasService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza uma sala pelo ID' })
    @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
    update(@Param('id') id: string, @Body() updateSalaDto: UpdateSalaDto) {
        return this.salasService.update(id, updateSalaDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove uma sala pelo ID' })
    @ApiResponse({ status: 200, description: 'Sala removida com sucesso.' })
    @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
    remove(@Param('id') id: string) {
        return this.salasService.remove(id);
    }
}
