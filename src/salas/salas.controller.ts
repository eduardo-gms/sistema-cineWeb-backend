import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SalasService } from './salas.service';

@Controller('salas')
export class SalasController {
    constructor(private readonly salasService: SalasService) { }

    @Post()
    create(@Body() createSalaDto: any) {
        return this.salasService.create(createSalaDto);
    }

    @Get()
    findAll() {
        return this.salasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salasService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSalaDto: any) {
        return this.salasService.update(id, updateSalaDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.salasService.remove(id);
    }
}
