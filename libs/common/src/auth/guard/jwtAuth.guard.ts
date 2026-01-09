import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_AUTH } from '@app/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isAuth = new Reflector().getAllAndOverride<boolean>(IS_AUTH, [context.getHandler(), context.getClass()]);
    if (!isAuth) {
      return true;
    }
    return super.canActivate(context);
  }
}
