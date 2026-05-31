import 'dotenv/config';
import { PrismaClient, Perfil } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Iniciando seed do banco de dados CineWeb...\n');

  // ──────────────────────────────────────────
  // 1. Usuário Administrador
  // ──────────────────────────────────────────
  const adminEmail = 'admin@cineweb.com';
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const senhaHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.usuario.create({
      data: {
        nome: 'Administrador CineWeb',
        email: adminEmail,
        senha: senhaHash,
        perfil: Perfil.ADMIN,
      },
    });
    console.log(`✅ Usuário ADMIN criado: ${admin.email} (senha: admin123)`);
  } else {
    console.log(`⏭️  Usuário ADMIN já existe: ${existingAdmin.email}`);
  }

  console.log('\n🎬 Seed concluído com sucesso!');

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Erro no seed:', e);
  process.exit(1);
});
