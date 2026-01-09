import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CUS_HEADER_KEY } from '../decorator/interceptor.decorator';

@Injectable()
export class CusHeaderGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // 获取当前方法是否有 @CusHeader
    const requiredFields: string[] = this.reflector.get(CUS_HEADER_KEY, context.getHandler());

    // 没有加装饰器，直接放行
    if (!requiredFields || !requiredFields.length) {
      return true;
    }

    // 校验请求头
    for (const field of requiredFields) {
      if (!request.headers[field.toLowerCase()]) {
        throw new ForbiddenException(`请求头缺少字段: ${field}`);
      }
      // 可以把字段挂在 request 上，Controller / Service 可直接使用
      request[field] = request.headers[field.toLowerCase()];
    }

    return true;
  }
}
