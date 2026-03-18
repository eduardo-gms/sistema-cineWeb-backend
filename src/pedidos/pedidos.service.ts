import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreatePedidoDto) {
        return this.prisma.pedido.create({
            data: {
                valorTotal: data.valorTotal,
                qtdInteira: data.qtdInteira,
                qtdMeia: data.qtdMeia,
                ingressos: {
                    create: data.ingressos || []
                },
                lanches: {
                    create: data.lanches || []
                }
            },
            include: {
                ingressos: true,
                lanches: true,
            }
        });
    }

    async findAll() {
        return this.prisma.pedido.findMany({
            include: { ingressos: true, lanches: true }
        });
    }

    async findOne(id: string) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id },
            include: { ingressos: true, lanches: true }
        });
        if (!pedido) throw new NotFoundException('Pedido não encontrado');
        return pedido;
    }

    async update(id: string, data: UpdatePedidoDto) {
        await this.findOne(id);
        return this.prisma.pedido.update({
            where: { id },
            data: {
                valorTotal: data.valorTotal,
                qtdInteira: data.qtdInteira,
                qtdMeia: data.qtdMeia
            }
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.ingresso.deleteMany({ where: { pedidoId: id } });
        await this.prisma.itemPedidoLanche.deleteMany({ where: { pedidoId: id } });
        return this.prisma.pedido.delete({ where: { id } });
    }
}
