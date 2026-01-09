import { Injectable } from '@nestjs/common';
import { BillEntity } from './bill.entity';
import { DatabaseRepository } from '@app/common';
import { DataSource } from 'typeorm';

@Injectable()
export class BillRepository extends DatabaseRepository<BillEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, BillEntity);
  }
}
