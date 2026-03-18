import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { IngressosService } from './ingressos.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Ingressos')
@Controller('ingressos')
export class IngressosController {
    constructor(private readonly ingressosService: IngressosService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo ingresso avulso' })
    @ApiResponse({ status: 201, description: 'Ingresso criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() createIngressoDto: CreateIngressoDto) {
        return this.ingressosService.create(createIngressoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os ingressos' })
    @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
    findAll() {
        return this.ingressosService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um ingresso pelo ID' })
    @ApiResponse({ status: 200, description: 'Ingresso retornado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Ingresso não encontrado.' })
    findOne(@Param('id') id: string) {
        return this.ingressosService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza um ingresso pelo ID' })
    @ApiResponse({ status: 200, description: 'Ingresso atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Ingresso não encontrado.' })
    update(@Param('id') id: string, @Body() updateIngressoDto: UpdateIngressoDto) {
        return this.ingressosService.update(id, updateIngressoDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um ingresso pelo ID' })
    @ApiResponse({ status: 200, description: 'Ingresso removido com sucesso.' })
    @ApiResponse({ status: 404, description: 'Ingresso não encontrado.' })
    remove(@Param('id') id: string) {
        return this.ingressosService.remove(id);
    }
}
