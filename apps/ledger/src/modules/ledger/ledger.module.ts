import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { AuthModule } from '@app/common';
import { LedgerRepository } from '../../entities/ledger';
import { LedgerUserRepository } from '../../entities/ledger_user';
import { BillRepository } from '../../entities/bill';

@Module({
  imports: [AuthModule],
  controllers: [LedgerController],
  providers: [LedgerService, LedgerRepository, LedgerUserRepository, BillRepository]
})
export class LedgerModule {}
