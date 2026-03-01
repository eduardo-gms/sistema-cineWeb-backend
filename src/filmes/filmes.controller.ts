import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FilmesService } from './filmes.service';

@Controller('filmes')
export class FilmesController {
    constructor(private readonly filmesService: FilmesService) { }

    @Post()
    create(@Body() createFilmeDto: any) {
        return this.filmesService.create(createFilmeDto);
    }

    @Get()
    findAll() {
        return this.filmesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filmesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateFilmeDto: any) {
        return this.filmesService.update(id, updateFilmeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filmesService.remove(id);
    }
}
