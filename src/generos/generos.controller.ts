import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Perfil } from '@prisma/client';

@ApiTags('Gêneros')
@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Perfil.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar um novo gênero' })
  @ApiResponse({ status: 201, description: 'Gênero criado com sucesso.' })
  create(@Body() createGeneroDto: CreateGeneroDto) {
    return this.generosService.create(createGeneroDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os gêneros' })
  @ApiResponse({ status: 200, description: 'Lista de gêneros retornada com sucesso.' })
  findAll() {
    return this.generosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um gênero pelo ID' })
  @ApiResponse({ status: 200, description: 'Gênero retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.generosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Perfil.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Atualizar um gênero pelo ID' })
  @ApiResponse({ status: 200, description: 'Gênero atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado.' })
  update(@Param('id') id: string, @Body() updateGeneroDto: UpdateGeneroDto) {
    return this.generosService.update(id, updateGeneroDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Perfil.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remover um gênero pelo ID' })
  @ApiResponse({ status: 200, description: 'Gênero removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gênero não encontrado.' })
  remove(@Param('id') id: string) {
    return this.generosService.remove(id);
  }
}
