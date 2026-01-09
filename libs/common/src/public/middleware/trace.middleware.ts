import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request & { traceId?: string }, res: Response, next: () => void) {
    // 复用上游传过来的 traceId，或新生成一个
    const traceId = (req.headers['x-trace-id'] as string) || uuidv4();
    req.traceId = traceId;

    // 给响应头也加上 traceId（可用于前端调试）
    res.setHeader('x-trace-id', traceId);
    next();
  }
}
