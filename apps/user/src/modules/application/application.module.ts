import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { ApplicationRepository, UserApplicationRepository } from '@user/entities';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository, UserApplicationRepository]
})
export class ApplicationModule {}
