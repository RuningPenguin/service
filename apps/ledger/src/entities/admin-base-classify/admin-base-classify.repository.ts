import { Injectable } from '@nestjs/common';
import { AdminBaseClassifyEntity } from './admin-base-classify.entity';
import { DatabaseRepository } from '@app/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminBaseClassifyRepository extends DatabaseRepository<AdminBaseClassifyEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, AdminBaseClassifyEntity);
  }
}
