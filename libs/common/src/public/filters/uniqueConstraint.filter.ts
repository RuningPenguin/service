import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class UniqueConstraintFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const path = request.url;

    if ((exception as any).code === 'ER_DUP_ENTRY' || (exception as any).code === '23505') {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: '数据已存在，请勿重复创建',
        error: 'Conflict',
        path,
        timestamp: new Date().toLocaleString()
      });
    } else {
      // 如果是其他错误，你可以选择返回 500，或者什么都不做
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '服务器内部错误',
        error: 'Internal Server Error',
        path,
        timestamp: new Date().toLocaleString()
      });
    }
  }
}
