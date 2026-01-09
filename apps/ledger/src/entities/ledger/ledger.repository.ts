import { Injectable } from '@nestjs/common';
import { LedgerEntity } from './ledger.entity';
import { DatabaseRepository } from '@app/common';
import { DataSource } from 'typeorm';

@Injectable()
export class LedgerRepository extends DatabaseRepository<LedgerEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, LedgerEntity);
  }
}
