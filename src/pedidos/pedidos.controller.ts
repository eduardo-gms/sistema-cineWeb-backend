import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Cria um novo pedido com ingressos e lanches (opcional)' })
    @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 401, description: 'Não autenticado.' })
    create(@Body() createPedidoDto: CreatePedidoDto, @Request() req: any) {
        return this.pedidosService.create(createPedidoDto, req.user?.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os pedidos' })
    @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
    findAll() {
        return this.pedidosService.findAll();
    }

    @Get('meus')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Lista os pedidos do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Pedidos do usuário retornados.' })
    findMeus(@Request() req: any) {
        return this.pedidosService.findByUsuario(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um pedido pelo ID' })
    @ApiResponse({ status: 200, description: 'Pedido retornado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    findOne(@Param('id') id: string) {
        return this.pedidosService.findOne(id);
    }

    @Get(':id/comprovante')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Gera o comprovante detalhado de um pedido' })
    @ApiResponse({ status: 200, description: 'Comprovante gerado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    getComprovante(@Param('id') id: string) {
        return this.pedidosService.getComprovante(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Atualiza informações gerais de um pedido pelo ID' })
    @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
        return this.pedidosService.update(id, updatePedidoDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Remove um pedido pelo ID e relacionamentos em cascata' })
    @ApiResponse({ status: 200, description: 'Pedido removido com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    remove(@Param('id') id: string) {
        return this.pedidosService.remove(id);
    }
}
