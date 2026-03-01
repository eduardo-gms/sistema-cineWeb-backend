import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { IngressosService } from './ingressos.service';

@Controller('ingressos')
export class IngressosController {
    constructor(private readonly ingressosService: IngressosService) { }

    @Post()
    create(@Body() createIngressoDto: any) {
        return this.ingressosService.create(createIngressoDto);
    }

    @Get()
    findAll() {
        return this.ingressosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ingressosService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateIngressoDto: any) {
        return this.ingressosService.update(id, updateIngressoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.ingressosService.remove(id);
    }
}
