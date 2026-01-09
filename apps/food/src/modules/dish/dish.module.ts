import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { ClassifyRepository, DishRepository } from '@food/entities';
import { AuthModule } from '@app/common';

@Module({
  imports: [AuthModule],
  controllers: [DishController],
  providers: [DishService, DishRepository, ClassifyRepository]
})
export class DishModule {}
