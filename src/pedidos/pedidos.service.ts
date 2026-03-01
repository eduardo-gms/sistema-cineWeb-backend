import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PedidosService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        // Exemplo de payload esperado no data:
        // {
        //   valorTotal: 50.0,
        //   qtdInteira: 1,
        //   qtdMeia: 0,
        //   ingressos: [{ sessaoId: 'uuid', poltrona: 'A1' }],
        //   lanches: [{ lancheComboId: 'uuid', quantidade: 2, precoUnitario: 15.0 }]
        // }

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

    async update(id: string, data: any) {
        await this.findOne(id);
        // Para simplificar, o update básico atualiza apenas dados do pedido.
        // Atualização de nested objects exigiria lógica extra de delete/create (sync).
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
        // Como há relacionamentos restritos, cascata é necessária. 
        // Com prisma default (se onDelete: Cascade não for explicitamente declarado),
        // devemos excluir os filhos primeiro ou configurar schema.
        await this.prisma.ingresso.deleteMany({ where: { pedidoId: id } });
        await this.prisma.itemPedidoLanche.deleteMany({ where: { pedidoId: id } });
        return this.prisma.pedido.delete({ where: { id } });
    }
}
