import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/enums/roles.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGaurd implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { profile } = context.switchToHttp().getRequest();
    console.log(profile);
    return requiredRoles.some((role) => profile.roles?.includes(role));
  }
}
