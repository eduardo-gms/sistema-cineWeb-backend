import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';

@Injectable()
export class IngressosService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateIngressoDto) {
        const sessao = await this.prisma.sessao.findUnique({
            where: { id: data.sessaoId },
            include: { sala: true }
        });

        if (!sessao) throw new NotFoundException('Sessão não encontrada');

        const qtdVendido = await this.prisma.ingresso.count({
            where: { sessaoId: data.sessaoId }
        });

        if (qtdVendido >= sessao.sala.capacidade) {
            throw new BadRequestException('Sessão esgotada. Não há mais poltronas disponíveis.');
        }

        const valorTotalCalculado = data.tipo === 'Meia' ? (sessao.valorIngresso / 2) : sessao.valorIngresso;

        return this.prisma.ingresso.create({ 
            data: {
                pedidoId: data.pedidoId,
                sessaoId: data.sessaoId,
                poltrona: data.poltrona,
                tipo: data.tipo,
                valorPago: valorTotalCalculado
            } as any
        });
    }

    async findAll() {
        return this.prisma.ingresso.findMany({ 
            include: { 
                sessao: { include: { filme: true, sala: true } }, 
                pedido: true 
            } 
        });
    }

    async findOne(id: string) {
        const ingresso = await this.prisma.ingresso.findUnique({
            where: { id },
            include: { 
                sessao: { include: { filme: true, sala: true } }, 
                pedido: true 
            },
        });
        if (!ingresso) throw new NotFoundException('Ingresso não encontrado');
        return ingresso;
    }

    async update(id: string, data: UpdateIngressoDto) {
        await this.findOne(id);
        return this.prisma.ingresso.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.ingresso.delete({ where: { id } });
    }
}
