import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreatePedidoDto, usuarioId?: string) {
        let valorTotalCalculado = 0;
        let inteira = 0;
        let meia = 0;

        return this.prisma.$transaction(async (tx) => {
            const lanchesParaCriar: any[] = [];
        for (const item of (data.lanches || [])) {
            const lancheBd = await tx.lancheCombo.findUnique({
                where: { id: item.lancheComboId },
            });
            if (!lancheBd) throw new NotFoundException(`Lanche/Combo ${item.lancheComboId} não encontrado`);
            if (lancheBd.estoque < item.quantidade) {
                throw new BadRequestException(`Estoque insuficiente para o Lanche/Combo ${lancheBd.nome}`);
            }

            // Decrementa o estoque
            await tx.lancheCombo.update({
                where: { id: item.lancheComboId },
                data: { estoque: lancheBd.estoque - item.quantidade }
            });

            valorTotalCalculado += lancheBd.valorUnitario * item.quantidade;
            lanchesParaCriar.push({
                lancheComboId: item.lancheComboId,
                quantidade: item.quantidade,
                precoUnitario: lancheBd.valorUnitario,
            });
        }

        const demandaSessoes: Record<string, number> = {};
        for (const ing of (data.ingressos || [])) {
            demandaSessoes[ing.sessaoId] = (demandaSessoes[ing.sessaoId] || 0) + 1;
        }

        for (const sessaoId of Object.keys(demandaSessoes)) {
            const sessao = await tx.sessao.findUnique({
                where: { id: sessaoId },
                include: { sala: true },
            });
            if (!sessao) throw new BadRequestException(`Sessão ${sessaoId} não encontrada`);
            
            const vendidos = await tx.ingresso.count({ where: { sessaoId } });
            if (vendidos + demandaSessoes[sessaoId] > sessao.sala.capacidade) {
                throw new BadRequestException(`Sessão esgotada. Não há capacidade para ${demandaSessoes[sessaoId]} novo(s) ingresso(s).`);
            }
        }

        const ingressosParaCriar: any[] = [];
        for (const ing of (data.ingressos || [])) {
            const sessaoBd = await tx.sessao.findUnique({
                where: { id: ing.sessaoId },
            });

            let valorPago = sessaoBd!.valorIngresso;
            if (ing.tipo === 'Meia') {
                valorPago = valorPago / 2;
                meia++;
            } else {
                inteira++;
            }
            valorTotalCalculado += valorPago;

            ingressosParaCriar.push({
                sessaoId: ing.sessaoId,
                poltrona: ing.poltrona,
                tipo: ing.tipo,
                valorPago: valorPago,
            });
        }

        return tx.pedido.create({
            data: {
                usuarioId: usuarioId || null,
                valorTotal: valorTotalCalculado,
                qtdInteira: inteira,
                qtdMeia: meia,
                ingressos: { create: ingressosParaCriar },
                lanches: { create: lanchesParaCriar }
            },
            include: { 
                ingressos: { include: { sessao: { include: { filme: true, sala: true } } } }, 
                lanches: { include: { lancheCombo: true } } 
            }
        });
        });
    }

    async findAll() {
        return this.prisma.pedido.findMany({
            include: { 
                ingressos: { include: { sessao: { include: { filme: true, sala: true } } } }, 
                lanches: { include: { lancheCombo: true } } 
            }
        });
    }

    async findByUsuario(usuarioId: string) {
        return this.prisma.pedido.findMany({
            where: { usuarioId },
            include: {
                ingressos: { include: { sessao: { include: { filme: { include: { genero: true } }, sala: true } } } },
                lanches: { include: { lancheCombo: true } }
            },
            orderBy: { dataHora: 'desc' },
        });
    }

    async findOne(id: string) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id },
            include: { 
                ingressos: { include: { sessao: { include: { filme: true, sala: true } } } }, 
                lanches: { include: { lancheCombo: true } } 
            }
        });
        if (!pedido) throw new NotFoundException('Pedido não encontrado');
        return pedido;
    }

    async getComprovante(id: string) {
        const pedido = await this.prisma.pedido.findUnique({
            where: { id },
            include: {
                usuario: {
                    select: { id: true, nome: true, email: true },
                },
                ingressos: {
                    include: {
                        sessao: {
                            include: {
                                filme: { include: { genero: true } },
                                sala: true,
                            },
                        },
                    },
                },
                lanches: {
                    include: { lancheCombo: true },
                },
            },
        });

        if (!pedido) throw new NotFoundException('Pedido não encontrado');

        // Monta o comprovante estruturado
        return {
            comprovante: {
                pedidoId: pedido.id,
                dataCompra: pedido.dataHora,
                cliente: pedido.usuario
                    ? { nome: pedido.usuario.nome, email: pedido.usuario.email }
                    : null,
                ingressos: pedido.ingressos.map((ing) => ({
                    id: ing.id,
                    filme: ing.sessao.filme.titulo,
                    genero: ing.sessao.filme.genero?.nome,
                    classificacao: ing.sessao.filme.classificacaoEtaria,
                    duracao: `${ing.sessao.filme.duracao} min`,
                    sala: `Sala ${String(ing.sessao.sala.numero).padStart(2, '0')}`,
                    data: ing.sessao.data,
                    horario: ing.sessao.horario,
                    poltrona: ing.poltrona,
                    tipo: ing.tipo,
                    valor: ing.valorPago,
                    valorFormatado: `R$ ${ing.valorPago.toFixed(2).replace('.', ',')}`,
                    qrCodeData: JSON.stringify({
                        ticketId: ing.id,
                        pedidoId: pedido.id,
                        sessaoId: ing.sessaoId,
                        poltrona: ing.poltrona,
                        hash: `cineweb-${ing.id}-${pedido.id}`,
                    }),
                })),
                lanches: pedido.lanches.map((item) => ({
                    nome: item.lancheCombo.nome,
                    quantidade: item.quantidade,
                    precoUnitario: item.precoUnitario,
                    subtotal: item.precoUnitario * item.quantidade,
                    subtotalFormatado: `R$ ${(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}`,
                })),
                resumo: {
                    qtdInteira: pedido.qtdInteira,
                    qtdMeia: pedido.qtdMeia,
                    totalIngressos: pedido.ingressos.length,
                    totalLanches: pedido.lanches.length,
                    valorTotal: pedido.valorTotal,
                    valorTotalFormatado: `R$ ${pedido.valorTotal.toFixed(2).replace('.', ',')}`,
                },
            },
        };
    }

    async update(id: string, data: UpdatePedidoDto) {
        await this.findOne(id);
        return this.prisma.pedido.update({
            where: { id },
            data: {
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
