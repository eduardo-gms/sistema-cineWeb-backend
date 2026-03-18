import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';

@Injectable()
export class SalasService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateSalaDto) {
        return this.prisma.sala.create({ data });
    }

    async findAll() {
        return this.prisma.sala.findMany();
    }

    async findOne(id: string) {
        const sala = await this.prisma.sala.findUnique({ where: { id } });
        if (!sala) throw new NotFoundException('Sala não encontrada');
        return sala;
    }

    async update(id: string, data: UpdateSalaDto) {
        await this.findOne(id);
        return this.prisma.sala.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.sala.delete({ where: { id } });
    }
}
