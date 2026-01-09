import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseRepository } from '@app/common';
import { DishEntity } from './dish.entity';

@Injectable()
export class DishRepository extends DatabaseRepository<DishEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, DishEntity);
  }
}
