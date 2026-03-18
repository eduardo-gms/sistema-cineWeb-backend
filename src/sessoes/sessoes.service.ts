import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';

@Injectable()
export class SessoesService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateSessaoDto) {
        return this.prisma.sessao.create({ data });
    }

    async findAll() {
        return this.prisma.sessao.findMany({ include: { filme: true, sala: true } });
    }

    async findOne(id: string) {
        const sessao = await this.prisma.sessao.findUnique({
            where: { id },
            include: { filme: true, sala: true },
        });
        if (!sessao) throw new NotFoundException('Sessão não encontrada');
        return sessao;
    }

    async update(id: string, data: UpdateSessaoDto) {
        await this.findOne(id);
        return this.prisma.sessao.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.sessao.delete({ where: { id } });
    }
}
