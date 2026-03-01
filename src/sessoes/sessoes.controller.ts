import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SessoesService } from './sessoes.service';

@Controller('sessoes')
export class SessoesController {
    constructor(private readonly sessoesService: SessoesService) { }

    @Post()
    create(@Body() createSessaoDto: any) {
        return this.sessoesService.create(createSessaoDto);
    }

    @Get()
    findAll() {
        return this.sessoesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.sessoesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSessaoDto: any) {
        return this.sessoesService.update(id, updateSessaoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.sessoesService.remove(id);
    }
}
