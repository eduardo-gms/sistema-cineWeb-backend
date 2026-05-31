import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Perfil } from '@prisma/client';

// Payload embutido no JWT
export interface JwtPayload {
  sub: string;    // userId
  email: string;
  perfil: Perfil;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ──────────────────────────────────────────
  // REGISTRO
  // ──────────────────────────────────────────
  async register(dto: RegisterDto) {
    // Verifica duplicidade de e-mail
    const exists = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    // Hash da senha com bcrypt (10 salt rounds)
    const senhaHash = await bcrypt.hash(dto.senha, 10);

    // Cria o usuário
    const usuario = await this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        perfil: Perfil.CUSTOMER,
      },
    });

    // Gera par de tokens
    const tokens = await this.generateTokens({
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    // Salva hash do refresh token no DB
    await this.updateRefreshTokenHash(usuario.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }

  // ──────────────────────────────────────────
  // LOGIN
  // ──────────────────────────────────────────
  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Compara senha informada com o hash armazenado
    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const tokens = await this.generateTokens({
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    await this.updateRefreshTokenHash(usuario.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }

  // ──────────────────────────────────────────
  // REFRESH TOKENS
  // ──────────────────────────────────────────
  async refreshTokens(userId: string, refreshToken: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    // Usuário não existe ou refresh token foi revogado
    if (!usuario || !usuario.refreshTokenHash) {
      throw new ForbiddenException('Acesso negado. Faça login novamente.');
    }

    // Compara o refresh token enviado com o hash no banco
    const tokenValido = await bcrypt.compare(refreshToken, usuario.refreshTokenHash);
    if (!tokenValido) {
      throw new ForbiddenException('Refresh token inválido ou expirado.');
    }

    // Gera novo par de tokens (rotação de refresh token)
    const tokens = await this.generateTokens({
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    });

    await this.updateRefreshTokenHash(usuario.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // ──────────────────────────────────────────
  // LOGOUT (revogação do refresh token)
  // ──────────────────────────────────────────
  async logout(userId: string) {
    await this.prisma.usuario.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logout realizado com sucesso.' };
  }

  // ──────────────────────────────────────────
  // RECUPERAÇÃO DE SENHA
  // ──────────────────────────────────────────
  async forgotPassword(email: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });
    if (usuario) {
      console.log(`[SIMULAÇÃO] E-mail de recuperação de senha enviado para: ${email}`);
    }
    // Sempre retorna sucesso por segurança (evita enumerar contas válidas)
    return { message: 'Se o e-mail existir em nossa base, você receberá as instruções em breve.' };
  }

  // ──────────────────────────────────────────
  // PERFIL DO USUÁRIO
  // ──────────────────────────────────────────
  async getProfile(userId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        createdAt: true,
      },
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return usuario;
  }

  // ──────────────────────────────────────────
  // HELPERS PRIVADOS
  // ──────────────────────────────────────────
  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      // Access Token — curta duração (15 minutos)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      // Refresh Token — longa duração (7 dias)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.usuario.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }
}
