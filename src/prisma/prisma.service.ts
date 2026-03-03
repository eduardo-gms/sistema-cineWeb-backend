import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        // Inicializa o pool de conexão do PostgreSQL
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        // Cria o adaptador do Prisma
        const adapter = new PrismaPg(pool);
        // Injeta o adaptador na instância base do PrismaClient
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }
}