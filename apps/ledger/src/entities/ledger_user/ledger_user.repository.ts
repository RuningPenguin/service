import { Injectable } from '@nestjs/common';
import { LedgerUserEntity } from './ledger_user.entity';
import { DatabaseRepository } from '@app/common';
import { DataSource } from 'typeorm';

@Injectable()
export class LedgerUserRepository extends DatabaseRepository<LedgerUserEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, LedgerUserEntity);
  }
}
