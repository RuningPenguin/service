import { Injectable } from '@nestjs/common';
import { LedgerEntity, LedgerRepository } from '../../entities/ledger';
import { BaseService } from '@app/common/utils/crud/crud.service';
import { LedgerUserEntity, LedgerUserRepository } from '../../entities/ledger_user';
import { CusHttpException, CustomErrorCode, CustomErrorMsgMap } from '@app/common/public/custom/HttpException.custom';
import { BillRepository } from '../../entities/bill';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { CreateLedgerDto } from './dto';

@Injectable()
export class LedgerService extends BaseService<LedgerEntity> {
  constructor(
    private readonly ledgerRepository: LedgerRepository,
    private readonly billRepository: BillRepository,
    private readonly ledgerUserRepository: LedgerUserRepository
  ) {
    super(ledgerRepository);
  }

  // 加入用户账本
  async joinLedger(userId: number, ledgerId: number) {
    // 校验账本是否存在
    await this.checkIdExist(ledgerId);

    // 校验用户是否已加入该账本
    const ledgerUser: LedgerUserEntity = await this.checkUserIsLedgerMember(userId, ledgerId);
    if (ledgerUser) {
      throw CusHttpException.error(CustomErrorCode['60999'], CustomErrorMsgMap['60999']);
    }

    // 加入账本
    await this.createLedgerUserRelations({ userId, ledgerId, role: 'member' });
  }

  // 邀请用户加入账本
  async inviteLedger(userId: number, friendId: number) {
    // 校验用户是否有账本 并是账本创建人
    const ledger = await this.ledgerRepository.findOne({
      where: { userId },
      relations: ['users']
    });

    // 一个账本最高2人逻辑
    if (ledger.users.length > 1) {
      throw CusHttpException.error(63299, '超出账本最高人数');
    }
    // end

    const owner = ledger.users.find(
      (ledgerUser) => ledgerUser.role === 'owner' && ledgerUser.isExited === false && ledgerUser.ledgerId === ledger.id
    );

    if (!owner) {
      throw CusHttpException.error(CustomErrorCode['63201'], CustomErrorMsgMap['63201']);
    }

    // 校验用户是否已加入该账本
    const ledgerUser: LedgerUserEntity = await this.checkUserIsLedgerMember(friendId, ledger.id);

    if (ledgerUser) {
      throw CusHttpException.error(CustomErrorCode['63202'], CustomErrorMsgMap['63202']);
    }

    // 邀请用户加入账本
    await this.createLedgerUserRelations({ userId: friendId, ledgerId: ledger.id, role: 'member' });
  }

  // 退出账本
  async quitLedger(userId: number, ledgerId: number) {
    // 校验账本是否存在
    await this.checkIdExist(ledgerId);

    // 校验用户是否已加入该账本
    const ledgerUser: LedgerUserEntity = await this.checkUserIsLedgerMember(userId, ledgerId);
    if (!ledgerUser) {
      throw CusHttpException.error(CustomErrorCode['60998'], CustomErrorMsgMap['60998']);
    }

    console.log(ledgerUser, 99);

    // 退出账本
    await this.ledgerUserRepository.update({ userId, ledgerId }, { isExited: true });

    // 软删除用户关联账单
    const { affected } = await this.billRepository.softDelete({
      ledgerId,
      consumerId: userId
    });

    return Boolean(affected);
  }

  // 新增
  async add(dto: CreateLedgerDto & { userId: number }) {
    // 校验用户是否有账本
    const ledger = await this.ledgerRepository.find({
      where: { userId: dto.userId }
    });

    // 一个用户最多创建1个账本
    if (ledger.length > 0) {
      throw CusHttpException.error('超出最大账本数量');
    }
    // end

    // 创建数据
    const entity = this.repo.create(dto);

    // 保存数据
    return this.repo.save(entity);
  }

  // 获取用户账本
  async getUserLedger(userId: number) {
    return this.ledgerRepository.findOne({
      where: { userId, users: { isExited: false } },
      relations: ['users']
    });
  }

  // 创建账本关联关系
  public async createLedgerUserRelations(options: DeepPartial<LedgerUserEntity>) {
    return this.ledgerUserRepository.save(options);
  }

  // 校验用户是否账本成员
  public async checkUserIsLedgerMember(userId: number, ledgerId: number) {
    return await this.ledgerUserRepository.findOne({
      where: { ledgerId, userId, isExited: false }
    });
  }
}
