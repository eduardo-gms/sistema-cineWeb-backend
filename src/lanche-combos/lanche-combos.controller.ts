import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LancheCombosService } from './lanche-combos.service';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Lanches & Combos')
@Controller('lanche-combos')
export class LancheCombosController {
    constructor(private readonly lancheCombosService: LancheCombosService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo lanche ou combo' })
    @ApiResponse({ status: 201, description: 'Lanche/combo criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() createLancheComboDto: CreateLancheComboDto) {
        return this.lancheCombosService.create(createLancheComboDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os lanches e combos' })
    @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
    findAll() {
        return this.lancheCombosService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um lanche ou combo pelo ID' })
    @ApiResponse({ status: 200, description: 'Item retornado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Item não encontrado.' })
    findOne(@Param('id') id: string) {
        return this.lancheCombosService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza um lanche ou combo pelo ID' })
    @ApiResponse({ status: 200, description: 'Item atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Item não encontrado.' })
    update(@Param('id') id: string, @Body() updateLancheComboDto: UpdateLancheComboDto) {
        return this.lancheCombosService.update(id, updateLancheComboDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um lanche ou combo pelo ID' })
    @ApiResponse({ status: 200, description: 'Item removido com sucesso.' })
    @ApiResponse({ status: 404, description: 'Item não encontrado.' })
    remove(@Param('id') id: string) {
        return this.lancheCombosService.remove(id);
    }
}
