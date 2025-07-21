import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    console.log('ROLES GUARD USER:', user);

    if (!user || !user.rights) {
      throw new ForbiddenException('Access denied. No user or rights.');
    }

    const hasRole = () => user.rights.some((role: Role) => roles.includes(role));
    if (!hasRole()) {
      throw new ForbiddenException('Access denied. You do not have the required role(s).');
    }

    return true;
  }
}