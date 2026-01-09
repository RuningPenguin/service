import { NestFactory } from '@nestjs/core';
import { DataPullModule } from './dataPull.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(DataPullModule);

  // 启用全局验证管道
  app.useGlobalPipes(
    // 参数验证
    new ValidationPipe({
      transform: true, // 自动将请求中的数据转换为指定的类实例
      whitelist: true // 去除 DTO 中没有定义的属性
    })
  );

  await app.listen(4040);
}
bootstrap();
