import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo pedido com ingressos e lanches (opcional)' })
    @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() createPedidoDto: CreatePedidoDto) {
        return this.pedidosService.create(createPedidoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os pedidos' })
    @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
    findAll() {
        return this.pedidosService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um pedido pelo ID' })
    @ApiResponse({ status: 200, description: 'Pedido retornado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    findOne(@Param('id') id: string) {
        return this.pedidosService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza informações gerais de um pedido pelo ID' })
    @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
        return this.pedidosService.update(id, updatePedidoDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove um pedido pelo ID e relacionamentos em cascata' })
    @ApiResponse({ status: 200, description: 'Pedido removido com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    remove(@Param('id') id: string) {
        return this.pedidosService.remove(id);
    }
}
