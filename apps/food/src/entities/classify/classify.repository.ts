import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseRepository } from '@app/common';
import { ClassifyEntity } from './classify.entity';

@Injectable()
export class ClassifyRepository extends DatabaseRepository<ClassifyEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ClassifyEntity);
  }
}
