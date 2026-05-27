# 🎬 CineWeb Backend

API REST do ecossistema CineWeb, construída com **NestJS**, **Prisma ORM** e **PostgreSQL**. Responsável por toda a lógica de negócio: gerenciamento de filmes, salas, sessões, pedidos, ingressos, lanches e autenticação JWT.

---

## Stack de Tecnologias

| Tecnologia | Versão | Propósito |
|---|---|---|
| **Node.js** | 20+ | Runtime JavaScript |
| **NestJS** | 11.x | Framework backend |
| **Prisma ORM** | 7.x | ORM e migrations |
| **PostgreSQL** | 15 | Banco de dados relacional |
| **Passport + JWT** | - | Autenticação e autorização |
| **bcrypt** | 6.x | Hash de senhas e refresh tokens |
| **Swagger** | 11.x | Documentação interativa da API |
| **Docker** | - | Conteinerização |

---

## Arquitetura de Autenticação

O sistema implementa **JWT com Refresh Token** e **RBAC (Role-Based Access Control)**:

```
┌─────────────┐     POST /auth/login      ┌──────────────────┐
│   Cliente    │ ──────────────────────── │   AuthService     │
│ (Web/Mobile) │ ◄──── accessToken (15m) ──│                  │
│              │ ◄──── refreshToken (7d) ──│  bcrypt.hash()   │
└──────┬───────┘                           │  refreshTokenHash │
       │                                   │  → salvo no DB    │
       │  401 Unauthorized                 └──────────────────┘
       │                                          │
       │  POST /auth/refresh                      │
       └──────────────────────────────────────────┘
```

- **Access Token**: Expiração curta (15 minutos), usado em todas as requisições autenticadas.
- **Refresh Token**: Expiração longa (7 dias), hash bcrypt armazenado no PostgreSQL para revogação.
- **RBAC**: Perfis `ADMIN` e `CUSTOMER`. Rotas de gerenciamento (CRUD de filmes, salas, etc.) requerem `ADMIN`. Rotas de pedidos requerem apenas autenticação.

### Endpoints de Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Registro de novo usuário | Não |
| POST | `/auth/login` | Login com email/senha | Não |
| POST | `/auth/refresh` | Renovar tokens | Não |
| POST | `/auth/logout` | Revogar refresh token | Sim |
| GET | `/auth/me` | Perfil do usuário autenticado | Sim |

### Proteção de Rotas (RBAC)

- **GET** (listagem/busca): Públicas
- **POST/PUT/DELETE** em filmes, salas, sessões, gêneros, lanches: `ADMIN` obrigatório
- **POST/PUT/DELETE** em pedidos e ingressos: Autenticação obrigatória (qualquer perfil)
- **GET /pedidos/meus**: Retorna pedidos do usuário autenticado
- **GET /pedidos/:id/comprovante**: Retorna comprovante detalhado do pedido

---

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+ (ou Docker)
- npm

---

## Setup Local (sem Docker)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com sua DATABASE_URL, JWT_SECRET, etc.

# 3. Gerar Prisma Client
npx prisma generate

# 4. Executar migrations
npx prisma migrate dev

# 5. Popular dados iniciais (seed)
npx prisma db seed

# 6. Iniciar em modo desenvolvimento
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.
Swagger UI em `http://localhost:3000/api`.

### Variáveis de Ambiente

```env
DATABASE_URL=postgresql://postgres:60451@localhost:5432/cineweb?schema=public
JWT_SECRET=cineweb-jwt-secret-dev-2026
JWT_REFRESH_SECRET=cineweb-jwt-refresh-secret-dev-2026
PORT=3000
```

---

## Setup Docker (Individual)

```bash
# Criar rede (necessária para comunicação com outros serviços)
docker network create cineweb-network

# Subir backend + PostgreSQL
docker compose up --build
```

---

## Setup Docker (Compose Unificado)

Na raiz do projeto CineWeb (`cineWeb/`):

```bash
docker compose up --build
```

Isso sobe PostgreSQL, Backend, Frontend e Mobile simultaneamente.

---

## Seed de Dados

O seed cria dois usuários para testes:

| Perfil | E-mail | Senha |
|--------|--------|-------|
| **ADMIN** | `admin@cineweb.com` | `admin123` |
| **CUSTOMER** | `cliente@cineweb.com` | `cliente123` |

---

## Estrutura do Projeto

```
src/
├── auth/                  # Módulo de autenticação
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/               # DTOs de validação
│   ├── guards/            # JwtAuthGuard, RolesGuard
│   ├── strategies/        # JwtStrategy (Passport)
│   └── decorators/        # @Roles()
├── filmes/                # CRUD de filmes
├── salas/                 # CRUD de salas
├── sessoes/               # CRUD de sessões
├── pedidos/               # Pedidos + Comprovante
├── ingressos/             # CRUD de ingressos
├── generos/               # CRUD de gêneros
├── lanche-combos/         # CRUD de lanches/combos
├── prisma/                # PrismaService (global)
├── app.module.ts
└── main.ts
```
