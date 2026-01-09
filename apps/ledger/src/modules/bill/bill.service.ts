import { Injectable } from '@nestjs/common';
import { BillEntity, BillRepository } from '../../entities/bill';
import { BaseService } from '@app/common/utils/crud/crud.service';
import { LedgerUserRepository } from '../../entities/ledger_user';
import { CusHttpException, CustomErrorCode, CustomErrorMsgMap } from '@app/common/public/custom/HttpException.custom';

@Injectable()
export class BillService extends BaseService<BillEntity> {
  constructor(
    private readonly billRepository: BillRepository,
    private readonly ledgerUserRepository: LedgerUserRepository
  ) {
    super(billRepository);
  }

  // 判断用户是否账本成员并 抛出异常
  async checkUserIsLedgerMember(userId: number, ledgerId: number) {
    const res = await this.ledgerUserRepository.findOne({
      where: { ledgerId, userId, isExited: false }
    });

    if (!res) {
      throw CusHttpException.error(CustomErrorCode['63201'], CustomErrorMsgMap['63201']);
    }

    return res;
  }
}
