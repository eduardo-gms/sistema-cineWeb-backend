import { SetMetadata } from '@nestjs/common';
import { Perfil } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Decorator para definir quais perfis (roles) têm acesso a uma rota.
 * Uso: @Roles(Perfil.ADMIN)
 */
export const Roles = (...roles: Perfil[]) => SetMetadata(ROLES_KEY, roles);
