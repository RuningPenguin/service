import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { RETURN_TYPE, ReturnTypeOptions } from '../decorator/interceptor.decorator';

export interface Response<T> {
  code: number;
  message: string;
  path: string;
  timestamp: string;
  data: T;
}

// 序列化data
const serialize = (data: any, meta?: { type: ClassConstructor<any>; options?: ReturnTypeOptions }) => {
  const tempData = data?.data ?? data;

  if (tempData === null || tempData === undefined) return null;

  if (meta?.options?.isBoolean) {
    return tempData;
  }

  if (!meta?.type) return tempData;

  return plainToInstance(meta.type, tempData, {
    excludeExtraneousValues: true
  });
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const meta = new Reflector().get<{ type: ClassConstructor<any>; options?: ReturnTypeOptions }>(
      RETURN_TYPE,
      context.getHandler()
    );

    const request = context.switchToHttp().getRequest();
    const path = request.originalUrl ?? request.url;

    // const ctx = context.switchToHttp();
    // const request = ctx.getRequest();
    // const path = request.url;

    return next.handle().pipe(
      map((data) => {
        return {
          code: HttpStatus.OK, // 200
          data: serialize(data, meta),
          message: data && typeof data === 'object' && 'message' in data ? data.message : 'success',
          path,
          timestamp: new Date().toLocaleString()
        };
      })
    );
  }
}
