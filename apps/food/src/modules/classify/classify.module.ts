import { Module } from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { ClassifyController } from './classify.controller';
import { ClassifyEntity, ClassifyRepository, DishEntity } from '@food/entities';

@Module({
  controllers: [ClassifyController],
  providers: [ClassifyService, ClassifyRepository, ClassifyEntity, DishEntity]
})
export class ClassifyModule {}
