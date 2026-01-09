import { Module } from '@nestjs/common';
import { DataPullController } from './dataPull.controller';
import { DataPullService } from './dataPull.service';

@Module({
  controllers: [DataPullController],
  providers: [DataPullService]
})
export class DataPullModule {}
