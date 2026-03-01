import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LancheCombosService } from './lanche-combos.service';

@Controller('lanche-combos')
export class LancheCombosController {
    constructor(private readonly lancheCombosService: LancheCombosService) { }

    @Post()
    create(@Body() createLancheComboDto: any) {
        return this.lancheCombosService.create(createLancheComboDto);
    }

    @Get()
    findAll() {
        return this.lancheCombosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.lancheCombosService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateLancheComboDto: any) {
        return this.lancheCombosService.update(id, updateLancheComboDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.lancheCombosService.remove(id);
    }
}
