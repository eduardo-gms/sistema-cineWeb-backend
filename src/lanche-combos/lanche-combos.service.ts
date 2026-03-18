import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';

@Injectable()
export class LancheCombosService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateLancheComboDto) {
        return this.prisma.lancheCombo.create({ data });
    }

    async findAll() {
        return this.prisma.lancheCombo.findMany();
    }

    async findOne(id: string) {
        const lanche = await this.prisma.lancheCombo.findUnique({ where: { id } });
        if (!lanche) throw new NotFoundException('Lanche/Combo não encontrado');
        return lanche;
    }

    async update(id: string, data: UpdateLancheComboDto) {
        await this.findOne(id);
        return this.prisma.lancheCombo.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.lancheCombo.delete({ where: { id } });
    }
}
