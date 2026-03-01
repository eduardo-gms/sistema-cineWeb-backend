import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IngressosService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.IngressoUncheckedCreateInput) {
        return this.prisma.ingresso.create({ data });
    }

    async findAll() {
        return this.prisma.ingresso.findMany({ include: { sessao: true, pedido: true } });
    }

    async findOne(id: string) {
        const ingresso = await this.prisma.ingresso.findUnique({
            where: { id },
            include: { sessao: true, pedido: true },
        });
        if (!ingresso) throw new NotFoundException('Ingresso não encontrado');
        return ingresso;
    }

    async update(id: string, data: Prisma.IngressoUncheckedUpdateInput) {
        await this.findOne(id);
        return this.prisma.ingresso.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.ingresso.delete({ where: { id } });
    }
}
