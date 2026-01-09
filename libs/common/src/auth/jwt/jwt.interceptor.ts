import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  private readonly logger = new Logger(JwtInterceptor.name);

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    this.logger.log(`authorization: ${authorization} ${JSON.stringify(request.user)}`);

    return next.handle();
  }
}
