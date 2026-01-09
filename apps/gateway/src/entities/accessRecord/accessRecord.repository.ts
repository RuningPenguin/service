import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccessRecordEntity } from './accessRecord.entity';
import { DatabaseRepository } from '@app/common';

@Injectable()
export class AccessRecordRepository extends DatabaseRepository<AccessRecordEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, AccessRecordEntity);
  }
}
