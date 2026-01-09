import { Module } from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { ClassifyController } from './classify.controller';
import { AuthModule } from '@app/common';
import { ClassifyRepository } from '../../entities/classify';

@Module({
  imports: [AuthModule],
  controllers: [ClassifyController],
  providers: [ClassifyService, ClassifyRepository],
  exports: [ClassifyService, ClassifyRepository]
})
export class ClassifyModule {}
