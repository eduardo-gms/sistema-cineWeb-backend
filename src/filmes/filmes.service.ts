import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';

@Injectable()
export class FilmesService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateFilmeDto) {
        return this.prisma.filme.create({ data });
    }

    async findAll() {
        return this.prisma.filme.findMany({
            include: { genero: true }
        });
    }

    async findOne(id: string) {
        const filme = await this.prisma.filme.findUnique({ 
            where: { id },
            include: { genero: true }
        });
        if (!filme) throw new NotFoundException('Filme não encontrado');
        return filme;
    }

    async update(id: string, data: UpdateFilmeDto) {
        await this.findOne(id); // Garante que existe
        return this.prisma.filme.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.filme.delete({ where: { id } });
    }
}
