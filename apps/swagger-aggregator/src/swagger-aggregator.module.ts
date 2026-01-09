import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/common';

@Module({
  imports: [ConfigModule.forRoot('swagger-aggregator')],
  controllers: [],
  providers: []
})
export class SwaggerAggregatorModule {}
