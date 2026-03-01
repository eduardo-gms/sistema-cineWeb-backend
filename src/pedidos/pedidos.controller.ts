import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) { }

    @Post()
    create(@Body() createPedidoDto: any) {
        return this.pedidosService.create(createPedidoDto);
    }

    @Get()
    findAll() {
        return this.pedidosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pedidosService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePedidoDto: any) {
        return this.pedidosService.update(id, updatePedidoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pedidosService.remove(id);
    }
}
