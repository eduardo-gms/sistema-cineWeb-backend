import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FilmesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.FilmeCreateInput) {
        return this.prisma.filme.create({ data });
    }

    async findAll() {
        return this.prisma.filme.findMany();
    }

    async findOne(id: string) {
        const filme = await this.prisma.filme.findUnique({ where: { id } });
        if (!filme) throw new NotFoundException('Filme não encontrado');
        return filme;
    }

    async update(id: string, data: Prisma.FilmeUpdateInput) {
        await this.findOne(id); // Garante que existe
        return this.prisma.filme.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.filme.delete({ where: { id } });
    }
}
