import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
const defaultMessage = 'Server Error';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const path = request.url;
    const body = {
      code: status,
      message: exceptionResponse || defaultMessage,
      data: null,
      path,
      timestamp: new Date().toLocaleString()
    };

    if (path.startsWith('/api')) {
      if (exceptionResponse.error && typeof exceptionResponse === 'object') {
        const errorInfo = exceptionResponse.error;
        body.code = errorInfo.code || errorInfo.statusCode || status;
        body.data = errorInfo.data || null;
        body.message = errorInfo.error || errorInfo.message || defaultMessage;
      }
    } else {
      if (exceptionResponse && typeof exceptionResponse === 'object') {
        const errorInfo = exceptionResponse;
        body.code = errorInfo.code || errorInfo.statusCode || status;
        body.data = errorInfo.message || null;
        body.message = errorInfo.error || errorInfo.message || defaultMessage;
      }
    }

    response.status(status).json(body);
  }
}
