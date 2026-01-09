import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    console.log('Before...');
    const request = context.switchToHttp().getRequest();

    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${request.method} ${request.url} ${Date.now() - now}ms`)));
  }
}
