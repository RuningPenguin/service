import { NestFactory } from '@nestjs/core';
import { SwaggerAggregatorModule } from './swagger-aggregator.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

/** 🔧 修复 $ref 指向 */
function fixSchemaRef(obj: any, serviceName: string) {
  if (!obj || typeof obj !== 'object') return;

  Object.keys(obj).forEach((key) => {
    const val = obj[key];

    if (key === '$ref' && typeof val === 'string' && val.startsWith('#/components/schemas/')) {
      const schemaName = val.replace('#/components/schemas/', '');
      obj[key] = `#/components/schemas/${serviceName}_${schemaName}`;
    } else {
      fixSchemaRef(val, serviceName);
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(SwaggerAggregatorModule);

  /** ✅ monorepo 下安全路径 */
  const apiDir = path.resolve(process.cwd(), 'swaggerJson');

  const files = fs.readdirSync(apiDir).filter((f) => f.startsWith('swagger-') && f.endsWith('.json'));

  const merged: any = {
    openapi: '3.0.0',
    info: {
      title: '接口文档',
      version: '1.0.0'
    },
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {}
    }
  };

  files.forEach((file) => {
    const serviceName = file.replace('swagger-', '').replace('.json', '');

    const doc = JSON.parse(fs.readFileSync(path.join(apiDir, file), 'utf-8'));

    if (!doc.paths) {
      console.warn(`${file} has no paths`);
      return;
    }

    /** 1️⃣ 先修 $ref */
    fixSchemaRef(doc, serviceName);

    /** 2️⃣ 合并 paths + tag */
    Object.entries(doc.paths).forEach(([pathKey, methods]) => {
      merged.paths[`${pathKey}`] = methods;

      Object.values(methods as any).forEach((m: any) => {
        m.tags = [`${serviceName}/${m.tags[0] || 'default'}`];
      });
    });

    /** 3️⃣ 合并 schemas（加前缀，且只合并一次） */
    Object.entries(doc.components?.schemas || {}).forEach(([key, value]) => {
      merged.components.schemas[`${serviceName}_${key}`] = value;
    });

    /** 4️⃣ 合并 securitySchemes */
    Object.assign(merged.components.securitySchemes, doc.components?.securitySchemes || {});
  });

  /** ✅ 给 Apifox 用 */
  app.getHttpAdapter().get('/swagger.json', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(merged);
  });

  /** ✅ Swagger UI */
  SwaggerModule.setup('api-docs', app, merged);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 4001);
}

bootstrap();
