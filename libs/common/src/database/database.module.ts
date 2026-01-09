import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@app/common';

@Module({})
export class DatabaseModule {
  static forRoot(envFilePath: string) {
    return TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_DATABASE'),
          entities: [envFilePath],
          timezone: '+08:00', // 中国时区
          synchronize: !isProduction, // 是否在生产环境中自动同步数据库
          logging: configService.get<boolean>('DATABASE_LOGGING') // 启用日志记录
        };
      }
    });
  }
}
