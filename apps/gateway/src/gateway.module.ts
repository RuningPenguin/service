import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, DatabaseModule, LoggerModule } from '@app/common';
import { GatewayService } from './gateway.service';
import { AccessRecordRepository } from './entities';
import { join } from 'node:path';
import { TraceMiddleware } from '@app/common/public/middleware/trace.middleware';

// import fileUpload from 'express-fileupload';

console.log(__dirname, join(__dirname, 'entities/**/*.entity{.ts,.js}'));

@Module({
  imports: [
    ConfigModule.forRoot('gateway'),
    LoggerModule.forRoot('gateway'),
    DatabaseModule.forRoot(join(__dirname, 'entities/**/*.entity{.ts,.js}')),
    HttpModule
  ],
  controllers: [GatewayController],
  providers: [GatewayService, AccessRecordRepository]
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TraceMiddleware)
      // .apply(
      //   fileUpload({
      //     limits: { fileSize: 50 * 1024 * 1024 },
      //     useTempFiles: false,
      //     abortOnLimit: true,
      //   }),
      // )
      .forRoutes('*');
  }
}
