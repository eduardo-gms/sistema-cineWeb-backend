import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';

@Injectable()
export class SessoesService {
    constructor(private prisma: PrismaService) { }

    private parseHorarioParaMinutos(horario: string): number {
        const [horas, minutos] = horario.split(':').map(Number);
        return horas * 60 + (minutos || 0);
    }

    private async validarConflitoHorario(salaId: string, filmeId: string, data: Date | string, horario: string, ignorarSessaoId?: string) {
        const datetime = new Date(data);
        datetime.setUTCHours(0, 0, 0, 0);

        const filme = await this.prisma.filme.findUnique({ where: { id: filmeId } });
        if (!filme) throw new NotFoundException('Filme não encontrado para validação de horário');

        const novaSessaoInicio = this.parseHorarioParaMinutos(horario);
        const novaSessaoFim = novaSessaoInicio + filme.duracao;

        const sessoesDaSala = await this.prisma.sessao.findMany({
            where: { salaId },
            include: { filme: true }
        });

        const conflito = sessoesDaSala.find(s => {
            if (ignorarSessaoId && s.id === ignorarSessaoId) return false;

            const dtSessaoExistente = new Date(s.data);
            dtSessaoExistente.setUTCHours(0, 0, 0, 0);

            if (dtSessaoExistente.getTime() !== datetime.getTime()) return false;

            const inicioExistente = this.parseHorarioParaMinutos(s.horario);
            const fimExistente = inicioExistente + s.filme.duracao;

            return (novaSessaoInicio < fimExistente && novaSessaoFim > inicioExistente);
        });

        if (conflito) {
            throw new BadRequestException('A sala já está ocupada neste horário de sessão. Conflito detectado com outra exibição.');
        }
    }

    async create(data: CreateSessaoDto) {
        await this.validarConflitoHorario(data.salaId, data.filmeId, data.data, data.horario);
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
        const sessaoAtual = await this.findOne(id);
        
        const salaId = data.salaId || sessaoAtual.salaId;
        const filmeId = data.filmeId || sessaoAtual.filmeId;
        const dt = data.data || sessaoAtual.data;
        const hr = data.horario || sessaoAtual.horario;

        await this.validarConflitoHorario(salaId, filmeId, dt, hr, id);

        return this.prisma.sessao.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.sessao.delete({ where: { id } });
    }
}
