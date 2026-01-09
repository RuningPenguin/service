// src/config/config.module.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { writeFileSync } from 'node:fs';

export function setupSwagger(app: INestApplication, serviceName: string): void {
  const options = new DocumentBuilder()
    .setTitle(`${serviceName} Example`)
    .setDescription(`${serviceName} 接口文档`)
    .setVersion('1.0')
    .addTag(serviceName)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '请输入 JWT Token（示例：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx）'
      },
      'Authorization' // 👈 security scheme 名称
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup(`api-${serviceName}`, app, document);
  writeFileSync(`./swaggerJson/swagger-${serviceName}.json`, JSON.stringify(document, null, 2));
}
