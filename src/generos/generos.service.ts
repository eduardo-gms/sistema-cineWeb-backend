import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';

@Injectable()
export class GenerosService {
  constructor(private prisma: PrismaService) {}

  async create(createGeneroDto: CreateGeneroDto) {
    return this.prisma.genero.create({ data: createGeneroDto });
  }

  async findAll() {
    return this.prisma.genero.findMany();
  }

  async findOne(id: string) {
    const genero = await this.prisma.genero.findUnique({ where: { id } });
    if (!genero) throw new NotFoundException('Gênero não encontrado');
    return genero;
  }

  async update(id: string, updateGeneroDto: UpdateGeneroDto) {
    await this.findOne(id);
    return this.prisma.genero.update({
      where: { id },
      data: updateGeneroDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.genero.delete({ where: { id } });
  }
}
