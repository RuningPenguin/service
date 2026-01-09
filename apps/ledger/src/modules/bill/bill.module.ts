import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { AuthModule } from '@app/common';
import { BillRepository } from '../../entities/bill';
import { LedgerUserRepository } from '../../entities/ledger_user';

@Module({
  imports: [AuthModule],
  controllers: [BillController],
  providers: [BillService, BillRepository, LedgerUserRepository]
})
export class BillModule {}
