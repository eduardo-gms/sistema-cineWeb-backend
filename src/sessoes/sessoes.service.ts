import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SessoesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.SessaoUncheckedCreateInput) {
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

    async update(id: string, data: Prisma.SessaoUncheckedUpdateInput) {
        await this.findOne(id);
        return this.prisma.sessao.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.sessao.delete({ where: { id } });
    }
}
