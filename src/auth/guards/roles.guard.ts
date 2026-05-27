import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Perfil } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard RBAC (Role-Based Access Control).
 * Verifica se o perfil do usuário autenticado está entre os perfis permitidos pela rota.
 * Deve ser usado APÓS o JwtAuthGuard (que popula request.user).
 *
 * Uso:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles(Perfil.ADMIN)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Perfil[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se nenhuma role foi definida, a rota é acessível a qualquer usuário autenticado
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.perfil) {
      throw new ForbiddenException('Acesso negado. Perfil de usuário não identificado.');
    }

    const hasRole = requiredRoles.includes(user.perfil);
    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso restrito. Perfis permitidos: ${requiredRoles.join(', ')}.`,
      );
    }

    return true;
  }
}
