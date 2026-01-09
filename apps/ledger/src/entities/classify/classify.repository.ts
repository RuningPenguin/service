import { Injectable } from '@nestjs/common';
import { ClassifyEntity } from './classify.entity';
import { DatabaseRepository } from '@app/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ClassifyRepository extends DatabaseRepository<ClassifyEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ClassifyEntity);
  }
}
