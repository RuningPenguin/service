import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '@app/common/public/filters/httpException.filter';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const configService = app.get(ConfigService);

  // app.use(poHttp());

  app.use(multer().any());

  app.enableCors();

  // 启用全局日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 启用全局过滤器 错误捕获
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get('PORT'));
}
bootstrap();
