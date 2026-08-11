import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ROLE_KEY } from './roles.decorator';
import { UserRole } from 'src/user/enum/user-role.enum';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles=this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_KEY,[context.getHandler(),context.getClass()]
    )
    if(!requiredRoles){
        return true;
    }
    const request=context.switchToHttp().getRequest()
    const user=request.user
    return requiredRoles.includes(user.role)


    
  }
}
