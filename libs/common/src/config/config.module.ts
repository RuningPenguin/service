import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as process from 'node:process';

@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {
  constructor() {}
  static forRoot(serviceName: string, envFilePath?: string) {
    // 自动识别服务的工作目录
    return NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${join(process.cwd(), '.env')}`, envFilePath ? envFilePath : `apps/${serviceName}/.env`]
    });
  }
}
